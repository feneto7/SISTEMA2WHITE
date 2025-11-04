//--------------------------------------------------------------------
// COMPONENTE DE CARD DE LOGIN
// Card de autenticação com campos de email e senha
// Utilizado na tela de Login
//--------------------------------------------------------------------

import React, { useState, useEffect, useRef } from 'react';
import { systemStyles, systemColors } from '../../../styles/systemStyle';
import { useTheme } from '../../../styles/ThemeProvider';
import logoImage from '../../../../main/img/logo.png';

interface LoginCardProps {
  onLogin: (email: string, password: string) => void;
}

export function LoginCard({ onLogin }: LoginCardProps): JSX.Element {
  const { theme, systemColors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showArrow, setShowArrow] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus no campo apropriado ao montar ou mudar de step
  useEffect(() => {
    if (step === 'email' && emailInputRef.current) {
      emailInputRef.current.focus();
    } else if (step === 'password' && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [step]);

  // Listener para ESC voltar para email
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && step === 'password') {
        setStep('email');
        setShowArrow(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [step]);

  // Manipular mudança no campo de email
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setShowArrow(e.target.value.length > 0);
  };

  // Manipular mudança no campo de senha
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setShowArrow(e.target.value.length > 0);
  };

  // Submissão do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 'email') {
      // Validar email e avançar para senha
      if (email.length < 1) {
        setIsShaking(true);
        setTimeout(() => {
          setIsShaking(false);
        }, 700);
        return;
      }
      // Iniciar transição
      setIsTransitioning(true);
      setTimeout(() => {
        setStep('password');
        setShowArrow(false);
        setIsTransitioning(false);
      }, 300);
    } else {
      // Validar senha e fazer login
      if (password.length < 1) {
        setIsShaking(true);
        setTimeout(() => {
          setIsShaking(false);
        }, 700);
        return;
      }
      
      // Login bem-sucedido
      onLogin(email, password);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  // Filtro do logo baseado no tema
  const logoFilter = theme === 'dark' 
    ? 'brightness(0)' // Logo preto no tema dark
    : 'brightness(0) saturate(100%) invert(36%)'; // Logo cinza escuro no tema light

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

        {/* Container com label e formulário juntos */}
        <div style={{
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          gap: '0px'
        }}>
        {/* Label Usuário */}
        <span style={{
          ...systemStyles.loginCard.userLabel,
          ...(isTransitioning ? systemStyles.loginCard.userLabelTransitioning : {}),
          textAlign: 'center' as const,
          marginBottom: '4px'
        }}>
          {step === 'password' ? email : 'Usuário'}
        </span>

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={{
          ...systemStyles.loginCard.form,
          ...(isTransitioning ? systemStyles.loginCard.formTransitioning : {}),
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          gap: '2px',
          marginTop: 0
        }}>
          {step === 'email' ? (
            // Campo de email
            <div style={{
              ...systemStyles.loginCard.inputWrapper,
              margin: '0 auto 2px'
            }}>
              <input
                ref={emailInputRef}
                type="email"
                placeholder="e-mail"
                value={email}
                onChange={handleEmailChange}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                className="neumorphic-login-input"
                data-theme={theme}
                style={{
                  ...systemStyles.loginCard.input,
                  ...getNeumorphicInputStyle(theme, false, systemColors) // Sempre usa o estilo não focado
                }}
              />
            </div>
          ) : (
            // Campo de senha com botão de revelar senha
            <div style={{
              ...systemStyles.loginCard.inputWrapper,
              margin: '0 auto 2px'
            }}>
              <input
                ref={passwordInputRef}
                type={showPassword ? 'text' : 'password'}
                placeholder="senha"
                value={password}
                onChange={handlePasswordChange}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                className="neumorphic-login-input"
                data-theme={theme}
                style={{
                  ...systemStyles.loginCard.input,
                  ...getNeumorphicInputStyle(theme, false, systemColors) // Sempre usa o estilo não focado
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={systemStyles.loginCard.eyeButton}
                title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </button>
            </div>
          )}
          
          {/* Hint dentro do formulário */}
          <div style={{
            ...systemStyles.loginCard.hint,
            ...(isTransitioning ? systemStyles.loginCard.hintTransitioning : {}),
            textAlign: 'center' as const,
            marginTop: '0px'
          }}>
            {step === 'email' ? 'Digite seu e-mail' : 'Digite sua senha'}
          </div>
        </form>
        </div>
      </div>

      {/* Footer com informações da empresa - sempre fixo na parte inferior */}
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
          
          /* Sobrescrever estilos globais de input para campos de login neumórficos */
          /* Remove border e outline, e garante que background e box-shadow inline sejam preservados */
          .neumorphic-login-input {
            border: none !important;
            outline: none !important;
          }
          
          /* Remover TODOS os estilos globais quando focado */
          .neumorphic-login-input:focus {
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
          }
          
          /* Aplicar background e box-shadow neumórfico baseado no tema via data attribute */
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
          
          /* Garantir que estilos inline sejam preservados */
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
  // Filtro aplicado dinamicamente baseado no tema no componente
};

// Função para obter estilo neumórfico do input baseado no tema
// Inputs neumórficos são sempre debossed (pressionados/côncavos)
function getNeumorphicInputStyle(
  theme: 'light' | 'dark',
  isFocused: boolean,
  systemColors: any
): React.CSSProperties {
  // Background levemente mais escuro que o fundo para criar o efeito debossed
  const baseBg = theme === 'dark' ? systemColors.background.secondary : '#E8E8E8';
  
  if (theme === 'dark') {
    // Neumorfismo dark: sombras internas para efeito debossed
    const shadowDark = 'rgba(0, 0, 0, 0.6)'; // Sombra escura na parte superior/esquerda
    const shadowLight = 'rgba(255, 255, 255, 0.02)'; // Destaque claro na parte inferior/direita
    
    // Mantém o mesmo estilo neumórfico tanto no estado normal quanto focado
    // Apenas intensifica ligeiramente as sombras quando focado
    return {
      background: baseBg,
      border: 'none',
      boxShadow: isFocused 
        ? `inset 5px 5px 10px ${shadowDark}, inset -5px -5px 10px ${shadowLight}` 
        : `inset 4px 4px 8px ${shadowDark}, inset -4px -4px 8px ${shadowLight}`,
      outline: 'none'
    };
  } else {
    // Neumorfismo light: sombras internas mais pronunciadas
    const shadowDark = 'rgba(0, 0, 0, 0.2)'; // Sombra escura na parte superior/esquerda
    const shadowLight = 'rgba(255, 255, 255, 0.9)'; // Destaque claro na parte inferior/direita
    
    // Mantém o mesmo estilo neumórfico tanto no estado normal quanto focado
    // Apenas intensifica ligeiramente as sombras quando focado
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

