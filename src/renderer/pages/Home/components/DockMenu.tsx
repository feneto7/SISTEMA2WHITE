import React, { useState } from 'react';
import { 
  HomeIcon, 
  SearchIcon, 
  SettingsIcon, 
  FolderIcon, 
  ToolsIcon, 
  DocumentIcon,
  UsersIcon
} from '../../../components/Icons/Icons';
import { useClickSound } from '../../../hooks/useClickSound';
import { useNavigation } from '../../../router/Navigation';
import { Tooltip } from '../../../components/Tooltip';

interface DockButtonProps {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  onClick?: () => void;
}

function DockButton({ icon: Icon, label, onClick }: DockButtonProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const playClickSound = useClickSound();

  const handleClick = () => {
    playClickSound();
    if (onClick) onClick();
  };

  return (
    <div style={dockButtonContainer}>
      <button
        style={isHovered ? dockButtonHover : dockButton}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <Icon size={20} color="var(--text-primary)" />
      </button>
      <Tooltip text={label} visible={isHovered} position="top" />
    </div>
  );
}

export function DockMenu(): JSX.Element {
  const { navigate } = useNavigation();
  return (
    <div style={dockContainer}>
      <div style={dockInner}>
        <DockButton icon={HomeIcon} label="Home" />
        <DockButton icon={SearchIcon} label="Buscar" />
        <DockButton icon={SettingsIcon} label="Configurações" />
        <DockButton icon={FolderIcon} label="Arquivos" />
        <DockButton icon={ToolsIcon} label="Ferramentas" />
        <DockButton icon={DocumentIcon} label="Documentos" />
        <DockButton icon={DocumentIcon} label="Produtos" onClick={() => navigate('products')} />
        <DockButton icon={UsersIcon} label="Clientes" onClick={() => navigate('clients')} />
        <DockButton icon={DocumentIcon} label="Fiscal" onClick={() => navigate('fiscal')} />
      </div>
    </div>
  );
}

const dockContainer: React.CSSProperties = {
  height: 64,
  margin: '0 16px 16px 16px',
  borderRadius: 16,
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow: '0 12px 40px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
  width: 'fit-content',
  marginLeft: 'auto',
  marginRight: 'auto',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)'
};

const dockInner: React.CSSProperties = {
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 16,
  padding: '0 16px'
};

const dockButtonContainer: React.CSSProperties = {
  position: 'relative',
  display: 'inline-block'
};

const dockButton: React.CSSProperties = {
  height: 48,
  width: 48,
  borderRadius: 12,
  border: 'none',
  background: 'rgba(255,255,255,0.15)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)',
  backdropFilter: 'blur(20px) saturate(180%)',
  cursor: 'pointer',
  transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.2s ease, box-shadow 0.2s ease',
  transform: 'scale(1)',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  willChange: 'transform',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
};

const dockButtonHover: React.CSSProperties = {
  ...dockButton,
  transform: 'scale(1.15)',
  background: 'rgba(255,255,255,0.25)',
  boxShadow: '0 6px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)'
};
