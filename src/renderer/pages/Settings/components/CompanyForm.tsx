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
interface Municipio {
  nome: string;
  codigo_ibge: string;
}

// Interface para resposta da API BrasilAPI
interface CNPJResponse {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  situacao_cadastral: number;
  descricao_situacao_cadastral: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  descricao_tipo_logradouro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  uf: string;
  codigo_municipio: number;
  municipio: string;
  ddd_telefone_1: string;
  ddd_telefone_2: string;
  opcao_pelo_simples: boolean;
  opcao_pelo_mei: boolean;
}

export function CompanyForm(): JSX.Element {
  const { systemStyles, systemColors } = useTheme();
  const [empresaData, setEmpresaData] = useState({
    nomeEmpresarial: '',
    nomeFantasia: '',
    cnpj: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    cnae: '',
    regimeTributario: '',
    rua: '',
    numero: '',
    cep: '',
    complemento: '',
    cidade: '',
    uf: '',
    bairro: '',
    telefone: '',
    email: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingCNPJ, setIsLoadingCNPJ] = useState(false);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);
  const [municipioSelecionado, setMunicipioSelecionado] = useState<Municipio | null>(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);
  const [companyId, setCompanyId] = useState<number | null>(null);

  // Lista de UFs brasileiras
  const ufsBrasileiras = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const handleInputChange = (field: string, value: string) => {
    setEmpresaData(prev => {
      const newData = { ...prev, [field]: value };
      // Se mudar a UF, limpa a cidade
      if (field === 'uf') {
        newData.cidade = '';
      }
      return newData;
    });
    // Limpa mensagens ao editar
    if (showSuccessMessage) setShowSuccessMessage(false);
    if (errorMessage) setErrorMessage('');
  };

  // Função para buscar municípios da API BrasilAPI
  const fetchMunicipios = async (uf: string) => {
    if (!uf) {
      setMunicipios([]);
      return;
    }
    
    setLoadingMunicipios(true);
    try {
      const response = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${uf}?providers=dados-abertos-br,gov,wikipedia`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar municípios: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Mapear os dados para o formato esperado
      // Remove o estado entre parênteses do nome do município (ex: "SÃO FELIPE (BAHIA)" -> "SÃO FELIPE")
      const municipiosFormatados: Municipio[] = data.map((municipio: any) => ({
        nome: municipio.nome.replace(/\s*\([^)]*\)\s*$/, '').trim(),
        codigo_ibge: municipio.codigo_ibge
      }));
      
      setMunicipios(municipiosFormatados);
      console.log(`Municípios de ${uf} carregados:`, municipiosFormatados.length);
      
      // Se houver uma cidade pendente para preencher (vinda da consulta de CNPJ), tenta preenchê-la
      const cidadePendente = empresaData.cidade;
      if (cidadePendente && municipiosFormatados.length > 0) {
        const municipioEncontrado = municipiosFormatados.find(m => 
          m.nome.toLowerCase().trim() === cidadePendente.toLowerCase().trim()
        );
        if (municipioEncontrado) {
          setMunicipioSelecionado(municipioEncontrado);
        }
      }
    } catch (error) {
      console.error(`Erro ao buscar municípios de ${uf}:`, error);
      setMunicipios([]);
    } finally {
      setLoadingMunicipios(false);
    }
  };

  // Busca cidade e UF pelo código IBGE (otimizado)
  const buscarCidadeEUFPorCodigoIBGE = async (codigoIBGE: number, stateId?: number): Promise<{ cidade: string; uf: string } | null> => {
    try {
      // Se temos state_id, busca apenas na UF correspondente (muito mais rápido)
      if (stateId && stateId > 0 && stateId <= ufsBrasileiras.length) {
        const uf = ufsBrasileiras[stateId - 1];
        try {
          const response = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${uf}?providers=dados-abertos-br,gov,wikipedia`);
          
          if (response.ok) {
            const municipiosData = await response.json();
            const municipio = municipiosData.find((m: any) => parseInt(m.codigo_ibge, 10) === codigoIBGE);
            
            if (municipio) {
              const nomeCidade = municipio.nome.replace(/\s*\([^)]*\)\s*$/, '').trim();
              return { cidade: nomeCidade, uf: uf };
            }
          }
        } catch (error) {
          console.error(`[CompanyForm] Erro ao buscar município na UF ${uf}:`, error);
        }
      }
      
      // Se não encontrou ou não tem state_id, busca nas UFs mais comuns primeiro (otimizado)
      const ufsPrioritarias = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'PE', 'CE'];
      
      // Faz requisições em paralelo para as UFs prioritárias (muito mais rápido)
      const promisesPrioritarias = ufsPrioritarias.map(async (uf) => {
        try {
          const response = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${uf}?providers=dados-abertos-br,gov,wikipedia`);
          
          if (response.ok) {
            const municipiosData = await response.json();
            const municipio = municipiosData.find((m: any) => parseInt(m.codigo_ibge, 10) === codigoIBGE);
            
            if (municipio) {
              const nomeCidade = municipio.nome.replace(/\s*\([^)]*\)\s*$/, '').trim();
              return { cidade: nomeCidade, uf: uf };
            }
          }
        } catch (error) {
          // Ignora erros individuais
        }
        return null;
      });
      
      // Aguarda todas as requisições prioritárias em paralelo
      const resultados = await Promise.all(promisesPrioritarias);
      const resultadoEncontrado = resultados.find(r => r !== null);
      
      if (resultadoEncontrado) {
        return resultadoEncontrado;
      }
      
      // Se não encontrou nas prioritárias, busca nas demais (sequencial, mas raramente necessário)
      const outrasUFs = ufsBrasileiras.filter(uf => !ufsPrioritarias.includes(uf));
      for (const uf of outrasUFs) {
        try {
          const response = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${uf}?providers=dados-abertos-br,gov,wikipedia`);
          
          if (response.ok) {
            const municipiosData = await response.json();
            const municipio = municipiosData.find((m: any) => parseInt(m.codigo_ibge, 10) === codigoIBGE);
            
            if (municipio) {
              const nomeCidade = municipio.nome.replace(/\s*\([^)]*\)\s*$/, '').trim();
              return { cidade: nomeCidade, uf: uf };
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
              if (stateIndex >= 0 && stateIndex < ufsBrasileiras.length) {
                ufValue = ufsBrasileiras[stateIndex];
              }
            }
            
            // Preenche dados básicos primeiro (sem esperar busca da cidade)
            const dadosEmpresa = {
              nomeEmpresarial: company.name || '',
              nomeFantasia: company.legal_name || '',
              cnpj: cnpjFormatted,
              inscricaoEstadual: company.ie || '',
              inscricaoMunicipal: company.im || '',
              cnae: company.cnae || '',
              regimeTributario: '',
              rua: address?.street || '',
              numero: address?.number?.toString() || '',
              cep: address?.zipcode || '',
              complemento: address?.complement || '',
              cidade: '', // Será preenchido depois
              uf: ufValue,
              bairro: address?.district || '',
              telefone: phoneContact?.value || '',
              email: emailContact?.value || ''
            };
            
            console.log('[CompanyForm] Dados básicos da empresa preenchidos:', dadosEmpresa);
            
            // Atualiza o estado com os dados básicos primeiro (renderiza imediatamente)
            setEmpresaData(dadosEmpresa);
            
            // Busca cidade de forma assíncrona (não bloqueia a renderização)
            if (address?.city_id) {
              console.log('[CompanyForm] Buscando cidade pelo código IBGE:', address.city_id, 'state_id:', address.state_id);
              // Não usa await aqui - busca em background
              buscarCidadeEUFPorCodigoIBGE(address.city_id, address.state_id)
                .then((cidadeEUF) => {
                  if (cidadeEUF) {
                    console.log('[CompanyForm] Cidade e UF encontradas:', cidadeEUF);
                    // Atualiza apenas a cidade sem recarregar tudo
                    setEmpresaData(prev => ({
                      ...prev,
                      cidade: cidadeEUF.cidade,
                      uf: cidadeEUF.uf || prev.uf // Mantém UF se já estava preenchida
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
    if (empresaData.uf) {
      fetchMunicipios(empresaData.uf);
    } else {
      setMunicipios([]);
      setMunicipioSelecionado(null);
    }
  }, [empresaData.uf]);

  // Atualiza município selecionado quando a cidade ou municípios mudarem
  useEffect(() => {
    if (!empresaData.cidade || municipios.length === 0) {
      setMunicipioSelecionado(null);
      return;
    }
    
    // Tenta encontrar o município correspondente (busca case-insensitive)
    const municipio = municipios.find(m => 
      m.nome.toLowerCase().trim() === empresaData.cidade.toLowerCase().trim()
    );
    
    if (municipio) {
      setMunicipioSelecionado(municipio);
    } else {
      // Se não encontrou, tenta buscar por similaridade (pode ser que a API retorne com acentos diferentes)
      const municipioSimilar = municipios.find(m => 
        m.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === 
        empresaData.cidade.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      );
      setMunicipioSelecionado(municipioSimilar || null);
    }
  }, [empresaData.cidade, municipios]);

  // Função para consultar CNPJ na API BrasilAPI
  const consultarCNPJ = async (cnpj: string) => {
    setIsLoadingCNPJ(true);
    try {
      // Remove formatação do CNPJ para consulta
      const cnpjLimpo = cnpj.replace(/\D/g, '');
      
      // Verifica se o CNPJ tem 14 dígitos
      if (cnpjLimpo.length !== 14) {
        return;
      }

      console.log('Consultando CNPJ:', cnpjLimpo);
      
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);
      
      if (!response.ok) {
        throw new Error(`Erro na consulta: ${response.status}`);
      }
      
      const data: CNPJResponse = await response.json();
      
      console.log('Dados recebidos da API:', data);
      
      // Preenche os campos automaticamente
      handleInputChange('nomeEmpresarial', data.razao_social || '');
      handleInputChange('nomeFantasia', data.nome_fantasia || '');
      
      // Preenche dados de endereço
      handleInputChange('rua', data.logradouro || '');
      handleInputChange('numero', data.numero || '');
      handleInputChange('complemento', data.complemento || '');
      handleInputChange('bairro', data.bairro || '');
      handleInputChange('cep', data.cep || '');
      
      // UF deve estar em maiúsculas para funcionar com a API de municípios
      const uf = (data.uf || '').toUpperCase();
      const municipioNome = data.municipio || '';
      
      // Preenche UF primeiro para carregar os municípios
      handleInputChange('uf', uf);
      
      // Preenche a cidade (será encontrada pelo useEffect quando os municípios carregarem)
      if (municipioNome) {
        handleInputChange('cidade', municipioNome);
      }
      
      // Preenche CNAE (converte número para string)
      if (data.cnae_fiscal) {
        handleInputChange('cnae', data.cnae_fiscal.toString());
      }
      
      // Preenche telefone se disponível
      if (data.ddd_telefone_1) {
        const telefone = data.ddd_telefone_1.replace(/\D/g, '');
        if (telefone.length >= 10) {
          const telefoneFormatado = telefone.length === 10 
            ? `(${telefone.slice(0, 2)}) ${telefone.slice(2, 6)}-${telefone.slice(6)}`
            : `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7, 11)}`;
          handleInputChange('telefone', telefoneFormatado);
        }
      }
      
      // Define regime tributário baseado na opção pelo simples
      if (data.opcao_pelo_simples) {
        if (data.opcao_pelo_mei) {
          handleInputChange('regimeTributario', 'mei');
        } else {
          handleInputChange('regimeTributario', 'simples-nacional');
        }
      }
      
      console.log('Campos preenchidos automaticamente:', {
        razaoSocial: data.razao_social,
        nomeFantasia: data.nome_fantasia,
        endereco: data.logradouro,
        cidade: data.municipio,
        estado: data.uf,
        cep: data.cep,
        cnae: data.cnae_fiscal
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
    const cnpjLimpo = value.replace(/\D/g, '');
    if (cnpjLimpo.length === 14) {
      console.log('CNPJ completo detectado, consultando API...');
      await consultarCNPJ(formatted);
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
    
    if (!empresaData.nomeEmpresarial.trim()) {
      errors.push('Nome Empresarial é obrigatório');
    }
    
    if (!empresaData.rua.trim()) {
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
      const cnpjClean = cleanCNPJ(empresaData.cnpj);
      
      // Prepara endereço
      const addresses = [];
      if (empresaData.rua.trim()) {
        // Tenta encontrar o município se não estiver selecionado
        let municipioAtual = municipioSelecionado;
        if (!municipioAtual && empresaData.cidade && municipios.length > 0) {
          municipioAtual = municipios.find(m => 
            m.nome.toLowerCase().trim() === empresaData.cidade.toLowerCase().trim()
          ) || null;
        }
        
        // Converte código IBGE para inteiro
        const cityId = municipioAtual?.codigo_ibge 
          ? parseInt(municipioAtual.codigo_ibge, 10) 
          : null;
        
        // Log para debug
        if (empresaData.cidade && !cityId) {
          console.warn('[CompanyForm] Município não encontrado para cidade:', empresaData.cidade);
          console.log('[CompanyForm] Municípios disponíveis:', municipios.map(m => m.nome));
        }
        
        addresses.push({
          street: empresaData.rua.trim(),
          number: empresaData.numero ? parseInt(empresaData.numero, 10) || null : null,
          complement: empresaData.complemento.trim() || null,
          district: empresaData.bairro.trim() || null,
          city_id: cityId,
          state_id: null, // TODO: Implementar busca de state_id quando tiver tabela de estados
          zipcode: cleanCEP(empresaData.cep) || null
        });
      }

      // Prepara contatos
      const contacts = [];
      if (empresaData.telefone.trim()) {
        contacts.push({
          type: 'phone',
          value: empresaData.telefone.trim()
        });
      }
      if (empresaData.email.trim()) {
        contacts.push({
          type: 'email',
          value: empresaData.email.trim()
        });
      }

      // Monta payload da API
      const payload: any = {
        name: empresaData.nomeEmpresarial.trim(),
        legalName: empresaData.nomeFantasia.trim() || null,
        cnpj: cnpjClean || null,
        ie: empresaData.inscricaoEstadual.trim() || null,
        im: empresaData.inscricaoMunicipal.trim() || null,
        cnae: empresaData.cnae.trim() || null
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
          nomeEmpresarial: empresaData.nomeEmpresarial,
          nomeFantasia: empresaData.nomeFantasia,
          cnpj: cnpjClean,
          inscricaoEstadual: empresaData.inscricaoEstadual,
          inscricaoMunicipal: empresaData.inscricaoMunicipal,
          cnae: empresaData.cnae,
          rua: empresaData.rua,
          numero: empresaData.numero,
          cep: empresaData.cep,
          complemento: empresaData.complemento,
          cidade: empresaData.cidade,
          uf: empresaData.uf,
          bairro: empresaData.bairro,
          telefone: empresaData.telefone,
          email: empresaData.email
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
              value={empresaData.nomeEmpresarial}
              onChange={(e) => handleInputChange('nomeEmpresarial', e.target.value)}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Nome Fantasia</label>
            <input
              type="text"
              style={styles.input}
              value={empresaData.nomeFantasia}
              onChange={(e) => handleInputChange('nomeFantasia', e.target.value)}
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
                value={empresaData.cnpj}
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
              value={empresaData.inscricaoEstadual}
              onChange={(e) => handleInputChange('inscricaoEstadual', e.target.value)}
            />
          </div>
        </div>
        
        <div style={styles.formGrid3}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Inscrição Municipal</label>
            <input
              type="text"
              style={styles.input}
              value={empresaData.inscricaoMunicipal}
              onChange={(e) => handleInputChange('inscricaoMunicipal', e.target.value)}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>CNAE</label>
            <input
              type="text"
              style={styles.input}
              value={empresaData.cnae}
              onChange={(e) => handleInputChange('cnae', e.target.value)}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Regime Tributário</label>
            <div style={styles.selectWrapper}>
              <select
                style={styles.select}
                value={empresaData.regimeTributario}
                onChange={(e) => handleInputChange('regimeTributario', e.target.value)}
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
              value={empresaData.rua}
              onChange={(e) => handleInputChange('rua', e.target.value)}
            />
          </div>
        </div>
        
        <div style={styles.formGrid3}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Número</label>
            <input
              type="text"
              style={styles.input}
              value={empresaData.numero}
              onChange={(e) => handleInputChange('numero', e.target.value)}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>CEP</label>
            <input
              type="text"
              style={styles.input}
              value={empresaData.cep}
              onChange={(e) => handleInputChange('cep', e.target.value)}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Complemento</label>
            <input
              type="text"
              style={styles.input}
              value={empresaData.complemento}
              onChange={(e) => handleInputChange('complemento', e.target.value)}
            />
          </div>
        </div>
        
        <div style={styles.formGrid2}>
          <div style={styles.formGroup}>
            <label style={styles.label}>UF</label>
            <div style={styles.selectWrapper}>
              <select
                style={styles.select}
                value={empresaData.uf}
                onChange={(e) => handleInputChange('uf', e.target.value)}
              >
                <option value="">Selecione a UF</option>
                {ufsBrasileiras.map(uf => (
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
              {loadingMunicipios && (
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
                  opacity: loadingMunicipios ? 0.7 : 1
                }}
                value={empresaData.cidade}
                onChange={(e) => {
                  handleInputChange('cidade', e.target.value);
                  // Encontra o município selecionado para obter o código IBGE
                  const municipio = municipios.find(m => m.nome === e.target.value);
                  setMunicipioSelecionado(municipio || null);
                }}
                disabled={!empresaData.uf || loadingMunicipios}
              >
                <option value="">
                  {!empresaData.uf 
                    ? 'Selecione uma UF primeiro' 
                    : loadingMunicipios 
                      ? 'Carregando municípios...'
                      : 'Selecione o município'}
                </option>
                {municipios.map(municipio => (
                  <option key={municipio.codigo_ibge} value={municipio.nome}>
                    {municipio.nome}
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
              value={empresaData.bairro}
              onChange={(e) => handleInputChange('bairro', e.target.value)}
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
              value={empresaData.telefone}
              onChange={(e) => handleInputChange('telefone', e.target.value)}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              style={styles.input}
              value={empresaData.email}
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
