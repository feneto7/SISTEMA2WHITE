//--------------------------------------------------------------------
// ACTION BUTTON - BOTÃO DE AÇÃO PARA LISTAS
// Botão com estilo neomorfismo usado nas ações das listas
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { useTheme } from '../../styles/ThemeProvider';
import { useClickSound } from '../../hooks/useClickSound';

// Botão de ação com o mesmo padrão de neumorfismo do BackButton
// Usado nas listas (coluna AÇÕES) para editar/excluir etc.
interface ActionButtonProps {
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  title: string;
  color?: string; // reserva para variações de cor do ícone se necessário
}

export function ActionButton({ icon, onClick, title, color: _color }: ActionButtonProps): JSX.Element {
  const { systemStyles } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const playClickSound = useClickSound();

  const handleClick = (e: React.MouseEvent) => {
    playClickSound();
    onClick(e);
  };

  return (
    <button
      style={
        isPressed
          ? { ...systemStyles.toolbar.button, ...systemStyles.toolbar.buttonActive, filter: 'none' }
          : { ...systemStyles.toolbar.button, filter: 'none' }
      }
      data-pressed={isPressed ? 'true' : 'false'}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={handleClick}
      title={title}
      className="no-hover-effect"
    >
      {icon}
    </button>
  );
}

