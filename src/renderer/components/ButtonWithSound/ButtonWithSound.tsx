import React, { ReactNode } from 'react';
import { useClickSound } from '../../hooks/useClickSound';

interface ButtonWithSoundProps {
  children: ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
  title?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/**
 * Componente wrapper para botões que reproduzem som de clique
 * Pode ser usado em qualquer lugar do sistema para garantir consistência
 */
export function ButtonWithSound({
  children,
  onClick,
  style,
  className,
  title,
  disabled = false,
  type = 'button',
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonWithSoundProps): JSX.Element {
  const playClickSound = useClickSound();

  const handleClick = () => {
    if (!disabled) {
      playClickSound();
      onClick?.();
    }
  };

  return (
    <button
      type={type}
      style={style}
      className={className}
      title={title}
      disabled={disabled}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
}
