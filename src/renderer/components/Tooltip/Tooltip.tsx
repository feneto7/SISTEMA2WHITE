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
          marginBottom: '24px', // Mais espaço do botão
          transform: 'translateX(-50%) translateY(0)'
        };
      case 'bottom':
        return {
          ...baseStyle,
          top: '100%',
          marginTop: '20px'
        };
      case 'left':
        return {
          ...baseStyle,
          right: '100%',
          marginRight: '20px',
          left: 'auto',
          transform: 'translateY(-50%)',
          top: '50%'
        };
      case 'right':
        return {
          ...baseStyle,
          left: '100%',
          marginLeft: '20px',
          transform: 'translateY(-50%)',
          top: '50%'
        };
      default:
        return baseStyle;
    }
  };

  const getArrowStyles = (): React.CSSProperties => {
    const baseArrow: React.CSSProperties = {
      position: 'absolute',
      width: '0',
      height: '0',
      borderStyle: 'solid'
    };

    switch (position) {
      case 'top':
        return {
          ...baseArrow,
          bottom: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '6px 5px 0 5px',
          borderColor: 'rgba(255, 255, 255, 0.9) transparent transparent transparent',
          filter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1))'
        };
      case 'bottom':
        return {
          ...baseArrow,
          top: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '0 5px 6px 5px',
          borderColor: 'transparent transparent rgba(255, 255, 255, 0.9) transparent',
          filter: 'drop-shadow(0 -1px 1px rgba(0, 0, 0, 0.1))'
        };
      case 'left':
        return {
          ...baseArrow,
          right: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: '5px 0 5px 6px',
          borderColor: 'transparent transparent transparent rgba(255, 255, 255, 0.9)',
          filter: 'drop-shadow(1px 0 1px rgba(0, 0, 0, 0.1))'
        };
      case 'right':
        return {
          ...baseArrow,
          left: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: '5px 6px 5px 0',
          borderColor: 'transparent rgba(255, 255, 255, 0.9) transparent transparent',
          filter: 'drop-shadow(-1px 0 1px rgba(0, 0, 0, 0.1))'
        };
      default:
        return baseArrow;
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
      <div style={{
        ...getArrowStyles(),
        visibility: visible ? 'visible' : 'hidden',
        opacity: visible ? 1 : 0
      }} />
    </div>
  );
}

const tooltipBase: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: 'rgba(0, 0, 0, 0.85)',
  textAlign: 'center',
  borderRadius: '6px',
  padding: '5px 10px',
  fontSize: '12px',
  fontWeight: '500',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  whiteSpace: 'nowrap',
  transition: 'opacity 0.1s ease',
  boxShadow: '0 3px 12px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '0.5px solid rgba(0, 0, 0, 0.08)',
  pointerEvents: 'none',
  letterSpacing: '0.2px'
};

