// Estilos modelo para modais do sistema baseados no NewProductModal
// Arquivo base para todos os modais seguindo o design macOS

// === OVERLAY E CONTAINER ===
export const modalOverlay: React.CSSProperties = {
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
};

export const modalContainer: React.CSSProperties = {
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
};

// === HEADER ===
export const modalHeader: React.CSSProperties = {
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
};

export const modalTitle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#333',
  margin: 0,
  flex: 1,
  textAlign: 'center' as const,
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  textTransform: 'uppercase' as const
};

// === TRAFFIC LIGHTS (macOS) ===
export const trafficLights: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center'
};

export const trafficLight: React.CSSProperties = {
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
};

export const trafficLightRed: React.CSSProperties = {
  backgroundColor: '#ff5f57'
};

export const trafficLightYellow: React.CSSProperties = {
  backgroundColor: '#ffbd2e'
};

export const trafficLightGreen: React.CSSProperties = {
  backgroundColor: '#28ca42'
};

// === TYPE SELECTOR ===
export const typeSelector: React.CSSProperties = {
  padding: '16px',
  borderBottom: '1px solid #d0d0d0',
  backgroundColor: '#f8f8f8'
};

export const typeLabel: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '500',
  color: '#333',
  marginBottom: '12px',
  display: 'block',
  textTransform: 'uppercase' as const
};

export const checkboxGroup: React.CSSProperties = {
  display: 'flex',
  gap: '20px',
  flexWrap: 'wrap' as const
};

export const checkboxItem: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  padding: '4px',
  borderRadius: '4px',
  transition: 'background-color 0.15s ease'
};

export const checkbox: React.CSSProperties = {
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
};

export const checkboxChecked: React.CSSProperties = {
  border: '2px solid #007aff',
  backgroundColor: '#007aff'
};

export const checkboxDot: React.CSSProperties = {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: 'white',
  opacity: 0,
  transition: 'opacity 0.15s ease'
};

export const checkboxLabel: React.CSSProperties = {
  fontSize: '13px',
  color: '#333',
  fontWeight: '400',
  userSelect: 'none' as const,
  textTransform: 'uppercase' as const
};

// === TABS SYSTEM ===
export const tabsContainer: React.CSSProperties = {
  display: 'flex',
  backgroundColor: '#e8e8e8',
  borderBottom: '1px solid #c0c0c0',
  padding: '0',
  borderRadius: '0',
  position: 'relative' as const,
  alignItems: 'flex-end',
  height: '32px',
  background: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)'
};

export const tab: React.CSSProperties = {
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
};

export const tabActive: React.CSSProperties = {
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
};

export const tabHover: React.CSSProperties = {
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
};

// === TAB CONTENT ===
export const tabContent: React.CSSProperties = {
  flex: 1,
  padding: '24px',
  backgroundColor: '#ffffff',
  overflow: 'auto',
  minHeight: '400px',
  borderTop: '1px solid #c0c0c0',
  marginTop: '-1px'
};

export const tabContentTitle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#333',
  margin: '0 0 24px 0',
  paddingBottom: '16px',
  borderBottom: '1px solid #e8e8e8',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  textTransform: 'uppercase' as const
};

// === FOOTER ===
export const modalFooter: React.CSSProperties = {
  backgroundColor: '#e8e8e8',
  borderTop: '1px solid #c0c0c0',
  padding: '12px 16px',
  borderBottomLeftRadius: '8px',
  borderBottomRightRadius: '8px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)'
};

// === BUTTONS ===
export const button: React.CSSProperties = {
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
};

export const buttonHover: React.CSSProperties = {
  background: 'linear-gradient(to bottom, #f8f8f8, #e0e0e0)',
  color: 'rgba(0, 0, 0, 0.8)',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
  transform: 'translateY(-1px)'
};

export const buttonPrimary: React.CSSProperties = {
  background: 'linear-gradient(to bottom, var(--accent), #0056b3)',
  color: 'white',
  border: '1px solid var(--accent)',
  boxShadow: '0 1px 2px rgba(10, 132, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  marginLeft: '8px'
};

export const buttonPrimaryHover: React.CSSProperties = {
  background: 'linear-gradient(to bottom, #0056b3, #004494)',
  boxShadow: '0 2px 4px rgba(10, 132, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
  transform: 'translateY(-1px)'
};

// === FORM ELEMENTS ===
export const formGroup: React.CSSProperties = {
  marginBottom: '20px'
};

export const formLabel: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '600',
  color: '#333',
  marginBottom: '4px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px'
};

export const formInput: React.CSSProperties = {
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
};

export const formInputFocus: React.CSSProperties = {
  borderColor: '#007aff !important',
  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(0, 122, 255, 0.2) !important'
};

// Estilos globais para garantir que o foco funcione em todos os inputs
export const globalInputFocusStyles = `
  input:focus,
  textarea:focus,
  select:focus {
    border-color: #007aff !important;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(0, 122, 255, 0.2) !important;
    outline: none !important;
  }
`;

// Função utilitária para aplicar estilos de input com foco
// Nota: Os estilos de foco são aplicados globalmente via CSS
export const getInputWithFocus = (baseStyle: React.CSSProperties = formInput): React.CSSProperties => ({
  ...baseStyle
});

export const formSelect: React.CSSProperties = {
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
};

export const formTextarea: React.CSSProperties = {
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
};

// === FORM SECTIONS ===
export const formSection: React.CSSProperties = {
  backgroundColor: '#f8f8f8',
  border: '1px solid #d0d0d0',
  borderRadius: '4px',
  padding: '12px',
  marginBottom: '16px',
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5)'
};

export const formSectionTitle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#333',
  margin: '0 0 8px 0',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  textTransform: 'uppercase' as const
};

// === FORM GRID ===
export const formGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px'
};

export const formGridFull: React.CSSProperties = {
  gridColumn: '1 / -1'
};

// === CHECKBOXES ===
export const formCheckbox: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginBottom: '8px',
  cursor: 'pointer'
};

export const formCheckboxInput: React.CSSProperties = {
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
};

export const formCheckboxInputChecked: React.CSSProperties = {
  backgroundColor: '#007aff',
  borderColor: '#007aff'
};

export const formCheckboxLabel: React.CSSProperties = {
  fontSize: '13px',
  color: '#333',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  cursor: 'pointer',
  userSelect: 'none' as const,
  textTransform: 'uppercase' as const
};

// === STATES ===
export const disabled: React.CSSProperties = {
  opacity: 0.6,
  cursor: 'not-allowed',
  pointerEvents: 'none' as const
};

export const loading: React.CSSProperties = {
  position: 'relative' as const,
  pointerEvents: 'none' as const
};

export const loadingOverlay: React.CSSProperties = {
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
};

// === LIST STYLES ===
export const listContainer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '8px'
};

export const listItem: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 16px',
  backgroundColor: '#ffffff',
  border: '1px solid #d0d0d0',
  borderRadius: '6px',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  transition: 'background 0.15s ease'
};

export const listItemLast: React.CSSProperties = {
  borderBottom: 'none'
};

export const listItemInfo: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '4px'
};

export const listItemName: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '500',
  color: '#1a1a1a'
};

export const listItemDetails: React.CSSProperties = {
  fontSize: '12px',
  color: '#666'
};

export const removeButton: React.CSSProperties = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  border: '1px solid #ff3b30',
  background: '#ff3b30',
  color: 'white',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 'bold',
  transition: 'all 0.15s ease'
};

export const emptyState: React.CSSProperties = {
  textAlign: 'center' as const,
  padding: '40px 20px',
  color: '#999',
  fontStyle: 'italic',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
};

// === INFO SECTIONS ===
export const infoSection: React.CSSProperties = {
  backgroundColor: '#f0f8ff',
  borderColor: '#b0d4f1',
  border: '1px solid #b0d4f1',
  borderRadius: '4px',
  padding: '12px',
  marginBottom: '16px'
};

export const infoSectionTitle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#0066cc',
  margin: '0 0 8px 0',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  textTransform: 'uppercase' as const
};

export const infoText: React.CSSProperties = {
  fontSize: '12px',
  color: '#666',
  lineHeight: '1.5',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
};

// === ADD BUTTON STYLES ===
export const addButtonContainer: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  alignItems: 'flex-end',
  marginBottom: '16px',
  padding: '16px',
  backgroundColor: '#f8f8f8',
  borderRadius: '6px',
  border: '1px solid #d0d0d0'
};

export const addButton: React.CSSProperties = {
  backgroundColor: '#007aff',
  color: 'white',
  border: '1px solid #007aff',
  fontSize: '12px',
  padding: '6px 16px',
  height: '32px',
  minWidth: '100px',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontWeight: '500',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

export const addButtonGreen: React.CSSProperties = {
  backgroundColor: '#34C759',
  color: 'white',
  border: '1px solid #34C759',
  fontSize: '12px',
  padding: '6px 12px',
  height: '32px',
  minWidth: '80px',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontWeight: '500',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

// === TABLE STYLES ===
export const tableHeader: React.CSSProperties = {
  display: 'grid',
  gap: '12px',
  padding: '12px 16px',
  backgroundColor: '#f0f0f0',
  borderRadius: '6px',
  fontWeight: '600',
  fontSize: '12px',
  color: '#666',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
};

export const tableRow: React.CSSProperties = {
  display: 'grid',
  gap: '12px',
  alignItems: 'center',
  padding: '12px 16px',
  backgroundColor: '#ffffff',
  border: '1px solid #d0d0d0',
  borderRadius: '6px',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
};

// === LEGACY STYLES (mantidos para compatibilidade) ===
export const glassPanel: React.CSSProperties = {
  background: 'var(--panel)',
  backgroundImage: 'var(--gradient-primary)',
  border: '1px solid var(--border-white)',
  borderRadius: 'var(--border-radius-medium)',
  boxShadow: 'var(--glass-shadow)',
  backdropFilter: 'blur(22px) saturate(160%)',
  WebkitBackdropFilter: 'blur(22px) saturate(160%)'
};

export const modalContainerHover: React.CSSProperties = {
  ...modalContainer,
  opacity: 1
};

export const loginForm: React.CSSProperties = {
  display: 'block',
  margin: 'auto',
  padding: '40px 40px 30px',
  position: 'absolute' as const,
  background: 'var(--primary-bg)',
  backgroundImage: 'var(--gradient-primary)',
  borderRadius: 'var(--border-radius-medium)',
  border: '1px solid var(--border-white)',
  boxShadow: 'var(--glass-shadow)',
  textAlign: 'center' as const,
  width: '100%',
  boxSizing: 'border-box' as const
};

export const inputField: React.CSSProperties = {
  display: 'block',
  width: '170px',
  margin: '20px auto',
  padding: '10px 25px 10px 10px',
  borderRadius: 'var(--border-radius-small)',
  border: '1px solid var(--border-color)',
  background: 'var(--text-white)',
  fontSize: '14px',
  transition: 'var(--transition-fast)',
  outline: 'none'
};

export const inputFieldFocus: React.CSSProperties = {
  ...inputField,
  borderColor: 'var(--accent)',
  boxShadow: '0 0 0 2px rgba(10, 132, 255, 0.2)'
};

export const avatar: React.CSSProperties = {
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
};

export const textWithShadow: React.CSSProperties = {
  color: 'var(--text-white)',
  textShadow: 'var(--shadow-text)'
};

export const textLightShadow: React.CSSProperties = {
  color: 'var(--text-primary)',
  textShadow: 'var(--shadow-text-light)'
};

// === ANIMATIONS ===
export const shakeAnimation = `
  @keyframes shake {
    0% { left: 0; }
    20% { left: 10px; }
    40% { left: -10px; }
    60% { left: 10px; }
    80% { left: -10px; }
    100% { left: 0px; }
  }
`;

export const shakeClass = {
  animation: 'shake 0.7s ease-in-out'
};