//--------------------------------------------------------------------
// COMPONENTE DE FORMULÁRIO DA EMPRESA
// Formulário para cadastro e edição de dados da empresa
// Seguindo o padrão de estilo macOS
//--------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../styles/ThemeProvider';
import { AppIcons } from '../../../components/Icons/AppIcons';
import { apiPost, apiGet } from '../../../utils/apiService';
import { LoadingSpinner } from '../../../components/LoadingSpinner/LoadingSpinner';
import { formatCNPJ } from '../../../utils/documentFormatter';

// Interface para município
interface City {
  nome: string;
  codigo_ibge: string;
}

// Interface para resposta da API BrasilAPI (campos internos em inglês)
interface CNPJResponse {
  cnpj: string;
  corporateName: string;              // razao_social
  tradeName: string;                  // nome_fantasia
  registrationStatus: number;         // situacao_cadastral
  registrationStatusDescription: string; // descricao_situacao_cadastral
  mainActivityCode: number;           // cnae_fiscal
  mainActivityDescription: string;    // cnae_fiscal_descricao
  streetTypeDescription: string;      // descricao_tipo_logradouro
  street: string;                     // logradouro
  addressNumber: string;              // numero
  addressComplement: string;          // complemento
  district: string;                   // bairro
  zipCode: string;                    // cep
  state: string;                      // uf
  cityCode: number;                   // codigo_municipio
  city: string;                       // municipio
  phone1: string;                     // ddd_telefone_1
  phone2: string;                     // ddd_telefone_2
  simpleNationalOptIn: boolean;       // opcao_pelo_simples
  individualMicroEntrepreneurOptIn: boolean; // opcao_pelo_mei
}

export function CompanyForm(): JSX.Element {
  const { systemStyles, systemColors } = useTheme();
  const [companyData, setCompanyData] = useState({
    businessName: '',
    tradeName: '',
    cnpj: '',
    stateRegistration: '',
    municipalRegistration: '',
    cnae: '',
    taxRegime: '',
    street: '',
    addressNumber: '',
    zipCode: '',
    addressComplement: '',
    city: '',
    state: '',
    district: '',
    phone: '',
    email: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingCNPJ, setIsLoadingCNPJ] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);
  const [companyId, setCompanyId] = useState<number | null>(null);

  // Lista de UFs brasileiras
  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const handleInputChange = (field: string, value: string) => {
    setCompanyData(prev => {
      const newData = { ...prev, [field]: value };
      // Se mudar a UF, limpa a cidade
      if (field === 'state') {
        newData.city = '';
      }
      return newData;
    });
    // Limpa mensagens ao editar
    if (showSuccessMessage) setShowSuccessMessage(false);
    if (errorMessage) setErrorMessage('');
  };

  // Função para buscar municípios da API BrasilAPI
  const fetchCities = async (stateCode: string) => {
    if (!stateCode) {
      setCities([]);
      return;
    }
    
    setLoadingCities(true);
    try {
      const response = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${stateCode}?providers=dados-abertos-br,gov,wikipedia`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar municípios: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Mapear os dados para o formato esperado
      // Remove o estado entre parênteses do nome do município (ex: "SÃO FELIPE (BAHIA)" -> "SÃO FELIPE")
      const formattedCities: City[] = data.map((city: any) => ({
        nome: city.nome.replace(/\s*\([^)]*\)\s*$/, '').trim(),
        codigo_ibge: city.codigo_ibge
      }));
      
      setCities(formattedCities);
      console.log(`Municípios de ${stateCode} carregados:`, formattedCities.length);
      
      // Se houver uma cidade pendente para preencher (vinda da consulta de CNPJ), tenta preenchê-la
      const pendingCity = companyData.city;
      if (pendingCity && formattedCities.length > 0) {
        const foundCity = formattedCities.find(m => 
          m.nome.toLowerCase().trim() === pendingCity.toLowerCase().trim()
        );
        if (foundCity) {
          setSelectedCity(foundCity);
        }
      }
    } catch (error) {
      console.error(`[CompanyForm] Erro ao buscar municípios de ${stateCode}:`, error);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  // Busca cidade e UF pelo código IBGE (otimizado)
  const fetchCityAndStateByIBGECode = async (ibgeCode: number, stateId?: number): Promise<{ city: string; state: string } | null> => {
    try {
      // Se temos state_id, busca apenas na UF correspondente (muito mais rápido)
      if (stateId && stateId > 0 && stateId <= brazilianStates.length) {
        const uf = brazilianStates[stateId - 1];
        try {
          const response = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${uf}?providers=dados-abertos-br,gov,wikipedia`);
          
          if (response.ok) {
            const citiesData = await response.json();
            const city = citiesData.find((m: any) => parseInt(m.codigo_ibge, 10) === ibgeCode);
            
            if (city) {
              const cityName = city.nome.replace(/\s*\([^)]*\)\s*$/, '').trim();
              return { city: cityName, state: uf };
            }
          }
        } catch (error) {
          console.error(`[CompanyForm] Erro ao buscar município na UF ${uf}:`, error);
        }
      }
      
      // Se não encontrou ou não tem state_id, busca nas UFs mais comuns primeiro (otimizado)
      const priorityUFs = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'PE', 'CE'];
      
      // Faz requisições em paralelo para as UFs prioritárias (muito mais rápido)
      const priorityPromises = priorityUFs.map(async (uf) => {
        try {
          const response = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${uf}?providers=dados-abertos-br,gov,wikipedia`);
          
          if (response.ok) {
            const citiesData = await response.json();
            const city = citiesData.find((m: any) => parseInt(m.codigo_ibge, 10) === ibgeCode);
            
            if (city) {
              const cityName = city.nome.replace(/\s*\([^)]*\)\s*$/, '').trim();
              return { city: cityName, state: uf };
            }
          }
        } catch (error) {
          // Ignora erros individuais
        }
        return null;
      });
      
      // Aguarda todas as requisições prioritárias em paralelo
      const results = await Promise.all(priorityPromises);
      const foundResult = results.find(r => r !== null);
      
      if (foundResult) {
        return foundResult;
      }
      
      // Se não encontrou nas prioritárias, busca nas demais (sequencial, mas raramente necessário)
      const otherUFs = brazilianStates.filter(uf => !priorityUFs.includes(uf));
      for (const uf of otherUFs) {
        try {
          const response = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${uf}?providers=dados-abertos-br,gov,wikipedia`);
          
          if (response.ok) {
            const citiesData = await response.json();
            const city = citiesData.find((m: any) => parseInt(m.codigo_ibge, 10) === ibgeCode);
            
            if (city) {
              const cityName = city.nome.replace(/\s*\([^)]*\)\s*$/, '').trim();
              return { city: cityName, state: uf };
            }
          }
        } catch (error) {
          continue;
        }
      }
      
      return null;
    } catch (error) {
      console.error('[CompanyForm] Erro ao buscar cidade por código IBGE:', error);
      return null;
    }
  };

  // Carrega dados da empresa ao montar o componente
  useEffect(() => {
    const loadCompanyData = async () => {
      setIsLoadingCompany(true);
      try {
        console.log('[CompanyForm] Buscando dados da empresa...');
        const response = await apiGet('/api/companies', { requireAuth: true });
        
        console.log('[CompanyForm] Resposta da API:', response);
        console.log('[CompanyForm] response.ok:', response.ok);
        console.log('[CompanyForm] response.data:', response.data);
        
        if (response.ok) {
          // Verifica diferentes estruturas possíveis da resposta
          let companies = null;
          
          // Tenta diferentes estruturas de resposta
          if (response.data?.data) {
            if (Array.isArray(response.data.data)) {
              companies = response.data.data;
            } else {
              companies = [response.data.data];
            }
          } else if (Array.isArray(response.data)) {
            companies = response.data;
          }
          
          console.log('[CompanyForm] Companies encontradas:', companies);
          
          if (companies && companies.length > 0) {
            const company = companies[0];
            console.log('[CompanyForm] Empresa encontrada:', company);
            
            setCompanyId(company.id);
            
            const address = company.addresses && company.addresses.length > 0 ? company.addresses[0] : null;
            const phoneContact = company.contacts?.find((c: any) => c.type === 'phone');
            const emailContact = company.contacts?.find((c: any) => c.type === 'email');
            
            console.log('[CompanyForm] Address:', address);
            console.log('[CompanyForm] Phone contact:', phoneContact);
            console.log('[CompanyForm] Email contact:', emailContact);
            
            const cnpjFormatted = company.cnpj ? formatCNPJ(company.cnpj) : '';
            
            // Preenche UF primeiro se tiver state_id (rápido, sem requisição HTTP)
            let ufValue = '';
            if (address?.state_id) {
              const stateIndex = address.state_id - 1;
              if (stateIndex >= 0 && stateIndex < brazilianStates.length) {
                ufValue = brazilianStates[stateIndex];
              }
            }
            
            // Preenche dados básicos primeiro (sem esperar busca da cidade)
            const companyInfo = {
              businessName: company.name || '',
              tradeName: company.legal_name || '',
              cnpj: cnpjFormatted,
              stateRegistration: company.ie || '',
              municipalRegistration: company.im || '',
              cnae: company.cnae || '',
              taxRegime: '',
              street: address?.street || '',
              addressNumber: address?.number?.toString() || '',
              zipCode: address?.zipcode || '',
              addressComplement: address?.complement || '',
              city: '', // Será preenchido depois
              state: ufValue,
              district: address?.district || '',
              phone: phoneContact?.value || '',
              email: emailContact?.value || ''
            };
            
            console.log('[CompanyForm] Dados básicos da empresa preenchidos:', companyInfo);
            
            // Atualiza o estado com os dados básicos primeiro (renderiza imediatamente)
            setCompanyData(companyInfo);
            
            // Busca cidade de forma assíncrona (não bloqueia a renderização)
            if (address?.city_id) {
              console.log('[CompanyForm] Buscando cidade pelo código IBGE:', address.city_id, 'state_id:', address.state_id);
              // Não usa await aqui - busca em background
              fetchCityAndStateByIBGECode(address.city_id, address.state_id)
                .then((cityAndState) => {
                  if (cityAndState) {
                    console.log('[CompanyForm] Cidade e UF encontradas:', cityAndState);
                    // Atualiza apenas a cidade sem recarregar tudo
                    setCompanyData(prev => ({
                      ...prev,
                      city: cityAndState.city,
                      state: cityAndState.state || prev.state // Mantém UF se já estava preenchida
                    }));
                  }
                })
                .catch((error) => {
                  console.error('[CompanyForm] Erro ao buscar cidade:', error);
                });
            }
          } else {
            console.log('[CompanyForm] Nenhuma empresa encontrada');
          }
        } else {
          console.error('[CompanyForm] Erro na resposta da API:', response.status, response.data);
        }
      } catch (error) {
        console.error('[CompanyForm] Erro ao carregar dados da empresa:', error);
      } finally {
        setIsLoadingCompany(false);
      }
    };
    
    loadCompanyData();
  }, []);

  // Carrega municípios quando a UF mudar
  useEffect(() => {
    if (companyData.state) {
      fetchCities(companyData.state);
    } else {
      setCities([]);
      setSelectedCity(null);
    }
  }, [companyData.state]);

  // Atualiza município selecionado quando a cidade ou municípios mudarem
  useEffect(() => {
    if (!companyData.city || cities.length === 0) {
      setSelectedCity(null);
      return;
    }
    
    // Tenta encontrar o município correspondente (busca case-insensitive)
    const city = cities.find(m => 
      m.nome.toLowerCase().trim() === companyData.city.toLowerCase().trim()
    );
    
    if (city) {
      setSelectedCity(city);
    } else {
      // Se não encontrou, tenta buscar por similaridade (pode ser que a API retorne com acentos diferentes)
      const similarCity = cities.find(m => 
        m.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === 
        companyData.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      );
      setSelectedCity(similarCity || null);
    }
  }, [companyData.city, cities]);

  // Função para consultar CNPJ na API BrasilAPI
  const consultCNPJ = async (cnpj: string) => {
    setIsLoadingCNPJ(true);
    try {
      // Remove formatação do CNPJ para consulta
      const cleanCnpj = cnpj.replace(/\D/g, '');
      
      // Verifica se o CNPJ tem 14 dígitos
      if (cleanCnpj.length !== 14) {
        return;
      }

      console.log('Consultando CNPJ:', cleanCnpj);
      
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
      
      if (!response.ok) {
        throw new Error(`Erro na consulta: ${response.status}`);
      }
      
      const apiData = await response.json();

      const data: CNPJResponse = {
        cnpj: apiData.cnpj,
        corporateName: apiData.razao_social,
        tradeName: apiData.nome_fantasia,
        registrationStatus: apiData.situacao_cadastral,
        registrationStatusDescription: apiData.descricao_situacao_cadastral,
        mainActivityCode: apiData.cnae_fiscal,
        mainActivityDescription: apiData.cnae_fiscal_descricao,
        streetTypeDescription: apiData.descricao_tipo_logradouro,
        street: apiData.logradouro,
        addressNumber: apiData.numero,
        addressComplement: apiData.complemento,
        district: apiData.bairro,
        zipCode: apiData.cep,
        state: apiData.uf,
        cityCode: apiData.codigo_municipio,
        city: apiData.municipio,
        phone1: apiData.ddd_telefone_1,
        phone2: apiData.ddd_telefone_2,
        simpleNationalOptIn: apiData.opcao_pelo_simples,
        individualMicroEntrepreneurOptIn: apiData.opcao_pelo_mei
      };
      
      console.log('Dados recebidos da API (normalizados):', data);
      
      // Preenche os campos automaticamente
      handleInputChange('businessName', data.corporateName || '');
      handleInputChange('tradeName', data.tradeName || '');
      
      // Preenche dados de endereço
      handleInputChange('street', data.street || '');
      handleInputChange('addressNumber', data.addressNumber || '');
      handleInputChange('addressComplement', data.addressComplement || '');
      handleInputChange('district', data.district || '');
      handleInputChange('zipCode', data.zipCode || '');
      
      // UF deve estar em maiúsculas para funcionar com a API de municípios
      const uf = (data.state || '').toUpperCase();
      const cityName = data.city || '';
      
      // Preenche UF primeiro para carregar os municípios
      handleInputChange('state', uf);
      
      // Preenche a cidade (será encontrada pelo useEffect quando os municípios carregarem)
      if (cityName) {
        handleInputChange('city', cityName);
      }
      
      // Preenche CNAE (converte número para string)
      if (data.mainActivityCode) {
        handleInputChange('cnae', data.mainActivityCode.toString());
      }
      
      // Preenche telefone se disponível
      if (data.phone1) {
        const phone = data.phone1.replace(/\D/g, '');
        if (phone.length >= 10) {
          const formattedPhone = phone.length === 10 
            ? `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`
            : `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7, 11)}`;
          handleInputChange('phone', formattedPhone);
        }
      }
      
      // Define regime tributário baseado na opção pelo simples
      if (data.simpleNationalOptIn) {
        if (data.individualMicroEntrepreneurOptIn) {
          handleInputChange('taxRegime', 'mei');
        } else {
          handleInputChange('taxRegime', 'simples-nacional');
        }
      }
      
      console.log('Campos preenchidos automaticamente:', {
        corporateName: data.corporateName,
        tradeName: data.tradeName,
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        mainActivityCode: data.mainActivityCode
      });
      
    } catch (error) {
      console.error('Erro ao consultar CNPJ:', error);
      // Não mostra erro para o usuário, apenas loga no console
    } finally {
      setIsLoadingCNPJ(false);
    }
  };

  // Função para lidar com mudança no campo CNPJ
  const handleCNPJChange = async (value: string) => {
    // Se o campo estiver vazio, apenas limpa
    if (!value || value.trim() === '') {
      handleInputChange('cnpj', '');
      return;
    }
    
    // Aplica formatação do CNPJ
    const formatted = formatCNPJ(value);
    handleInputChange('cnpj', formatted);
    
    // Se estiver completo (14 dígitos), consulta a API
    const cleanCnpj = value.replace(/\D/g, '');
    if (cleanCnpj.length === 14) {
      console.log('CNPJ completo detectado, consultando API...');
        await consultCNPJ(formatted);
    }
  };

  // Remove formatação do CNPJ (só números)
  const cleanCNPJ = (cnpj: string): string => {
    return cnpj.replace(/\D/g, '');
  };

  // Remove formatação do CEP (só números)
  const cleanCEP = (cep: string): string => {
    return cep.replace(/\D/g, '');
  };

  // Valida campos obrigatórios
  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!companyData.businessName.trim()) {
      errors.push('Nome Empresarial é obrigatório');
    }
    
    if (!companyData.street.trim()) {
      errors.push('Rua/Av é obrigatória');
    }
    
    return errors;
  };

  // Salva empresa na API
  const handleSave = async () => {
    // Valida campos obrigatórios
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(', '));
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    setShowSuccessMessage(false);

    try {
      // Prepara dados no formato esperado pela API
      const cnpjClean = cleanCNPJ(companyData.cnpj);
      
      // Prepara endereço
      const addresses = [];
      if (companyData.street.trim()) {
        // Tenta encontrar o município se não estiver selecionado
        let currentCity = selectedCity;
        if (!currentCity && companyData.city && cities.length > 0) {
          currentCity = cities.find(m => 
            m.nome.toLowerCase().trim() === companyData.city.toLowerCase().trim()
          ) || null;
        }
        
        // Converte código IBGE para inteiro
        const cityId = currentCity?.codigo_ibge 
          ? parseInt(currentCity.codigo_ibge, 10) 
          : null;
        
        // Log para debug
        if (companyData.city && !cityId) {
          console.warn('[CompanyForm] Município não encontrado para cidade:', companyData.city);
          console.log('[CompanyForm] Municípios disponíveis:', cities.map(m => m.nome));
        }
        
        addresses.push({
          street: companyData.street.trim(),
          number: companyData.addressNumber ? parseInt(companyData.addressNumber, 10) || null : null,
          complement: companyData.addressComplement.trim() || null,
          district: companyData.district.trim() || null,
          city_id: cityId,
          state_id: null, // TODO: Implementar busca de state_id quando tiver tabela de estados
          zipcode: cleanCEP(companyData.zipCode) || null
        });
      }

      // Prepara contatos
      const contacts = [];
      if (companyData.phone.trim()) {
        contacts.push({
          type: 'phone',
          value: companyData.phone.trim()
        });
      }
      if (companyData.email.trim()) {
        contacts.push({
          type: 'email',
          value: companyData.email.trim()
        });
      }

      // Monta payload da API
      const payload: any = {
        name: companyData.businessName.trim(),
        legalName: companyData.tradeName.trim() || null,
        cnpj: cnpjClean || null,
        ie: companyData.stateRegistration.trim() || null,
        im: companyData.municipalRegistration.trim() || null,
        cnae: companyData.cnae.trim() || null
      };

      // Adiciona arrays apenas se tiverem dados
      if (addresses.length > 0) {
        payload.addresses = addresses;
      }
      if (contacts.length > 0) {
        payload.contacts = contacts;
      }

      // Chama API
      const response = await apiPost('/api/companies', payload, { requireAuth: true });

      if (response.ok) {
        setShowSuccessMessage(true);
        
        // Atualiza o ID da empresa se foi criada
        if (response.data?.data?.id && !companyId) {
          setCompanyId(response.data.data.id);
        }
        
        // Salva dados da empresa no localStorage para uso em outras partes do sistema
        localStorage.setItem('companyData', JSON.stringify({
          businessName: companyData.businessName,
          tradeName: companyData.tradeName,
          cnpj: cnpjClean,
          stateRegistration: companyData.stateRegistration,
          municipalRegistration: companyData.municipalRegistration,
          cnae: companyData.cnae,
          street: companyData.street,
          addressNumber: companyData.addressNumber,
          zipCode: companyData.zipCode,
          addressComplement: companyData.addressComplement,
          city: companyData.city,
          state: companyData.state,
          district: companyData.district,
          phone: companyData.phone,
          email: companyData.email
        }));
        
        // Remove mensagem de sucesso após 5 segundos
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);
      } else {
        // Trata erros da API
        const errorMsg = response.data?.message || 
                        (response.data?.errors ? Object.values(response.data.errors).flat().join(', ') : '') ||
                        'Erro ao salvar empresa. Tente novamente.';
        setErrorMessage(errorMsg);
      }
    } catch (error: any) {
      console.error('[CompanyForm] Erro ao salvar empresa:', error);
      setErrorMessage(error.message || 'Erro ao salvar empresa. Verifique sua conexão e tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Mostra loading enquanto carrega dados da empresa
  if (isLoadingCompany) {
    return (
      <div style={{
        padding: '0',
        background: 'transparent',
        overflowY: 'auto' as const,
        height: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px'
      }}>
        <LoadingSpinner size={32} />
        <span style={{
          fontSize: '14px',
          color: systemColors.text.secondary,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
          Carregando dados da empresa...
        </span>
      </div>
    );
  }

  const styles = {
    container: {
      padding: '0',
      background: 'transparent',
      overflowY: 'auto' as const,
      height: '100%'
    },
    section: {
      marginBottom: '32px'
    },
    sectionTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: systemColors.text.primary,
      marginBottom: '16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '16px'
    },
    formGrid2: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px'
    },
    formGrid3: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '16px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '6px'
    },
    label: {
      ...systemStyles.input.label
    },
    input: {
      ...systemStyles.input.field
    },
    selectWrapper: {
      ...systemStyles.select.container
    },
    select: {
      ...systemStyles.select.field
    },
    selectArrow: {
      ...systemStyles.select.arrow
    },
    selectArrowIcon: {
      ...systemStyles.select.arrowIcon
    }
  };

  // Mostra loading enquanto carrega dados da empresa
  if (isLoadingCompany) {
    return (
      <div style={styles.container}>
        <div style={{
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: '16px'
        }}>
          <LoadingSpinner size={32} />
          <span style={{
            fontSize: '14px',
            color: systemColors.text.secondary,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
          }}>
            Carregando dados da empresa...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Seção: Dados da Empresa */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Dados da Empresa</h2>
        
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nome Empresarial</label>
            <input
              type="text"
              style={styles.input}
              value={companyData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Nome Fantasia</label>
            <input
              type="text"
              style={styles.input}
              value={companyData.tradeName}
              onChange={(e) => handleInputChange('tradeName', e.target.value)}
            />
          </div>
        </div>
        
        <div style={styles.formGrid2}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              CNPJ
              {isLoadingCNPJ && (
                <span style={{
                  marginLeft: '8px',
                  fontSize: '10px',
                  color: '#007AFF',
                  fontWeight: '400'
                }}>
                  🔄 Consultando...
                </span>
              )}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                style={{
                  ...styles.input,
                  opacity: isLoadingCNPJ ? 0.7 : 1,
                  cursor: isLoadingCNPJ ? 'not-allowed' : 'text'
                }}
                value={companyData.cnpj}
                onChange={(e) => handleCNPJChange(e.target.value)}
                placeholder="00.000.000/0000-00"
                maxLength={18}
                disabled={isLoadingCNPJ}
              />
              {isLoadingCNPJ && (
                <div style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '12px',
                  color: '#007AFF'
                }}>
                  ⏳
                </div>
              )}
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Inscrição Estadual</label>
            <input
              type="text"
              style={styles.input}
              value={companyData.stateRegistration}
              onChange={(e) => handleInputChange('stateRegistration', e.target.value)}
            />
          </div>
        </div>
        
        <div style={styles.formGrid3}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Inscrição Municipal</label>
            <input
              type="text"
              style={styles.input}
              value={companyData.municipalRegistration}
              onChange={(e) => handleInputChange('municipalRegistration', e.target.value)}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>CNAE</label>
            <input
              type="text"
              style={styles.input}
              value={companyData.cnae}
              onChange={(e) => handleInputChange('cnae', e.target.value)}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Regime Tributário</label>
            <div style={styles.selectWrapper}>
              <select
                style={styles.select}
                value={companyData.taxRegime}
                onChange={(e) => handleInputChange('taxRegime', e.target.value)}
              >
                <option value="">Selecione...</option>
                <option value="simples-nacional">Simples Nacional</option>
                <option value="presumido">Presumido</option>
                <option value="real">Real</option>
                <option value="mei">MEI</option>
              </select>
              <div style={styles.selectArrow}>
                <div style={styles.selectArrowIcon}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção: Endereço */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Endereço</h2>
        
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Rua/Av</label>
            <input
              type="text"
              style={styles.input}
              value={companyData.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
            />
          </div>
        </div>
        
        <div style={styles.formGrid3}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Número</label>
            <input
              type="text"
              style={styles.input}
              value={companyData.addressNumber}
              onChange={(e) => handleInputChange('addressNumber', e.target.value)}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>CEP</label>
            <input
              type="text"
              style={styles.input}
              value={companyData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Complemento</label>
            <input
              type="text"
              style={styles.input}
              value={companyData.addressComplement}
              onChange={(e) => handleInputChange('addressComplement', e.target.value)}
            />
          </div>
        </div>
        
        <div style={styles.formGrid2}>
          <div style={styles.formGroup}>
            <label style={styles.label}>UF</label>
            <div style={styles.selectWrapper}>
              <select
                style={styles.select}
                value={companyData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
              >
                <option value="">Selecione a UF</option>
                {brazilianStates.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
              <div style={styles.selectArrow}>
                <div style={styles.selectArrowIcon}></div>
              </div>
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Cidade
              {loadingCities && (
                <span style={{
                  marginLeft: '8px',
                  fontSize: '10px',
                  color: '#007AFF',
                  fontWeight: '400'
                }}>
                  🔄 Carregando...
                </span>
              )}
            </label>
            <div style={styles.selectWrapper}>
              <select
                style={{
                  ...styles.select,
                  opacity: loadingCities ? 0.7 : 1
                }}
                onChange={(e) => {
                  handleInputChange('city', e.target.value);
                  // Encontra o município selecionado para obter o código IBGE
                  const city = cities.find(m => m.nome === e.target.value);
                  setSelectedCity(city || null);
                }}
                value={companyData.city}
                disabled={!companyData.state || loadingCities}
              >
                <option value="">
                  {!companyData.state 
                    ? 'Selecione uma UF primeiro' 
                    : loadingCities 
                      ? 'Carregando municípios...'
                      : 'Selecione o município'}
                </option>
                {cities.map(cityItem => (
                  <option key={cityItem.codigo_ibge} value={cityItem.nome}>
                    {cityItem.nome}
                  </option>
                ))}
              </select>
              <div style={styles.selectArrow}>
                <div style={styles.selectArrowIcon}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Bairro/Distrito</label>
            <input
              type="text"
              style={styles.input}
              value={companyData.district}
              onChange={(e) => handleInputChange('district', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Seção: Contatos */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Contatos</h2>
        
        <div style={styles.formGrid2}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Telefone</label>
            <input
              type="text"
              style={styles.input}
              value={companyData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              style={styles.input}
              value={companyData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Mensagem de erro */}
      {errorMessage && (
        <div style={{
          padding: '12px 16px',
          background: '#FFEBEE',
          border: '1px solid #EF5350',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#EF5350',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 'bold',
            flexShrink: 0
          }}>
            ✕
          </div>
          <span style={{
            fontSize: '12px',
            color: '#C62828',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
          }}>
            {errorMessage}
          </span>
        </div>
      )}

      {/* Mensagem de sucesso */}
      {showSuccessMessage && (
        <div style={{
          padding: '12px 16px',
          background: '#E8F5E9',
          border: '1px solid #66BB6A',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#66BB6A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 'bold',
            flexShrink: 0
          }}>
            ✓
          </div>
          <span style={{
            fontSize: '12px',
            color: '#2E7D32',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
          }}>
            Empresa salva com sucesso!
          </span>
        </div>
      )}

      {/* Botão Salvar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        marginTop: '24px',
        paddingTop: '24px',
        borderTop: `1px solid ${systemColors.border.light}`
      }}>
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            ...systemStyles.button.primary,
            ...(isSaving ? systemStyles.button.disabled : {}),
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px'
          }}
          onMouseEnter={(e) => {
            if (!isSaving) {
              e.currentTarget.style.background = systemStyles.button.primaryHover.background;
              e.currentTarget.style.boxShadow = systemStyles.button.primaryHover.boxShadow;
            }
          }}
          onMouseLeave={(e) => {
            if (!isSaving) {
              e.currentTarget.style.background = systemStyles.button.primary.background;
              e.currentTarget.style.boxShadow = systemStyles.button.primary.boxShadow;
            }
          }}
        >
          {isSaving ? (
            <>
              <LoadingSpinner size={14} borderWidth={2} />
              Salvando...
            </>
          ) : (
            <>
              <AppIcons.Save size={14} />
              Salvar Empresa
            </>
          )}
        </button>
      </div>
    </div>
  );
}
