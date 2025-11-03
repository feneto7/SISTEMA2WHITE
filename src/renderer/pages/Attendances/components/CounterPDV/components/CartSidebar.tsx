//--------------------------------------------------------------------
// CARRINHO SIDEBAR
// Sidebar lateral para exibir itens adicionados ao carrinho e totais
// Componente reutilizável para PDV e operações de pedidos
//--------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { AppIcons } from '../../../../../components/Icons/AppIcons';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { TableSelectionModal } from './TableSelectionModal';

export interface CartComplement {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  complements?: CartComplement[];
  hasComplements?: boolean;
  productId?: string;
}

interface CartSidebarProps {
  items?: CartItem[];
  total?: number;
  onCheckout?: () => void;
  editingItemId?: string | null;
  onStartEdit?: (item: CartItem) => void;
  onUpdateEditingItem?: (item: CartItem) => void;
  onFinishEditing?: () => void;
  onDeleteItem?: (itemId: string) => void;
  orderType?: 'counter' | 'table';
  isTableModalOpen?: boolean;
  onOpenTableModal?: () => void;
  onCloseTableModal?: () => void;
  onTableSelect?: (table: { id: string; number: number; status: 'free' | 'occupied' | 'reserved' }) => void;
  selectedTable?: { id: string; number: number; status: 'free' | 'occupied' | 'reserved' } | null;
}

export function CartSidebar({ items = [], total = 0, onCheckout, editingItemId, onStartEdit, onUpdateEditingItem, onFinishEditing, onDeleteItem, orderType = 'counter', isTableModalOpen = false, onOpenTableModal, onCloseTableModal, onTableSelect, selectedTable = null }: CartSidebarProps): JSX.Element {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const { systemStyles, systemColors } = useTheme();
  const playClickSound = useClickSound();

  const formatMoney = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Limpar campos de cliente quando o carrinho for esvaziado
  useEffect(() => {
    if (items.length === 0) {
      setClientName('');
      setClientPhone('');
    }
  }, [items.length]);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      background: systemColors.background.content,
      borderRadius: 10,
      border: `1px solid ${systemColors.border.light}`,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      height: '100%',
      width: '350px',
      flexShrink: 0
    },
    header: {
      ...systemStyles.list.header,
      padding: '16px',
      borderBottom: `1px solid ${systemColors.border.light}`
    },
    title: {
      ...systemStyles.list.headerCell,
      fontSize: '14px',
      margin: 0
    },
    content: {
      flex: 1,
      overflow: 'auto',
      padding: '8px',
      scrollbarGutter: 'stable'
    } as React.CSSProperties,
    empty: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: systemColors.text.secondary,
      fontSize: '14px'
    },
    footer: {
      padding: '16px',
      borderTop: `1px solid ${systemColors.border.light}`,
      background: systemColors.background.primary
    },
    total: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
      fontSize: '13px',
      fontWeight: '600',
      color: systemColors.text.primary
    },
    totalLabel: {
      color: systemColors.text.secondary,
      fontSize: '11px'
    },
    totalValue: {
      color: systemColors.text.primary,
      fontSize: '13px',
      fontWeight: '700'
    },
    checkoutButton: {
      ...systemStyles.button.primary,
      width: '100%',
      padding: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    checkoutButtonDisabled: {
      ...systemStyles.button.primary,
      width: '100%',
      padding: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'not-allowed',
      opacity: 0.5
    },
    itemWrapper: {
      position: 'relative' as const,
      marginBottom: 8
    },
    itemContainer: {
      padding: '8px',
      borderRadius: 6,
      transition: 'all 0.15s ease',
      cursor: 'pointer'
    },
    itemContainerHovered: {
      background: systemColors.selection.blue,
      padding: '8px'
    },
    itemRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '14px',
      color: systemColors.text.primary
    },
    itemQuantity: {
      fontWeight: '600'
    },
    itemPrice: {
      fontWeight: '600'
    },
    complementContainer: {
      marginLeft: 16,
      marginTop: 4
    },
    complementRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '13px',
      color: systemColors.text.secondary
    },
    separator: {
      height: 1,
      background: systemColors.border.light,
      margin: '8px 0'
    },
    clientInfoRow: {
      display: 'flex',
      gap: 8,
      marginBottom: 12
    },
    clientInput: {
      flex: 1,
      height: 32,
      padding: '6px 10px',
      fontSize: 13,
      color: systemColors.text.primary,
      background: systemColors.input.background,
      border: `1px solid ${systemColors.input.border}`,
      borderRadius: 6,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      outline: 'none',
      transition: 'all 0.15s ease',
      boxShadow: systemColors.text.primary === '#FFFFFF' 
        ? 'inset 0 1px 2px rgba(0, 0, 0, 0.2)'
        : 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
    },
    actionButtonsContainer: {
      display: 'flex',
      gap: 8,
      marginTop: 8,
      paddingTop: 8,
      borderTop: `1px solid rgba(255, 255, 255, 0.2)`
    },
    actionButton: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: '6px 8px',
      borderRadius: 4,
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      border: 'none'
    },
    editButton: {
      background: systemColors.selection.blueDark,
      color: '#FFFFFF'
    },
    editButtonHover: {
      background: '#0047AB'
    },
    deleteButton: {
      background: systemColors.selection.blueDark,
      color: '#FFFFFF'
    },
    deleteButtonHover: {
      background: '#DC2626'
    },
    editingBadge: {
      background: systemColors.selection.blue,
      color: '#FFFFFF',
      fontSize: '11px',
      fontWeight: '600',
      padding: '4px 8px',
      borderRadius: 4,
      marginBottom: 8,
      textAlign: 'center' as const
    },
    editingQuantityControls: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 8,
      paddingTop: 8,
      borderTop: `1px solid rgba(255, 255, 255, 0.2)`
    },
    editingQuantityButton: {
      width: 28,
      height: 28,
      borderRadius: 4,
      background: systemColors.background.primary,
      border: `1px solid ${systemColors.border.light}`,
      color: systemColors.text.primary,
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    editingQuantityButtonHover: {
      background: '#FFFFFF',
      borderColor: systemColors.selection.blue,
      color: systemColors.selection.blue
    },
    editingQuantityDisplay: {
      minWidth: 40,
      textAlign: 'center' as const,
      fontSize: '16px',
      fontWeight: '700',
      color: '#FFFFFF'
    }
  };

  const handleStartEdit = (item: CartItem) => {
    if (onStartEdit) {
      onStartEdit(item);
      playClickSound();
    }
  };

  const handleDeleteItem = (itemId: string) => {
    if (onDeleteItem) {
      onDeleteItem(itemId);
      playClickSound();
    }
  };

  const handleOpenTableModalInternal = () => {
    if (onOpenTableModal) {
      onOpenTableModal();
    }
    playClickSound();
  };

  const handleCloseTableModalInternal = () => {
    if (onCloseTableModal) {
      onCloseTableModal();
    }
    playClickSound();
  };

  const handleSelectTableInternal = (table: { id: string; number: number; status: 'free' | 'occupied' | 'reserved' }) => {
    if (onTableSelect) {
      onTableSelect(table);
    }
    playClickSound();
  };

  const renderCartItem = (item: CartItem, index: number) => {
    const isHovered = hoveredItemId === item.id && !editingItemId;
    const isEditing = editingItemId === item.id;
    
    return (
      <div key={item.id}>
        <div 
          style={styles.itemWrapper}
          onMouseEnter={() => !editingItemId && setHoveredItemId(item.id)}
          onMouseLeave={() => !editingItemId && setHoveredItemId(null)}
        >
          <div style={isHovered || isEditing ? { ...styles.itemContainer, ...styles.itemContainerHovered } : styles.itemContainer}>
            {/* Badge EDITANDO */}
            {isEditing && (
              <div style={styles.editingBadge}>EDITANDO</div>
            )}
            
            {/* Controles de quantidade quando editando */}
            {isEditing && (
              <div style={styles.editingQuantityControls}>
                <button
                  style={styles.editingQuantityButton}
                  onClick={() => {
                    if (item.quantity > 1 && onUpdateEditingItem) {
                      onUpdateEditingItem({ ...item, quantity: item.quantity - 1 });
                    }
                  }}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, styles.editingQuantityButtonHover);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = systemColors.background.primary;
                    e.currentTarget.style.borderColor = systemColors.border.light;
                    e.currentTarget.style.color = systemColors.text.primary;
                  }}
                >
                  -
                </button>
                <span style={styles.editingQuantityDisplay}>{item.quantity}</span>
                <button
                  style={styles.editingQuantityButton}
                  onClick={() => {
                    if (onUpdateEditingItem) {
                      onUpdateEditingItem({ ...item, quantity: item.quantity + 1 });
                    }
                  }}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, styles.editingQuantityButtonHover);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = systemColors.background.primary;
                    e.currentTarget.style.borderColor = systemColors.border.light;
                    e.currentTarget.style.color = systemColors.text.primary;
                  }}
                >
                  +
                </button>
              </div>
            )}
            
            {/* Produto principal */}
            <div style={styles.itemRow}>
              <span style={{ ...styles.itemQuantity, color: isHovered || isEditing ? '#FFFFFF' : systemColors.text.primary }}>
                {item.quantity}x {item.name}
              </span>
              <span style={{ ...styles.itemPrice, color: isHovered || isEditing ? '#FFFFFF' : systemColors.text.primary }}>
                {formatMoney(item.price * item.quantity)}
              </span>
            </div>

            {/* Complementos */}
            {item.complements && item.complements.length > 0 && (
              <div style={styles.complementContainer}>
                {item.complements.map((complement) => (
                  <div key={complement.id} style={{ ...styles.complementRow, color: isHovered || isEditing ? 'rgba(255, 255, 255, 0.8)' : systemColors.text.secondary }}>
                    <span>
                      {complement.quantity}x {complement.name}
                    </span>
                    <span>
                      {formatMoney(complement.price * complement.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Botões de ação quando editando produtos SEM complementos (salvar) */}
            {isEditing && !item.hasComplements && (
              <div style={styles.actionButtonsContainer}>
                <button
                  style={{ ...styles.actionButton, ...styles.editButton }}
                  onClick={() => {
                    if (onFinishEditing) {
                      onFinishEditing();
                    }
                  }}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, styles.editButtonHover);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = systemColors.selection.blueDark;
                  }}
                >
                  <AppIcons.Save size={14} />
                  Salvar
                </button>
              </div>
            )}

            {/* Botões de ação (só aparece quando hovered e não editando) */}
            {isHovered && !isEditing && (
              <div style={styles.actionButtonsContainer}>
                <button
                  style={{ ...styles.actionButton, ...styles.editButton }}
                  onClick={() => handleStartEdit(item)}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, styles.editButtonHover);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = systemColors.selection.blueDark;
                  }}
                >
                  <AppIcons.Edit size={14} />
                  Editar
                </button>
                <button
                  style={{ ...styles.actionButton, ...styles.deleteButton }}
                  onClick={() => handleDeleteItem(item.id)}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, styles.deleteButtonHover);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = systemColors.selection.blueDark;
                  }}
                >
                  <AppIcons.Delete size={14} />
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Separador entre itens (exceto no último) */}
        {index < items.length - 1 && !isHovered && !isEditing && <div style={styles.separator} />}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Itens Adicionados</h3>
      </div>

      <div style={styles.content}>
        {items.length === 0 ? (
          <div style={styles.empty}>
            Nenhum item adicionado
          </div>
        ) : (
          <div>
            {/* Títulos das colunas */}
            <div style={styles.itemRow}>
              <span style={{ fontWeight: '600', color: systemColors.text.secondary, fontSize: '13px' }}>
                Itens do pedido
              </span>
              <span style={{ fontWeight: '600', color: systemColors.text.secondary, fontSize: '13px' }}>
                Subtotal
              </span>
            </div>
            {/* Separador */}
            <div style={styles.separator} />
            {/* Lista de itens */}
            {items.map((item, index) => renderCartItem(item, index))}
          </div>
        )}
      </div>

      <div style={styles.footer}>
        {/* Subtotal */}
        <div style={styles.total}>
          <span style={styles.totalLabel}>Subtotal:</span>
          <span style={styles.totalValue}>{formatMoney(total)}</span>
        </div>

        {/* Entrega */}
        <div style={{ ...styles.total, marginBottom: 4 }}>
          <span style={styles.totalLabel}>Entrega:</span>
          <span style={{ fontSize: 11, color: systemColors.selection.blue, fontWeight: '600' }}>
            Grátis
          </span>
        </div>

        {/* Total */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 12,
          paddingTop: 4,
          borderTop: `1px solid ${systemColors.border.light}`
        }}>
          <span style={{ fontSize: 14, fontWeight: '600', color: systemColors.text.primary }}>
            Total:
          </span>
          <span style={{ fontSize: 16, fontWeight: '700', color: systemColors.text.primary }}>
            {formatMoney(total)}
          </span>
        </div>

        {/* Campos de cliente */}
        <div style={styles.clientInfoRow}>
          <input
            type="tel"
            placeholder="Telefone"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            style={styles.clientInput}
          />
          <input
            type="text"
            placeholder="Nome do cliente"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            style={styles.clientInput}
          />
        </div>

        {/* Botão de seleção de mesa (só aparece quando orderType é 'table') */}
        {orderType === 'table' && (
          <button
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: 12,
              borderRadius: 8,
              background: selectedTable ? systemColors.selection.blue : systemColors.input.background,
              color: selectedTable ? '#FFFFFF' : systemColors.text.primary,
              border: `1px solid ${selectedTable ? systemColors.selection.blueDark : systemColors.input.border}`,
              transition: 'all 0.15s ease'
            }}
            onClick={handleOpenTableModalInternal}
          >
            {selectedTable ? `Mesa ${selectedTable.number}` : 'Selecionar Mesa'}
          </button>
        )}

        <button 
          style={items.length === 0 ? styles.checkoutButtonDisabled : styles.checkoutButton} 
          onClick={onCheckout}
          disabled={items.length === 0}
        >
          Gerar Pedido
        </button>
      </div>

      {/* Modal de seleção de mesas */}
      <TableSelectionModal
        isOpen={isTableModalOpen}
        onClose={handleCloseTableModalInternal}
        onSelectTable={handleSelectTableInternal}
      />
    </div>
  );
}

