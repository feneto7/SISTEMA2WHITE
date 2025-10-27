//--------------------------------------------------------------------
// SYSTEM STYLE - ESTILOS BASEADOS NO macOS
// Estilos fiéis ao design do macOS capturados das telas de sistema
// Cores, layouts e componentes seguindo o padrão Apple
//--------------------------------------------------------------------

// Paleta de cores do sistema baseada nas imagens fornecidas
export const systemColors = {
  // Cores de fundo
  background: {
    primary: '#DEDEDE',        // Fundo de headers/footers/toolbars (mais escuro)
    secondary: '#E4E4E4',      // Fundo secundário
    sidebar: '#D7D7D7',        // Fundo da sidebar (Finder)
    content: '#ECECEC',        // Fundo de conteúdo/formulários (mais claro)
    white: '#FFFFFF',          // Branco puro
    window: '#EDEDED'          // Fundo de janelas
  },
  
  // Cores de bordas e divisores
  border: {
    light: '#C8C8C8',          // Borda clara
    medium: '#B4B4B4',         // Borda média
    dark: '#979797',           // Borda escura
    divider: '#D0D0D0'         // Divisor
  },
  
  // Cores de texto
  text: {
    primary: '#000000',        // Texto principal
    secondary: '#6B6B6B',      // Texto secundário
    tertiary: '#8E8E8E',       // Texto terciário
    disabled: '#BEBEBE',       // Texto desabilitado
    label: '#464646'           // Labels
  },
  
  // Cores de seleção e destaque
  selection: {
    blue: '#0066CC',           // Azul de seleção
    blueLight: '#4A90E2',      // Azul claro
    blueDark: '#0051A8',       // Azul escuro
    background: '#DCE9F7',     // Fundo de seleção
    border: '#3F8FCA'          // Borda de seleção
  },
  
  // Cores de controles
  control: {
    background: '#FBFBFB',     // Fundo de controles
    border: '#C0C0C0',         // Borda de controles
    hover: '#F0F0F0',          // Hover
    active: '#E5E5E5',         // Ativo
    disabled: '#F7F7F7'        // Desabilitado
  },
  
  // Cores de botões
  button: {
    default: '#FFFFFF',        // Botão padrão
    defaultBorder: '#ADADAD',  // Borda botão padrão
    blue: '#007AFF',           // Botão azul
    blueHover: '#0051D5',      // Botão azul hover
    gradient: 'linear-gradient(to bottom, #FFFFFF, #F0F0F0)'  // Gradiente padrão
  },
  
  // Cores do Dock
  dock: {
    background: 'rgba(255, 255, 255, 0.25)',  // Fundo translúcido
    border: 'rgba(255, 255, 255, 0.5)',       // Borda
    separator: 'rgba(0, 0, 0, 0.15)'          // Separador
  },
  
  // Traffic Lights (botões de janela)
  trafficLights: {
    red: '#FF5F57',
    yellow: '#FFBD2E',
    green: '#28CA42',
    inactive: '#D6D6D6'
  }
};

// Estilos do sistema
export const systemStyles = {
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
    borderTopRightRadius: '10px'
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
      borderRadius: '6px',
      border: 'none',
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      opacity: 0.65
    },
    buttonHover: {
      background: 'rgba(0, 0, 0, 0.06)',
      opacity: 1
    },
    buttonActive: {
      background: 'rgba(0, 0, 0, 0.1)',
      opacity: 1
    }
  },

  // App Icon Button (botão do ícone da aplicação - menu dropdown)
  appIconButton: {
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
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      padding: '4px',
      position: 'relative' as const,
      filter: 'brightness(1) drop-shadow(0 0 0 rgba(255, 255, 255, 0))',
      WebkitFilter: 'brightness(1) drop-shadow(0 0 0 rgba(255, 255, 255, 0))'
    },
    buttonHover: {
      background: 'rgba(0, 0, 0, 0.06)',
      filter: 'brightness(1.8) drop-shadow(0 0 12px rgba(255, 255, 255, 1)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.3))',
      WebkitFilter: 'brightness(1.8) drop-shadow(0 0 12px rgba(255, 255, 255, 1)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.3))',
      transform: 'scale(1.05)',
      boxShadow: '0 0 20px rgba(255, 255, 255, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.2)'
    },
    buttonActive: {
      background: 'rgba(0, 0, 0, 0.1)',
      filter: 'brightness(1.8) drop-shadow(0 0 12px rgba(255, 255, 255, 1)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.3))',
      WebkitFilter: 'brightness(1.8) drop-shadow(0 0 12px rgba(255, 255, 255, 1)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.3))',
      boxShadow: '0 0 20px rgba(255, 255, 255, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.2)',
      transform: 'scale(1.05)'
    },
    icon: {
      width: '24px',
      height: '24px',
      objectFit: 'contain' as const,
      pointerEvents: 'none' as const
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
      borderColor: systemColors.selection.blueDark,
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
      borderColor: systemColors.selection.blue,
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

  // Input / Text Field - estilo macOS
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
      background: '#FFFFFF',
      border: `0.5px solid #BABABA`,
      borderRadius: '4px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      outline: 'none',
      transition: 'all 0.2s ease',
      boxShadow: 'inset 0 0.5px 2px rgba(0, 0, 0, 0.12), 0 0.5px 0 rgba(255, 255, 255, 0.5)'
    },
    fieldFocus: {
      borderColor: '#6CB4FB',
      boxShadow: `0 0 0 3px rgba(108, 180, 251, 0.3), inset 0 0.5px 2px rgba(0, 0, 0, 0.12)`
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
      background: systemColors.control.background,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: systemColors.control.border,
      borderRadius: '5px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      outline: 'none',
      transition: 'all 0.15s ease',
      boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
    },
    fieldFocus: {
      borderColor: systemColors.selection.border,
      boxShadow: `0 0 0 3px ${systemColors.selection.background}, inset 0 1px 2px rgba(0, 0, 0, 0.05)`
    },
    icon: {
      position: 'absolute' as const,
      left: '8px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '14px',
      height: '14px',
      color: systemColors.text.tertiary,
      pointerEvents: 'none' as const
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

  // Select / Dropdown - estilo macOS com botão azul
  select: {
    container: {
      position: 'relative' as const,
      width: '100%'
    },
    field: {
      width: '100%',
      height: '28px',
      padding: '4px 24px 4px 8px',
      fontSize: '11px',
      color: systemColors.text.primary,
      background: 'linear-gradient(to bottom, #FFFFFF, #F8F8F8)',
      borderWidth: '0.5px',
      borderStyle: 'solid',
      borderColor: '#BABABA',
      borderRadius: '4px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      outline: 'none',
      cursor: 'pointer',
      appearance: 'none' as any,
      WebkitAppearance: 'none' as any,
      MozAppearance: 'none' as any,
      transition: 'all 0.2s ease',
      boxShadow: 'inset 0 0.5px 1px rgba(0, 0, 0, 0.06), 0 0.5px 0 rgba(255, 255, 255, 0.5)'
    },
    fieldFocus: {
      borderColor: '#6CB4FB',
      boxShadow: `0 0 0 3px rgba(108, 180, 251, 0.3), inset 0 0.5px 1px rgba(0, 0, 0, 0.06)`
    },
    arrow: {
      position: 'absolute' as const,
      right: '0px',
      top: '0px',
      width: '20px',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom, #5A9EDD, #3B7BC4)',
      borderLeft: '0.5px solid #2A6BA8',
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
      borderColor: systemColors.border.medium,
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
      background: 'rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(30px) saturate(180%)',
      WebkitBackdropFilter: 'blur(30px) saturate(180%)',
      border: '0.5px solid rgba(255, 255, 255, 0.4)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 0 0 0.5px rgba(255, 255, 255, 0.5), 0 8px 16px rgba(0, 0, 0, 0.15)',
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
      willChange: 'transform'
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
      flexDirection: 'column',
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
      border: `1px solid ${systemColors.selection.border}`
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
      background: 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(50px) saturate(180%)',
      WebkitBackdropFilter: 'blur(50px) saturate(180%)',
      borderRadius: '32px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
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
      transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
    },
    iconContainerHover: {
      transform: 'scale(1.1) translateY(-8px)'
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
  }
};

// Export padrão com tudo
export default {
  colors: systemColors,
  styles: systemStyles
};

