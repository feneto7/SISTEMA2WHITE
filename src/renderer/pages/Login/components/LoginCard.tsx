//--------------------------------------------------------------------
// COMPONENTE DE CARD DE LOGIN
// Card de autenticação com campos de email e senha
// Utilizado na tela de Login
//--------------------------------------------------------------------

import React, { useState, useEffect, useRef } from 'react';
import { systemStyles } from '../../../styles/systemStyle';
import logoImage from '../../../../main/img/logo.png';

interface LoginCardProps {
  onLogin: (email: string, password: string) => void;
}

export function LoginCard({ onLogin }: LoginCardProps): JSX.Element {
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

  return (
    <div style={{
      ...systemStyles.loginCard.container,
      ...(isShaking ? { animation: 'shake 0.7s ease-in-out' } : {})
    }}>
      <div style={systemStyles.loginCard.card}>
        {/* Efeito de reflexo de vidro */}
        <div style={systemStyles.loginCard.glassReflection} />
        
        {/* Logo */}
        <div style={{...systemStyles.loginCard.avatar, position: 'relative' as const, zIndex: 2}}>
          <div style={systemStyles.loginCard.avatarInner}>
            <img 
              src={logoImage} 
              alt="Logo" 
              style={systemStyles.loginCard.logoImage}
            />
          </div>
        </div>

        {/* Nome do usuário - mostra email quando na etapa de senha */}
        <span style={{
          ...systemStyles.loginCard.userLabel,
          ...(isTransitioning ? systemStyles.loginCard.userLabelTransitioning : {}),
          position: 'relative' as const,
          zIndex: 2
        }}>
          {step === 'password' ? email : 'Usuário'}
        </span>

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={{
          ...systemStyles.loginCard.form,
          ...(isTransitioning ? systemStyles.loginCard.formTransitioning : {}),
          position: 'relative' as const,
          zIndex: 2
        }}>
          {step === 'email' ? (
            // Campo de email
            <div style={systemStyles.loginCard.inputWrapper}>
              <input
                ref={emailInputRef}
                type="email"
                placeholder="e-mail"
                value={email}
                onChange={handleEmailChange}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                style={{
                  ...systemStyles.loginCard.input,
                  ...(isEmailFocused || email.length > 0 ? systemStyles.loginCard.inputFocus : {})
                }}
              />
            </div>
          ) : (
            // Campo de senha com botão de revelar senha
            <div style={systemStyles.loginCard.inputWrapper}>
              <input
                ref={passwordInputRef}
                type={showPassword ? 'text' : 'password'}
                placeholder="senha"
                value={password}
                onChange={handlePasswordChange}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                style={{
                  ...systemStyles.loginCard.input,
                  ...(isPasswordFocused || password.length > 0 ? systemStyles.loginCard.inputFocus : {})
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
            position: 'relative' as const,
            zIndex: 2
          }}>
            {step === 'email' ? 'Digite seu e-mail' : 'Digite sua senha'}
          </div>
        </form>
      </div>

      {/* Footer com informações da empresa */}
      <div style={systemStyles.loginCard.footer}>
        <p style={systemStyles.loginCard.footerTitle}>Netinove</p>
        <p style={systemStyles.loginCard.footerSubtitle}>Consultoria e Sistema</p>
        <a 
          href="https://netinove.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          style={systemStyles.loginCard.footerLink}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, systemStyles.loginCard.footerLinkHover);
          }}
          onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, systemStyles.loginCard.footerLink);
          }}
        >
          Acesse nosso site
        </a>
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

