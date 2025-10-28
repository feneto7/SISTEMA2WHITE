//--------------------------------------------------------------------
// TELA DE LOGIN
// Tela de autenticação estilo macOS com animação de fundo
// Utiliza o componente AnimatedWaves para efeito de ondas
//--------------------------------------------------------------------

import React, { useState, useEffect, useRef } from 'react';
import { systemColors, systemStyles } from '../../styles/systemStyle';
import { AnimatedWaves, useAnimatedBackground } from '../../styles/bgHome';
import { useNavigation } from '../../router/Navigation';
import logoImage from '../../../main/img/logo.png';

export function Login(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showArrow, setShowArrow] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const { navigate } = useNavigation();

  // Injetar animações CSS do background
  useAnimatedBackground();

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
      
      // Login bem-sucedido - navegar para Home
      navigate('home');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  const styles = {
    container: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1
    },
    loginWrap: {
      width: '340px',
      height: '400px',
      position: 'relative' as const,
      ...(isShaking ? { animation: 'shake 0.7s ease-in-out' } : {})
    },
    login: {
      display: 'block',
      padding: '80px 50px 40px',
      position: 'absolute' as const,
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '50px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
      textAlign: 'center' as const,
      width: '100%',
      overflow: 'hidden' as const
    },
    glassReflection: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: '50%',
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%)',
      pointerEvents: 'none' as const,
      zIndex: 1
    },
    avatar: {
      display: 'block',
      margin: '0 auto 15px',
      width: 'auto',
      height: 'auto',
      overflow: 'hidden' as const,
      position: 'relative' as const
    },
    avatarInner: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%'
    },
    logoImage: {
      width: '80px',
      height: 'auto',
      objectFit: 'contain' as const
    },
    user: {
      padding: '10px 0',
      fontSize: '0.95em',
      color: systemColors.text.primary,
      textShadow: 'rgba(255, 255, 255, 0.7) 0px 1px 0px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      wordBreak: 'break-all' as const,
      transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out'
    },
    userTransitioning: {
      opacity: 0,
      transform: 'scale(0.95)'
    },
    loginForm: {
      position: 'relative' as const,
      marginTop: '20px',
      transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out'
    },
    loginFormTransitioning: {
      opacity: 0,
      transform: 'translateX(20px)'
    },
    pass: {
      display: 'block',
      width: '240px',
      margin: '20px auto',
      padding: '14px 18px',
      borderRadius: '12px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#CCC',
      background: 'transparent',
      color: systemColors.text.primary,
      fontSize: '15px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      outline: 'none',
      transition: 'border-color 0.15s ease',
      textTransform: 'none' as const
    },
    passFocus: {
      borderColor: systemColors.selection.blue,
      boxShadow: `0 0 0 3px ${systemColors.selection.background}`
    },
    eyeButton: {
      position: 'absolute' as const,
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: systemColors.text.secondary,
      fontSize: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4px',
      transition: 'color 0.2s ease'
    },
    passwordInputWrapper: {
      position: 'relative' as const,
      width: '240px',
      margin: '20px auto'
    },
    arrow: {
      position: 'absolute' as const,
      right: '36px',
      top: '30px',
      display: 'block',
      zIndex: 999,
      color: '#999',
      opacity: showArrow ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out',
      fontSize: '18px',
      cursor: 'pointer',
      pointerEvents: showArrow ? 'auto' as const : 'none' as const
    },
    arrowHover: {
      color: systemColors.selection.blue
    },
    hint: {
      marginTop: '8px',
      padding: '0',
      color: systemColors.text.secondary,
      fontSize: '12px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      opacity: 0.7,
      whiteSpace: 'nowrap' as const,
      textAlign: 'center' as const,
      transition: 'opacity 0.3s ease-in-out'
    },
    hintTransitioning: {
      opacity: 0
    },
    backButton: {
      position: 'absolute' as const,
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'transparent',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: '#ffffff',
      fontSize: '18px',
      transition: 'all 0.3s ease',
      opacity: 0.8
    },
    backButtonHover: {
      opacity: 1,
      borderColor: 'rgba(255, 255, 255, 0.6)',
      background: 'rgba(255, 255, 255, 0.1)'
    },
    footer: {
      position: 'absolute' as const,
      bottom: '-80px',
      left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center' as const,
      color: '#ffffff',
      textShadow: '#000 0px 1px 5px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      width: '100%'
    },
    footerTitle: {
      fontSize: '16px',
      fontWeight: '600',
      margin: '0 0 4px 0'
    },
    footerSubtitle: {
      fontSize: '13px',
      fontWeight: '400',
      margin: '0 0 8px 0',
      opacity: 0.9
    },
    footerLink: {
      fontSize: '12px',
      color: '#ffffff',
      textDecoration: 'none',
      opacity: 0.8,
      transition: 'opacity 0.2s ease',
      cursor: 'pointer'
    },
    footerLinkHover: {
      opacity: 1,
      textDecoration: 'underline'
    }
  };

  return (
    <div style={styles.container}>
      {/* Background animado */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        overflow: 'hidden',
        background: 'linear-gradient(315deg, rgba(101,0,94,1) 3%, rgba(60,132,206,1) 38%, rgba(48,238,226,1) 68%, rgba(255,25,25,1) 98%)',
        backgroundSize: '400% 400%',
        backgroundAttachment: 'fixed',
        animation: 'gradient 15s ease infinite'
      }}>
        <AnimatedWaves />
      </div>

      {/* Card de login */}
      <div style={styles.loginWrap}>
        <div style={styles.login}>
          {/* Efeito de reflexo de vidro */}
          <div style={styles.glassReflection} />
          
          {/* Logo */}
          <div style={{...styles.avatar, position: 'relative' as const, zIndex: 2}}>
            <div style={styles.avatarInner}>
              <img 
                src={logoImage} 
                alt="Logo" 
                style={styles.logoImage}
              />
            </div>
          </div>

          {/* Nome do usuário - mostra email quando na etapa de senha */}
          <span style={{
            ...styles.user,
            ...(isTransitioning ? styles.userTransitioning : {}),
            position: 'relative' as const,
            zIndex: 2
          }}>
            {step === 'password' ? email : 'Usuário'}
          </span>

          {/* Formulário */}
          <form onSubmit={handleSubmit} style={{
            ...styles.loginForm,
            ...(isTransitioning ? styles.loginFormTransitioning : {}),
            position: 'relative' as const,
            zIndex: 2
          }}>
            {step === 'email' ? (
              // Campo de email
              <div className="passwordInputWrapper" style={styles.passwordInputWrapper}>
                <input
                  ref={emailInputRef}
                  type="email"
                  placeholder="e-mail"
                  value={email}
                  onChange={handleEmailChange}
                  onKeyPress={handleKeyPress}
                  style={{
                    ...styles.pass,
                    ...(email.length > 0 ? styles.passFocus : {})
                  }}
                />
              </div>
            ) : (
              // Campo de senha com botão de revelar senha
              <div className="passwordInputWrapper" style={styles.passwordInputWrapper}>
                <input
                  ref={passwordInputRef}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="senha"
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyPress={handleKeyPress}
                  style={{
                    ...styles.pass,
                    ...(password.length > 0 ? styles.passFocus : {}),
                    paddingRight: '40px'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
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
              ...styles.hint,
              ...(isTransitioning ? styles.hintTransitioning : {}),
              position: 'relative' as const,
              zIndex: 2
            }}>
              {step === 'email' ? 'Digite seu e-mail' : 'Digite sua senha'}
            </div>
          </form>
        </div>

        {/* Footer com informações da empresa */}
        <div style={styles.footer}>
          <p style={styles.footerTitle}>Netinove</p>
          <p style={styles.footerSubtitle}>Consultoria e Sistema</p>
          <a 
            href="https://netinove.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={styles.footerLink}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.8';
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Acesse nosso site
          </a>
        </div>
      </div>

      {/* Inject shake animation */}
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
        `}
      </style>
    </div>
  );
}
