import React, { useState } from 'react';
import { useClickSound } from '../../hooks/useClickSound';
import { useTheme } from '../../styles/ThemeProvider';

// Componente de botão voltar estilo macOS
// Reutilizável e modularizado seguindo as regras do projeto
interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export function BackButton({ onClick, label = "Voltar" }: BackButtonProps): JSX.Element {
  const { systemStyles, systemColors } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const playClickSound = useClickSound();

  const handleClick = () => {
    playClickSound();
    onClick();
  };

  return (
    <button
      style={isPressed ? { ...systemStyles.toolbar.button, ...systemStyles.toolbar.buttonActive } : systemStyles.toolbar.button}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={handleClick}
      title={label}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M7.5 3L4.5 6L7.5 9"
          stroke={systemColors.text.primary}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
 

