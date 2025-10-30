//--------------------------------------------------------------------
// APP ICON BUTTON
// Botão do ícone da aplicação com dropdown menu
// Usado no TopMenu para exibir menu de opções do sistema
//--------------------------------------------------------------------

import React, { useState, useRef, useEffect } from 'react';
import { systemStyles, systemColors } from '../../styles/systemStyle';
import { useClickSound } from '../../hooks/useClickSound';
import { useNavigation } from '../../router/Navigation';
import { useTheme } from '../../styles/ThemeProvider';
import iconImage from '../../../main/img/icon.png';

export function AppIconButton(): JSX.Element {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHovered, setHovered] = useState(false);
  const [isPressed, setPressed] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeCloseTimeout = useRef<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredSubIndex, setHoveredSubIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const playClickSound = useClickSound();
  const { navigate } = useNavigation();
  const { theme, setTheme, systemColors: themeColors } = useTheme();

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setIsThemeMenuOpen(false);
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

  const handleThemeOpen = () => {
    if (themeCloseTimeout.current) {
      window.clearTimeout(themeCloseTimeout.current);
      themeCloseTimeout.current = null;
    }
    setIsThemeMenuOpen(true);
  };
  const handleThemeClose = () => {
    // pequeno atraso para permitir mover o cursor até o submenu sem fechar
    if (themeCloseTimeout.current) window.clearTimeout(themeCloseTimeout.current);
    themeCloseTimeout.current = window.setTimeout(() => {
      setIsThemeMenuOpen(false);
      themeCloseTimeout.current = null;
    }, 150);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    playClickSound();
    setTheme(newTheme);
    setIsThemeMenuOpen(false);
    setIsDropdownOpen(false);
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
          <div style={{ ...styles.dropdownMenu, background: themeColors.background.content, border: `1px solid ${themeColors.border.light}` }}>
            {/* Item Temas com submenu */}
            <div
              style={styles.themeItemContainer}
              ref={themeMenuRef}
              onMouseEnter={handleThemeOpen}
              onMouseLeave={handleThemeClose}
            >
              <button
                style={{ ...(isThemeMenuOpen || hoveredIndex === 0 ? styles.dropdownItemActive : styles.dropdownItem), color: (isThemeMenuOpen || hoveredIndex === 0) ? '#ffffff' : themeColors.text.primary }}
                onClick={() => setIsThemeMenuOpen((v) => !v)}
                onMouseEnter={() => setHoveredIndex(0)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span>Temas</span>
                <span style={{ ...styles.arrowIcon, marginLeft: 'auto' }}>{isThemeMenuOpen ? '▾' : '▸'}</span>
              </button>
              
              {/* Submenu de temas */}
              {isThemeMenuOpen && (
                <div style={{ ...styles.subMenu, background: themeColors.background.content, border: `1px solid ${themeColors.border.light}` }} onMouseEnter={handleThemeOpen} onMouseLeave={handleThemeClose}>
                  <button
                    onClick={() => handleThemeChange('light')}
                    style={{ ...(theme === 'light' || hoveredSubIndex === 0 ? styles.subMenuItemActive : styles.subMenuItem), color: (theme === 'light' || hoveredSubIndex === 0) ? '#ffffff' : themeColors.text.primary }}
                    onMouseEnter={() => setHoveredSubIndex(0)}
                    onMouseLeave={() => setHoveredSubIndex(null)}
                  >
                    <span style={styles.checkIcon}>{theme === 'light' ? '✓' : ''}</span>
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => handleThemeChange('dark')}
                    style={{ ...(theme === 'dark' || hoveredSubIndex === 1 ? styles.subMenuItemActive : styles.subMenuItem), color: (theme === 'dark' || hoveredSubIndex === 1) ? '#ffffff' : themeColors.text.primary }}
                    onMouseEnter={() => setHoveredSubIndex(1)}
                    onMouseLeave={() => setHoveredSubIndex(null)}
                  >
                    <span style={styles.checkIcon}>{theme === 'dark' ? '✓' : ''}</span>
                    <span>Dark</span>
                  </button>
                </div>
              )}
            </div>

            {/* Item Sair */}
            <button
              onClick={handleLogout}
              style={{ ...(hoveredIndex === 1 ? styles.dropdownItemActive : styles.dropdownItem), color: hoveredIndex === 1 ? '#ffffff' : themeColors.text.primary }}
              onMouseEnter={() => setHoveredIndex(1)}
              onMouseLeave={() => setHoveredIndex(null)}
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
    minWidth: '140px',
    background: systemColors.background.content,
    border: `1px solid ${systemColors.border.light}`,
    borderRadius: '2px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
    padding: '2px 0',
    zIndex: 1000,
    animation: 'dropdownFadeIn 0.15s cubic-bezier(0.2, 0, 0.2, 1)',
    transformOrigin: 'top left',
    overflow: 'visible'
  },
  dropdownItem: {
    width: '100%',
    padding: '4px 8px',
    fontSize: '11px',
    color: systemColors.text.primary,
    background: 'transparent',
    border: 'none',
    borderRadius: '0',
    cursor: 'pointer',
    textAlign: 'left' as const,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontWeight: '500',
    transition: 'background-color 0.08s ease',
    display: 'block',
    outline: 'none',
    WebkitFontSmoothing: 'antialiased' as const,
    MozOsxFontSmoothing: 'grayscale' as const
  },
  dropdownItemActive: {
    width: '100%',
    padding: '4px 8px',
    fontSize: '11px',
    color: '#ffffff',
    background: '#007AFF',
    border: 'none',
    borderRadius: '0',
    cursor: 'pointer',
    textAlign: 'left' as const,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontWeight: '600',
    transition: 'background-color 0.08s ease',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    outline: 'none',
    WebkitFontSmoothing: 'antialiased' as const,
    MozOsxFontSmoothing: 'grayscale' as const
  },
  themeItemContainer: {
    position: 'relative' as const
  },
  arrowIcon: {
    fontSize: '10px',
    marginLeft: '8px',
    opacity: 0.7
  },
  subMenu: {
    position: 'absolute' as const,
    left: '100%',
    top: '0',
    minWidth: '130px',
    background: systemColors.background.content,
    border: `1px solid ${systemColors.border.light}`,
    borderRadius: '2px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
    padding: '2px 0',
    marginLeft: '4px',
    zIndex: 1001,
    animation: 'dropdownFadeIn 0.15s cubic-bezier(0.2, 0, 0.2, 1)',
    transformOrigin: 'top left',
    overflow: 'hidden'
  },
  subMenuItem: {
    width: '100%',
    padding: '4px 8px',
    fontSize: '11px',
    color: systemColors.text.primary,
    background: 'transparent',
    border: 'none',
    borderRadius: '0',
    cursor: 'pointer',
    textAlign: 'left' as const,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontWeight: '500',
    transition: 'background-color 0.08s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    outline: 'none',
    WebkitFontSmoothing: 'antialiased' as const,
    MozOsxFontSmoothing: 'grayscale' as const
  },
  subMenuItemActive: {
    width: '100%',
    padding: '4px 8px',
    fontSize: '11px',
    color: '#ffffff',
    background: '#007AFF',
    border: 'none',
    borderRadius: '0',
    cursor: 'pointer',
    textAlign: 'left' as const,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontWeight: '600',
    transition: 'background-color 0.08s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    outline: 'none',
    WebkitFontSmoothing: 'antialiased' as const,
    MozOsxFontSmoothing: 'grayscale' as const
  },
  checkIcon: {
    width: '12px',
    fontSize: '11px',
    fontWeight: '600',
    display: 'inline-block',
    textAlign: 'center' as const
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

