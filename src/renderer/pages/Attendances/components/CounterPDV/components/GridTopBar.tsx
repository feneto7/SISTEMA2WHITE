//--------------------------------------------------------------------
// BARRA SUPERIOR REUTILIZÁVEL
// Componente compartilhado para barras superiores das grids (categorias, produtos, complementos)
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { BackButton } from '../../../../../components/BackButton';
import { AppIcons } from '../../../../../components/Icons/AppIcons';

interface GridTopBarProps {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  showSearch?: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
}

export function GridTopBar({ 
  leftContent, 
  rightContent, 
  showSearch = false, 
  searchValue = '', 
  searchPlaceholder = 'Buscar...',
  onSearchChange
}: GridTopBarProps): JSX.Element {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { systemStyles, systemColors } = useTheme();

  const styles = {
    topBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      borderBottom: `1px solid ${systemColors.border.light}`,
      flexShrink: 0,
      height: 60,
      boxSizing: 'border-box' as const
    },
    topBarLeft: {
      display: 'flex',
      alignItems: 'center',
      flex: 1
    },
    topBarRight: {
      display: 'flex',
      alignItems: 'center'
    },
    searchContainer: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      maxWidth: 400,
      position: 'relative' as const
    },
    searchInputOverride: {
      width: '100%',
      height: 36,
      padding: '6px 10px 6px 32px',
      fontSize: 14,
      color: systemColors.text.primary,
      background: systemColors.input.background,
      border: `1px solid ${systemColors.input.border}`,
      borderRadius: 8,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      outline: 'none',
      transition: 'all 0.15s ease',
      boxShadow: systemColors.text.primary === '#FFFFFF' 
        ? 'inset 0 1px 2px rgba(0, 0, 0, 0.2)'
        : 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
    }
  };

  return (
    <div style={styles.topBar}>
      <div style={styles.topBarLeft}>
        {leftContent || (
          showSearch && (
            <div style={styles.searchContainer}>
              <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <AppIcons.Search size={16} color={systemColors.text.tertiary} />
              </div>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder={searchPlaceholder}
                style={{
                  ...styles.searchInputOverride,
                  ...(isSearchFocused ? {
                    borderColor: systemColors.input.borderFocus,
                    boxShadow: `0 0 0 2px ${systemColors.input.borderFocus}33`
                  } : {})
                }}
              />
            </div>
          )
        )}
      </div>
      <div style={styles.topBarRight}>
        {rightContent}
      </div>
    </div>
  );
}

