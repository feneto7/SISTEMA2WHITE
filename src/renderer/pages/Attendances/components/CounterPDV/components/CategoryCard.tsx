//--------------------------------------------------------------------
// CARD DE CATEGORIA
// Card individual para exibir uma categoria no grid de categorias
// Usado no PDV para navegação entre categorias
//--------------------------------------------------------------------
import React from 'react';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { useClickSound } from '../../../../../hooks/useClickSound';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon?: string;
  };
  isSelected?: boolean;
  onClick: () => void;
}

export function CategoryCard({ category, isSelected = false, onClick }: CategoryCardProps): JSX.Element {
  const { systemStyles, systemColors } = useTheme();
  const playClickSound = useClickSound();

  const handleClick = () => {
    playClickSound();
    onClick();
  };

  const styles = {
    card: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      borderRadius: 10,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      background: isSelected ? systemColors.selection.background : systemColors.background.primary,
      border: `1px solid ${isSelected ? systemColors.selection.border : systemColors.border.light}`,
      boxShadow: isSelected ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
      '&:hover': {
        boxShadow: systemColors.text.primary === '#FFFFFF'
          ? '8px 8px 16px rgba(0,0,0,0.5), -8px -8px 16px rgba(255,255,255,0.08)'
          : '4px 4px 8px rgba(0, 0, 0, 0.15)',
        transform: 'translateY(-2px)'
      }
    },
    icon: {
      fontSize: '32px',
      marginBottom: 8
    },
    name: {
      fontSize: '14px',
      fontWeight: '600' as const,
      color: isSelected ? systemColors.selection.blue : systemColors.text.primary,
      textAlign: 'center' as const
    }
  };

  return (
    <div style={styles.card} onClick={handleClick}>
      <div style={styles.icon}>{category.icon || '📦'}</div>
      <span style={styles.name}>{category.name}</span>
    </div>
  );
}

