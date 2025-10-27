//--------------------------------------------------------------------
// SPLASH SCREEN
// Tela de carregamento estilo macOS minimalista
// Exibida na abertura do aplicativo enquanto os recursos carregam
//--------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import { systemColors } from '../../styles/systemStyle';
import { useAnimatedBackground, AnimatedWaves, bgHomeStyles } from '../../styles/bgHome';
import logo from '../../../main/img/logo.png';

export function SplashScreen(): JSX.Element {
  const [visible, setVisible] = useState(true);
  
  // Injeta animações do background animado
  useAnimatedBackground();

  useEffect(() => {
    // Simula carregamento e remove splash após 2 segundos
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return <></>;

  return (
    <>
      {/* Background animado */}
      <div style={bgHomeStyles.container}>
        <AnimatedWaves />
      </div>

      {/* Conteúdo da splash */}
      <div style={styles.container}>
        {/* Logo com animação de brilho */}
        <div style={styles.logoContainer}>
          <img 
            src={logo} 
            alt="Logo" 
            style={styles.logo}
          />
        </div>

        {/* Texto de carregamento */}
        <p style={styles.loadingText}>Carregando...</p>
      </div>
    </>
  );
}

const styles = {
  container: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  },
  logoContainer: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: '120px',
    height: '120px',
    objectFit: 'contain' as const,
    // Torna a logo vermelha branca (igual AppIconButton)
    filter: 'brightness(0) invert(1) drop-shadow(0 0 20px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 60px rgba(255, 255, 255, 0.4))',
    WebkitFilter: 'brightness(0) invert(1) drop-shadow(0 0 20px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 60px rgba(255, 255, 255, 0.4))',
    animation: 'glowPulse 2s ease-in-out infinite'
  },
  loadingText: {
    marginTop: '32px',
    fontSize: '15px',
    fontWeight: '400',
    color: systemColors.text.secondary,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    letterSpacing: '0.5px',
    animation: 'fadeInOut 2s ease-in-out infinite'
  }
};

// Injetar animações CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes glowPulse {
      0%, 100% {
        filter: brightness(0) invert(1) drop-shadow(0 0 20px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 60px rgba(255, 255, 255, 0.2));
      }
      50% {
        filter: brightness(0) invert(1) drop-shadow(0 0 30px rgba(255, 255, 255, 1)) drop-shadow(0 0 60px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 90px rgba(255, 255, 255, 0.6));
      }
    }
    
    @keyframes fadeInOut {
      0%, 100% {
        opacity: 0.5;
      }
      50% {
        opacity: 1;
      }
    }
  `;
  if (!document.getElementById('splash-animations')) {
    style.id = 'splash-animations';
    document.head.appendChild(style);
  }
}

