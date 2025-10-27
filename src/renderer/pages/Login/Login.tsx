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

  // Voltar para etapa de email
  const handleBack = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep('email');
      setPassword('');
      setShowArrow(false);
      setIsTransitioning(false);
    }, 300);
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
      width: '290px',
      height: '320px',
      position: 'relative' as const,
      ...(isShaking ? { animation: 'shake 0.7s ease-in-out' } : {})
    },
    login: {
      display: 'block',
      padding: '40px 40px 30px',
      position: 'absolute' as const,
      background: 'linear-gradient(to bottom, #f0f0f0, #ddd)',
      borderRadius: '5px',
      border: '1px solid #ffffff',
      boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 20px',
      textAlign: 'center' as const,
      width: '100%'
    },
    avatar: {
      display: 'block',
      margin: '0 auto 15px',
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      border: '3px solid #ffffff',
      boxShadow: 'rgba(0, 0, 0, 0.4) 0px 2px 4px, inset rgba(0, 0, 0, 0.4) 0px 3px 2px',
      overflow: 'hidden' as const,
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0) 50%), #007AFF',
      backgroundSize: 'auto, 100%',
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
      width: '60%',
      height: '60%',
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
      width: '170px',
      margin: '20px auto',
      padding: '10px 25px 10px 10px',
      borderRadius: '3px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#CCC',
      fontSize: '14px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      outline: 'none',
      transition: 'border-color 0.15s ease',
      textTransform: 'none' as const
    },
    passFocus: {
      borderColor: systemColors.selection.blue,
      boxShadow: `0 0 0 3px ${systemColors.selection.background}`
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
      position: 'absolute' as const,
      bottom: '50px',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '10px 20px',
      color: '#ffffff',
      textShadow: '#000 0px 1px 5px',
      fontSize: '13px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      opacity: 0.8,
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
          {/* Avatar */}
          <div style={styles.avatar}>
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
            ...(isTransitioning ? styles.userTransitioning : {})
          }}>
            {step === 'password' ? email : 'Usuário'}
          </span>

          {/* Formulário */}
          <form onSubmit={handleSubmit} style={{
            ...styles.loginForm,
            ...(isTransitioning ? styles.loginFormTransitioning : {})
          }}>
            {step === 'email' ? (
              // Campo de email
              <>
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
                {showArrow && (
                  <span
                    style={styles.arrow}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = systemColors.selection.blue;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#999';
                    }}
                    onClick={handleSubmit}
                  >
                    →
                  </span>
                )}
              </>
            ) : (
              // Campo de senha
              <>
                <input
                  ref={passwordInputRef}
                  type="password"
                  placeholder="senha"
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyPress={handleKeyPress}
                  style={{
                    ...styles.pass,
                    ...(password.length > 0 ? styles.passFocus : {})
                  }}
                />
                {showArrow && (
                  <span
                    style={styles.arrow}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = systemColors.selection.blue;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#999';
                    }}
                    onClick={handleSubmit}
                  >
                    →
                  </span>
                )}
              </>
            )}
          </form>
        </div>

        {/* Hint */}
        <div style={{
          ...styles.hint,
          ...(isTransitioning ? styles.hintTransitioning : {})
        }}>
          {step === 'email' ? 'Digite seu e-mail' : 'Digite sua senha'}
        </div>

        {/* Botão de voltar - apenas na etapa de senha */}
        {step === 'password' && (
          <button
            type="button"
            onClick={handleBack}
            style={styles.backButton}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.backButtonHover);
            }}
            onMouseLeave={(e) => {
              Object.assign(e.currentTarget.style, styles.backButton);
            }}
            title="Voltar (ESC)"
          >
            ←
          </button>
        )}

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
