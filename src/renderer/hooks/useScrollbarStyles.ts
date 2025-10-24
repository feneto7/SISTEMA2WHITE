import { useEffect } from 'react';
import { applyScrollbarStyles, removeScrollbarStyles } from '../styles/shared';

// Hook para aplicar estilos de scrollbar específicos
// Permite aplicar diferentes variantes de scrollbar em componentes específicos
export const useScrollbarStyles = (variant: 'global' | 'dark' | 'modal' | 'list' = 'global') => {
  useEffect(() => {
    // Aplicar estilos quando o componente monta
    applyScrollbarStyles(variant);
    
    // Cleanup: remover estilos quando o componente desmonta
    return () => {
      removeScrollbarStyles();
    };
  }, [variant]);
};

// Hook para aplicar scrollbar apenas em um elemento específico
export const useElementScrollbarStyles = (
  elementRef: React.RefObject<HTMLElement>,
  variant: 'global' | 'dark' | 'modal' | 'list' = 'global'
) => {
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const className = `scrollbar-${variant}`;
    
    // Adicionar classe CSS ao elemento
    element.classList.add(className);
    
    // Aplicar estilos específicos ao elemento
    const styleId = `scrollbar-${variant}-${Date.now()}`;
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    
    // Estilos específicos para o elemento
    const elementStyles = `
      .${className} {
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
        scroll-behavior: smooth;
      }
      
      .${className}::-webkit-scrollbar {
        width: ${variant === 'modal' ? '6px' : variant === 'list' ? '7px' : '8px'};
        height: ${variant === 'modal' ? '6px' : variant === 'list' ? '7px' : '8px'};
      }
      
      .${className}::-webkit-scrollbar-track {
        background: transparent;
        border-radius: ${variant === 'modal' ? '3px' : variant === 'list' ? '3.5px' : '4px'};
      }
      
      .${className}::-webkit-scrollbar-thumb {
        background: ${variant === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'};
        border-radius: ${variant === 'modal' ? '3px' : variant === 'list' ? '3.5px' : '4px'};
        border: 1px solid ${variant === 'dark' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
        transition: all 0.2s ease;
      }
      
      .${className}::-webkit-scrollbar-thumb:hover {
        background: ${variant === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)'};
        border: 1px solid ${variant === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'};
        ${variant === 'list' ? 'transform: scale(1.1);' : ''}
      }
      
      .${className}::-webkit-scrollbar-thumb:active {
        background: ${variant === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'};
        border: 1px solid ${variant === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)'};
      }
      
      .${className}::-webkit-scrollbar-corner {
        background: transparent;
      }
    `;
    
    styleElement.textContent = elementStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      // Cleanup
      element.classList.remove(className);
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, [elementRef, variant]);
};
