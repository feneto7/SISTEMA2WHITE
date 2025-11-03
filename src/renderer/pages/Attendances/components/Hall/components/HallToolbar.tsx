//--------------------------------------------------------------------
// BARRA DE FERRAMENTAS DO SALÃO
// Barra superior reutilizável para gerenciamento de mesas do salão
// Inclui busca, ordenação e botão de novo pedido
//--------------------------------------------------------------------
import React from 'react';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { AppIcons } from '../../../../../components/Icons/AppIcons';

export type SortOrder = 'alphabetical' | 'number' | 'status';

interface HallToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
  onNewOrder: () => void;
  onViewTablesWithOrders?: () => void;
  searchPlaceholder?: string;
}

export function HallToolbar({
  searchValue,
  onSearchChange,
  sortOrder,
  onSortChange,
  onNewOrder,
  onViewTablesWithOrders,
  searchPlaceholder = 'Mesa'
}: HallToolbarProps): JSX.Element {
  const { systemStyles, systemColors } = useTheme();

  const styles = {
    toolbar: {
      ...systemStyles.searchBox.container,
      display: 'flex',
      alignItems: 'center',
      gap: 12
    },
    searchContainer: {
      display: 'flex',
      alignItems: 'center',
      flex: 1,
      maxWidth: 400,
      position: 'relative' as const
    },
    searchInput: {
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
      transition: 'all 0.15s ease'
    },
    searchIcon: {
      position: 'absolute' as const,
      left: 10,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none' as const
    },
    selectContainer: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative' as const
    },
    select: {
      height: 36,
      padding: '6px 10px 6px 12px',
      fontSize: 14,
      color: systemColors.text.primary,
      background: systemColors.input.background,
      border: `1px solid ${systemColors.input.border}`,
      borderRadius: 8,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      outline: 'none',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      appearance: 'none' as const,
      paddingRight: 32
    },
    selectChevron: {
      position: 'absolute' as const,
      right: 10,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none' as const,
      fontSize: 12,
      color: systemColors.text.tertiary
    },
    viewTablesButton: {
      ...systemStyles.button.default,
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    },
    newOrderButton: {
      ...systemStyles.button.primary,
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  };

  return (
    <div style={styles.toolbar}>
      {/* Campo de pesquisa */}
      <div style={styles.searchContainer}>
        <div style={styles.searchIcon}>
          <AppIcons.Search size={16} color={systemColors.text.tertiary} />
        </div>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Select de ordenação */}
      <div style={styles.selectContainer}>
        <select
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value as SortOrder)}
          style={styles.select}
        >
          <option value="alphabetical">Ordem alfabética</option>
          <option value="number">Ordem numérica</option>
          <option value="status">Por status</option>
        </select>
        <div style={styles.selectChevron}>▼</div>
      </div>

      {/* Espaço flexível para empurrar botão para direita */}
      <div style={{ flex: 1 }}></div>

      {/* Botão ver mesas com pedidos */}
      {onViewTablesWithOrders && (
        <button style={styles.viewTablesButton} onClick={onViewTablesWithOrders}>
          Ver Mesas c/ Pedidos
        </button>
      )}

      {/* Botão novo pedido */}
      <button style={styles.newOrderButton} onClick={onNewOrder}>
        <AppIcons.Add size={16} />
        Novo pedido
      </button>
    </div>
  );
}

