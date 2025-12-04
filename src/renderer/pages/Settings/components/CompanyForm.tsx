//--------------------------------------------------------------------
// COMPONENTE DE FORMULÁRIO DA EMPRESA
// Formulário para cadastro e edição de dados da empresa
// Seguindo o padrão de estilo macOS
//--------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../styles/ThemeProvider';
import { AppIcons } from '../../../components/Icons/AppIcons';
import { apiPost, apiGet, apiPut } from '../../../utils/apiService';
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
  const [isEditing, setIsEditing] = useState(false);

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
          // Erro silencioso
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
      return null;
    }
  };

  // Carrega dados da empresa ao montar o componente
  useEffect(() => {
    const loadCompanyData = async () => {
      setIsLoadingCompany(true);
      try {
        const response = await apiGet('/api/companies', { requireAuth: true });
        
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
          
          if (companies && companies.length > 0) {
            const company = companies[0];
            
            setCompanyId(company.id);
            
            const address = company.addresses && company.addresses.length > 0 ? company.addresses[0] : null;
            const phoneContact = company.contacts?.find((c: any) => c.type === 'phone');
            const emailContact = company.contacts?.find((c: any) => c.type === 'email');
            
            const cnpjFormatted = company.cnpj ? formatCNPJ(company.cnpj) : '';
            
            // Busca UF do relacionamento state (retornado pelo backend)
            let ufValue = '';
            let cityName = '';
            let cityIbgeCode = '';
            
            if (address?.state?.uf) {
              // Se o backend retornou o relacionamento state, usa a UF de lá
              ufValue = address.state.uf;
            }
            
            if (address?.city?.name) {
              // Se o backend retornou o relacionamento city, usa o nome de lá
              cityName = address.city.name;
            }
            
            // Se temos city_id, assume que é o código IBGE (salvo da API IBGE)
            if (address?.city_id) {
              cityIbgeCode = address.city_id.toString();
            }
            
            // Preenche dados da empresa
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
              city: cityName,
              state: ufValue,
              district: address?.district || '',
              phone: phoneContact?.value || '',
              email: emailContact?.value || ''
            };
            
            // Atualiza o estado
            setCompanyData(companyInfo);
            
            // Se temos UF e cidade, cria o objeto selectedCity para que o select funcione
            if (cityName && cityIbgeCode) {
              setSelectedCity({
                nome: cityName,
                codigo_ibge: cityIbgeCode
              });
            }
          }
        }
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
      // Só limpa selectedCity se não tiver cidade preenchida
      if (!companyData.city) {
        setSelectedCity(null);
      }
    }
  }, [companyData.state]);

  // Atualiza município selecionado quando a cidade ou municípios mudarem
  useEffect(() => {
    // Se não tiver cidade ou já tiver selectedCity definido, não faz nada
    if (!companyData.city) {
      return;
    }
    
    // Se já tem selectedCity e o nome bate, não precisa buscar de novo
    if (selectedCity && selectedCity.nome === companyData.city) {
      return;
    }
    
    // Se não tem cidades carregadas, não tenta buscar
    if (cities.length === 0) {
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
      if (similarCity) {
        setSelectedCity(similarCity);
      }
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
      
    } catch (error) {
      // Erro silencioso
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

  // Alterna entre modo de edição e visualização
  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    // Limpa mensagens ao entrar em modo de edição
    if (!isEditing) {
      setShowSuccessMessage(false);
      setErrorMessage('');
    }
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
        
        // Não calcula state_id no frontend - o backend vai buscar pela UF
        // Envia apenas a UF para o backend processar
        
        // Monta objeto de endereço
        // Envia a UF para o backend buscar o state_id correto
        const addressData: any = {
          street: companyData.street.trim(),
          number: companyData.addressNumber ? parseInt(companyData.addressNumber, 10) || null : null,
          complement: companyData.addressComplement.trim() || null,
          district: companyData.district.trim() || null,
          uf: companyData.state ? companyData.state.toUpperCase() : null,
          zipcode: cleanCEP(companyData.zipCode) || null
        };

        // Adiciona nome da cidade para o backend buscar/criar na tabela cities
        // O backend vai buscar o state_id pela UF e depois buscar/criar a cidade
        if (companyData.city && companyData.state) {
          addressData.city_name = companyData.city;
          // Código IBGE pode ser útil para referência, mas não é obrigatório
          if (cityId) {
            addressData.ibge_code = cityId;
          }
        }

        addresses.push(addressData);
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

      // Chama API - usa PUT se tiver companyId (edição), POST se não tiver (criação)
      const response = companyId 
        ? await apiPut(`/api/companies/${companyId}`, payload, { requireAuth: true })
        : await apiPost('/api/companies', payload, { requireAuth: true });

      if (response.ok) {
        setShowSuccessMessage(true);
        setIsEditing(false); // Sai do modo de edição após salvar
        
        // Atualiza o ID da empresa se foi criada
        if (response.data?.data?.id && !companyId) {
          setCompanyId(response.data.data.id);
        } else if (companyId && response.data?.data?.id) {
          // Garante que o ID está atualizado após edição
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
    inputDisabled: {
      ...systemStyles.input.field,
      opacity: 0.6,
      cursor: 'not-allowed',
      background: systemColors.background.secondary
    },
    selectWrapper: {
      ...systemStyles.select.container
    },
    select: {
      ...systemStyles.select.field
    },
    selectDisabled: {
      ...systemStyles.select.field,
      opacity: 0.6,
      cursor: 'not-allowed',
      background: systemColors.background.secondary
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
              style={styles.inputDisabled}
              value={companyData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              disabled={true}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Nome Fantasia</label>
            <input
              type="text"
              style={styles.inputDisabled}
              value={companyData.tradeName}
              onChange={(e) => handleInputChange('tradeName', e.target.value)}
              disabled={true}
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
                  ...styles.inputDisabled,
                  opacity: isLoadingCNPJ ? 0.7 : 0.6,
                  cursor: 'not-allowed'
                }}
                value={companyData.cnpj}
                onChange={(e) => handleCNPJChange(e.target.value)}
                placeholder="00.000.000/0000-00"
                maxLength={18}
                disabled={true}
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
              style={styles.inputDisabled}
              value={companyData.stateRegistration}
              onChange={(e) => handleInputChange('stateRegistration', e.target.value)}
              disabled={true}
            />
          </div>
        </div>
        
        <div style={styles.formGrid3}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Inscrição Municipal</label>
            <input
              type="text"
              style={!isEditing ? styles.inputDisabled : styles.input}
              value={companyData.municipalRegistration}
              onChange={(e) => handleInputChange('municipalRegistration', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>CNAE</label>
            <input
              type="text"
              style={!isEditing ? styles.inputDisabled : styles.input}
              value={companyData.cnae}
              onChange={(e) => handleInputChange('cnae', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Regime Tributário</label>
            <div style={styles.selectWrapper}>
              <select
                style={!isEditing ? styles.selectDisabled : styles.select}
                value={companyData.taxRegime}
                onChange={(e) => handleInputChange('taxRegime', e.target.value)}
                disabled={!isEditing}
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
              style={!isEditing ? styles.inputDisabled : styles.input}
              value={companyData.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
        
        <div style={styles.formGrid3}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Número</label>
            <input
              type="text"
              style={!isEditing ? styles.inputDisabled : styles.input}
              value={companyData.addressNumber}
              onChange={(e) => handleInputChange('addressNumber', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>CEP</label>
            <input
              type="text"
              style={!isEditing ? styles.inputDisabled : styles.input}
              value={companyData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Complemento</label>
            <input
              type="text"
              style={!isEditing ? styles.inputDisabled : styles.input}
              value={companyData.addressComplement}
              onChange={(e) => handleInputChange('addressComplement', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
        
        <div style={styles.formGrid2}>
          <div style={styles.formGroup}>
            <label style={styles.label}>UF</label>
            <div style={styles.selectWrapper}>
              <select
                style={!isEditing ? styles.selectDisabled : styles.select}
                value={companyData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                disabled={!isEditing}
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
                  ...(!isEditing ? styles.selectDisabled : styles.select),
                  opacity: loadingCities ? 0.7 : (!isEditing ? 0.6 : 1)
                }}
                onChange={(e) => {
                  handleInputChange('city', e.target.value);
                  // Encontra o município selecionado para obter o código IBGE
                  const city = cities.find(m => m.nome === e.target.value);
                  setSelectedCity(city || null);
                }}
                value={companyData.city}
                disabled={!companyData.state || loadingCities || !isEditing}
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
              style={!isEditing ? styles.inputDisabled : styles.input}
              value={companyData.district}
              onChange={(e) => handleInputChange('district', e.target.value)}
              disabled={!isEditing}
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
              style={!isEditing ? styles.inputDisabled : styles.input}
              value={companyData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              style={!isEditing ? styles.inputDisabled : styles.input}
              value={companyData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
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

      {/* Botão Editar/Salvar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        marginTop: '24px',
        paddingTop: '24px',
        borderTop: `1px solid ${systemColors.border.light}`
      }}>
        {isEditing ? (
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
        ) : (
          <button
            onClick={handleToggleEdit}
            style={{
              ...systemStyles.button.default,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px'
            }}
            onMouseEnter={(e) => {
              if (systemStyles.button.defaultHover) {
                e.currentTarget.style.background = systemStyles.button.defaultHover.background;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = systemStyles.button.default.background;
            }}
          >
            <AppIcons.Edit size={14} />
            Editar
          </button>
        )}
      </div>
    </div>
  );
}
