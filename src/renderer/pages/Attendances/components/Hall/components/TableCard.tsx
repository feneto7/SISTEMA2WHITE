//--------------------------------------------------------------------
// CARD DE MESA
// Card individual para exibir uma mesa no grid de mesas do salão
// Usado para identificar e gerenciar pedidos por mesa
//--------------------------------------------------------------------
import React from 'react';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { useClickSound } from '../../../../../hooks/useClickSound';

interface TableCardProps {
  table: {
    id: string;
    number: number;
    status: 'free' | 'occupied' | 'reserved';
  };
  onAddOrder: () => void;
  onClick?: () => void;
  showAddOrderButton?: boolean;
}

export function TableCard({ table, onAddOrder, onClick, showAddOrderButton = true }: TableCardProps): JSX.Element {
  const { systemStyles, systemColors } = useTheme();
  const playClickSound = useClickSound();

  const handleAddOrderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    onAddOrder();
  };

  const handleCardClick = () => {
    playClickSound();
    if (onClick) {
      onClick();
    }
  };

  // Cores do status
  const getStatusColor = () => {
    switch (table.status) {
      case 'free':
        return '#10B981'; // Verde para livre
      case 'occupied':
        return '#F59E0B'; // Laranja para ocupada
      case 'reserved':
        return '#EF4444'; // Vermelho para reservada
      default:
        return systemColors.border.light;
    }
  };

  const getStatusText = () => {
    switch (table.status) {
      case 'free':
        return 'Livre';
      case 'occupied':
        return 'Ocupada';
      case 'reserved':
        return 'Reservada';
      default:
        return '';
    }
  };

  const styles = {
    card: {
      display: 'flex',
      flexDirection: 'column' as const,
      background: systemColors.background.primary,
      borderRadius: 10,
      border: `1px solid ${systemColors.border.light}`,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.15s ease',
      minHeight: 120,
      position: 'relative' as const
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '12px 16px'
    },
    tableNumber: {
      fontSize: '16px',
      fontWeight: '700' as const,
      color: systemColors.text.primary
    },
    addOrderButton: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '6px 12px',
      borderRadius: 6,
      background: systemColors.background.primary,
      border: `1px solid ${systemColors.border.light}`,
      fontSize: '12px',
      fontWeight: '600' as const,
      color: systemColors.text.primary,
      cursor: 'pointer',
      transition: 'all 0.15s ease'
    },
    statusBar: {
      marginTop: 'auto',
      padding: '8px 16px',
      background: getStatusColor(),
      color: '#FFFFFF',
      fontSize: '13px',
      fontWeight: '600' as const,
      textAlign: 'center' as const
    }
  };

  const handleAddOrderMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = systemColors.selection.background;
    e.currentTarget.style.borderColor = systemColors.selection.blue;
  };

  const handleAddOrderMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = systemColors.background.primary;
    e.currentTarget.style.borderColor = systemColors.border.light;
  };

  return (
    <div style={styles.card} onClick={handleCardClick}>
      <div style={styles.cardHeader}>
        <span style={styles.tableNumber}>Mesa {table.number}</span>
        {showAddOrderButton && (
          <button
            style={styles.addOrderButton}
            onClick={handleAddOrderClick}
            onMouseEnter={handleAddOrderMouseEnter}
            onMouseLeave={handleAddOrderMouseLeave}
          >
            <span>+</span>
            <span>Pedido</span>
          </button>
        )}
      </div>
      <div style={styles.statusBar}>
        {getStatusText()}
      </div>
    </div>
  );
}

