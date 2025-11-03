//--------------------------------------------------------------------
// DETALHES DE PEDIDOS DA MESA
// Componente de detalhes lateral direito mostrando informações da mesa selecionada
// Usado na visualização de mesas com pedidos abertos
//--------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { AppIcons } from '../../../../../components/Icons/AppIcons';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { CloseAccountModal } from './CloseAccountModal';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  complements?: OrderComplement[];
}

export interface OrderComplement {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  number: number;
  time: string;
  source: string;
  items: OrderItem[];
  subtotal: number;
  serviceFee?: number;
  total: number;
  isDelivered?: boolean;
}

export interface TableOrderDetailsProps {
  tableNumber: number;
  tableTotal: number;
  orders: Order[];
  clientName?: string;
  onNewOrder?: () => void;
  onCloseAccount?: () => void;
  onMarkDelivered?: (orderId: string) => void;
}

export function TableOrderDetails({
  tableNumber,
  tableTotal,
  orders,
  clientName,
  onNewOrder,
  onCloseAccount,
  onMarkDelivered
}: TableOrderDetailsProps): JSX.Element {
  const { systemStyles, systemColors } = useTheme();
  const playClickSound = useClickSound();
  const [isCloseAccountModalOpen, setIsCloseAccountModalOpen] = useState(false);
  const [showPrintDropdown, setShowPrintDropdown] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [openOrderActionsDropdown, setOpenOrderActionsDropdown] = useState<string | null>(null);

  const formatMoney = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const styles = {
    container: {
      background: systemColors.background.content,
      border: `1px solid ${systemColors.border.light}`,
      borderRadius: '10px',
      overflow: 'hidden' as const,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column' as const,
      flex: 1,
      minHeight: 0,
      height: '100%'
    },
    header: {
      ...systemStyles.list.header,
      padding: '12px 16px',
      flexShrink: 0
    },
    headerTop: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flex: 1
    },
    tableTitle: {
      ...systemStyles.page.title,
      margin: 0,
      fontSize: '16px'
    },
    tableTotal: {
      fontSize: '13px',
      color: systemColors.text.secondary,
      fontWeight: '600'
    },
    headerActions: {
      display: 'flex',
      gap: '6px',
      alignItems: 'center'
    },
    actionButton: {
      ...systemStyles.button.default,
      padding: '6px 10px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      borderRadius: 6
    },
    primaryActionButton: {
      ...systemStyles.button.primary,
      padding: '6px 10px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      borderRadius: 6
    },
    content: {
      ...systemStyles.list.content,
      flex: 1,
      overflow: 'auto' as const
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      textAlign: 'center' as const
    },
    emptyStateIcon: {
      fontSize: '48px',
      color: systemColors.text.tertiary,
      marginBottom: '16px'
    },
    emptyStateTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: systemColors.text.primary,
      marginBottom: '8px'
    },
    emptyStateText: {
      fontSize: '14px',
      color: systemColors.text.secondary
    },
    clientInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 10px',
      background: systemColors.background.primary,
      borderRadius: 6,
      marginBottom: '12px',
      border: `1px solid ${systemColors.border.light}`
    },
    clientText: {
      fontSize: '13px',
      color: systemColors.text.secondary
    },
    orderCard: {
      padding: '12px',
      background: systemColors.background.primary,
      borderRadius: 8,
      border: `1px solid ${systemColors.border.light}`,
      marginBottom: '12px'
    },
    orderHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
      paddingBottom: '8px',
      borderBottom: `1px solid ${systemColors.border.light}`
    },
    orderNumber: {
      fontSize: '14px',
      fontWeight: '600',
      color: systemColors.text.primary
    },
    orderMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    orderMetaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '12px',
      color: systemColors.text.secondary
    },
    orderActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    itemRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '4px 0',
      fontSize: '14px',
      color: systemColors.text.primary
    },
    itemName: {
      flex: 1
    },
    itemPrice: {
      fontWeight: '600'
    },
    complementSection: {
      marginLeft: '20px',
      marginTop: '4px'
    },
    complementTitle: {
      fontSize: '12px',
      fontWeight: '600',
      color: systemColors.text.secondary,
      marginBottom: '4px'
    },
    complementRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '2px 0',
      fontSize: '13px',
      color: systemColors.text.secondary,
      marginLeft: '20px'
    },
    summary: {
      padding: '16px',
      background: systemColors.background.primary,
      borderRadius: 8,
      border: `1px solid ${systemColors.border.light}`,
      marginTop: '16px'
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '6px 0',
      fontSize: '14px'
    },
    summaryTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      marginTop: '8px',
      borderTop: `1px solid ${systemColors.border.light}`,
      fontSize: '16px',
      fontWeight: '600',
      color: systemColors.text.primary
    },
    footer: {
      padding: '12px 16px',
      borderTop: `1px solid ${systemColors.border.light}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '20px',
      flexShrink: 0,
      background: systemColors.background.primary,
      width: '100%',
      boxSizing: 'border-box' as const,
      marginTop: 'auto'
    },
    footerTotals: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
      flex: 1
    },
    footerTotalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '14px',
      color: systemColors.text.secondary
    },
    footerTotalLabel: {
      color: systemColors.text.secondary
    },
    footerTotalValue: {
      fontWeight: '600',
      color: systemColors.text.primary
    },
    footerTotalFinal: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '16px',
      fontWeight: '600',
      color: systemColors.text.primary,
      marginTop: '4px',
      paddingTop: '4px',
      borderTop: `1px solid ${systemColors.border.light}`
    },
    footerButtons: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
      minWidth: '180px'
    },
    footerButton: {
      ...systemStyles.button.default,
      padding: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      borderRadius: 8,
      width: '100%'
    },
    footerPrimaryButton: {
      ...systemStyles.button.primary,
      padding: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      borderRadius: 8,
      width: '100%'
    },
    printButtonContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      position: 'relative' as const
    },
    printMainButton: {
      ...systemStyles.button.primary,
      padding: '6px 10px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      borderRadius: '6px 0 0 6px',
      borderRight: 'none'
    },
    printDropdownButton: {
      ...systemStyles.button.primary,
      padding: '6px 4px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '0 6px 6px 0',
      borderLeft: `1px solid ${systemColors.selection.blueDark}`,
      minWidth: '24px'
    },
    actionsButton: {
      ...systemStyles.button.default,
      padding: '6px 10px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      borderRadius: 6,
      position: 'relative' as const
    },
    dropdown: {
      position: 'absolute' as const,
      top: '100%',
      right: 0,
      marginTop: '4px',
      background: systemColors.background.content,
      border: `1px solid ${systemColors.border.light}`,
      borderRadius: 6,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 1000,
      minWidth: '200px',
      overflow: 'hidden'
    },
    printDropdown: {
      position: 'absolute' as const,
      top: '100%',
      left: 0,
      right: 0,
      marginTop: '4px',
      background: systemColors.background.content,
      border: `1px solid ${systemColors.border.light}`,
      borderRadius: 6,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 1000,
      width: '100%',
      minWidth: 0,
      overflow: 'hidden'
    },
    dropdownItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 12px',
      fontSize: '13px',
      color: systemColors.text.primary,
      cursor: 'pointer',
      transition: 'background 0.15s ease',
      background: 'transparent'
    },
    dropdownItemHover: {
      background: systemColors.selection.blue
    }
  };

  // Calcular total geral
  const totalServiceFee = orders.reduce((sum, order) => sum + (order.serviceFee || 0), 0);
  const totalSubtotal = orders.reduce((sum, order) => sum + order.subtotal, 0);
  const grandTotal = totalSubtotal + totalServiceFee;

  const handleOpenCloseAccountModal = () => {
    playClickSound();
    setIsCloseAccountModalOpen(true);
  };

  const handleCloseCloseAccountModal = () => {
    playClickSound();
    setIsCloseAccountModalOpen(false);
  };

  const handleConfirmCloseAccount = () => {
    playClickSound();
    if (onCloseAccount) {
      onCloseAccount();
    }
    setIsCloseAccountModalOpen(false);
  };

  const handlePrintOrders = () => {
    playClickSound();
    setShowPrintDropdown(false);
    // TODO: Implementar impressão de pedidos
    console.log('Imprimir pedidos');
  };

  const handlePrintValues = () => {
    playClickSound();
    setShowPrintDropdown(false);
    // TODO: Implementar impressão de valores
    console.log('Imprimir valores');
  };

  const handleTransferBetweenTables = () => {
    playClickSound();
    setShowActionsDropdown(false);
    // TODO: Implementar transferência entre mesas
    console.log('Transferir entre mesas');
  };

  const handlePrintOrder = (orderId: string) => {
    playClickSound();
    setOpenOrderActionsDropdown(null);
    // TODO: Implementar impressão do pedido
    console.log('Imprimir pedido:', orderId);
  };

  const handleEditOrder = (orderId: string) => {
    playClickSound();
    setOpenOrderActionsDropdown(null);
    // TODO: Implementar edição do pedido
    console.log('Editar pedido:', orderId);
  };

  const handleViewOrderDetails = (orderId: string) => {
    playClickSound();
    setOpenOrderActionsDropdown(null);
    // TODO: Implementar visualização de detalhes do pedido
    console.log('Ver detalhes do pedido:', orderId);
  };

  const handleDeleteOrder = (orderId: string) => {
    playClickSound();
    setOpenOrderActionsDropdown(null);
    // TODO: Implementar exclusão do pedido
    console.log('Excluir pedido:', orderId);
  };

  // Fechar dropdowns quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showPrintDropdown && !target.closest('[data-print-dropdown]')) {
        setShowPrintDropdown(false);
      }
      if (showActionsDropdown && !target.closest('[data-actions-dropdown]')) {
        setShowActionsDropdown(false);
      }
      if (openOrderActionsDropdown && !target.closest(`[data-order-actions-dropdown="${openOrderActionsDropdown}"]`)) {
        setOpenOrderActionsDropdown(null);
      }
    };

    if (showPrintDropdown || showActionsDropdown || openOrderActionsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showPrintDropdown, showActionsDropdown, openOrderActionsDropdown]);

  if (orders.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerTop}>
            <h2 style={styles.tableTitle}>Mesa {tableNumber}</h2>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <span style={styles.tableTotal}>Total da mesa: {formatMoney(tableTotal)}</span>
            <div style={styles.headerActions}>
              <button
                style={styles.primaryActionButton}
                onClick={() => {
                  playClickSound();
                  // TODO: Implementar impressão de conferência
                }}
              >
                Imprimir conferência
                <span>▼</span>
              </button>
              <button
                style={styles.actionButton}
                onClick={() => {
                  playClickSound();
                  // TODO: Implementar menu de ações
                }}
              >
                Ações
                <span>▼</span>
              </button>
            </div>
          </div>
        </div>
        <div style={styles.content}>
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>👤</div>
            <div style={styles.emptyStateTitle}>Selecione uma mesa ao lado.</div>
            <div style={styles.emptyStateText}>A visualização da mesa irá aparecer aqui!</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <h2 style={styles.tableTitle}>Mesa {tableNumber}</h2>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <span style={styles.tableTotal}>Total da mesa: {formatMoney(tableTotal)}</span>
          <div style={styles.headerActions}>
            {/* Botão Imprimir conferência com dropdown */}
            <div style={styles.printButtonContainer} data-print-dropdown>
              <button
                style={styles.printMainButton}
                onClick={() => {
                  playClickSound();
                  // TODO: Implementar impressão de conferência direta
                  console.log('Imprimir conferência');
                }}
              >
                Imprimir conferência
              </button>
              <button
                style={styles.printDropdownButton}
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound();
                  setShowPrintDropdown(!showPrintDropdown);
                  setShowActionsDropdown(false);
                }}
              >
                ▼
              </button>
              {showPrintDropdown && (
                <div style={styles.printDropdown}>
                  <div
                    style={styles.dropdownItem}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = systemColors.selection.blue;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                    onClick={handlePrintOrders}
                  >
                    <AppIcons.ChefHat size={16} color={systemColors.text.primary} />
                    <span>Imprimir pedidos</span>
                  </div>
                  <div
                    style={styles.dropdownItem}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = systemColors.selection.blue;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                    onClick={handlePrintValues}
                  >
                    <AppIcons.Dollar size={16} color={systemColors.text.primary} />
                    <span>Imprimir valores</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Botão Ações com dropdown */}
            <div style={{ position: 'relative' as const }} data-actions-dropdown>
              <button
                style={{
                  ...styles.actionButton,
                  ...(showActionsDropdown ? { background: systemColors.selection.blueLight } : {})
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound();
                  setShowActionsDropdown(!showActionsDropdown);
                  setShowPrintDropdown(false);
                }}
              >
                Ações
                <span>{showActionsDropdown ? '▲' : '▼'}</span>
              </button>
              {showActionsDropdown && (
                <div style={styles.dropdown}>
                  <div
                    style={styles.dropdownItem}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = systemColors.selection.blue;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                    onClick={handleTransferBetweenTables}
                  >
                    <AppIcons.Transfer size={16} color={systemColors.text.primary} />
                    <span>Transferir entre mesas</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
          {/* Informações do cliente */}
          {clientName && (
            <div style={styles.clientInfo}>
              <AppIcons.User size={16} color={systemColors.text.secondary} />
              <span style={styles.clientText}>{clientName}</span>
            </div>
          )}
          {!clientName && (
            <div style={styles.clientInfo}>
              <AppIcons.User size={16} color={systemColors.text.secondary} />
              <span style={styles.clientText}>Cliente não identificado</span>
            </div>
          )}

          {/* Lista de pedidos */}
          {orders.map((order) => (
          <div key={order.id} style={styles.orderCard}>
            {/* Header do pedido */}
            <div style={styles.orderHeader}>
              <span style={styles.orderNumber}>Pedido #{order.number}</span>
              <div style={styles.orderActions}>
                <div style={styles.orderMetaItem}>
                  <span>🕐</span>
                  <span>{order.time}</span>
                </div>
                <div style={{ position: 'relative' as const }} data-order-actions-dropdown={order.id}>
                  <button
                    style={{
                      ...styles.actionButton,
                      ...(openOrderActionsDropdown === order.id ? { background: systemColors.selection.blueLight } : {})
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      playClickSound();
                      setOpenOrderActionsDropdown(openOrderActionsDropdown === order.id ? null : order.id);
                      setShowPrintDropdown(false);
                      setShowActionsDropdown(false);
                    }}
                  >
                    Ações
                    <span>{openOrderActionsDropdown === order.id ? '▲' : '▼'}</span>
                  </button>
                  {openOrderActionsDropdown === order.id && (
                    <div style={styles.dropdown}>
                      <div
                        style={styles.dropdownItem}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = systemColors.selection.blue;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                        onClick={() => handlePrintOrder(order.id)}
                      >
                        <AppIcons.Print size={16} color={systemColors.text.primary} />
                        <span>Imprimir</span>
                      </div>
                      <div
                        style={styles.dropdownItem}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = systemColors.selection.blue;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                        onClick={() => handleEditOrder(order.id)}
                      >
                        <AppIcons.Edit size={16} color={systemColors.text.primary} />
                        <span>Editar</span>
                      </div>
                      <div
                        style={styles.dropdownItem}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = systemColors.selection.blue;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                        onClick={() => handleViewOrderDetails(order.id)}
                      >
                        <AppIcons.Document size={16} color={systemColors.text.primary} />
                        <span>Ver detalhes</span>
                      </div>
                      <div
                        style={styles.dropdownItem}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = systemColors.selection.blue;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        <AppIcons.Delete size={16} color={systemColors.text.primary} />
                        <span>Excluir</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Itens do pedido */}
            {order.items.map((item) => (
              <div key={item.id}>
                <div style={styles.itemRow}>
                  <span style={styles.itemName}>
                    {item.quantity}x {item.name}
                  </span>
                  <span style={styles.itemPrice}>{formatMoney(item.price * item.quantity)}</span>
                </div>
                
                {/* Complementos */}
                {item.complements && item.complements.length > 0 && (
                  <div style={styles.complementSection}>
                    {item.complements.map((complement) => (
                      <div key={complement.id} style={styles.complementRow}>
                        <span>- {complement.name}</span>
                        <span>{formatMoney(complement.price * complement.quantity)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Checkbox de entregue */}
            <div 
              style={systemStyles.checkbox.container}
              onClick={() => {
                playClickSound();
                if (onMarkDelivered) {
                  onMarkDelivered(order.id);
                }
              }}
            >
              <div style={{
                ...systemStyles.checkbox.box,
                ...(order.isDelivered ? systemStyles.checkbox.boxChecked : {})
              }}>
                {order.isDelivered && <AppIcons.Check size={10} color="#FFFFFF" />}
              </div>
              <span style={systemStyles.checkbox.label}>
                Marcar como entregue
              </span>
            </div>

          </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        {/* Totais à esquerda */}
        <div style={styles.footerTotals}>
          <div style={styles.footerTotalRow}>
            <span style={styles.footerTotalLabel}>Subtotal:</span>
            <span style={styles.footerTotalValue}>{formatMoney(totalSubtotal)}</span>
          </div>
          {totalServiceFee > 0 && (
            <div style={styles.footerTotalRow}>
              <span style={styles.footerTotalLabel}>Taxa de serviço (10%):</span>
              <span style={styles.footerTotalValue}>{formatMoney(totalServiceFee)}</span>
            </div>
          )}
          <div style={styles.footerTotalFinal}>
            <span>Valor total:</span>
            <span>{formatMoney(grandTotal)}</span>
          </div>
        </div>

        {/* Botões à direita (empilhados) */}
        <div style={styles.footerButtons}>
          <button
            style={styles.footerButton}
            onClick={handleOpenCloseAccountModal}
          >
            Fechar conta
          </button>
          <button
            style={styles.footerPrimaryButton}
            onClick={() => {
              playClickSound();
              if (onNewOrder) {
                onNewOrder();
              }
            }}
          >
            Novo pedido
          </button>
        </div>
      </div>

      {/* Modal de fechamento de conta */}
      <CloseAccountModal
        isOpen={isCloseAccountModalOpen}
        onClose={handleCloseCloseAccountModal}
        onConfirm={handleConfirmCloseAccount}
        tableNumber={tableNumber}
        orders={orders}
        totalSubtotal={totalSubtotal}
        totalServiceFee={totalServiceFee}
        grandTotal={grandTotal}
      />
    </div>
  );
}

