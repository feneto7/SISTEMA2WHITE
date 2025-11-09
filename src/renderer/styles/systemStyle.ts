//--------------------------------------------------------------------
// SYSTEM STYLE - ESTILOS BASEADOS NO macOS
// Estilos fiéis ao design do macOS capturados das telas de sistema
// Cores, layouts e componentes seguindo o padrão Apple
//--------------------------------------------------------------------

import { ThemeTokens, lightTheme } from './shared';

// Fábrica de estilos baseada em tokens de tema
export const createSystemStyles = (theme: ThemeTokens) => {
  const systemColors = {
    background: theme.background,
    border: theme.border,
    text: theme.text,
    selection: theme.selection,
    control: theme.control,
    input: theme.input,
    button: theme.button,
    status: theme.status,
    dock: theme.dock,
    trafficLights: theme.trafficLights
  };

  // Estilos do sistema (usa systemColors criado acima)
  const systemStyles = {
  // Janela principal
  window: {
    background: systemColors.background.primary,
    borderRadius: '10px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(0, 0, 0, 0.1)'
  },

  // Barra de título (Title Bar)
  titleBar: {
    height: '52px',
    background: systemColors.background.primary,
    borderBottom: `1px solid ${systemColors.border.light}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 20px',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    position: 'relative' as const
  },

  titleBarTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: systemColors.text.primary,
    textAlign: 'center' as const,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
  },

  // Traffic Lights (botões de controle da janela)
  trafficLights: {
    container: {
      display: 'flex',
      gap: '8px',
      position: 'absolute' as const,
      left: '12px',
      top: '16px'
    },
    button: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      position: 'relative' as const,
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.1), 0 0 0 0.5px rgba(0, 0, 0, 0.1)',
      background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), transparent 50%)'
    },
    red: {
      background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), transparent 50%), #FF5F57',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.15), 0 0 0 0.5px rgba(0, 0, 0, 0.1)'
    },
    yellow: {
      background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), transparent 50%), #FFBD2E',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.15), 0 0 0 0.5px rgba(0, 0, 0, 0.1)'
    },
    green: {
      background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), transparent 50%), #28CA42',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.15), 0 0 0 0.5px rgba(0, 0, 0, 0.1)'
    }
  },

  // Toolbar (barra de ferramentas)
  toolbar: {
    container: {
      height: '44px',
      background: systemColors.background.primary,
      borderBottom: `1px solid ${systemColors.border.light}`,
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: '12px'
    },
    button: {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      border: 'none',
      background: systemColors.background.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'none',
      padding: '4px',
      outline: 'none',
      transform: 'none',
      appearance: 'none' as any,
      WebkitAppearance: 'none' as any,
      MozAppearance: 'none' as any,
      filter: 'none',
      boxShadow: `${systemColors.text.primary === '#FFFFFF' ? '6px 6px 12px rgba(0,0,0,0.45), -6px -6px 12px rgba(255,255,255,0.06)' : '3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.8)'}`
    },
    buttonHover: {
      background: systemColors.background.primary,
      boxShadow: `${systemColors.text.primary === '#FFFFFF' ? '6px 6px 12px rgba(0,0,0,0.45), -6px -6px 12px rgba(255,255,255,0.06)' : '3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.8)'}`
    },
    buttonActive: {
      background: systemColors.background.primary,
      boxShadow: `${systemColors.text.primary === '#FFFFFF' ? 'inset 3px 3px 6px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(255,255,255,0.06)' : 'inset 2px 2px 4px rgba(0, 0, 0, 0.12), inset -2px -2px 4px rgba(255, 255, 255, 0.7)'}`
    }
  },

  // App Icon Button (botão do ícone da aplicação - menu dropdown)
  appIconButton: {
    // Botão recipiente. Mantém-se transparente, apenas com leve feedback no hover
    button: {
      width: '32px',
      height: '32px',
      borderRadius: '6px',
      border: 'none',
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'background 0.15s ease',
      padding: '4px',
      position: 'relative' as const,
      boxShadow: 'none'
    },
    buttonHover: {
      width: '32px',
      height: '32px',
      borderRadius: '6px',
      border: 'none',
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'background 0.15s ease',
      padding: '4px',
      position: 'relative' as const,
      boxShadow: 'none'
    },
    // Ícone sempre branco (filtrado) – imagem original é colorida
    icon: {
      width: '24px',
      height: '24px',
      objectFit: 'contain' as const,
      pointerEvents: 'none' as const,
      // Torna o conteúdo do PNG branco, preservando transparência
      filter: 'brightness(0) invert(1)',
      WebkitFilter: 'brightness(0) invert(1)',
      transition: 'filter 0.15s ease, transform 0.1s ease'
    },
    // Hover: brilho branco suave (estilo macOS)
    iconHover: {
      width: '24px',
      height: '24px',
      objectFit: 'contain' as const,
      pointerEvents: 'none' as const,
      filter: 'brightness(0) invert(1) drop-shadow(0 0 6px rgba(255,255,255,0.9)) drop-shadow(0 0 14px rgba(255,255,255,0.55)) drop-shadow(0 0 22px rgba(255,255,255,0.35))',
      WebkitFilter: 'brightness(0) invert(1) drop-shadow(0 0 6px rgba(255,255,255,0.9)) drop-shadow(0 0 14px rgba(255,255,255,0.55)) drop-shadow(0 0 22px rgba(255,255,255,0.35))',
      transition: 'filter 0.15s ease, transform 0.1s ease'
    },
    // Active/Pressed: brilho mais intenso, levemente pressionado
    iconActive: {
      width: '24px',
      height: '24px',
      objectFit: 'contain' as const,
      pointerEvents: 'none' as const,
      filter: 'brightness(0) invert(1) drop-shadow(0 0 10px rgba(255,255,255,1)) drop-shadow(0 0 20px rgba(255,255,255,0.7)) drop-shadow(0 0 30px rgba(255,255,255,0.5))',
      WebkitFilter: 'brightness(0) invert(1) drop-shadow(0 0 10px rgba(255,255,255,1)) drop-shadow(0 0 20px rgba(255,255,255,0.7)) drop-shadow(0 0 30px rgba(255,255,255,0.5))',
      transform: 'scale(0.98)',
      transition: 'filter 0.1s ease, transform 0.1s ease'
    }
  },

  // Sidebar (barra lateral estilo Finder)
  sidebar: {
    container: {
      width: '200px',
      background: systemColors.background.sidebar,
      borderRight: `1px solid ${systemColors.border.light}`,
      display: 'flex',
      flexDirection: 'column' as const,
      padding: '10px 0'
    },
    section: {
      marginBottom: '20px'
    },
    sectionTitle: {
      fontSize: '11px',
      fontWeight: '700',
      color: systemColors.text.secondary,
      textTransform: 'uppercase' as const,
      padding: '0 10px 4px 10px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      letterSpacing: '0.5px'
    },
    item: {
      padding: '4px 10px',
      fontSize: '13px',
      color: systemColors.text.primary,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.1s ease',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      fontWeight: '500'
    },
    itemHover: {
      background: 'rgba(0, 0, 0, 0.04)'
    },
    itemSelected: {
      background: 'linear-gradient(to bottom, #5A9EDD, #3B7BC4)',
      borderColor: '#2A6BA8',
      color: '#FFFFFF',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 2px 8px rgba(58, 123, 196, 0.3)'
    }
  },

  // Tabs (abas) - estilo macOS Preferences
  tabs: {
    container: {
      display: 'flex',
      borderBottom: 'none',
      background: 'transparent',
      padding: '8px 20px 0 20px',
      gap: '4px',
      justifyContent: 'center'
    },
    tab: {
      padding: '6px 20px',
      fontSize: '11px',
      color: systemColors.text.primary,
      cursor: 'pointer',
      background: '#BFBFBF',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#999999',
      borderBottomWidth: '0',
      transition: 'background 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      fontWeight: '500',
      position: 'relative' as const,
      outline: 'none',
      borderRadius: '4px 4px 0 0',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5)',
      transform: 'translateY(0)',
      opacity: 1,
      minWidth: 'fit-content',
      whiteSpace: 'nowrap' as const,
      WebkitFontSmoothing: 'antialiased' as const,
      MozOsxFontSmoothing: 'grayscale' as const
    },
    tabHover: {
      background: '#C5C5C5',
      transform: 'translateY(-1px)',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    tabActive: {
      color: '#FFFFFF',
      background: 'linear-gradient(to bottom, #5A9EDD, #3B7BC4)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#2A6BA8',
      borderBottomWidth: '0',
      fontWeight: '500',
      zIndex: 1,
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 2px 8px rgba(58, 123, 196, 0.3)',
      transform: 'translateY(0)',
      opacity: 1
    }
  },

  // Checkbox estilo macOS
  checkbox: {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer'
    },
    box: {
      width: '14px',
      height: '14px',
      borderRadius: '3px',
      border: `0.5px solid #B8B8B8`,
      background: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.15s ease',
      boxShadow: 'inset 0 0.5px 1px rgba(0, 0, 0, 0.06), 0 0.5px 0 rgba(255, 255, 255, 0.8)'
    },
    boxChecked: {
      background: systemColors.selection.blue,
      border: `0.5px solid ${systemColors.selection.blueDark}`,
      boxShadow: 'inset 0 0.5px 1px rgba(0, 0, 0, 0.15), 0 0.5px 0 rgba(255, 255, 255, 0.5)'
    },
    checkmark: {
      width: '10px',
      height: '10px',
      color: '#FFFFFF',
      strokeWidth: '2.5px'
    },
    label: {
      fontSize: '11px',
      color: systemColors.text.primary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      userSelect: 'none' as const
    }
  },

  // Radio Button estilo macOS
  radio: {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer'
    },
    circle: {
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      border: `1px solid ${systemColors.control.border}`,
      background: systemColors.control.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.15s ease',
      boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
    },
    circleChecked: {
      border: `1px solid ${systemColors.selection.blue}`,
      background: systemColors.control.background
    },
    dot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: systemColors.selection.blue
    },
    label: {
      fontSize: '13px',
      color: systemColors.text.primary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      userSelect: 'none' as const
    }
  },

  // Input / Text Field - 
  // IMPORTANTE: O estilo de foco (:focus) dos inputs é aplicado automaticamente
  // via CSS global em reset.css (linhas 227-237). Não é necessário aplicar
  // fieldFocus programaticamente nos componentes - apenas usar systemStyles.input.field
  // e deixar o CSS global aplicar o estilo de foco quando o campo está em :focus
  input: {
    container: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '6px'
    },
    field: {
      width: '100%',
      height: '28px',
      padding: '4px 8px',
      fontSize: '11px',
      color: systemColors.text.primary,
      background: systemColors.input.background,
      border: `0.5px solid ${systemColors.input.border}`,
      borderRadius: '4px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      outline: 'none',
      transition: 'all 0.2s ease',
      boxShadow: systemColors.text.primary === '#FFFFFF' 
        ? 'inset 0 0.5px 2px rgba(0, 0, 0, 0.3), 0 0.5px 0 rgba(255, 255, 255, 0.05)'
        : 'inset 0 0.5px 2px rgba(0, 0, 0, 0.12), 0 0.5px 0 rgba(255, 255, 255, 0.5)'
    },
   
    fieldFocus: {
      borderColor: systemColors.input.borderFocus,
      boxShadow: `0 0 0 2px ${systemColors.input.borderFocus}33`
    },
    label: {
      fontSize: '11px',
      fontWeight: '600',
      color: systemColors.text.primary,
      marginBottom: '0',
      display: 'block',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.3px'
    }
  },

  // Search Field (campo de busca)
  searchField: {
    container: {
      position: 'relative' as const,
      width: '100%'
    },
    field: {
      width: '100%',
      height: '22px',
      padding: '4px 8px 4px 24px',
      fontSize: '13px',
      color: systemColors.text.primary,
      background: systemColors.input.background,
      border: `1px solid ${systemColors.input.border}`,
      borderRadius: '5px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      outline: 'none',
      transition: 'all 0.15s ease',
      boxShadow: systemColors.text.primary === '#FFFFFF' 
        ? 'inset 0 1px 2px rgba(0, 0, 0, 0.2)'
        : 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
    },
    fieldFocus: {
      borderColor: systemColors.input.borderFocus,
      boxShadow: `0 0 0 2px ${systemColors.input.borderFocus}33`
    },
    icon: {
      position: 'absolute' as const,
      left: '8px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '14px',
      height: '14px',
      color: systemColors.text.tertiary,
      pointerEvents: 'none' as const,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  },

  // Search Box (container de busca completo)
  searchBox: {
    container: {
      background: systemColors.background.primary,
      border: `1px solid ${systemColors.border.light}`,
      borderRadius: '10px',
      padding: '16px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    }
  },

  // Select / Dropdown - com botão azul
  select: {
    container: {
      position: 'relative' as const,
      width: '100%'
    },
    fieldWrapper: {
      position: 'relative' as const,
      width: '100%',
      height: '28px'
    },
    field: {
      width: '100%',
      height: '28px',
      padding: '4px 24px 4px 8px',
      fontSize: '11px',
      color: systemColors.text.primary,
      background: systemColors.input.background,
      border: `0.5px solid ${systemColors.input.border}`,
      borderRadius: '4px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      outline: 'none',
      cursor: 'pointer',
      appearance: 'none' as any,
      WebkitAppearance: 'none' as any,
      MozAppearance: 'none' as any,
      transition: 'all 0.2s ease',
      boxShadow: systemColors.text.primary === '#FFFFFF'
        ? 'inset 0 0.5px 2px rgba(0, 0, 0, 0.3), 0 0.5px 0 rgba(255, 255, 255, 0.05)'
        : 'inset 0 0.5px 2px rgba(0, 0, 0, 0.12), 0 0.5px 0 rgba(255, 255, 255, 0.5)'
    },
    arrow: {
      position: 'absolute' as const,
      right: '0px',
      top: '0px',
      width: '20px',
      height: '100%', // acompanha a altura do wrapper/field
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: systemColors.button.blue,
      borderLeft: `0.5px solid ${systemColors.selection.blueDark}`,
      borderRadius: '0 3.5px 3.5px 0',
      pointerEvents: 'none' as const,
      boxShadow: 'inset 0 0.5px 0 rgba(255, 255, 255, 0.4)'
    },
    arrowIcon: {
      width: '0',
      height: '0',
      borderLeft: '3px solid transparent',
      borderRight: '3px solid transparent',
      borderTop: '4px solid #FFFFFF',
      marginTop: '0px'
    }
  },

  // Button estilo macOS
  button: {
    default: {
      padding: '4px 12px',
      fontSize: '11px',
      fontWeight: '400',
      color: systemColors.text.primary,
      background: systemColors.button.gradient,
      border: `0.5px solid ${systemColors.button.defaultBorder}`,
      borderRadius: '4px',
      cursor: 'pointer',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      transition: 'all 0.15s ease',
      boxShadow: '0 0.5px 1px rgba(0, 0, 0, 0.04)',
      outline: 'none',
      minWidth: '60px'
    },
    defaultHover: {
      background: 'linear-gradient(to bottom, #FAFAFA, #E8E8E8)',
      border: `0.5px solid ${systemColors.border.medium}`,
      boxShadow: '0 0.5px 2px rgba(0, 0, 0, 0.08)'
    },
    defaultActive: {
      background: 'linear-gradient(to bottom, #E8E8E8, #D8D8D8)',
      boxShadow: 'inset 0 0.5px 1px rgba(0, 0, 0, 0.08)'
    },
    primary: {
      padding: '4px 12px',
      fontSize: '11px',
      fontWeight: '500',
      color: '#FFFFFF',
      background: systemColors.button.blue,
      border: `0.5px solid ${systemColors.selection.blueDark}`,
      borderRadius: '4px',
      cursor: 'pointer',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      transition: 'all 0.15s ease',
      boxShadow: '0 0.5px 2px rgba(0, 122, 255, 0.25)',
      outline: 'none',
      minWidth: '60px'
    },
    primaryHover: {
      background: systemColors.button.blueHover,
      boxShadow: '0 1px 3px rgba(0, 122, 255, 0.35)'
    },
    primaryActive: {
      background: systemColors.selection.blueDark,
      boxShadow: 'inset 0 0.5px 1px rgba(0, 0, 0, 0.15)'
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none' as const
    }
  },

  // Slider (controle deslizante)
  slider: {
    container: {
      width: '100%',
      padding: '10px 0'
    },
    track: {
      width: '100%',
      height: '4px',
      background: systemColors.control.border,
      borderRadius: '2px',
      position: 'relative' as const
    },
    fill: {
      height: '100%',
      background: systemColors.selection.blue,
      borderRadius: '2px',
      position: 'absolute' as const,
      left: 0,
      top: 0
    },
    thumb: {
      width: '16px',
      height: '16px',
      background: '#FFFFFF',
      border: `1px solid ${systemColors.control.border}`,
      borderRadius: '50%',
      position: 'absolute' as const,
      top: '50%',
      transform: 'translate(-50%, -50%)',
      cursor: 'pointer',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.15s ease'
    },
    thumbActive: {
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
      transform: 'translate(-50%, -50%) scale(1.1)'
    }
  },

  // Action Button (botões de ação nas listas - estilo neomorfismo)
  actionButton: {
    container: {
      width: '28px',
      height: '28px',
      borderRadius: '6px',
      border: 'none',
      background: systemColors.background.content,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'none',
      boxShadow: systemColors.text.primary === '#FFFFFF'
        ? '6px 6px 12px rgba(0,0,0,0.45), -6px -6px 12px rgba(255,255,255,0.06)'
        : '3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.8)'
    },
    containerActive: {
      background: systemColors.background.content,
      boxShadow: systemColors.text.primary === '#FFFFFF'
        ? 'inset 3px 3px 6px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(255,255,255,0.06)'
        : 'inset 2px 2px 4px rgba(0, 0, 0, 0.12), inset -2px -2px 4px rgba(255, 255, 255, 0.7)',
      transform: 'scale(0.95)'
    }
  },

  // Neumorphic Button (botão grande com neomorfismo)
  neumorphicButton: {
    container: {
      padding: '10px 16px',
      borderRadius: '14px',
      border: 'none',
      background: systemColors.background.content,
      color: systemColors.text.primary,
      cursor: 'pointer',
      boxShadow: systemColors.text.primary === '#FFFFFF'
        ? '10px 10px 20px rgba(0,0,0,0.45), -10px -10px 20px rgba(255,255,255,0.06)'
        : '3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.8)',
      transition: 'box-shadow 120ms ease'
    },
    containerActive: {
      padding: '10px 16px',
      borderRadius: '14px',
      border: 'none',
      background: systemColors.background.content,
      color: systemColors.text.primary,
      cursor: 'pointer',
      boxShadow: systemColors.text.primary === '#FFFFFF'
        ? 'inset 6px 6px 12px rgba(0,0,0,0.6), inset -6px -6px 12px rgba(255,255,255,0.06)'
        : 'inset 2px 2px 4px rgba(0, 0, 0, 0.12), inset -2px -2px 4px rgba(255, 255, 255, 0.7)'
    }
  },

  // Segmented Control
  segmentedControl: {
    container: {
      display: 'flex',
      background: systemColors.control.background,
      border: `1px solid ${systemColors.control.border}`,
      borderRadius: '5px',
      overflow: 'hidden',
      boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
    },
    segment: {
      padding: '6px 16px',
      fontSize: '13px',
      color: systemColors.text.primary,
      background: 'transparent',
      border: 'none',
      borderRight: `1px solid ${systemColors.control.border}`,
      cursor: 'pointer',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      transition: 'all 0.15s ease'
    },
    segmentLast: {
      borderRight: 'none'
    },
    segmentSelected: {
      background: '#FFFFFF',
      color: systemColors.selection.blue,
      fontWeight: '500',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
    }
  },

  // Dock (barra de dock)
  dock: {
    container: {
      height: '68px',
      margin: '0 auto 12px auto',
      borderRadius: '16px',
      background: systemColors.text.primary === '#FFFFFF' ? 'rgba(30,30,36,0.35)' : 'rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(30px) saturate(180%)',
      WebkitBackdropFilter: 'blur(30px) saturate(180%)',
      border: systemColors.text.primary === '#FFFFFF' ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(255, 255, 255, 0.4)',
      boxShadow: systemColors.text.primary === '#FFFFFF'
        ? '0 10px 30px rgba(0,0,0,0.35), inset 0 0 0 0.5px rgba(255,255,255,0.08)'
        : '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 0 0 0.5px rgba(255, 255, 255, 0.5), 0 8px 16px rgba(0, 0, 0, 0.15)',
      width: 'fit-content',
      padding: '0 12px',
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    icon: {
      width: '52px',
      height: '52px',
      borderRadius: '12px',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      transform: 'scale(1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      willChange: 'transform',
      boxShadow: systemColors.text.primary === '#FFFFFF'
        ? '6px 6px 12px rgba(0,0,0,0.45), -6px -6px 12px rgba(255,255,255,0.06)'
        : '0 4px 10px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)'
    },
    iconHover: {
      transform: 'scale(1.3) translateY(-8px)'
    },
    separator: {
      width: '1px',
      height: '48px',
      background: systemColors.dock.separator,
      margin: '0 4px'
    }
  },

  // Content Area (área de conteúdo principal)
  contentArea: {
    container: {
      flex: 1,
      background: systemColors.background.content,
      overflow: 'auto',
      padding: '20px'
    }
  },

  // Page Styles (estilos para páginas)
  page: {
    container: {
      background: systemColors.background.content,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const
    },
    header: {
      background: systemColors.background.primary,
      border: `1px solid ${systemColors.border.light}`,
      borderRadius: '10px',
      padding: '16px 20px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    title: {
      fontSize: '18px',
      fontWeight: '600',
      color: systemColors.text.primary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      margin: 0
    },
    content: {
      flex: 1,
      padding: '20px',
      background: systemColors.background.content
    }
  },

  // List Styles (estilos para listagens)
  list: {
    container: {
      background: systemColors.background.content,
      border: `1px solid ${systemColors.border.light}`,
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column' as const,
      flex: 1,
      minHeight: 0
    },
    header: {
      background: systemColors.background.primary,
      padding: '12px 16px',
      borderBottom: `1px solid ${systemColors.border.light}`,
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    headerCell: {
      fontSize: '11px',
      fontWeight: '700',
      color: systemColors.text.secondary,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    content: {
      background: systemColors.background.content,
      padding: '8px',
      flex: 1,
      overflow: 'auto'
    },
    row: {
      padding: '16px 12px',
      borderBottom: `1px solid ${systemColors.border.divider}`,
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      transition: 'background-color 0.15s ease',
      animation: 'fadeIn 0.3s ease forwards',
      opacity: 0
    },
    rowHover: {
      background: systemColors.control.hover
    },
    rowSelected: {
      background: systemColors.selection.background,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: systemColors.selection.border,
      borderBottomWidth: '1px'
    }
  },

  // Modal List (listagens internas a modais)
  modalList: {
    container: {
      border: `1px solid ${systemColors.border.light}`,
      borderRadius: '10px',
      background: systemColors.background.primary,
      flex: 1,
      minHeight: 0,
      height: '100%',
      overflowY: 'auto' as const,
      overflowX: 'hidden' as const
    },
    header: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr auto',
      gap: '8px',
      padding: '10px 8px',
      color: systemColors.text.secondary,
      fontSize: '12px',
      borderBottom: `1px solid ${systemColors.border.light}`,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr auto',
      gap: '8px',
      padding: '10px 8px',
      alignItems: 'center',
      color: systemColors.text.primary,
      borderBottom: `1px solid ${systemColors.border.light}`
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  },

  // List Item (item de lista)
  listItem: {
    container: {
      padding: '8px 12px',
      fontSize: '13px',
      color: systemColors.text.primary,
      background: 'transparent',
      cursor: 'pointer',
      transition: 'all 0.1s ease',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      borderRadius: '4px'
    },
    containerHover: {
      background: 'rgba(0, 0, 0, 0.04)'
    },
    containerSelected: {
      background: systemColors.selection.background,
      color: systemColors.selection.blue
    }
  },

  // Modal (Padrão de modais do sistema)

  modal: {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(4px)'
    },
    container: {
      background: systemColors.background.content,
      borderRadius: '10px',
      border: `1px solid ${systemColors.border.light}`,
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      height: '70vh',
      maxHeight: '70vh'
    },
    titleBar: {
      height: '52px',
      background: systemColors.background.primary,
      borderBottom: `1px solid ${systemColors.border.light}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 20px',
      borderTopLeftRadius: '10px',
      borderTopRightRadius: '10px',
      position: 'relative' as const
    },
    title: {
      fontSize: '13px',
      fontWeight: '600',
      color: systemColors.text.primary,
      textAlign: 'center' as const,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    content: {
      flex: 1,
      overflow: 'auto',
      padding: '20px',
      background: systemColors.background.content
    },
    footer: {
      padding: '12px 16px',
      background: systemColors.background.primary,
      borderTop: `1px solid ${systemColors.border.light}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    footerLeft: {
      display: 'flex',
      gap: '8px'
    },
    footerRight: {
      display: 'flex',
      gap: '8px'
    }
  },

  // Login Card (Card de autenticação)
  loginCard: {
    container: {
      width: '340px',
      height: '400px',
      position: 'relative' as const
    },
    card: {
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
    userLabel: {
      padding: '10px 0',
      fontSize: '0.95em',
      color: systemColors.text.primary,
      textShadow: 'rgba(255, 255, 255, 0.7) 0px 1px 0px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      wordBreak: 'break-all' as const,
      transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out'
    },
    userLabelTransitioning: {
      opacity: 0,
      transform: 'scale(0.95)'
    },
    form: {
      position: 'relative' as const,
      marginTop: '20px',
      transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out'
    },
    formTransitioning: {
      opacity: 0,
      transform: 'translateX(20px)'
    },
    inputWrapper: {
      position: 'relative' as const,
      width: '240px',
      margin: '20px auto'
    },
    input: {
      display: 'block',
      width: '100%',
      padding: '10px 40px 10px 18px',
      borderRadius: '20px',
      border: `1px solid ${systemColors.control.border}`,
      background: 'transparent',
      color: systemColors.text.primary,
      fontSize: '15px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      outline: 'none',
      transition: 'border-color 0.15s ease',
      textTransform: 'none' as const,
      boxSizing: 'border-box' as const
    },
    inputFocus: {
      border: `1px solid ${systemColors.selection.blue}`,
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
    hint: {
      marginTop: '8px',
      padding: '0',
      color: systemColors.text.primary,
      fontSize: '12px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textShadow: 'rgba(255, 255, 255, 0.7) 0px 1px 0px',
      whiteSpace: 'nowrap' as const,
      textAlign: 'center' as const,
      transition: 'opacity 0.3s ease-in-out'
    },
    hintTransitioning: {
      opacity: 0
    },
    footer: {
      position: 'absolute' as const,
      bottom: '-80px',
      left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center' as const,
      color: systemColors.background.white,
      textShadow: '0px 1px 5px rgba(0, 0, 0, 1)',
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
      color: systemColors.background.white,
      textDecoration: 'none',
      opacity: 0.8,
      transition: 'opacity 0.2s ease',
      cursor: 'pointer'
    },
    footerLinkHover: {
      opacity: 1,
      textDecoration: 'underline'
    }
  },

  // Launchpad Operations (Launchpad de operações)
  launchpad: {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(30px) saturate(180%)',
      WebkitBackdropFilter: 'blur(30px) saturate(180%)',
      transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: 0
    },
    overlayAnimated: {
      opacity: 1
    },
    container: {
      background: systemColors.text.primary === '#FFFFFF' ? 'rgba(30,30,36,0.35)' : 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(50px) saturate(180%)',
      WebkitBackdropFilter: 'blur(50px) saturate(180%)',
      borderRadius: '32px',
      border: systemColors.text.primary === '#FFFFFF' ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: systemColors.text.primary === '#FFFFFF'
        ? '0 10px 30px rgba(0,0,0,0.35), inset 0 0 0 0.5px rgba(255,255,255,0.08)'
        : '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
      padding: '60px 80px',
      maxWidth: '90vw',
      maxHeight: '90vh'
    },
    containerInitial: {
      opacity: 0,
      transform: 'scale(0.9) translateY(20px)'
    },
    containerAnimated: {
      opacity: 1,
      transform: 'scale(1) translateY(0)',
      transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '40px',
      minWidth: '600px'
    },
    iconContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      borderRadius: '16px',
      padding: '16px',
      opacity: 1,
      transition: 'all 0.15s ease',
      background: systemColors.text.primary === '#FFFFFF' ? 'rgba(40, 40, 46, 0.4)' : 'rgba(255, 255, 255, 0.15)',
      boxShadow: systemColors.text.primary === '#FFFFFF'
        ? '6px 6px 12px rgba(0,0,0,0.45), -6px -6px 12px rgba(255,255,255,0.06)'
        : '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.3)'
    },
    iconContainerHover: {
      // Sem efeito de hover: mantém aparência neutra (neumorfismo só no active)
    },
    iconContainerActive: {
      boxShadow: systemColors.text.primary === '#FFFFFF'
        ? 'inset 3px 3px 6px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(255,255,255,0.06)'
        : 'inset 3px 3px 6px rgba(0, 0, 0, 0.15), inset -3px -3px 6px rgba(255, 255, 255, 0.3)',
      transform: 'scale(0.98)'
    },
    iconWrapper: {
      width: '80px',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '8px'
    },
    iconLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: systemColors.text.primary,
      textAlign: 'center' as const,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      marginTop: '4px'
    }
  },

  // Dialog (Caixa de diálogo estilo sistema)
  dialog: {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      zIndex: 10000,
      backdropFilter: 'blur(2px)'
    },
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif',
      width: '422px',
      background: systemColors.background.content,
      borderRadius: '5px',
      boxShadow: '0px 15px 25px 0px rgba(50, 50, 50, 0.7)',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      border: `1px solid ${systemColors.border.light}`
    },
    titleBar: {
      width: '100%',
      height: '22px',
      background: systemColors.background.sidebar,
      borderRadius: '5px 5px 0 0',
      borderBottom: `1px solid ${systemColors.border.medium}`
    },
    body: {
      position: 'relative' as const,
      padding: '12px',
      paddingBottom: '20px',
      background: systemColors.background.content,
      overflow: 'hidden' as const,
      boxSizing: 'border-box' as const
    },
    icon: {
      width: '60px',
      height: '60px',
      position: 'absolute' as const,
      left: '25px',
      top: '12px',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none' as const
    },
    warning: {
      fontSize: '0.8em',
      fontWeight: '700',
      color: systemColors.text.primary,
      lineHeight: '1.4',
      marginBottom: '8px'
    },
    hint: {
      fontSize: '0.75em',
      color: systemColors.text.secondary,
      lineHeight: '1.4',
      marginBottom: '4px'
    },
    actions: {
      padding: '15px',
      display: 'flex',
      gap: '5px',
      justifyContent: 'flex-end',
      borderTop: `1px solid ${systemColors.border.divider}`,
      background: systemColors.background.sidebar,
      position: 'relative' as const,
      zIndex: 2
    },
    button: {
      width: '80px',
      margin: '0 5px',
      padding: '4px 12px',
      fontSize: '11px',
      fontWeight: '400',
      color: systemColors.text.primary,
      background: systemColors.background.white,
      border: `0.5px solid ${systemColors.border.light}`,
      borderRadius: '3px',
      cursor: 'pointer',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      transition: 'all 0.15s ease',
      outline: 'none',
      boxShadow: '0 0.5px 1px rgba(0, 0, 0, 0.04)'
    },
    buttonHover: {
      background: systemColors.background.primary,
      border: `0.5px solid ${systemColors.border.medium}`,
      boxShadow: '0 0.5px 2px rgba(0, 0, 0, 0.08)'
    },
    buttonActive: {
      background: systemColors.background.secondary,
      boxShadow: 'inset 0 0.5px 1px rgba(0, 0, 0, 0.08)'
    },
    buttonConfirm: {
      color: '#ffffff',
      background: systemColors.button.blue,
      border: `0.5px solid ${systemColors.selection.blueDark}`,
      boxShadow: '0 0.5px 2px rgba(0, 122, 255, 0.25)'
    },
    buttonConfirmHover: {
      background: systemColors.button.blueHover,
      boxShadow: '0 1px 3px rgba(0, 122, 255, 0.35)'
    },
    buttonConfirmActive: {
      background: systemColors.selection.blueDark,
      boxShadow: 'inset 0 0.5px 1px rgba(0, 0, 0, 0.15)'
    }
  },

  // Kitchen (layout KDS e cartões de estações)
  kitchen: {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '24px',
      height: '100%',
      minHeight: 0,
      position: 'relative' as const
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px 0'
    },
    title: {
      fontSize: '22px',
      fontWeight: 600,
      color: systemColors.text.primary,
      margin: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    description: {
      fontSize: '13px',
      fontWeight: 400,
      color: systemColors.text.secondary,
      textAlign: 'center' as const,
      margin: '0 auto',
      maxWidth: '520px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: '18px',
      width: '100%',
      padding: '0 8px'
    },
    card: {
      container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '100px',
        borderRadius: '14px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: systemColors.border.light,
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
        cursor: 'pointer',
        background: systemColors.background.window,
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        overflow: 'hidden'
      },
      containerHover: {
        transform: 'translateY(-3px)',
        boxShadow: '0 12px 26px rgba(0, 0, 0, 0.16)'
      },
      mainArea: {
        flex: 1,
        padding: '22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '12px',
        background: systemColors.background.window,
        color: systemColors.text.primary
      },
      title: {
        fontSize: '16px',
        fontWeight: 600,
        margin: 0,
        color: systemColors.text.primary
      },
      actionPanel: {
        width: '60px',
        background: systemColors.background.content,
        borderLeft: `1px solid ${systemColors.border.light}`,
        borderTopRightRadius: '14px',
        borderBottomRightRadius: '14px',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '14px 0'
      },
      actionButton: {
        width: '32px',
        height: '32px',
        borderRadius: '10px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: systemColors.border.light,
        background: systemColors.control.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: systemColors.selection.blueDark,
        cursor: 'pointer',
        transition: 'all 0.15s ease'
      },
      actionButtonHover: {
        background: systemColors.selection.background,
        borderColor: systemColors.selection.blue
      }
    },
    addCard: {
      container: {
        minHeight: '100px',
        borderRadius: '14px',
        border: `1px dashed ${systemColors.border.medium}`,
        background: systemColors.background.window,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '18px',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        color: systemColors.text.secondary
      },
      containerHover: {
        border: `1px dashed ${systemColors.selection.blue}`,
        color: systemColors.selection.blue,
        background: systemColors.selection.background,
        boxShadow: '0 10px 22px rgba(0, 0, 0, 0.14)'
      },
      iconWrapper: {
        width: '38px',
        height: '38px',
        borderRadius: '12px',
        border: `1px solid ${systemColors.border.light}`,
        background: systemColors.control.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      label: {
        fontSize: '13px',
        fontWeight: 600,
        textAlign: 'center' as const
      }
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      borderRadius: '16px',
      border: `1px dashed ${systemColors.border.light}`,
      color: systemColors.text.secondary,
      gap: '12px'
    },
    kdsOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: systemColors.background.content,
      borderRadius: '16px',
      border: `1px solid ${systemColors.border.light}`,
      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.22)',
      display: 'flex',
      flexDirection: 'column' as const,
      padding: '24px',
      gap: '20px',
      zIndex: 5
    },
    kdsOverlayFullscreen: {
      position: 'fixed' as const,
      inset: 0,
      width: '100vw',
      height: '100vh',
      borderRadius: 0,
      border: 'none',
      padding: '24px',
      boxShadow: 'none',
      background: systemColors.background.content,
      zIndex: 9999,
      overflow: 'hidden'
    },
    kdsHeader: {
      display: 'grid',
      gridTemplateColumns: '1fr auto auto',
      gap: '16px',
      alignItems: 'center'
    },
    kdsTitleGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px'
    },
    kdsTitle: {
      fontSize: '24px',
      fontWeight: 600,
      color: systemColors.text.primary,
      margin: 0
    },
    kdsSubtitle: {
      fontSize: '13px',
      color: systemColors.text.secondary,
      margin: 0
    },
    kdsControls: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center'
    },
    kdsButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      padding: '10px 18px',
      borderRadius: '12px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: systemColors.control.border,
      background: systemColors.control.background,
      color: systemColors.text.primary,
      fontSize: '13px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      boxShadow: `0 6px 16px ${systemColors.control.hover}`
    },
    kdsButtonPrimary: {
      background: systemColors.button.blue,
      borderColor: systemColors.selection.blueDark,
      color: '#FFFFFF',
      boxShadow: `0 8px 20px ${systemColors.selection.background}`
    },
    kdsButtonHover: {
      transform: 'translateY(-1px)',
      boxShadow: '0 10px 24px rgba(0, 0, 0, 0.16)'
    },
    kdsOrdersGrid: {
      flex: 1,
      display: 'flex',
      gap: '16px',
      overflowX: 'auto' as const,
      overflowY: 'hidden' as const,
      padding: '10px 4px 14px',
      alignItems: 'stretch',
      scrollbarWidth: 'thin' as const,
      WebkitOverflowScrolling: 'touch' as const
    },
    kdsOrderCard: {
      minWidth: '240px',
      maxWidth: '260px',
      borderRadius: '12px',
      border: `1px solid ${systemColors.border.light}`,
      background: systemColors.text.primary === '#FFFFFF'
        ? systemColors.background.window
        : systemColors.background.sidebar,
      boxShadow: `0 8px 20px rgba(0, 0, 0, 0.16)`,
      padding: '18px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '14px',
      overflow: 'hidden'
    },
    kdsOrderTopHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      padding: '12px 18px',
      margin: '-18px -18px 10px',
      background: systemColors.text.primary === '#FFFFFF'
        ? systemColors.control.background
        : systemColors.background.primary,
      borderTopLeftRadius: '12px',
      borderTopRightRadius: '12px'
    },
    kdsOrderTitleGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '2px'
    },
    kdsOrderLabel: {
      fontSize: '11px',
      color: systemColors.text.secondary,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.6px'
    },
    kdsOrderCode: {
      fontSize: '15px',
      fontWeight: 700,
      color: systemColors.text.primary
    },
    kdsOrderHeaderMeta: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '0'
    },
    kdsFinalizeButton: {
      padding: '6px 14px',
      borderRadius: '999px',
      border: 'none',
      background: systemColors.status.authorized.color,
      color: '#FFFFFF',
      fontSize: '12px',
      fontWeight: 600,
      cursor: 'pointer',
      boxShadow: `0 6px 12px ${systemColors.status.authorized.background}`,
      transition: 'transform 0.15s ease'
    },
    kdsFinalizeButtonHover: {
      transform: 'translateY(-1px)'
    },
    kdsOrderTimer: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      borderRadius: '999px',
      background: systemColors.control.background,
      color: systemColors.text.primary,
      fontSize: '12px',
      fontWeight: 600
    },
    kdsOrderBody: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '14px',
      flex: 1,
      minHeight: 0,
      overflowY: 'auto' as const,
      paddingRight: '4px',
      scrollbarWidth: 'thin' as const,
      WebkitOverflowScrolling: 'touch' as const
    },
    kdsOrderProduct: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '6px',
      borderRadius: '12px',
      padding: '12px 14px',
      background: systemColors.background.content,
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left' as const,
      transition: 'all 0.18s ease',
      color: systemColors.text.primary,
      fontFamily: 'inherit',
      fontSize: 'inherit',
      outline: 'none',
      boxShadow: `inset 0 0 0 1px ${systemColors.border.light}`,
      width: '100%',
      appearance: 'none' as const,
      WebkitAppearance: 'none' as const,
      MozAppearance: 'none' as const,
      position: 'relative' as const,
      overflow: 'hidden'
    },
    kdsOrderProductHover: {
      background: systemColors.text.primary === '#FFFFFF'
        ? systemColors.background.window
        : systemColors.background.sidebar,
      boxShadow: `inset 0 0 0 1px ${systemColors.border.light}`
    },
    kdsOrderProductReady: {
      background: systemColors.status.authorized.background,
      boxShadow: `inset 0 0 0 1px ${systemColors.status.authorized.color}`
    },
    kdsOrderProductHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px'
    },
    kdsOrderProductName: {
      fontSize: '13px',
      fontWeight: 600,
      color: systemColors.text.primary
    },
    kdsOrderProductReadyOverlay: {
      position: 'absolute' as const,
      top: '50%',
      right: '12px',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    kdsOrderProductNote: {
      fontSize: '12px',
      color: systemColors.text.secondary
    },
    kdsComplementList: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '2px'
    },
    kdsComplementItem: {
      fontSize: '12px',
      color: systemColors.text.secondary
    },
    kdsFooter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    kdsFooterTag: {
      padding: '4px 10px',
      borderRadius: '8px',
      background: systemColors.selection.background,
      color: systemColors.selection.blueDark,
      fontSize: '12px',
      fontWeight: 600
    },
    kdsFooterTime: {
      fontSize: '12px',
      color: systemColors.text.secondary
    }
  }
  };

  return { systemColors, systemStyles };
};

// Instância padrão (backwards compatibility): tema claro
export const { systemColors, systemStyles } = createSystemStyles(lightTheme);

// Export padrão com tudo
export default {
  colors: systemColors,
  styles: systemStyles
};

