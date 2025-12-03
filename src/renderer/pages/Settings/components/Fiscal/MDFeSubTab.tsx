//--------------------------------------------------------------------
// SUB-ABA DE MDF-e
// Configurações de numeração e série para MDF-e
//--------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../styles/ThemeProvider';
import { apiGet, apiPost } from '../../../../utils/apiService';

interface FormData {
  serie: string;
  numero: string;
}

const ENVIRONMENT_KEY = 'fiscal_environment';

export function MDFeSubTab(): JSX.Element {
  const { systemColors, systemStyles } = useTheme();
  const [producao, setProducao] = useState<FormData>({ serie: '', numero: '' });
  const [homologacao, setHomologacao] = useState<FormData>({ serie: '', numero: '' });
  const [activeEnvironment, setActiveEnvironment] = useState<'producao' | 'homologacao'>('homologacao');
  const [tipoEmitente, setTipoEmitente] = useState<string>('nao_prestador');

  const [isProducaoSerieFocused, setIsProducaoSerieFocused] = useState(false);
  const [isProducaoNumeroFocused, setIsProducaoNumeroFocused] = useState(false);
  const [isHomologacaoSerieFocused, setIsHomologacaoSerieFocused] = useState(false);
  const [isHomologacaoNumeroFocused, setIsHomologacaoNumeroFocused] = useState(false);
  const [isTipoEmitenteFocused, setIsTipoEmitenteFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Estados para rastrear valores salvos (para detectar mudanças)
  const [savedProducao, setSavedProducao] = useState<FormData>({ serie: '', numero: '' });
  const [savedHomologacao, setSavedHomologacao] = useState<FormData>({ serie: '', numero: '' });

  // Função para converter ambiente para código da API (1 = produção, 2 = homologação)
  const getAmbCode = (env: 'producao' | 'homologacao'): string => {
    return env === 'producao' ? '1' : '2';
  };

  // Função para converter código da API para ambiente
  const getEnvFromAmb = (amb: string): 'producao' | 'homologacao' => {
    return amb === '1' ? 'producao' : 'homologacao';
  };

  // Carregar configurações da API
  const loadConfigs = async () => {
    try {
      setIsLoading(true);
      
      // Carrega configurações de produção (amb = 1)
      const producaoResponse = await apiGet('/api/mdfe-config?amb=1', {
        requireAuth: true
      });
      
      if (producaoResponse.ok && producaoResponse.data?.data) {
        const producaoConfig = Array.isArray(producaoResponse.data.data) 
          ? producaoResponse.data.data[0] 
          : producaoResponse.data.data;
        
        if (producaoConfig) {
          const producaoData = {
            serie: producaoConfig.serie || '',
            numero: producaoConfig.nMDF || ''
          };
          setProducao(producaoData);
          setSavedProducao(producaoData);
        }
      }

      // Carrega configurações de homologação (amb = 2)
      const homologacaoResponse = await apiGet('/api/mdfe-config?amb=2', {
        requireAuth: true
      });
      
      if (homologacaoResponse.ok && homologacaoResponse.data?.data) {
        const homologacaoConfig = Array.isArray(homologacaoResponse.data.data) 
          ? homologacaoResponse.data.data[0] 
          : homologacaoResponse.data.data;
        
        if (homologacaoConfig) {
          const homologacaoData = {
            serie: homologacaoConfig.serie || '',
            numero: homologacaoConfig.nMDF || ''
          };
          setHomologacao(homologacaoData);
          setSavedHomologacao(homologacaoData);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de MDF-e:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Salvar configuração na API
  const saveConfig = async (env: 'producao' | 'homologacao', data: FormData) => {
    try {
      const amb = getAmbCode(env);
      
      const response = await apiPost('/api/mdfe-config', {
        serie: data.serie,
        nMDF: data.numero,
        amb: amb
      }, {
        requireAuth: true
      });

      return response.ok;
    } catch (error) {
      console.error(`Erro ao salvar configuração de ${env}:`, error);
      return false;
    }
  };

  // Salvar todas as configurações
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Salva produção e homologação
      const producaoOk = await saveConfig('producao', producao);
      const homologacaoOk = await saveConfig('homologacao', homologacao);
      
      if (producaoOk && homologacaoOk) {
        // Atualiza os valores salvos
        setSavedProducao({ ...producao });
        setSavedHomologacao({ ...homologacao });
        
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Verifica se há mudanças não salvas
  const hasChanges = 
    producao.serie !== savedProducao.serie ||
    producao.numero !== savedProducao.numero ||
    homologacao.serie !== savedHomologacao.serie ||
    homologacao.numero !== savedHomologacao.numero;

  // Carregar ambiente ativo, tipo de emitente e configurações da API
  useEffect(() => {
    const savedEnv = localStorage.getItem(ENVIRONMENT_KEY) as 'producao' | 'homologacao' | null;
    if (savedEnv) {
      setActiveEnvironment(savedEnv);
    }
    
    const savedTipoEmitente = localStorage.getItem('mdfe_tipo_emitente');
    if (savedTipoEmitente) {
      setTipoEmitente(savedTipoEmitente);
    }

    // Carrega configurações da API
    loadConfigs();
  }, []);

  // Escutar mudanças no ambiente fiscal (sincronizar com CertificateSubTab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ENVIRONMENT_KEY && e.newValue) {
        setActiveEnvironment(e.newValue as 'producao' | 'homologacao');
      }
    };

    // Escuta mudanças no localStorage (quando muda em outra aba)
    window.addEventListener('storage', handleStorageChange);

    // Verifica mudanças periodicamente (para mudanças na mesma aba)
    const interval = setInterval(() => {
      const currentEnv = localStorage.getItem(ENVIRONMENT_KEY) as 'producao' | 'homologacao' | null;
      if (currentEnv && currentEnv !== activeEnvironment) {
        setActiveEnvironment(currentEnv);
      }
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [activeEnvironment]);
  
  // Salvar tipo de emitente no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('mdfe_tipo_emitente', tipoEmitente);
  }, [tipoEmitente]);

  // Estilo padrão para inputs - o foco é aplicado globalmente via CSS
  const getInputStyle = (isFocused?: boolean) => ({
    ...systemStyles.input.field,
    ...(isLoading ? { opacity: 0.6, cursor: 'wait' } : {})
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Indicador de Ambiente Ativo */}
      <div style={{
        padding: '12px 16px',
        background: activeEnvironment === 'producao' ? '#FFF3E0' : '#E3F2FD',
        border: `1px solid ${activeEnvironment === 'producao' ? '#FF9800' : '#2196F3'}`,
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: activeEnvironment === 'producao' ? '#FF9800' : '#2196F3'
        }}></div>
        <span style={{
          fontSize: '12px',
          color: systemColors.text.primary,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          fontWeight: '600'
        }}>
          Ambiente Ativo: {activeEnvironment === 'producao' ? 'PRODUÇÃO' : 'HOMOLOGAÇÃO'}
        </span>
      </div>

      <p style={{ 
        fontSize: '13px', 
        color: systemColors.text.secondary,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}>
        Configure o próximo número de série e numeração para MDF-e.
      </p>

      {/* Mensagem de sucesso */}
      {showSuccessMessage && (
        <div style={{
          padding: '12px 16px',
          background: '#E8F5E9',
          border: '1px solid #66BB6A',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
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
            fontWeight: 'bold'
          }}>
            ✓
          </div>
          <span style={{
            fontSize: '12px',
            color: '#2E7D32',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
          }}>
            Configuração salva com sucesso!
          </span>
        </div>
      )}

      {/* Campo Tipo de Emitente */}
      <div style={systemStyles.input.container}>
        <label style={systemStyles.input.label}>Tipo de Emitente</label>
        <div style={systemStyles.select.container}>
          <div style={systemStyles.select.fieldWrapper}>
            <select
              value={tipoEmitente}
              onChange={(e) => setTipoEmitente(e.target.value)}
              onFocus={() => setIsTipoEmitenteFocused(true)}
              onBlur={() => setIsTipoEmitenteFocused(false)}
              style={{
                ...systemStyles.select.field,
                cursor: 'pointer'
              }}
            >
              <option value="nao_prestador">Não prestador de serviço de transporte</option>
            </select>
            <div style={systemStyles.select.arrow}>
              <div style={systemStyles.select.arrowIcon}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Ambiente de Produção */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px',
        opacity: activeEnvironment === 'producao' ? 1 : 0.5,
        position: 'relative'
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: systemColors.text.primary,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          margin: 0
        }}>
          Ambiente de Produção
        </h3>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px'
        }}>
          {/* Série Produção */}
          <div style={systemStyles.input.container}>
            <label style={systemStyles.input.label}>Série</label>
            <input
              type="text"
              value={producao.serie}
              onChange={(e) => setProducao({ ...producao, serie: e.target.value })}
              onFocus={() => setIsProducaoSerieFocused(true)}
              onBlur={() => setIsProducaoSerieFocused(false)}
              placeholder="Ex: 1"
              style={getInputStyle(isProducaoSerieFocused)}
            />
          </div>

          {/* Número Produção */}
          <div style={systemStyles.input.container}>
            <label style={systemStyles.input.label}>Número</label>
            <input
              type="text"
              value={producao.numero}
              onChange={(e) => setProducao({ ...producao, numero: e.target.value })}
              onFocus={() => setIsProducaoNumeroFocused(true)}
              onBlur={() => setIsProducaoNumeroFocused(false)}
              placeholder="Ex: 000000001"
              style={getInputStyle(isProducaoNumeroFocused)}
            />
          </div>
        </div>
      </div>

      {/* Ambiente de Homologação */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px',
        opacity: activeEnvironment === 'homologacao' ? 1 : 0.5,
        position: 'relative'
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: systemColors.text.primary,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          margin: 0
        }}>
          Ambiente de Homologação
        </h3>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px'
        }}>
          {/* Série Homologação */}
          <div style={systemStyles.input.container}>
            <label style={systemStyles.input.label}>Série</label>
            <input
              type="text"
              value={homologacao.serie}
              onChange={(e) => setHomologacao({ ...homologacao, serie: e.target.value })}
              onFocus={() => setIsHomologacaoSerieFocused(true)}
              onBlur={() => setIsHomologacaoSerieFocused(false)}
              placeholder="Ex: 1"
              style={getInputStyle(isHomologacaoSerieFocused)}
            />
          </div>

          {/* Número Homologação */}
          <div style={systemStyles.input.container}>
            <label style={systemStyles.input.label}>Número</label>
            <input
              type="text"
              value={homologacao.numero}
              onChange={(e) => setHomologacao({ ...homologacao, numero: e.target.value })}
              onFocus={() => setIsHomologacaoNumeroFocused(true)}
              onBlur={() => setIsHomologacaoNumeroFocused(false)}
              placeholder="Ex: 000000001"
              style={getInputStyle(isHomologacaoNumeroFocused)}
            />
          </div>
        </div>
      </div>

      {/* Botão Salvar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          style={{
            ...systemStyles.button.primary,
            ...(!hasChanges || isSaving ? systemStyles.button.disabled : {}),
            ...(!hasChanges || isSaving ? {} : systemStyles.button.primaryHover)
          }}
          onMouseOver={(e) => {
            if (hasChanges && !isSaving) {
              Object.assign(e.currentTarget.style, systemStyles.button.primaryHover);
            }
          }}
          onMouseOut={(e) => {
            if (hasChanges && !isSaving) {
              Object.assign(e.currentTarget.style, systemStyles.button.primary);
            }
          }}
        >
          {isSaving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </div>
  );
}
