//--------------------------------------------------------------------
// APP ICON BUTTON
// Botão do ícone da aplicação com dropdown menu
// Usado no TopMenu para exibir menu de opções do sistema
//--------------------------------------------------------------------

import React, { useState, useRef, useEffect } from 'react';
import { systemStyles, systemColors } from '../../styles/systemStyle';
import { useClickSound } from '../../hooks/useClickSound';
import { useNavigation } from '../../router/Navigation';
import iconImage from '../../../main/img/icon.png';

export function AppIconButton(): JSX.Element {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHovered, setHovered] = useState(false);
  const [isPressed, setPressed] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const playClickSound = useClickSound();
  const { navigate } = useNavigation();

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleDropdownToggle = () => {
    playClickSound();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    playClickSound();
    setIsDropdownOpen(false);
    navigate('login');
  };

  return (
    <div style={styles.container} ref={dropdownRef}>
      <div style={{ position: 'relative' }}>
        <button
          onClick={handleDropdownToggle}
          style={(isHovered || isDropdownOpen) ? systemStyles.appIconButton.buttonHover : systemStyles.appIconButton.button}
          onMouseEnter={(e) => {
            setHovered(true);
          }}
          onMouseLeave={(e) => {
            setHovered(false);
            setPressed(false);
          }}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
        >
          {/* Ícone da app: sempre branco; hover/click com brilho */}
          <img
            src={iconImage}
            alt="Menu"
            style={
              (isDropdownOpen || isPressed)
                ? systemStyles.appIconButton.iconActive
                : isHovered
                ? systemStyles.appIconButton.iconHover
                : systemStyles.appIconButton.icon
            }
          />
        </button>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div style={styles.dropdownMenu}>
            <button
              onClick={handleLogout}
              style={styles.dropdownItem}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, styles.dropdownItemHover);
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, styles.dropdownItem);
              }}
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    flex: '0 0 auto'
  },
  dropdownMenu: {
    position: 'absolute' as const,
    top: '40px',
    left: '0',
    minWidth: '180px',
    background: systemColors.background.content,
    border: `0.5px solid ${systemColors.border.medium}`,
    borderRadius: '6px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.22), 0 2px 4px rgba(0, 0, 0, 0.08)',
    padding: '0',
    zIndex: 1000,
    animation: 'dropdownFadeIn 0.15s cubic-bezier(0.2, 0, 0.2, 1)',
    transformOrigin: 'top left',
    overflow: 'hidden'
  },
  dropdownItem: {
    width: '100%',
    padding: '6px 14px',
    fontSize: '13px',
    color: systemColors.text.primary,
    background: 'transparent',
    border: 'none',
    borderRadius: '0',
    cursor: 'default',
    textAlign: 'left' as const,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontWeight: '400',
    transition: 'background-color 0.08s ease',
    display: 'block',
    outline: 'none',
    WebkitFontSmoothing: 'antialiased' as const,
    MozOsxFontSmoothing: 'grayscale' as const
  },
  dropdownItemHover: {
    width: '100%',
    padding: '6px 14px',
    fontSize: '13px',
    color: '#ffffff',
    background: '#007AFF',
    border: 'none',
    borderRadius: '0',
    cursor: 'pointer',
    textAlign: 'left' as const,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontWeight: '400',
    transition: 'background-color 0.08s ease',
    display: 'block',
    outline: 'none',
    WebkitFontSmoothing: 'antialiased' as const,
    MozOsxFontSmoothing: 'grayscale' as const
  }
};

// Injetar animações CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes dropdownFadeIn {
      0% {
        opacity: 0;
        transform: translateY(-4px) scale(0.95);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    @keyframes gradientSlide {
      0% {
        background-position: 0%;
      }
      100% {
        background-position: 400%;
      }
    }
  `;
  if (!document.getElementById('dropdown-animation')) {
    style.id = 'dropdown-animation';
    document.head.appendChild(style);
  }
}

