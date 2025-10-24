import React from 'react';

// Componente de Tooltip padrão do sistema
// Usado em botões e ícones para exibir labels ao passar o mouse
interface TooltipProps {
  text: string;
  visible: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ text, visible, position = 'bottom' }: TooltipProps): JSX.Element {
  const getPositionStyles = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000
    };

    switch (position) {
      case 'top':
        return {
          ...baseStyle,
          bottom: '100%',
          marginBottom: '8px'
        };
      case 'bottom':
        return {
          ...baseStyle,
          top: '100%',
          marginTop: '8px'
        };
      case 'left':
        return {
          ...baseStyle,
          right: '100%',
          marginRight: '8px',
          left: 'auto',
          transform: 'translateY(-50%)',
          top: '50%'
        };
      case 'right':
        return {
          ...baseStyle,
          left: '100%',
          marginLeft: '8px',
          transform: 'translateY(-50%)',
          top: '50%'
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div style={{
      ...tooltipBase,
      ...getPositionStyles(),
      visibility: visible ? 'visible' : 'hidden',
      opacity: visible ? 1 : 0
    }}>
      {text}
    </div>
  );
}

const tooltipBase: React.CSSProperties = {
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  color: 'white',
  textAlign: 'center',
  borderRadius: '6px',
  padding: '6px 10px',
  fontSize: '12px',
  fontWeight: '500',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  pointerEvents: 'none'
};

