import React, { useState } from 'react';
import { AppIcons } from '../../../components/Icons/AppIcons';
import { useClickSound } from '../../../hooks/useClickSound';
import { Tooltip } from '../../../components/Tooltip';
import { useTheme } from '../../../styles/ThemeProvider';
import { useNavigation } from '../../../router/Navigation';
import { AppIconButton } from '../../../components/AppIconButton';

interface MenuButtonProps {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  onClick?: () => void;
}

function MenuButton({ icon: Icon, label, onClick }: MenuButtonProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();

  const handleClick = () => {
    playClickSound();
    if (onClick) {
      onClick();
    } else {
      // Aqui você pode adicionar a lógica específica de cada botão
      console.log(`Clicou em: ${label}`);
    }
  };

  return (
    <div style={tooltipContainer}>
      <button
        style={{
          ...systemStyles.toolbar.button,
          // Neumorfismo: sem efeito de hover; apenas estado pressionado
          ...(isPressed ? systemStyles.toolbar.buttonActive : {})
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onClick={handleClick}
      >
        <Icon size={18} color={systemColors.text.primary} />
      </button>
      <Tooltip text={label} visible={isHovered} position="bottom" />
    </div>
  );
}

export function TopMenu(): JSX.Element {
  const { navigate } = useNavigation();
  const { systemStyles, systemColors, theme } = useTheme();

  return (
    <div style={{ 
      ...systemStyles.toolbar.container, 
      position: 'relative' as const, 
      zIndex: 100,
      boxShadow: theme === 'dark'
        ? '0 2px 8px rgba(0, 0, 0, 0.4)'
        : '0 2px 8px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 4px',
        color: systemColors.text.primary,
        width: '100%'
      }}>
        {/* Menu dropdown no canto esquerdo */}
        <AppIconButton />

        {/* Menu centralizado */}
        <div style={menuCenter}>
          <MenuButton 
            icon={AppIcons.Users} 
            label="Usuários" 
            onClick={() => navigate('users')}
          />
          <MenuButton 
            icon={AppIcons.Settings} 
            label="Configurações" 
            onClick={() => navigate('settings')}
          />
        </div>

        {/* Espaço vazio à direita para manter simetria */}
        <div style={menuRight}></div>
      </div>
    </div>
  );
}

const menuCenter: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  flex: '1 1 auto',
  justifyContent: 'center'
};

const menuRight: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  flex: '0 0 auto',
  minWidth: '48px' // Mesma largura do botão de logout para manter simetria
};

const tooltipContainer: React.CSSProperties = {
  position: 'relative',
  display: 'inline-block'
};

// estilos dependentes de tema foram movidos para dentro do componente
