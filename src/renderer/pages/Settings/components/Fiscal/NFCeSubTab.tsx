//--------------------------------------------------------------------
// SUB-ABA DE NFC-e
// Configurações de numeração e credenciais para NFC-e
//--------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { systemColors, systemStyles } from '../../../../styles/systemStyle';
import { formatMoneyInput } from '../../../../utils/money';

interface ProducaoFormData {
  serie: string;
  valorMaximo: string;
  idToken: string;
  csc: string;
}

interface HomologacaoFormData {
  serie: string;
  valorMaximo: string;
  idToken: string;
  csc: string;
}

const ENVIRONMENT_KEY = 'fiscal_environment';

export function NFCeSubTab(): JSX.Element {
  const [producao, setProducao] = useState<ProducaoFormData>({ 
    serie: '1', 
    valorMaximo: '0,00',
    idToken: '000001',
    csc: ''
  });
  const [homologacao, setHomologacao] = useState<HomologacaoFormData>({ 
    serie: '1', 
    valorMaximo: '0,00',
    idToken: '000001',
    csc: ''
  });
  const [activeEnvironment, setActiveEnvironment] = useState<'producao' | 'homologacao'>('homologacao');

  const [showCscProducao, setShowCscProducao] = useState(false);
  const [showCscHomologacao, setShowCscHomologacao] = useState(false);

  // Estados de foco para todos os campos
  const [isProducaoSerieFocused, setIsProducaoSerieFocused] = useState(false);
  const [isProducaoValorMaximoFocused, setIsProducaoValorMaximoFocused] = useState(false);
  const [isProducaoIdTokenFocused, setIsProducaoIdTokenFocused] = useState(false);
  const [isProducaoCscFocused, setIsProducaoCscFocused] = useState(false);
  
  const [isHomologacaoSerieFocused, setIsHomologacaoSerieFocused] = useState(false);
  const [isHomologacaoValorMaximoFocused, setIsHomologacaoValorMaximoFocused] = useState(false);
  const [isHomologacaoIdTokenFocused, setIsHomologacaoIdTokenFocused] = useState(false);
  const [isHomologacaoCscFocused, setIsHomologacaoCscFocused] = useState(false);

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

  // Ícone de olho para toggle de senha
  const EyeIcon = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const EyeOffIcon = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );

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
        Configure as credenciais e numeração para NFC-e.
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
          gap: '20px',
          alignItems: 'start'
        }}>
          {/* Coluna esquerda - Numeração */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{
              fontSize: '13px',
              fontWeight: '600',
              color: systemColors.text.primary,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              margin: 0
            }}>
              Numeração - Produção
            </h4>

            {/* Série */}
            <div style={systemStyles.input.container}>
              <label style={systemStyles.input.label}>Série *</label>
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

            {/* Valor Máximo */}
            <div style={systemStyles.input.container}>
              <label style={systemStyles.input.label}>Valor Máximo para NFC-e</label>
              <input
                type="text"
                value={producao.valorMaximo}
                onChange={(e) => {
                  const formatted = formatMoneyInput(e.target.value);
                  setProducao({ ...producao, valorMaximo: formatted });
                }}
                onFocus={() => setIsProducaoValorMaximoFocused(true)}
                onBlur={() => setIsProducaoValorMaximoFocused(false)}
                placeholder="R$ 0,00"
                style={getInputStyle(isProducaoValorMaximoFocused)}
              />
            </div>
          </div>

          {/* Coluna direita - Credenciais */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{
              fontSize: '13px',
              fontWeight: '600',
              color: systemColors.text.primary,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              margin: 0
            }}>
              Credenciais - Produção
            </h4>

            {/* ID Token (CSC ID) */}
            <div style={systemStyles.input.container}>
              <label style={systemStyles.input.label}>ID Token (CSC ID) *</label>
              <input
                type="text"
                value={producao.idToken}
                onChange={(e) => setProducao({ ...producao, idToken: e.target.value })}
                onFocus={() => setIsProducaoIdTokenFocused(true)}
                onBlur={() => setIsProducaoIdTokenFocused(false)}
                placeholder="Ex: 000001"
                style={getInputStyle(isProducaoIdTokenFocused)}
              />
            </div>

            {/* CSC */}
            <div style={systemStyles.input.container}>
              <label style={systemStyles.input.label}>CSC (Código de Segurança do Contribuinte) *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCscProducao ? 'text' : 'password'}
                  value={producao.csc}
                  onChange={(e) => setProducao({ ...producao, csc: e.target.value })}
                  onFocus={() => setIsProducaoCscFocused(true)}
                  onBlur={() => setIsProducaoCscFocused(false)}
                  placeholder="Digite o CSC"
                  style={getInputStyle(isProducaoCscFocused)}
                />
                <button
                  type="button"
                  onClick={() => setShowCscProducao(!showCscProducao)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: systemColors.text.secondary
                  }}
                >
                  {showCscProducao ? (
                    <EyeOffIcon size={16} />
                  ) : (
                    <EyeIcon size={16} />
                  )}
                </button>
              </div>
            </div>
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
          gap: '20px',
          alignItems: 'start'
        }}>
          {/* Coluna esquerda - Numeração */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{
              fontSize: '13px',
              fontWeight: '600',
              color: systemColors.text.primary,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              margin: 0
            }}>
              Numeração - Homologação
            </h4>

            {/* Série */}
            <div style={systemStyles.input.container}>
              <label style={systemStyles.input.label}>Série *</label>
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

            {/* Valor Máximo */}
            <div style={systemStyles.input.container}>
              <label style={systemStyles.input.label}>Valor Máximo para NFC-e</label>
              <input
                type="text"
                value={homologacao.valorMaximo}
                onChange={(e) => {
                  const formatted = formatMoneyInput(e.target.value);
                  setHomologacao({ ...homologacao, valorMaximo: formatted });
                }}
                onFocus={() => setIsHomologacaoValorMaximoFocused(true)}
                onBlur={() => setIsHomologacaoValorMaximoFocused(false)}
                placeholder="R$ 0,00"
                style={getInputStyle(isHomologacaoValorMaximoFocused)}
              />
            </div>
          </div>

          {/* Coluna direita - Credenciais */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{
              fontSize: '13px',
              fontWeight: '600',
              color: systemColors.text.primary,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              margin: 0
            }}>
              Credenciais - Homologação
            </h4>

            {/* ID Token (CSC ID) */}
            <div style={systemStyles.input.container}>
              <label style={systemStyles.input.label}>ID Token (CSC ID) *</label>
              <input
                type="text"
                value={homologacao.idToken}
                onChange={(e) => setHomologacao({ ...homologacao, idToken: e.target.value })}
                onFocus={() => setIsHomologacaoIdTokenFocused(true)}
                onBlur={() => setIsHomologacaoIdTokenFocused(false)}
                placeholder="Ex: 000001"
                style={getInputStyle(isHomologacaoIdTokenFocused)}
              />
            </div>

            {/* CSC */}
            <div style={systemStyles.input.container}>
              <label style={systemStyles.input.label}>CSC (Código de Segurança do Contribuinte) *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCscHomologacao ? 'text' : 'password'}
                  value={homologacao.csc}
                  onChange={(e) => setHomologacao({ ...homologacao, csc: e.target.value })}
                  onFocus={() => setIsHomologacaoCscFocused(true)}
                  onBlur={() => setIsHomologacaoCscFocused(false)}
                  placeholder="Digite o CSC"
                  style={getInputStyle(isHomologacaoCscFocused)}
                />
                <button
                  type="button"
                  onClick={() => setShowCscHomologacao(!showCscHomologacao)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: systemColors.text.secondary
                  }}
                >
                  {showCscHomologacao ? (
                    <EyeOffIcon size={16} />
                  ) : (
                    <EyeIcon size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
