//--------------------------------------------------------------------
// LISTA DE MESAS COM PEDIDOS ABERTOS
// Componente de lista lateral esquerda mostrando mesas com pedidos
// Usado na visualização de mesas com pedidos abertos
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { AppIcons } from '../../../../../components/Icons/AppIcons';
import { useClickSound } from '../../../../../hooks/useClickSound';

export interface TableWithOrders {
  id: string;
  number: number;
  ordersCount: number;
  total: number;
}

interface TablesWithOrdersListProps {
  tables: TableWithOrders[];
  selectedTableId: string | null;
  onSelectTable: (tableId: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  hideHeader?: boolean;
}

export function TablesWithOrdersList({
  tables,
  selectedTableId,
  onSelectTable,
  searchValue,
  onSearchChange,
  hideHeader = false
}: TablesWithOrdersListProps): JSX.Element {
  const { systemStyles, systemColors } = useTheme();
  const playClickSound = useClickSound();

  const formatMoney = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Filtrar mesas baseado na busca
  const filteredTables = tables.filter(table =>
    `Mesa ${table.number}`.toLowerCase().includes(searchValue.toLowerCase())
  );

  const styles = {
    container: {
      width: 320,
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      background: 'transparent',
      overflow: 'hidden'
    },
    header: {
      padding: '16px',
      borderBottom: `1px solid ${systemColors.border.light}`,
      flexShrink: 0
    },
    title: {
      ...systemStyles.page.title,
      margin: 0,
      fontSize: '18px',
      marginBottom: '8px'
    },
    breadcrumb: {
      fontSize: '12px',
      color: systemColors.text.secondary,
      margin: 0
    },
    searchContainer: {
      padding: '16px',
      borderBottom: `1px solid ${systemColors.border.light}`,
      flexShrink: 0
    },
    searchInputContainer: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative' as const
    },
    searchIcon: {
      position: 'absolute' as const,
      left: 10,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none' as const
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
    listContainer: {
      flex: 1,
      overflow: 'auto',
      padding: '8px'
    },
    tableCard: (isSelected: boolean) => ({
      padding: '12px',
      marginBottom: '8px',
      borderRadius: 8,
      background: isSelected ? systemColors.selection.blue : systemColors.background.content,
      border: `1px solid ${isSelected ? systemColors.selection.blueDark : systemColors.border.light}`,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      boxShadow: isSelected ? `0 1px 3px rgba(0, 122, 255, 0.2)` : '0 0.5px 1px rgba(0, 0, 0, 0.04)'
    }),
    tableCardHover: {
      background: systemColors.selection.blueLight,
      borderColor: systemColors.selection.blueDark
    },
    tableHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '6px'
    },
    tableNumber: {
      fontSize: '14px',
      fontWeight: '600',
      color: systemColors.text.primary
    },
    tableArrow: {
      fontSize: '12px',
      color: systemColors.text.secondary
    },
    tableInfoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '8px'
    },
    tableInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    tableTotal: {
      fontSize: '14px',
      fontWeight: '600',
      color: systemColors.text.primary
    },
    ordersCount: {
      fontSize: '12px',
      color: systemColors.text.secondary,
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    }
  };

  const handleTableClick = (tableId: string) => {
    playClickSound();
    onSelectTable(tableId);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      {!hideHeader && (
        <>
          <div style={styles.header}>
            <h2 style={styles.title}>Pedidos salão</h2>
            <p style={styles.breadcrumb}>Início {'>'} Pedidos salão</p>
          </div>

          {/* Barra de pesquisa */}
          <div style={styles.searchContainer}>
            <div style={styles.searchInputContainer}>
              <div style={styles.searchIcon}>
                <AppIcons.Search size={16} color={systemColors.text.tertiary} />
              </div>
              <input
                type="text"
                placeholder="Mesa"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>
        </>
      )}

      {/* Lista de mesas */}
      <div style={styles.listContainer}>
        {filteredTables.map((table) => {
          const isSelected = selectedTableId === table.id;
          return (
            <div
              key={table.id}
              style={styles.tableCard(isSelected)}
              onClick={() => handleTableClick(table.id)}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  Object.assign(e.currentTarget.style, styles.tableCardHover);
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = systemColors.background.content;
                  e.currentTarget.style.borderColor = systemColors.border.light;
                }
              }}
            >
              <div style={styles.tableHeader}>
                <span style={{ ...styles.tableNumber, color: isSelected ? '#FFFFFF' : systemColors.text.primary }}>
                  Mesa {table.number}
                </span>
                <AppIcons.ArrowRight size={14} color={isSelected ? '#FFFFFF' : systemColors.text.secondary} />
              </div>
              <div style={styles.tableInfoRow}>
                <div style={styles.tableInfo}>
                  <div style={{ ...styles.ordersCount, color: isSelected ? 'rgba(255, 255, 255, 0.8)' : systemColors.text.secondary }}>
                    <AppIcons.Document size={14} />
                    {table.ordersCount}
                  </div>
                </div>
                <span style={{ ...styles.tableTotal, color: isSelected ? '#FFFFFF' : systemColors.text.primary }}>
                  {formatMoney(table.total)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

