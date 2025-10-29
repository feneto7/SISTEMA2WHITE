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
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();

  const handleClick = () => {
    playClickSound();
    if (onClick) onClick();
  };

  return (
    <div style={dockButtonContainer}>
      <button
        style={systemStyles.dock.icon}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
  const { systemStyles } = useTheme();
  
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
    <div style={systemStyles.dock.container}>
      <div style={dockInner}>
        <DockButton icon={AppIcons.Products} label="Produtos" onClick={() => navigate('products')} />
        <DockButton icon={AppIcons.Users} label="Clientes" onClick={() => navigate('clients')} />
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
