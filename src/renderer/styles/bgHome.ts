//--------------------------------------------------------------------
// BACKGROUND ANIMADO HOME
// Efeito de ondas animadas com gradiente que muda de cor
// Inspirado em design moderno com animações suaves
//--------------------------------------------------------------------
import React from 'react';

// Estilos para o background animado
export const bgHomeStyles = {
  container: {
    position: 'fixed' as const,
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
  },
  wave: {
    background: 'rgb(255 255 255 / 25%)',
    borderRadius: '1000% 1000% 0 0',
    position: 'fixed' as const,
    width: '200%',
    height: '12em',
    animation: 'wave 10s -3s linear infinite',
    transform: 'translate3d(0, 0, 0)',
    opacity: 0.8,
    bottom: 0,
    left: 0,
    zIndex: -1
  },
  wave2: {
    bottom: '-1.25em',
    animation: 'wave 18s linear reverse infinite',
    opacity: 0.8
  },
  wave3: {
    bottom: '-2.5em',
    animation: 'wave 20s -1s reverse infinite',
    opacity: 0.9
  }
};

// CSS Animations como string para injetar no head
export const bgHomeAnimations = `
@keyframes gradient {
    0% {
        background-position: 0% 0%;
    }
    50% {
        background-position: 100% 100%;
    }
    100% {
        background-position: 0% 0%;
    }
}

@keyframes wave {
    2% {
        transform: translateX(0);
    }
    25% {
        transform: translateX(-25%);
    }
    50% {
        transform: translateX(-50%);
    }
    75% {
        transform: translateX(-25%);
    }
    100% {
        transform: translateX(0);
    }
}
`;

// Componente das ondas animadas
export function AnimatedWaves(): JSX.Element {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement('div', { style: bgHomeStyles.wave }),
    React.createElement('div', { style: { ...bgHomeStyles.wave, ...bgHomeStyles.wave2 } }),
    React.createElement('div', { style: { ...bgHomeStyles.wave, ...bgHomeStyles.wave3 } })
  );
}

// Hook para injetar as animações CSS
export function useAnimatedBackground() {
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = bgHomeAnimations;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
}

