//--------------------------------------------------------------------
// SPLASH SCREEN
// Tela de carregamento estilo macOS minimalista
// Exibida na abertura do aplicativo enquanto os recursos carregam
// Animação de slide-in da palavra "Netinove"
//--------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import logoImage from '../../../main/img/logo.png';

export function SplashScreen(): JSX.Element {
  const [visible, setVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  // Detecta o tema do localStorage ou usa 'dark' como padrão
  const theme = (() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('app.theme');
      return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'dark';
    }
    return 'dark';
  })();

  useEffect(() => {
    
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 4300);

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 5200);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return <></>;

  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  const backgroundColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';

  // Palavra "Netinove" dividida em letras
  const letters = ['N', 'e', 't', 'i', 'n', 'o', 'v', 'e'];

  return (
    <>
      <div className={`splash ${isFadingOut ? 'fade-out' : ''}`} style={{ backgroundColor }}>
        <div style={styles.contentContainer}>
          {/* Container das letras */}
          <div className="letter-container">
            {letters.map((letter, index) => (
              <div
                key={index}
                className="letter"
                style={{
                  color: textColor,
                  animationDelay: `${(index + 1) * 0.2}s`
                }}
              >
                {letter}
              </div>
            ))}
          </div>

          {/* Logo abaixo do nome */}
          <div className="logo-container">
            <img
              src={logoImage}
              alt="Logo"
              className="logo-image"
            />
          </div>
        </div>
      </div>

      {/* Injetar estilos CSS */}
      <style>
        {`
          .splash {
            width: 100%;
            height: 100vh;
            position: fixed;
            background-color: ${backgroundColor};
            transition: opacity 0.8s ease-in-out;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .splash.fade-out {
            opacity: 0;
          }

          .letter-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 32px;
          }

          .letter {
            font-size: 2em;
            font-family: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
            opacity: 0;
            transform: translateX(-20px);
            animation: slideIn 0.5s forwards;
          }

          .logo-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 24px;
          }

          .logo-image {
            width: 120px;
            height: 120px;
            object-fit: contain;
            opacity: 0;
            transform: scale(0.8);
            animation: logoAppear 1.5s ease forwards 2.3s;
          }

          @keyframes slideIn {
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes logoAppear {
            0% {
              opacity: 0;
              transform: scale(0.8);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.05);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </>
  );
}

const styles = {
  contentContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const
  }
};
