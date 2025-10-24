// Estilos para modais do sistema baseados no CodePen Cocoa
// Arquivo específico para componentes modais seguindo o design macOS
export const modalStyles = {
  // Overlay do modal
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

  // Container principal do modal
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.1)',
    width: '85vw',
    height: '85vh',
    maxWidth: '90vw',
    maxHeight: '90vh',
    minWidth: '1200px',
    minHeight: '600px',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
  },

  // Header do modal
  header: {
    backgroundColor: '#e8e8e8',
    borderBottom: '1px solid #c0c0c0',
    padding: '8px 16px',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '44px',
    background: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)'
  },

  title: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
    flex: 1,
    textAlign: 'center' as const,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    textTransform: 'uppercase' as const
  },

  // Botões de controle macOS (traffic lights)
  trafficLights: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },

  trafficLight: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '8px',
    fontWeight: 'bold',
    color: 'transparent',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3)'
  },

  trafficLightRed: {
    backgroundColor: '#ff5f57'
  },

  trafficLightYellow: {
    backgroundColor: '#ffbd2e'
  },

  trafficLightGreen: {
    backgroundColor: '#28ca42'
  },

  // Seletor de tipo de produto
  typeSelector: {
    padding: '16px',
    borderBottom: '1px solid #d0d0d0',
    backgroundColor: '#f8f8f8'
  },

  typeLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '12px',
    display: 'block',
    textTransform: 'uppercase' as const
  },

  checkboxGroup: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap' as const
  },

  checkboxItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'background-color 0.15s ease'
  },

  checkboxItemHover: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)'
  },

  checkbox: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '2px solid #ccc',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  checkboxChecked: {
    border: '2px solid #007aff',
    backgroundColor: '#007aff'
  },

  checkboxDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'white',
    opacity: 0,
    transition: 'opacity 0.15s ease'
  },

  checkboxDotVisible: {
    opacity: 1
  },

  checkboxLabel: {
    fontSize: '13px',
    color: '#333',
    fontWeight: '400',
    userSelect: 'none' as const,
    textTransform: 'uppercase' as const
  },

  // Sistema de abas estilo macOS elegante melhorado
  tabsContainer: {
    display: 'flex',
    backgroundColor: '#e8e8e8',
    borderBottom: '1px solid #c0c0c0',
    padding: '0',
    borderRadius: '0',
    position: 'relative' as const,
    alignItems: 'flex-end',
    height: '32px',
    background: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)'
  },

  tab: {
    background: 'linear-gradient(to bottom, #f8f8f8, #e8e8e8)',
    borderTop: '1px solid #c0c0c0',
    borderLeft: '1px solid #c0c0c0',
    borderRight: '1px solid #c0c0c0',
    borderBottom: 'none',
    padding: '6px 16px',
    cursor: 'pointer',
    fontSize: '12px',
    color: '#666',
    fontWeight: '500',
    position: 'relative' as const,
    borderRadius: '6px 6px 0 0',
    margin: '0 1px',
    minWidth: '60px',
    textAlign: 'center' as const,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5)',
    height: '26px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    WebkitAppearance: 'none' as any,
    MozAppearance: 'none' as any,
    appearance: 'none' as any,
    textTransform: 'uppercase' as const
  },

  tabActive: {
    color: '#ffffff',
    fontWeight: '600',
    background: 'linear-gradient(to bottom, #007AFF, #0056CC)',
    borderTop: '1px solid #007AFF',
    borderLeft: '1px solid #007AFF',
    borderRight: '1px solid #007AFF',
    borderBottom: 'none',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 -1px 2px rgba(0, 122, 255, 0.3)',
    zIndex: 10,
    outline: 'none',
    WebkitAppearance: 'none' as any,
    MozAppearance: 'none' as any,
    appearance: 'none' as any,
    textTransform: 'uppercase' as const
  },

  tabHover: {
    background: 'linear-gradient(to bottom, #fafafa, #f0f0f0)',
    color: '#333',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.7), 0 -1px 1px rgba(0, 0, 0, 0.05)',
    borderTop: '1px solid #c0c0c0',
    borderLeft: '1px solid #c0c0c0',
    borderRight: '1px solid #c0c0c0',
    borderBottom: 'none',
    outline: 'none',
    WebkitAppearance: 'none' as any,
    MozAppearance: 'none' as any,
    appearance: 'none' as any,
    textTransform: 'uppercase' as const
  },

  // Conteúdo das abas
  tabContent: {
    flex: 1,
    padding: '24px',
    backgroundColor: '#ffffff',
    overflow: 'auto',
    minHeight: '400px',
    borderTop: '1px solid #c0c0c0',
    marginTop: '-1px'
  },

  tabContentTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 24px 0',
    paddingBottom: '16px',
    borderBottom: '1px solid #e8e8e8',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    textTransform: 'uppercase' as const
  },

  tabContentText: {
    color: '#666',
    fontSize: '16px',
    lineHeight: '1.6',
    margin: 0,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    textTransform: 'uppercase' as const
  },

  // Footer do modal
  footer: {
    backgroundColor: '#e8e8e8',
    borderTop: '1px solid #c0c0c0',
    padding: '12px 16px',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)'
  },

  // Botões do footer - estilo BackButton
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
    minWidth: '80px',
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
    boxShadow: '0 1px 2px rgba(10, 132, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    marginLeft: '8px'
  },

  buttonPrimaryHover: {
    background: 'linear-gradient(to bottom, #0056b3, #004494)',
    boxShadow: '0 2px 4px rgba(10, 132, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    transform: 'translateY(-1px)'
  },

  // Formulários estilo macOS
  formGroup: {
    marginBottom: '20px'
  },

  formLabel: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '4px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },

  formInput: {
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

  formInputFocus: {
    borderColor: '#007aff',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(0, 122, 255, 0.2)'
  },

  formTextarea: {
    width: '100%',
    padding: '6px 8px',
    border: '1px solid #c0c0c0',
    borderRadius: '3px',
    fontSize: '13px',
    backgroundColor: '#ffffff',
    minHeight: '60px',
    resize: 'vertical' as const,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
    outline: 'none',
    textTransform: 'uppercase' as const
  },

  formSelect: {
    width: '100%',
    padding: '6px 8px',
    border: '1px solid #c0c0c0',
    borderRadius: '3px',
    fontSize: '13px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
    outline: 'none',
    appearance: 'none' as any,
    WebkitAppearance: 'none' as any,
    MozAppearance: 'none' as any,
    backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\'%3E%3Cpath fill=\'%23666\' d=\'M4.427 6.427L8 10l3.573-3.573L12 7.5l-4 4-4-4z\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 6px center',
    backgroundSize: '10px',
    paddingRight: '24px',
    textTransform: 'uppercase' as const
  },

  // Seções agrupadas estilo macOS - ESTILO IMPORTANTE PARA TODOS OS MODAIS
  formSection: {
    backgroundColor: '#f8f8f8',
    border: '1px solid #d0d0d0',
    borderRadius: '4px',
    padding: '12px',
    marginBottom: '16px',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5)'
  },

  formSectionTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 8px 0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    textTransform: 'uppercase' as const
  },

  // Variações de formSection para diferentes contextos
  formSectionInfo: {
    backgroundColor: '#f0f8ff',
    border: '1px solid #b0d4f1',
    borderRadius: '4px',
    padding: '12px',
    marginBottom: '16px',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5)'
  },

  formSectionInfoTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#0066cc',
    margin: '0 0 8px 0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    textTransform: 'uppercase' as const
  },

  // Container para formulários dinâmicos (como adicionar itens)
  formSectionDynamic: {
    backgroundColor: '#f8f8f8',
    border: '1px solid #d0d0d0',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '16px',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5)',
    display: 'flex',
    alignItems: 'end',
    gap: '12px'
  },

  // Container para listas dentro de seções
  formSectionList: {
    backgroundColor: '#f8f8f8',
    border: '1px solid #d0d0d0',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '16px',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5)'
  },

  // Checkboxes estilo macOS
  formCheckbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px',
    cursor: 'pointer'
  },

  formCheckboxInput: {
    width: '14px',
    height: '14px',
    border: '1px solid #c0c0c0',
    borderRadius: '2px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: '#ffffff',
    fontWeight: 'bold',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.15s ease'
  },

  formCheckboxInputChecked: {
    backgroundColor: '#007aff',
    borderColor: '#007aff'
  },

  formCheckboxLabel: {
    fontSize: '13px',
    color: '#333',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    cursor: 'pointer',
    userSelect: 'none' as const,
    textTransform: 'uppercase' as const
  },

  // Grid para formulários
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },

  formGridFull: {
    gridColumn: '1 / -1'
  },

  // Estados de loading e disabled
  disabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    pointerEvents: 'none' as const
  },

  loading: {
    position: 'relative' as const,
    pointerEvents: 'none' as const
  },

  loadingOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px'
  }
};
