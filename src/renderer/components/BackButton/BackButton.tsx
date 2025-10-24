import React, { useState } from 'react';
import { useClickSound } from '../../hooks/useClickSound';

// Componente de botão voltar estilo macOS
// Reutilizável e modularizado seguindo as regras do projeto
interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export function BackButton({ onClick, label = "Voltar" }: BackButtonProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const playClickSound = useClickSound();

  const handleClick = () => {
    playClickSound();
    onClick();
  };

  return (
    <button
      style={isHovered ? backButtonHover : backButton}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      title={label}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M7.5 3L4.5 6L7.5 9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

const backButton: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 6,
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
};

const backButtonHover: React.CSSProperties = {
  ...backButton,
  background: 'linear-gradient(to bottom, #f8f8f8, #e0e0e0)',
  color: 'rgba(0, 0, 0, 0.8)',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
  transform: 'translateY(-1px)'
};

