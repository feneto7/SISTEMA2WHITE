import React, { useState } from 'react';
import { useClickSound } from '../../hooks/useClickSound';

// Componente de botão adicionar estilo macOS
// Reutilizável e modularizado seguindo as regras do projeto
interface AddButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  variant?: 'add' | 'edit';
}

export function AddButton({ onClick, disabled = false, label = "Adicionar", variant = 'add' }: AddButtonProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const playClickSound = useClickSound();

  const handleClick = () => {
    if (!disabled) {
      playClickSound();
      onClick();
    }
  };

  const baseStyle = variant === 'edit' ? addButtonEdit : addButton;
  const hoverStyle = variant === 'edit' ? addButtonEditHover : addButtonHover;

  return (
    <button
      style={disabled ? addButtonDisabled : (isHovered ? hoverStyle : baseStyle)}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      disabled={disabled}
      title={label}
    >
      {variant === 'edit' ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M6 3V9M3 6H9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

const addButton: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 6,
  border: '1px solid rgba(0, 0, 0, 0.2)',
  background: 'linear-gradient(to bottom, #4CAF50, #45a049)',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
};

const addButtonHover: React.CSSProperties = {
  ...addButton,
  background: 'linear-gradient(to bottom, #5CBF60, #4CAF50)',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
  transform: 'translateY(-1px)'
};

const addButtonDisabled: React.CSSProperties = {
  ...addButton,
  background: 'linear-gradient(to bottom, #cccccc, #b3b3b3)',
  color: 'rgba(255, 255, 255, 0.6)',
  cursor: 'not-allowed',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  transform: 'none'
};

// Estilos para modo edição (amarelo)
const addButtonEdit: React.CSSProperties = {
  ...addButton,
  background: 'linear-gradient(to bottom, #FFCC00, #FFB000)',
  color: '#4a3b00',
};

const addButtonEditHover: React.CSSProperties = {
  ...addButtonEdit,
  background: 'linear-gradient(to bottom, #FFD633, #FFCC00)',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
  transform: 'translateY(-1px)'
};
