// Estilos compartilhados otimizados para performance
// Centraliza estilos comuns e reduz duplicação de código
export const sharedStyles = {
  // Variáveis CSS otimizadas para melhor performance
  variables: {
    // Cores principais do sistema
    '--accent': '#0A84FF',
    '--accent-2': '#64D2FF',
    '--primary-bg': '#f8f8f8',
    '--secondary-bg': '#f0f0f0',
    '--tertiary-bg': '#ddd',
    '--text-primary': 'rgba(0,0,0,0.85)',
    '--text-secondary': 'rgba(0,0,0,0.6)',
    '--text-light': 'rgba(255,255,255,0.7)',
    '--text-white': '#fff',
    
    // Cores de painéis e vidro fosco
    '--panel': 'rgba(248,248,248,0.9)',
    '--panel-stroke': 'rgba(255,255,255,0.8)',
    '--glass-bg': 'rgba(248,248,248,0.8)',
    '--glass-border': 'rgba(255,255,255,0.9)',
    '--glass-shadow': 'rgba(0,0,0,0.5) 0px 3px 20px',
    
    // Gradientes otimizados
    '--gradient-primary': 'linear-gradient(to bottom, #f0f0f0, #ddd)',
    '--gradient-glass': 'linear-gradient(135deg, rgba(240,241,245,0.7), rgba(230,235,242,0.55))',
    '--gradient-avatar': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 50%)',
    
    // Sombras otimizadas
    '--shadow-light': 'rgba(0,0,0,0.4) 0px 2px 4px',
    '--shadow-medium': 'rgba(0,0,0,0.5) 0px 3px 20px',
    '--shadow-heavy': 'rgba(0,0,0,0.6) 0px 4px 8px',
    '--shadow-inset': 'inset rgba(0,0,0,0.4) 0px 3px 2px',
    '--shadow-text': '#000 0px 1px 3px',
    '--shadow-text-light': 'rgba(255,255,255,0.7) 0px 1px 0px',
    
    // Bordas e raios
    '--border-radius-small': '3px',
    '--border-radius-medium': '5px',
    '--border-radius-large': '12px',
    '--border-radius-circle': '100%',
    '--border-color': '#CCC',
    '--border-white': '#fff',
    
    // Transições otimizadas
    '--transition-fast': 'all 0.2s ease',
    '--transition-medium': 'all 0.5s ease-in-out',
    '--transition-slow': 'all 0.7s ease-in-out'
  },

  // Animações CSS otimizadas
  animations: {
    shimmer: `
      @keyframes shimmer {
        0% { transform: translateX(-100%) rotate(45deg); }
        100% { transform: translateX(100%) rotate(45deg); }
      }
    `,
    fadeIn: `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `,
    slideIn: `
      @keyframes slideIn {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
      }
    `
  },

  // Estilos de barra de rolagem estilo macOS
  scrollbar: {
    // Estilo global para todas as barras de rolagem
    global: `
      /* Webkit browsers (Chrome, Safari, Edge) */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      ::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.2s ease;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      ::-webkit-scrollbar-thumb:active {
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      ::-webkit-scrollbar-corner {
        background: transparent;
      }

      /* Firefox */
      * {
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
      }

      /* Smooth scrolling para todos os elementos */
      * {
        scroll-behavior: smooth;
      }

      /* Estilos globais para inputs estilo macOS */
      input[type="text"], 
      input[type="email"], 
      input[type="password"], 
      input[type="number"], 
      input[type="tel"], 
      input[type="url"], 
      input[type="search"], 
      input[type="date"], 
      input[type="time"], 
      textarea, 
      select {
        width: 100%;
        padding: 6px 8px;
        border: 1px solid #c0c0c0;
        border-radius: 3px;
        font-size: 13px;
        background-color: #ffffff;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
        outline: none;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
        text-transform: uppercase;
      }

      input[type="text"]:focus, 
      input[type="email"]:focus, 
      input[type="password"]:focus, 
      input[type="number"]:focus, 
      input[type="tel"]:focus, 
      input[type="url"]:focus, 
      input[type="search"]:focus, 
      input[type="date"]:focus, 
      input[type="time"]:focus, 
      textarea:focus, 
      select:focus {
        border-color: #007aff !important;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(0, 122, 255, 0.2) !important;
        outline: none !important;
      }

      /* Estilos para labels de inputs */
      label {
        display: block;
        font-size: 12px;
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    `,

    // Estilo para containers com fundo escuro
    dark: `
      ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border: 1px solid rgba(0, 0, 0, 0.1);
      }

      ::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.4);
        border: 1px solid rgba(0, 0, 0, 0.2);
      }

      ::-webkit-scrollbar-thumb:active {
        background: rgba(255, 255, 255, 0.5);
        border: 1px solid rgba(0, 0, 0, 0.3);
      }
    `,

    // Estilo para modais e painéis
    modal: `
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.15);
        border-radius: 3px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      ::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
    `,

    // Estilo para listas e grids
    list: `
      ::-webkit-scrollbar {
        width: 7px;
        height: 7px;
      }

      ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.18);
        border-radius: 3.5px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.15s ease;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.28);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
      }

      ::-webkit-scrollbar-thumb:active {
        background: rgba(0, 0, 0, 0.38);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
    `
  },

  // Estilos base reutilizáveis
  base: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    textTransform: 'uppercase' as const,
    transition: 'var(--transition-fast)',
    cursor: 'pointer'
  },

  // Estilos de botões otimizados
  button: {
    base: {
      borderRadius: '6px',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      background: 'linear-gradient(to bottom, #f5f5f5, #e8e8e8)',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgba(0, 0, 0, 0.7)',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      fontSize: '13px',
      fontWeight: '500',
      textTransform: 'uppercase' as const
    },
    hover: {
      background: 'linear-gradient(to bottom, #f8f8f8, #e0e0e0)',
      color: 'rgba(0, 0, 0, 0.8)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
      transform: 'translateY(-1px)'
    },
    primary: {
      background: 'linear-gradient(to bottom, var(--accent), #0056b3)',
      color: 'white',
      border: '1px solid var(--accent)',
      boxShadow: '0 1px 2px rgba(10, 132, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
    },
    primaryHover: {
      background: 'linear-gradient(to bottom, #0056b3, #004494)',
      boxShadow: '0 2px 4px rgba(10, 132, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      transform: 'translateY(-1px)'
    }
  },

  // Estilos de containers otimizados
  container: {
    glass: {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderRadius: 'var(--border-radius-large)',
      border: '1px solid rgba(255, 255, 255, 0.9)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
    },
    panel: {
      background: 'var(--panel)',
      borderBottom: '1px solid var(--panel-stroke)',
      backdropFilter: 'blur(22px) saturate(160%)',
      WebkitBackdropFilter: 'blur(22px) saturate(160%)',
      boxShadow: 'var(--shadow-light)'
    }
  },

  // Estilos de texto otimizados
  text: {
    primary: {
      fontSize: '14px',
      fontWeight: '500',
      color: 'var(--text-primary)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const
    },
    secondary: {
      fontSize: '13px',
      color: 'var(--text-secondary)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const
    },
    small: {
      fontSize: '12px',
      color: 'var(--text-secondary)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const
    }
  },

  // Estilos globais para inputs estilo macOS
  input: {
    base: {
      width: '100%',
      padding: '6px 8px',
      border: '1px solid #c0c0c0',
      borderRadius: '3px',
      fontSize: '13px',
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
      outline: 'none',
      transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
      textTransform: 'uppercase' as const
    },
    focus: {
      borderColor: '#007aff',
      boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(0, 122, 255, 0.2)'
    },
    compact: {
      padding: '4px 6px',
      fontSize: '12px'
    },
    large: {
      padding: '8px 12px',
      fontSize: '14px'
    }
  },

  // Estilos de badges otimizados
  badge: {
    base: {
      fontSize: '11px',
      padding: '4px 10px',
      borderRadius: '6px',
      fontWeight: '600',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px'
    },
    product: {
      color: 'var(--accent)',
      background: 'rgba(10, 132, 255, 0.1)'
    },
    service: {
      color: '#34C759',
      background: 'rgba(52, 199, 89, 0.1)'
    },
    individual: {
      color: '#34C759',
      background: 'rgba(52, 199, 89, 0.1)'
    },
    company: {
      color: '#FF9500',
      background: 'rgba(255, 149, 0, 0.1)'
    },
    category: {
      fontSize: '12px',
      color: 'var(--text-primary)',
      background: 'rgba(0, 0, 0, 0.06)',
      fontWeight: '500'
    }
  },

  // Estilos de grid otimizados
  grid: {
    listHeader: {
      display: 'grid',
      gap: '16px',
      padding: '16px 20px',
      background: 'rgba(246, 246, 246, 0.95)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    listRow: {
      display: 'grid',
      gap: '16px',
      padding: '16px 12px',
      borderRadius: '8px',
      transition: 'var(--transition-fast)',
      cursor: 'pointer',
      animation: 'fadeIn 0.3s ease forwards',
      opacity: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    listRowHover: {
      background: 'rgba(0, 0, 0, 0.04)',
      transform: 'translateX(4px)'
    },
    rowCell: {
      display: 'flex',
      alignItems: 'center'
    }
  },

  // Estilos de estado vazio otimizados
  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '12px',
    padding: '40px'
  },

  // Estilos de animação otimizados
  animation: {
    fadeIn: {
      animation: 'fadeIn 0.3s ease forwards'
    },
    slideIn: {
      animation: 'slideIn 0.3s ease forwards'
    }
  }
};

// Função utilitária para combinar estilos de forma otimizada
export const combineStyles = (...styles: (React.CSSProperties | undefined)[]): React.CSSProperties => {
  return Object.assign({}, ...styles.filter(Boolean));
};

// Função utilitária para criar estilos condicionais
export const conditionalStyle = (condition: boolean, trueStyle: React.CSSProperties, falseStyle?: React.CSSProperties): React.CSSProperties => {
  return condition ? trueStyle : (falseStyle || {});
};

// Função para aplicar estilos de scrollbar ao documento
export const applyScrollbarStyles = (variant: 'global' | 'dark' | 'modal' | 'list' = 'global') => {
  const styleId = 'macos-scrollbar-styles';
  let styleElement = document.getElementById(styleId) as HTMLStyleElement;
  
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }
  
  // Aplicar estilos base + variante específica
  styleElement.textContent = sharedStyles.scrollbar.global + sharedStyles.scrollbar[variant];
};

// Função para remover estilos de scrollbar
export const removeScrollbarStyles = () => {
  const styleElement = document.getElementById('macos-scrollbar-styles');
  if (styleElement) {
    styleElement.remove();
  }
};
