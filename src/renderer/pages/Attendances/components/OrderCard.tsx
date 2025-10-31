//--------------------------------------------------------------------
// CARD DE PEDIDO
// Componente reutilizável para exibir um pedido no quadro Kanban
// Usa estilos neomórficos e segue o padrão visual do sistema
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { useTheme } from '../../../styles/ThemeProvider';
import { useClickSound } from '../../../hooks/useClickSound';

interface OrderCardProps {
  orderNumber: string;
  customerName: string;
  orderTime: string;
  total: number;
  itemsCount: number;
  onClick?: () => void;
  onAdvance?: () => void;
  showAdvanceButton?: boolean;
  buttonLabel?: string;
}

export function OrderCard({
  orderNumber,
  customerName,
  orderTime,
  total,
  itemsCount,
  onClick,
  onAdvance,
  showAdvanceButton = false,
  buttonLabel = 'Avançar →'
}: OrderCardProps): JSX.Element {
  const { systemStyles, systemColors } = useTheme();
  // Efeito de hover do card para realçar o pedido no quadro
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const playClickSound = useClickSound();

  const handleAdvance = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    if (onAdvance) onAdvance();
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const styles = {
    container: {
      background: systemColors.background.content,
      border: `1px solid ${systemColors.border.light}`,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      cursor: 'default',
      // Sombra com variação sutil no hover para sensação de elevação (estilo macOS)
      boxShadow: isCardHovered
        ? (systemColors.text.primary === '#FFFFFF'
          ? '8px 8px 16px rgba(0,0,0,0.5), -8px -8px 16px rgba(255,255,255,0.08)'
          : '6px 6px 12px rgba(0, 0, 0, 0.12)')
        : (systemColors.text.primary === '#FFFFFF'
          ? '6px 6px 12px rgba(0,0,0,0.45), -6px -6px 12px rgba(255,255,255,0.06)'
          : '3px 3px 6px rgba(0, 0, 0, 0.1)'),
      transition: 'box-shadow 160ms ease, transform 160ms ease',
      transform: isCardHovered ? 'translateY(-1px)' : 'translateY(0)'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8
    },
    orderNumber: {
      ...systemStyles.page.title,
      fontSize: 14,
      fontWeight: 600,
      margin: 0,
      color: systemColors.text.primary
    },
    orderTime: {
      fontSize: 11,
      color: systemColors.text.secondary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    customerName: {
      fontSize: 13,
      fontWeight: 500,
      color: systemColors.text.primary,
      marginBottom: 8,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const
    },
    details: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 8,
      borderTop: `1px solid ${systemColors.border.light}`
    },
    itemsCount: {
      fontSize: 11,
      color: systemColors.text.secondary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    total: {
      fontSize: 14,
      fontWeight: 600,
      color: systemColors.text.primary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 8
    },
    advanceButton: (): React.CSSProperties => {
      const baseBg = systemColors.background.content;
      const shadowDark = systemColors.text.primary === '#FFFFFF' ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.1)';
      const shadowLight = systemColors.text.primary === '#FFFFFF' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.8)';
      return {
        padding: '4px 12px',
        borderRadius: 8,
        background: baseBg,
        color: systemColors.text.primary,
        border: 'none',
        cursor: 'pointer',
        fontSize: 11,
        fontWeight: 600,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        boxShadow: isButtonPressed
          ? systemColors.text.primary === '#FFFFFF'
            ? `inset 3px 3px 6px ${shadowDark}, inset -3px -3px 6px ${shadowLight}`
            : `inset 2px 2px 4px ${shadowDark}, inset -2px -2px 4px ${shadowLight}`
          : `3px 3px 6px ${shadowDark}, -3px -3px 6px ${shadowLight}`,
        transition: 'box-shadow 120ms ease',
        outline: 'none'
      };
    }
  };

  return (
    <div
      style={styles.container}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      onClick={onClick}
    >
      <div style={styles.header}>
        <h3 style={styles.orderNumber}>#{orderNumber}</h3>
        <span style={styles.orderTime}>{orderTime}</span>
      </div>
      <div style={styles.customerName}>{customerName}</div>
      <div style={styles.details}>
        <span style={styles.itemsCount}>
          {itemsCount} {itemsCount === 1 ? 'item' : 'itens'}
        </span>
        <span style={styles.total}>{formatCurrency(total)}</span>
      </div>
      {showAdvanceButton && (
        <div style={styles.footer}>
          <button
            style={styles.advanceButton()}
            onClick={handleAdvance}
            onMouseLeave={() => { setIsButtonPressed(false); }}
            onMouseDown={() => setIsButtonPressed(true)}
            onMouseUp={() => setIsButtonPressed(false)}
          >
            {buttonLabel}
          </button>
        </div>
      )}
    </div>
  );
}


