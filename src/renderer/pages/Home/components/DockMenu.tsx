import React, { useState } from 'react';
import { 
  AppIcons
} from '../../../components/Icons/AppIcons';
import { useClickSound } from '../../../hooks/useClickSound';
import { useNavigation } from '../../../router/Navigation';
import { Tooltip } from '../../../components/Tooltip';
import { useTheme } from '../../../styles/ThemeProvider';

interface DockButtonProps {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  onClick?: () => void;
}

function DockButton({ icon: Icon, label, onClick }: DockButtonProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const playClickSound = useClickSound();
  const { systemStyles, systemColors, theme } = useTheme();

  // Neomorfismo sutil baseado no tema atual
  const baseBg = systemColors.background.sidebar;
  const shadowDark = 'rgba(0, 0, 0, 0.45)';
  const shadowLight = theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.10)';

  const neoButton: React.CSSProperties = {
    background: baseBg,
    borderRadius: 14,
    boxShadow: isPressed
      ? theme === 'dark'
        ? `inset 6px 6px 12px ${shadowDark}, inset -6px -6px 12px rgba(255, 255, 255, 0.02)`
        : `inset 6px 6px 12px ${shadowDark}, inset -6px -6px 12px ${shadowLight}`
      : theme === 'dark'
      ? `8px 8px 16px ${shadowDark}, -4px -4px 8px rgba(255, 255, 255, 0.03)`
      : `10px 10px 20px ${shadowDark}, -10px -10px 20px ${shadowLight}`,
    transition: 'box-shadow 120ms ease',
  };

  const handleClick = () => {
    playClickSound();
    if (onClick) onClick();
  };

  return (
    <div style={dockButtonContainer}>
      <button
        style={{ ...systemStyles.dock.icon, ...neoButton }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onClick={handleClick}
      >
        <Icon size={20} color={systemColors.text.primary} />
      </button>
      <Tooltip text={label} visible={isHovered} position="top" />
    </div>
  );
}

interface DockMenuProps {
  onOpenOperations?: () => void;
  onOpenFiscal?: () => void;
}

export function DockMenu({ onOpenOperations, onOpenFiscal }: DockMenuProps): JSX.Element {
  const { navigate } = useNavigation();
  const { systemStyles, systemColors, theme } = useTheme();

  // Neomorfismo do container do dock baseado no tema
  const dockSurface: React.CSSProperties = {
    ...systemStyles.dock.container,
    background: systemColors.background.sidebar,
    borderRadius: 18,
    boxShadow: theme === 'dark'
      ? `10px 10px 20px rgba(0,0,0,0.5), -4px -4px 10px rgba(255,255,255,0.03)`
      : `12px 12px 24px rgba(0,0,0,0.45), -12px -12px 24px rgba(255,255,255,0.10)`
  };
  
  const handleOperationsClick = () => {
    if (onOpenOperations) {
      onOpenOperations();
    }
  };

  const handleFiscalClick = () => {
    if (onOpenFiscal) {
      onOpenFiscal();
    }
  };

  return (
    <div style={dockSurface}>
      <div style={dockInner}>
        <DockButton icon={AppIcons.Products} label="Produtos" onClick={() => navigate('products')} />
        <DockButton icon={AppIcons.Users} label="Clientes" onClick={() => navigate('clients')} />
        <DockButton icon={AppIcons.Settings} label="Atendimentos" onClick={() => navigate('attendances')} />
        <DockButton icon={AppIcons.ShoppingCart} label="Operações" onClick={handleOperationsClick} />
        <DockButton icon={AppIcons.Invoice} label="Fiscal" onClick={handleFiscalClick} />
      </div>
    </div>
  );
}

const dockInner: React.CSSProperties = {
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8
};

const dockButtonContainer: React.CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center'
};

// estilos dependentes de tema foram movidos para dentro dos componentes
