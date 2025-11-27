//--------------------------------------------------------------------
// COMPONENTE DE CARD DE SELEÇÃO DE TENANT
// Card para inserção do ID do tenant antes do login
// Utilizado na tela de TenantSelection
//--------------------------------------------------------------------

import React, { useState, useRef, useEffect } from 'react';
import { systemStyles } from '../../../styles/systemStyle';
import { useTheme } from '../../../styles/ThemeProvider';
import logoImage from '../../../../main/img/logo.png';

interface TenantSelectionCardProps {
  onContinue: (tenantId: string) => void;
  onValidate: (tenantId: string) => Promise<{ valid: boolean; error?: string }>;
}

export function TenantSelectionCard({ onContinue, onValidate }: TenantSelectionCardProps): JSX.Element {
  const { theme, systemColors } = useTheme();
  const [tenantId, setTenantId] = useState('');
  const [showArrow, setShowArrow] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus no campo ao montar
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Manipular mudança no campo
  const handleTenantIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTenantId(value);
    setShowArrow(value.length > 0);
    setErrorMessage(null); // Limpa erro ao digitar
  };

  // Submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (tenantId.trim().length < 1) {
      setIsShaking(true);
      setErrorMessage('Digite o ID do tenant');
      setTimeout(() => {
        setIsShaking(false);
      }, 700);
      return;
    }

    setIsValidating(true);
    setErrorMessage(null);

    try {
      const validation = await onValidate(tenantId);
      
      if (validation.valid) {
        onContinue(tenantId);
      } else {
        setIsShaking(true);
        setErrorMessage(validation.error || 'Tenant não encontrado');
        setTimeout(() => {
          setIsShaking(false);
        }, 700);
      }
    } catch (error) {
      setIsShaking(true);
      setErrorMessage('Erro ao validar tenant');
      setTimeout(() => {
        setIsShaking(false);
      }, 700);
    } finally {
      setIsValidating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isValidating) {
      handleSubmit(e as any);
    }
  };

  // Filtro do logo baseado no tema
  const logoFilter = theme === 'dark' 
    ? 'brightness(0)' 
    : 'brightness(0) saturate(100%) invert(36%)';

  return (
    <div style={{
      position: 'relative' as const,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh'
    }}>
      {/* Container principal com animação de shake */}
      <div style={{
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        ...(isShaking ? { animation: 'shake 0.7s ease-in-out' } : {}),
        position: 'relative' as const,
        zIndex: 1
      }}>
        {/* Logo centralizada */}
        <div style={logoContainer}>
          <img 
            src={logoImage} 
            alt="Logo" 
            style={{
              ...logoStyle,
              filter: logoFilter,
              WebkitFilter: logoFilter
            }}
          />
        </div>

        {/* Container com label e formulário */}
        <div style={{
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          gap: '0px'
        }}>
          {/* Label */}
          <span style={{
            ...systemStyles.loginCard.userLabel,
            textAlign: 'center' as const,
            marginBottom: '4px'
          }}>
            Código da Empresa
          </span>

          {/* Formulário */}
          <form onSubmit={handleSubmit} style={{
            ...systemStyles.loginCard.form,
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            gap: '2px',
            marginTop: 0
          }}>
            {/* Campo de tenant ID */}
            <div style={{
              ...systemStyles.loginCard.inputWrapper,
              margin: '0 auto 2px'
            }}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Digite o código da empresa"
                value={tenantId}
                onChange={handleTenantIdChange}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={isValidating}
                className="neumorphic-login-input"
                data-theme={theme}
                style={{
                  ...systemStyles.loginCard.input,
                  ...getNeumorphicInputStyle(theme, isFocused, systemColors),
                  opacity: isValidating ? 0.6 : 1
                }}
              />
            </div>
            
            {/* Mensagem de erro */}
            {errorMessage && (
              <div style={{
                color: systemColors.status.error,
                fontSize: '11px',
                marginTop: '4px',
                textAlign: 'center' as const,
                maxWidth: '300px'
              }}>
                {errorMessage}
              </div>
            )}

            {/* Hint */}
            <div style={{
              ...systemStyles.loginCard.hint,
              textAlign: 'center' as const,
              marginTop: errorMessage ? '4px' : '0px'
            }}>
              {isValidating ? 'Validando...' : 'Digite o código da empresa para continuar'}
            </div>
          </form>
        </div>
      </div>

      {/* Footer com informações da empresa */}
      <div style={{
        ...systemStyles.loginCard.footer,
        position: 'fixed' as const,
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        width: 'auto',
        color: systemColors.text.primary,
        textShadow: theme === 'dark' ? '0px 1px 5px rgba(0, 0, 0, 1)' : 'none'
      }}>
        <p style={{
          ...systemStyles.loginCard.footerTitle,
          color: systemColors.text.primary
        }}>Netinove</p>
        <p style={{
          ...systemStyles.loginCard.footerSubtitle,
          color: systemColors.text.secondary
        }}>Consultoria e Sistema</p>
        <a 
          href="https://netinove.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            ...systemStyles.loginCard.footerLink,
            color: systemColors.text.secondary
          }}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, {
              ...systemStyles.loginCard.footerLinkHover,
              color: systemColors.text.primary
            });
          }}
          onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, {
              ...systemStyles.loginCard.footerLink,
              color: systemColors.text.secondary
            });
          }}
        >
          Acesse nosso site
        </a>
      </div>

      {/* Inject shake animation and override global input styles */}
      <style>
        {`
          @keyframes shake {
            0% { transform: translateX(0); }
            20% { transform: translateX(10px); }
            40% { transform: translateX(-10px); }
            60% { transform: translateX(10px); }
            80% { transform: translateX(-10px); }
            100% { transform: translateX(0); }
          }
          
          .neumorphic-login-input {
            border: none !important;
            outline: none !important;
          }
          
          .neumorphic-login-input:focus {
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
          }
          
          .neumorphic-login-input[data-theme="light"]:focus {
            background: #E8E8E8 !important;
            background-color: #E8E8E8 !important;
            box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.2), inset -4px -4px 8px rgba(255, 255, 255, 0.9) !important;
          }
          
          .neumorphic-login-input[data-theme="dark"]:focus {
            background: #3A3A3D !important;
            background-color: #3A3A3D !important;
            box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.02) !important;
          }
          
          .neumorphic-login-input:active {
            border: none !important;
            outline: none !important;
          }
        `}
      </style>
    </div>
  );
}

const logoContainer: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px'
};

const logoStyle: React.CSSProperties = {
  width: '80px',
  height: '80px',
  objectFit: 'contain' as const
};

// Função para obter estilo neumórfico do input baseado no tema
function getNeumorphicInputStyle(
  theme: 'light' | 'dark',
  isFocused: boolean,
  systemColors: any
): React.CSSProperties {
  const baseBg = theme === 'dark' ? systemColors.background.secondary : '#E8E8E8';
  
  if (theme === 'dark') {
    const shadowDark = 'rgba(0, 0, 0, 0.6)';
    const shadowLight = 'rgba(255, 255, 255, 0.02)';
    
    return {
      background: baseBg,
      border: 'none',
      boxShadow: isFocused 
        ? `inset 5px 5px 10px ${shadowDark}, inset -5px -5px 10px ${shadowLight}` 
        : `inset 4px 4px 8px ${shadowDark}, inset -4px -4px 8px ${shadowLight}`,
      outline: 'none'
    };
  } else {
    const shadowDark = 'rgba(0, 0, 0, 0.2)';
    const shadowLight = 'rgba(255, 255, 255, 0.9)';
    
    return {
      background: baseBg,
      border: 'none',
      boxShadow: isFocused 
        ? `inset 5px 5px 10px ${shadowDark}, inset -5px -5px 10px ${shadowLight}` 
        : `inset 4px 4px 8px ${shadowDark}, inset -4px -4px 8px ${shadowLight}`,
      outline: 'none'
    };
  }
}

