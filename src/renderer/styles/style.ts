export const globalStyles = {
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
    
    // Cores de painéis
    '--panel': '#e8e8e8',
    '--panel-gradient': 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)',
    '--panel-stroke': '#c0c0c0',
    '--glass-bg': 'rgba(248,248,248,0.8)',
    '--glass-border': 'rgba(255,255,255,0.9)',
    '--glass-shadow': 'rgba(0,0,0,0.5) 0px 3px 20px',
    
    // Gradientes
    '--gradient-primary': 'linear-gradient(to bottom, #f0f0f0, #ddd)',
    '--gradient-glass': 'linear-gradient(135deg, rgba(240,241,245,0.7), rgba(230,235,242,0.55))',
    '--gradient-avatar': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 50%)',
    
    // Sombras
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
    
    // Transições
    '--transition-fast': 'all 0.2s ease',
    '--transition-medium': 'all 0.5s ease-in-out',
    '--transition-slow': 'all 0.7s ease-in-out'
  }
};

// Estilos para componentes do sistema macOS
export const macStyles = {
  // Header padrão do sistema - 3 colunas (BackButton | Título | Controles)
  pageHeader: {
    container: {
      height: 44,
      background: 'var(--panel-gradient)',
      backgroundColor: 'var(--panel)',
      borderBottom: '1px solid var(--panel-stroke)',
      boxShadow: 'var(--shadow-light)',
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      padding: '0 16px',
      position: 'relative' as const,
      zIndex: 10,
      marginBottom: '20px'
    },
    leftColumn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    centerColumn: {
      textAlign: 'center' as const
    },
    rightColumn: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      justifyContent: 'flex-end'
    },
    title: {
      color: 'var(--text-primary)',
      fontSize: '2.2rem',
      fontWeight: '600',
      margin: 0,
      textAlign: 'center' as const,
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const
    }
  },
  topMenu: {
    container: {
      height: 44,
      background: 'var(--panel-gradient)',
      backgroundColor: 'var(--panel)',
      borderBottom: '1px solid var(--panel-stroke)',
      boxShadow: 'var(--shadow-light)'
    },
    content: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      color: 'var(--text-primary)'
    },
    left: {
      display: 'flex',
      gap: 16,
      alignItems: 'center'
    },
    right: {
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    },
    item: {
      fontSize: 13,
      opacity: 0.9,
      cursor: 'pointer',
      transition: 'var(--transition-fast)',
      textTransform: 'uppercase' as const
    },
    itemActive: {
      fontSize: 13,
      opacity: 0.9,
      cursor: 'pointer',
      transition: 'var(--transition-fast)',
      fontWeight: 600,
      color: 'var(--accent)',
      textTransform: 'uppercase' as const
    }
  },
  dock: {
    container: {
      height: 64,
      margin: '0 16px 16px 16px',
      borderRadius: 'var(--border-radius-large)',
      background: 'var(--glass-bg)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--glass-shadow)',
      width: 'fit-content',
      marginLeft: 'auto',
      marginRight: 'auto',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)'
    },
    inner: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '0 12px'
    },
    button: {
      height: 48,
      width: 48,
      borderRadius: 'var(--border-radius-large)',
      border: 'none',
      background: 'var(--gradient-primary)',
      boxShadow: 'var(--shadow-light), var(--shadow-inset)',
      backdropFilter: 'blur(20px) saturate(180%)',
      cursor: 'pointer',
      transition: 'var(--transition-fast)',
      transform: 'scale(1)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonHover: {
      height: 48,
      width: 48,
      borderRadius: 'var(--border-radius-large)',
      border: 'none',
      background: 'var(--gradient-primary)',
      boxShadow: 'var(--shadow-medium), var(--shadow-inset)',
      backdropFilter: 'blur(20px) saturate(180%)',
      cursor: 'pointer',
      transition: 'var(--transition-fast)',
      transform: 'scale(1.2)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  },
  // Estilos para páginas do sistema
  pages: {
    // Estilos compartilhados de header para todas as páginas
    common: {
      pageHeader: {
        background: '#e8e8e8',
        backgroundImage: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderRadius: 'var(--border-radius-large)',
        border: '1px solid #c0c0c0',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      },
      pageTitle: {
        fontSize: '20px',
        fontWeight: '600',
        color: 'var(--text-primary)',
        margin: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px'
      },
      contentContainer: {
        background: '#e8e8e8',
        backgroundImage: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderRadius: 'var(--border-radius-large)',
        border: '1px solid #c0c0c0',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden'
      }
    },
    products: {
      container: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        padding: '20px',
        gap: '20px',
        overflow: 'hidden'
      },
      searchContainer: {
        background: '#e8e8e8',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderRadius: 'var(--border-radius-large)',
        border: '1px solid #c0c0c0',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '12px',
        backgroundImage: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)'
      },
      searchStats: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
      statsText: {
        fontSize: '13px',
        color: 'var(--text-secondary)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        textTransform: 'uppercase' as const
      },
      listContainer: {
        flex: 1,
        background: '#e8e8e8',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderRadius: 'var(--border-radius-large)',
        border: '1px solid #c0c0c0',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column' as const,
        backgroundImage: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)'
      },
      listHeader: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 0.8fr 0.8fr 1fr 80px',
        gap: '16px',
        padding: '16px 20px',
        background: '#e8e8e8',
        backgroundImage: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)',
        borderBottom: '1px solid #c0c0c0',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      },
      headerCell: {
        fontSize: '12px',
        fontWeight: '600',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
        position: 'relative' as const
      },
      headerCellDivider: {
        position: 'absolute' as const,
        right: '-8px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '1px',
        height: '60%',
        background: 'rgba(0, 0, 0, 0.15)',
        pointerEvents: 'none' as const
      },
      listContent: {
        flex: 1,
        overflow: 'auto',
        padding: '8px'
      },
      listRow: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 0.8fr 0.8fr 1fr',
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
      },
      productName: {
        fontSize: '14px',
        fontWeight: '500',
        color: 'var(--text-primary)',
        marginBottom: '0',
        whiteSpace: 'nowrap' as const,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textTransform: 'uppercase' as const
      },
      productDescription: {
        fontSize: '12px',
        color: 'var(--text-secondary)',
        lineHeight: '1.4',
        textTransform: 'uppercase' as const
      },
      categoryBadge: {
        fontSize: '12px',
        color: 'var(--text-primary)',
        background: 'rgba(0, 0, 0, 0.06)',
        padding: '4px 10px',
        borderRadius: '6px',
        fontWeight: '500',
        textTransform: 'uppercase' as const
      },
      typeBadgeProduct: {
        fontSize: '11px',
        color: 'var(--accent)',
        background: 'rgba(10, 132, 255, 0.1)',
        padding: '4px 10px',
        borderRadius: '6px',
        fontWeight: '600',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px'
      },
      typeBadgeService: {
        fontSize: '11px',
        color: '#34C759',
        background: 'rgba(52, 199, 89, 0.1)',
        padding: '4px 10px',
        borderRadius: '6px',
        fontWeight: '600',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px'
      },
      actionButtons: {
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        alignItems: 'center'
      },
      actionButton: {
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
        padding: '6px',
        width: '28px',
        height: '28px',
        textTransform: 'uppercase' as const
      },
      actionButtonHover: {
        background: 'linear-gradient(to bottom, #f8f8f8, #e0e0e0)',
        color: 'rgba(0, 0, 0, 0.8)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
        transform: 'translateY(-1px)'
      },
      stockGood: {
        fontSize: '13px',
        color: '#34C759',
        fontWeight: '500',
        textTransform: 'uppercase' as const
      },
      stockLow: {
        fontSize: '13px',
        color: '#FF9500',
        fontWeight: '500',
        textTransform: 'uppercase' as const
      },
      stockOut: {
        fontSize: '13px',
        color: '#FF3B30',
        fontWeight: '500',
        textTransform: 'uppercase' as const
      },
      stockNA: {
        fontSize: '13px',
        color: 'rgba(0, 0, 0, 0.3)',
        fontWeight: '500',
        textTransform: 'uppercase' as const
      },
      priceText: {
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--text-primary)',
        textTransform: 'uppercase' as const
      },
      emptyState: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: '12px',
        padding: '40px'
      },
      emptyText: {
        fontSize: '16px',
        fontWeight: '500',
        color: 'var(--text-secondary)',
        margin: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        textTransform: 'uppercase' as const
      },
      emptySubtext: {
        fontSize: '13px',
        color: 'rgba(0, 0, 0, 0.4)',
        margin: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        textTransform: 'uppercase' as const
      },
      newProductButton: {
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
        padding: '6px 12px',
        gap: '6px',
        textTransform: 'uppercase' as const
      },
      newProductButtonHover: {
        background: 'linear-gradient(to bottom, #f8f8f8, #e0e0e0)',
        color: 'rgba(0, 0, 0, 0.8)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
        transform: 'translateY(-1px)'
      }
    },
    clients: {
      container: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        padding: '20px',
        gap: '20px',
        overflow: 'hidden'
      },
      searchContainer: {
        background: '#e8e8e8',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderRadius: 'var(--border-radius-large)',
        border: '1px solid #c0c0c0',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '12px',
        backgroundImage: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)'
      },
      searchHeaderRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%'
      },
      searchStats: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
      statsText: {
        fontSize: '13px',
        color: 'var(--text-secondary)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        textTransform: 'uppercase' as const
      },
      listContainer: {
        flex: 1,
        background: '#e8e8e8',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderRadius: 'var(--border-radius-large)',
        border: '1px solid #c0c0c0',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column' as const,
        backgroundImage: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)'
      },
      listHeader: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr 0.8fr 80px',
        gap: '16px',
        padding: '16px 20px',
        background: '#e8e8e8',
        backgroundImage: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)',
        borderBottom: '1px solid #c0c0c0',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      },
      headerCell: {
        fontSize: '12px',
        fontWeight: '600',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
        position: 'relative' as const
      },
      headerCellDivider: {
        position: 'absolute' as const,
        right: '-8px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '1px',
        height: '60%',
        background: 'rgba(0, 0, 0, 0.15)',
        pointerEvents: 'none' as const
      },
      listContent: {
        flex: 1,
        overflow: 'auto',
        padding: '8px'
      },
      listRow: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr 0.8fr',
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
      },
      clientName: {
        fontSize: '14px',
        fontWeight: '500',
        color: 'var(--text-primary)',
        marginBottom: '0',
        whiteSpace: 'nowrap' as const,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textTransform: 'uppercase' as const
      },
      emailText: {
        fontSize: '13px',
        color: 'var(--text-primary)',
        textTransform: 'uppercase' as const
      },
      phoneText: {
        fontSize: '13px',
        color: 'var(--text-primary)',
        textTransform: 'uppercase' as const
      },
      documentText: {
        fontSize: '13px',
        color: 'var(--text-primary)',
        textTransform: 'uppercase' as const
      },
      typeBadgeIndividual: {
        fontSize: '11px',
        color: '#34C759',
        background: 'rgba(52, 199, 89, 0.1)',
        padding: '4px 10px',
        borderRadius: '6px',
        fontWeight: '600',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px'
      },
      typeBadgeCompany: {
        fontSize: '11px',
        color: '#FF9500',
        background: 'rgba(255, 149, 0, 0.1)',
        padding: '4px 10px',
        borderRadius: '6px',
        fontWeight: '600',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px'
      },
      actionButtons: {
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        alignItems: 'center'
      },
      actionButton: {
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
        padding: '6px',
        width: '28px',
        height: '28px',
        textTransform: 'uppercase' as const
      },
      actionButtonHover: {
        background: 'linear-gradient(to bottom, #f8f8f8, #e0e0e0)',
        color: 'rgba(0, 0, 0, 0.8)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
        transform: 'translateY(-1px)'
      },
      emptyState: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: '12px',
        padding: '40px'
      },
      emptyText: {
        fontSize: '16px',
        fontWeight: '500',
        color: 'var(--text-secondary)',
        margin: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        textTransform: 'uppercase' as const
      },
      emptySubtext: {
        fontSize: '13px',
        color: 'rgba(0, 0, 0, 0.4)',
        margin: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        textTransform: 'uppercase' as const
      },
      newClientButton: {
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
        padding: '6px 12px',
        gap: '6px',
        textTransform: 'uppercase' as const
      },
      newClientButtonHover: {
        background: 'linear-gradient(to bottom, #f8f8f8, #e0e0e0)',
        color: 'rgba(0, 0, 0, 0.8)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
        transform: 'translateY(-1px)'
      }
    }
  },
  // Estilos para modais do sistema
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
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)'
    },
    container: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.9)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden'
    },
    header: {
      padding: '20px 24px 16px',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    title: {
      fontSize: '18px',
      fontWeight: '600',
      color: 'var(--text-primary)',
      margin: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const
    },
    closeButton: {
      width: 28,
      height: 28,
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
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    closeButtonHover: {
      background: 'linear-gradient(to bottom, #f8f8f8, #e0e0e0)',
      color: 'rgba(0, 0, 0, 0.8)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
      transform: 'translateY(-1px)'
    },
    typeSelector: {
      padding: '16px 24px',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      display: 'flex',
      gap: '24px',
      alignItems: 'center'
    },
    typeLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: 'var(--text-primary)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const
    },
    checkboxGroup: {
      display: 'flex',
      gap: '16px'
    },
    checkboxItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer'
    },
    checkbox: {
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      border: '2px solid rgba(0, 0, 0, 0.3)',
      background: 'transparent',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      position: 'relative' as const
    },
    checkboxChecked: {
      border: '2px solid var(--accent)',
      background: 'var(--accent)'
    },
    checkboxDot: {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: 'white'
    },
    checkboxLabel: {
      fontSize: '13px',
      color: 'var(--text-primary)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const
    },
    tabsContainer: {
      display: 'flex',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      background: 'rgba(246, 246, 246, 0.5)'
    },
    tab: {
      padding: '12px 20px',
      cursor: 'pointer',
      borderBottom: '2px solid transparent',
      transition: 'all 0.15s ease',
      fontSize: '13px',
      fontWeight: '500',
      color: 'var(--text-secondary)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const
    },
    tabActive: {
      color: 'var(--accent)',
      borderBottomColor: 'var(--accent)',
      background: 'rgba(10, 132, 255, 0.05)'
    },
    tabContent: {
      flex: 1,
      padding: '24px',
      overflow: 'auto'
    },
    footer: {
      padding: '16px 24px',
      borderTop: '1px solid rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      background: 'rgba(246, 246, 246, 0.5)'
    },
    button: {
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
      padding: '8px 16px',
      textTransform: 'uppercase' as const
    },
    buttonHover: {
      background: 'linear-gradient(to bottom, #f8f8f8, #e0e0e0)',
      color: 'rgba(0, 0, 0, 0.8)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
      transform: 'translateY(-1px)'
    },
    buttonPrimary: {
      background: 'linear-gradient(to bottom, var(--accent), #0056b3)',
      color: 'white',
      border: '1px solid var(--accent)',
      boxShadow: '0 1px 2px rgba(10, 132, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
    },
    buttonPrimaryHover: {
      background: 'linear-gradient(to bottom, #0056b3, #004494)',
      boxShadow: '0 2px 4px rgba(10, 132, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      transform: 'translateY(-1px)'
    }
  },
  // Estilos para formulários e inputs baseados no CodePen
  form: {
    container: {
      background: 'var(--primary-bg)',
      backgroundImage: 'var(--gradient-primary)',
      borderRadius: 'var(--border-radius-medium)',
      border: '1px solid var(--border-white)',
      boxShadow: 'var(--glass-shadow)',
      padding: '40px 40px 30px',
      textAlign: 'center' as const
    },
    input: {
      display: 'block',
      width: '170px',
      margin: '20px auto',
      padding: '10px 25px 10px 10px',
      borderRadius: 'var(--border-radius-small)',
      border: '1px solid var(--border-color)',
      background: 'var(--text-white)',
      fontSize: '14px',
      transition: 'var(--transition-fast)'
    },
    inputFocus: {
      borderColor: 'var(--accent)',
      boxShadow: '0 0 0 2px rgba(10, 132, 255, 0.2)',
      outline: 'none'
    },
    button: {
      background: 'var(--gradient-primary)',
      border: '1px solid var(--border-white)',
      borderRadius: 'var(--border-radius-medium)',
      boxShadow: 'var(--shadow-light)',
      padding: '10px 20px',
      cursor: 'pointer',
      transition: 'var(--transition-fast)',
      color: 'var(--text-primary)',
      fontSize: '14px',
      fontWeight: 500
    },
    buttonHover: {
      background: 'var(--gradient-primary)',
      boxShadow: 'var(--shadow-medium)',
      transform: 'translateY(-1px)'
    },
    avatar: {
      display: 'block',
      margin: '0 auto 15px',
      width: '100px',
      height: '100px',
      borderRadius: 'var(--border-radius-circle)',
      border: '3px solid var(--border-white)',
      boxShadow: 'var(--shadow-light), var(--shadow-inset)',
      overflow: 'hidden',
      backgroundImage: 'var(--gradient-avatar)',
      backgroundSize: 'auto, 100%'
    }
  }
};


