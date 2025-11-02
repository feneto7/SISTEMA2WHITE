//--------------------------------------------------------------------
// CARD DE PRODUTO
// Card individual para exibir um produto no grid de produtos
// Usado no PDV para adicionar produtos ao carrinho
//--------------------------------------------------------------------
import React from 'react';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { useClickSound } from '../../../../../hooks/useClickSound';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    hasComplements?: boolean;
  };
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export function ProductCard({ product, quantity, onQuantityChange }: ProductCardProps): JSX.Element {
  const { systemStyles, systemColors } = useTheme();
  const playClickSound = useClickSound();

  const formatMoney = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleCardClick = () => {
    if (quantity === 0) {
      playClickSound();
      onQuantityChange(1);
    }
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    if (quantity > 0) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    onQuantityChange(quantity + 1);
  };

  const styles = {
    card: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      borderRadius: 8,
      border: `1px solid ${systemColors.border.light}`,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      background: systemColors.background.primary,
      position: 'relative' as const,
      minHeight: 140
    },
    icon: {
      fontSize: '24px',
      textAlign: 'center' as const
    },
    name: {
      fontSize: '12px',
      fontWeight: '600' as const,
      marginTop: 8,
      textAlign: 'center' as const,
      color: systemColors.text.primary
    },
    price: {
      fontSize: '14px',
      fontWeight: '700' as const,
      color: systemColors.selection.blue,
      textAlign: 'center' as const,
      marginTop: 4
    },
    quantityControls: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 8,
      width: '100%'
    },
    quantityButton: {
      width: 28,
      height: 28,
      border: `1px solid ${systemColors.border.light}`,
      borderRadius: 6,
      background: systemColors.background.primary,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      fontWeight: '600' as const,
      color: systemColors.text.primary,
      transition: 'all 0.15s ease'
    },
    quantityButtonHover: {
      background: systemColors.selection.background,
      borderColor: systemColors.selection.border
    },
    quantityDisplay: {
      minWidth: 32,
      textAlign: 'center' as const,
      fontSize: '14px',
      fontWeight: '600' as const,
      color: systemColors.text.primary
    }
  };

  return (
    <div style={styles.card} onClick={handleCardClick}>
      <div style={styles.icon}>🍔</div>
      <div style={styles.name}>{product.name}</div>
      <div style={styles.price}>{formatMoney(product.price)}</div>
      
      {quantity > 0 && (
        <div style={styles.quantityControls}>
          <button
            style={styles.quantityButton}
            onClick={handleDecrease}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.quantityButtonHover);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = systemColors.background.primary;
              e.currentTarget.style.borderColor = systemColors.border.light;
            }}
          >
            -
          </button>
          <span style={styles.quantityDisplay}>{quantity}</span>
          <button
            style={styles.quantityButton}
            onClick={handleIncrease}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.quantityButtonHover);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = systemColors.background.primary;
              e.currentTarget.style.borderColor = systemColors.border.light;
            }}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

