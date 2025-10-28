//--------------------------------------------------------------------
// ACTION BUTTON - BOTÃO DE AÇÃO PARA LISTAS
// Botão com estilo neomorfismo usado nas ações das listas
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { systemStyles } from '../../styles/systemStyle';
import { useClickSound } from '../../hooks/useClickSound';

interface ActionButtonProps {
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  title: string;
  color?: string;
}

export function ActionButton({ icon, onClick, title, color }: ActionButtonProps): JSX.Element {
  const [isPressed, setIsPressed] = useState(false);
  const playClickSound = useClickSound();

  const handleClick = (e: React.MouseEvent) => {
    playClickSound();
    onClick(e);
  };

  const getButtonStyle = () => {
    if (isPressed) {
      return {
        ...systemStyles.actionButton.container,
        ...systemStyles.actionButton.containerActive,
        transition: 'none',
        transform: 'scale(0.95)',
        boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.12), inset -2px -2px 4px rgba(255, 255, 255, 0.7)'
      };
    }
    
    return {
      ...systemStyles.actionButton.container,
      transition: 'none',
      transform: 'none',
      filter: 'none',
      boxShadow: '3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.8)'
    };
  };

  return (
    <button
      style={{
        ...getButtonStyle(),
        transform: isPressed ? 'scale(0.95)' : 'none',
        filter: 'none',
      } as React.CSSProperties}
      onMouseLeave={() => {
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={handleClick}
      title={title}
      onMouseEnter={() => {}}
      className="no-hover-effect"
    >
      {icon}
    </button>
  );
}

