import React, { useState } from 'react';
import { 
  UsersIcon, 
  ClientsIcon, 
  SuppliersIcon, 
  EntriesIcon, 
  SettingsIcon 
} from '../../../components/Icons/Icons';
import { useClickSound } from '../../../hooks/useClickSound';
import { Tooltip } from '../../../components/Tooltip';

interface MenuButtonProps {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
}

function MenuButton({ icon: Icon, label }: MenuButtonProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const playClickSound = useClickSound();

  const handleClick = () => {
    playClickSound();
    // Aqui você pode adicionar a lógica específica de cada botão
    console.log(`Clicou em: ${label}`);
  };

  return (
    <div style={tooltipContainer}>
      <button
        style={isHovered ? menuButtonHover : menuButton}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <Icon size={18} color="var(--text-primary)" />
      </button>
      <Tooltip text={label} visible={isHovered} position="bottom" />
    </div>
  );
}

export function TopMenu(): JSX.Element {
  return (
    <div style={topMenuContainer}>
      <div style={menuContent}>
        <div style={menuLeft}>
          <MenuButton icon={UsersIcon} label="Usuários" />
          <MenuButton icon={ClientsIcon} label="Clientes" />
          <MenuButton icon={SuppliersIcon} label="Fornecedores" />
          <MenuButton icon={EntriesIcon} label="Entradas" />
          <MenuButton icon={SettingsIcon} label="Configurações" />
        </div>
      </div>
    </div>
  );
}

const topMenuContainer: React.CSSProperties = {
  height: 36,
  background: 'rgba(246, 246, 246, 0.95)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
  display: 'flex',
  alignItems: 'center',
  padding: '0 8px',
  position: 'relative',
  zIndex: 100
};

const menuContent: React.CSSProperties = {
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: '0 4px',
  color: 'rgba(0, 0, 0, 0.8)',
  width: '100%'
};

const menuLeft: React.CSSProperties = {
  display: 'flex',
  gap: 4,
  alignItems: 'center'
};

const tooltipContainer: React.CSSProperties = {
  position: 'relative',
  display: 'inline-block'
};

const menuButton: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 4,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0.6,
  boxShadow: 'none',
  filter: 'none',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
};

const menuButtonHover: React.CSSProperties = {
  ...menuButton,
  background: 'rgba(0, 0, 0, 0.08)',
  opacity: 1,
  transform: 'scale(1.1)',
  boxShadow: 'none',
  filter: 'none'
};
