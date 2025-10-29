//--------------------------------------------------------------------
// SUB-ABA DE NFS-e
// Configurações de numeração e série para NFS-e
//--------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { systemColors, systemStyles } from '../../../../styles/systemStyle';

interface FormData {
  serie: string;
  numero: string;
}

const ENVIRONMENT_KEY = 'fiscal_environment';

export function NFSeSubTab(): JSX.Element {
  const [producao, setProducao] = useState<FormData>({ serie: '', numero: '' });
  const [homologacao, setHomologacao] = useState<FormData>({ serie: '', numero: '' });
  const [activeEnvironment, setActiveEnvironment] = useState<'producao' | 'homologacao'>('homologacao');

  const [isProducaoSerieFocused, setIsProducaoSerieFocused] = useState(false);
  const [isProducaoNumeroFocused, setIsProducaoNumeroFocused] = useState(false);
  const [isHomologacaoSerieFocused, setIsHomologacaoSerieFocused] = useState(false);
  const [isHomologacaoNumeroFocused, setIsHomologacaoNumeroFocused] = useState(false);

  // Carregar ambiente ativo
  useEffect(() => {
    const savedEnv = localStorage.getItem(ENVIRONMENT_KEY) as 'producao' | 'homologacao' | null;
    if (savedEnv) {
      setActiveEnvironment(savedEnv);
    }
  }, []);

  // Estilo padrão para inputs - o foco é aplicado globalmente via CSS
  const getInputStyle = () => ({
    ...systemStyles.input.field
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
        Configure o próximo número de série e numeração para NFS-e.
      </p>

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
    </div>
  );
}
