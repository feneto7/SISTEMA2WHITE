//--------------------------------------------------------------------
// MODAL DE FECHAMENTO DE CONTA
// Modal para fechar a conta de uma mesa, permitindo seleção de formas de pagamento
//--------------------------------------------------------------------
import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { AppIcons } from '../../../../../components/Icons/AppIcons';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { WindowHeader } from '../../../../../components/WindowHeader/WindowHeader';
import { Order, OrderItem } from './TableOrderDetails';
import { formatMoneyInput, formatCurrency } from '../../../../../utils/money';

export interface CloseAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tableNumber: number;
  orders: Order[];
  totalSubtotal: number;
  totalServiceFee: number;
  grandTotal: number;
}

type PaymentMethod = 'money' | 'card' | 'pix' | 'other';

interface Payment {
  id: string;
  method: PaymentMethod;
  amount: number;
  orderIds?: string[];
}

type DiscountSurchargeType = 'discount' | 'surcharge' | null;

interface DiscountSurcharge {
  type: 'discount' | 'surcharge';
  value: number;
  isPercentage: boolean;
}

export function CloseAccountModal({
  isOpen,
  onClose,
  onConfirm,
  tableNumber,
  orders,
  totalSubtotal,
  totalServiceFee,
  grandTotal
}: CloseAccountModalProps): JSX.Element | null {
  const { systemStyles, systemColors } = useTheme();
  const playClickSound = useClickSound();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [discountSurcharge, setDiscountSurcharge] = useState<DiscountSurcharge | null>(null);
  const [showDiscountSurchargeInput, setShowDiscountSurchargeInput] = useState<DiscountSurchargeType>(null);
  const [inputValue, setInputValue] = useState('');
  const [isPercentage, setIsPercentage] = useState(false);
  const [activePaymentButton, setActivePaymentButton] = useState<PaymentMethod | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>(orders.map(order => order.id));
  const [showPaymentInput, setShowPaymentInput] = useState<PaymentMethod | null>(null);
  const [paymentInputValue, setPaymentInputValue] = useState('');

  // Calcular valor dos pedidos selecionados
  const selectedOrdersTotal = useMemo(() => {
    const selectedOrdersData = orders.filter(order => selectedOrders.includes(order.id));
    const subtotal = selectedOrdersData.reduce((sum, order) => sum + order.subtotal, 0);
    const serviceFee = selectedOrdersData.reduce((sum, order) => sum + (order.serviceFee || 0), 0);
    const total = subtotal + serviceFee;
    return { subtotal, serviceFee, total };
  }, [orders, selectedOrders]);

  // Calcular valor com desconto/acréscimo
  const { finalSubtotal, finalServiceFee, finalTotal } = useMemo(() => {
    // Se há desconto/acréscimo, usa todos os pedidos (não pode calcular parcial)
    let baseTotal = discountSurcharge ? totalSubtotal : selectedOrdersTotal.subtotal;
    
    if (discountSurcharge) {
      if (discountSurcharge.isPercentage) {
        const discountAmount = (baseTotal * discountSurcharge.value) / 100;
        if (discountSurcharge.type === 'discount') {
          baseTotal -= discountAmount;
        } else {
          baseTotal += discountAmount;
        }
      } else {
        if (discountSurcharge.type === 'discount') {
          baseTotal -= discountSurcharge.value;
        } else {
          baseTotal += discountSurcharge.value;
        }
      }
    }
    
    const finalSubtotal = Math.max(0, baseTotal);
    const finalServiceFee = discountSurcharge ? (finalSubtotal * 10) / 100 : selectedOrdersTotal.serviceFee;
    const finalTotal = finalSubtotal + finalServiceFee;
    
    return { finalSubtotal, finalServiceFee, finalTotal };
  }, [discountSurcharge, totalSubtotal, selectedOrdersTotal]);

  // Remaining amount baseado nos pagamentos
  const remainingAmount = useMemo(() => {
    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    // Se não há pedidos selecionados, retorna um valor muito alto para desabilitar o botão
    if (selectedOrders.length === 0) {
      return 1;
    }
    return Math.max(0, finalTotal - totalPaid);
  }, [payments, finalTotal, selectedOrders.length]);

  useEffect(() => {
    if (isOpen) {
      setPayments([]);
      setDiscountSurcharge(null);
      setShowDiscountSurchargeInput(null);
      setInputValue('');
      setIsPercentage(false);
      setSelectedOrders(orders.map(order => order.id));
      setShowPaymentInput(null);
      setPaymentInputValue('');
    }
  }, [isOpen, orders]);

  const formatMoney = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleOpenPaymentInput = (method: PaymentMethod) => {
    playClickSound();
    setShowPaymentInput(method);
    setPaymentInputValue('');
  };

  const handleCancelPaymentInput = () => {
    playClickSound();
    setShowPaymentInput(null);
    setPaymentInputValue('');
  };

  const handleConfirmPayment = () => {
    playClickSound();
    // Converter valor formatado para número
    const numericValue = paymentInputValue.replace(/[^\d,]/g, '');
    const value = parseFloat(numericValue.replace(',', '.'));
    
    if (!isNaN(value) && value > 0) {
      // Verificar se o valor é maior que o restante (exceto para dinheiro que gera troco)
      if (showPaymentInput !== 'money' && value > remainingAmount) {
        // Para outras formas de pagamento, limitar ao valor restante
        const newPayment: Payment = {
          id: `payment-${Date.now()}`,
          method: showPaymentInput!,
          amount: remainingAmount,
          orderIds: discountSurcharge ? undefined : [...selectedOrders]
        };
        setPayments([...payments, newPayment]);
      } else {
        // Para dinheiro, permitir qualquer valor maior que zero
        const newPayment: Payment = {
          id: `payment-${Date.now()}`,
          method: showPaymentInput!,
          amount: value,
          orderIds: discountSurcharge ? undefined : [...selectedOrders]
        };
        setPayments([...payments, newPayment]);
      }
      
      setShowPaymentInput(null);
      setPaymentInputValue('');
      setActivePaymentButton(showPaymentInput!);
      setTimeout(() => setActivePaymentButton(null), 150);
    }
  };

  const handleRemovePayment = (paymentId: string) => {
    playClickSound();
    setPayments(payments.filter(p => p.id !== paymentId));
  };

  const handleOpenDiscountSurcharge = (type: 'discount' | 'surcharge') => {
    playClickSound();
    setShowDiscountSurchargeInput(type);
    setInputValue('');
    setIsPercentage(false);
  };

  const handleCancelDiscountSurcharge = () => {
    playClickSound();
    setShowDiscountSurchargeInput(null);
    setInputValue('');
    setIsPercentage(false);
  };

  const handleApplyDiscountSurcharge = () => {
    playClickSound();
    const value = parseFloat(inputValue.replace(/[^\d,]/g, '').replace(',', '.'));
    if (!isNaN(value) && value > 0) {
      setDiscountSurcharge({
        type: showDiscountSurchargeInput!,
        value,
        isPercentage
      });
      setShowDiscountSurchargeInput(null);
      setInputValue('');
      setIsPercentage(false);
    }
  };

  const handleRemoveDiscountSurcharge = () => {
    playClickSound();
    setDiscountSurcharge(null);
  };

  const handleConfirmClose = () => {
    playClickSound();
    if (remainingAmount === 0) {
      onConfirm();
      onClose();
    }
  };

  const formatMoneyInputLocal = (value: string): string => {
    if (isPercentage) {
      return value.replace(/[^\d]/g, '');
    }
    return formatCurrency(value);
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      ...systemStyles.modal.overlay
    },
    container: {
      ...systemStyles.modal.container,
      width: '90vw',
      maxWidth: '1200px',
      height: '85vh',
      maxHeight: '85vh'
    },
    content: {
      ...systemStyles.modal.content,
      display: 'flex',
      gap: '16px',
      padding: 0,
      overflow: 'hidden',
      flex: 1,
      minHeight: 0
    },
    ordersList: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      background: systemColors.background.content,
      padding: '16px'
    },
    ordersListTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: systemColors.text.primary,
      marginBottom: '12px'
    },
    ordersContainer: {
      flex: 1,
      overflowY: 'auto' as const,
      overflowX: 'hidden' as const
    },
    orderCard: {
      padding: '12px',
      background: systemColors.background.primary,
      borderRadius: 8,
      border: `1px solid ${systemColors.border.light}`,
      marginBottom: '12px',
      cursor: 'pointer',
      transition: 'background-color 0.15s ease'
    },
    orderCardSelected: {
      borderColor: systemColors.selection.blue,
      boxShadow: `0 0 0 1px ${systemColors.selection.blue}`
    },
    orderHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
      paddingBottom: '8px',
      borderBottom: `1px solid ${systemColors.border.light}`
    },
    orderHeaderContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flex: 1
    },
    orderCheckbox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    },
    orderNumber: {
      fontSize: '14px',
      fontWeight: '600',
      color: systemColors.text.primary
    },
    orderTime: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '12px',
      color: systemColors.text.secondary
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
    complementRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '2px 0',
      fontSize: '13px',
      color: systemColors.text.secondary,
      marginLeft: '20px'
    },
    paymentSidebar: {
      width: '400px',
      display: 'flex',
      flexDirection: 'column' as const,
      background: systemColors.background.primary,
      borderLeft: `1px solid ${systemColors.border.light}`,
      padding: '16px',
      overflow: 'hidden'
    },
    discountSurchargeButtons: {
      display: 'flex',
      gap: '8px',
      marginBottom: '12px',
      justifyContent: 'center'
    },
    discountSurchargeButton: {
      ...systemStyles.neumorphicButton.container,
      flex: 1,
      padding: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      borderRadius: 8
    },
    discountSurchargeButtonActive: {
      ...systemStyles.neumorphicButton.containerActive,
      flex: 1,
      padding: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      borderRadius: 8
    },
    discountSurchargeInputContainer: {
      padding: '12px',
      background: systemColors.background.content,
      borderRadius: 8,
      border: `1px solid ${systemColors.border.light}`,
      marginBottom: '12px'
    },
    discountSurchargeInputTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: systemColors.text.primary,
      marginBottom: '12px'
    },
    radioGroup: {
      display: 'flex',
      gap: '16px',
      marginBottom: '12px'
    },
    radioOption: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      cursor: 'pointer'
    },
    radioInput: {
      width: '16px',
      height: '16px',
      cursor: 'pointer'
    },
    radioLabel: {
      fontSize: '14px',
      color: systemColors.text.primary,
      cursor: 'pointer'
    },
    inputGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '12px'
    },
    inputLabel: {
      fontSize: '14px',
      color: systemColors.text.primary,
      minWidth: '120px'
    },
    valueInput: {
      flex: 1,
      padding: '8px 12px',
      fontSize: '14px',
      color: systemColors.text.primary,
      background: systemColors.input.background,
      border: `1px solid ${systemColors.input.border}`,
      borderRadius: 6,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      outline: 'none'
    },
    inputActions: {
      display: 'flex',
      gap: '8px',
      width: '100%'
    },
    totalsSection: {
      marginBottom: '0px'
    },
    discountSurchargeRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '4px 0',
      fontSize: '14px',
      color: systemColors.text.secondary
    },
    discountSurchargeLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flex: 1
    },
    discountSurchargeValue: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    removeDiscountButton: {
      background: 'transparent',
      border: 'none',
      color: systemColors.text.secondary,
      cursor: 'pointer',
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '20px',
      height: '20px'
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '4px 0',
      fontSize: '14px',
      color: systemColors.text.secondary
    },
    totalFinal: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      marginTop: '4px',
      borderTop: `1px solid ${systemColors.border.light}`,
      fontSize: '16px',
      fontWeight: '600',
      color: systemColors.text.primary
    },
    paymentMethodsTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: systemColors.text.primary,
      marginBottom: '8px',
      marginTop: 0
    },
    paymentMethodsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '8px',
      marginBottom: '12px'
    },
    paymentMethodButton: {
      ...systemStyles.neumorphicButton.container,
      padding: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    paymentMethodButtonPrimary: {
      ...systemStyles.neumorphicButton.containerActive,
      padding: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    paymentsList: {
      marginBottom: '16px'
    },
    paymentItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 12px',
      background: systemColors.background.content,
      borderRadius: 6,
      marginBottom: '8px',
      border: `1px solid ${systemColors.border.light}`
    },
    paymentMethodLabel: {
      fontSize: '14px',
      color: systemColors.text.primary,
      fontWeight: '500'
    },
    paymentAmount: {
      fontSize: '14px',
      fontWeight: '600',
      color: systemColors.text.primary
    },
    removePaymentButton: {
      background: 'transparent',
      border: 'none',
      color: systemColors.text.secondary,
      cursor: 'pointer',
      padding: '4px',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    scrollableContent: {
      flex: 1,
      overflowY: 'auto' as const,
      minHeight: 0,
      marginBottom: '12px'
    },
    paymentInputContainer: {
      padding: '12px',
      background: systemColors.background.content,
      borderRadius: 8,
      border: `1px solid ${systemColors.border.light}`,
      marginBottom: '12px'
    },
    footerSection: {
      padding: '12px',
      background: systemColors.background.content,
      borderRadius: 8,
      border: `1px solid ${systemColors.border.light}`,
      flexShrink: 0
    },
    remainingRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px'
    },
    remainingLabel: {
      fontSize: '12px',
      color: systemColors.text.secondary
    },
    remainingAmount: {
      fontSize: '18px',
      fontWeight: '600',
      color: remainingAmount > 0 ? '#FF5F57' : systemColors.text.primary
    },
    confirmButton: {
      ...systemStyles.button.primary,
      padding: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: remainingAmount === 0 ? 'pointer' : 'not-allowed',
      borderRadius: 8,
      width: '100%',
      opacity: remainingAmount === 0 ? 1 : 0.5
    }
  };

  const getPaymentMethodLabel = (method: PaymentMethod): string => {
    switch (method) {
      case 'money':
        return 'Dinheiro';
      case 'card':
        return 'Cartão';
      case 'pix':
        return 'PIX';
      case 'other':
        return 'Outro';
      default:
        return 'Outro';
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.container} onClick={(e) => e.stopPropagation()}>
        <WindowHeader
          title={`Fechar Conta - Mesa ${tableNumber}`}
          onClose={onClose}
        />

        <div style={styles.content}>
          {/* Lista de pedidos à esquerda */}
          <div style={styles.ordersList}>
            <h3 style={styles.ordersListTitle}>Pedidos da Mesa</h3>
            <div style={styles.ordersContainer}>
              {orders.map((order) => {
                const isSelected = selectedOrders.includes(order.id);
                const isDisabled = !!discountSurcharge;
                return (
                  <div 
                    key={order.id} 
                    style={{
                      ...styles.orderCard,
                      ...(isSelected && !isDisabled ? styles.orderCardSelected : {}),
                      opacity: isDisabled ? 0.6 : 1
                    }}
                    onClick={() => {
                      if (!isDisabled) {
                        playClickSound();
                        if (isSelected) {
                          setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                        } else {
                          setSelectedOrders([...selectedOrders, order.id]);
                        }
                      }
                    }}
                  >
                    <div style={styles.orderHeader}>
                      <div style={styles.orderHeaderContent}>
                        {!isDisabled && (
                          <div style={styles.orderCheckbox}>
                            {isSelected ? (
                              <AppIcons.Check size={16} color={systemColors.selection.blue} />
                            ) : (
                              <div style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '3px',
                                border: `1px solid ${systemColors.border.medium}`,
                                background: systemColors.background.content
                              }} />
                            )}
                          </div>
                        )}
                        <span style={styles.orderNumber}>Pedido #{order.number}</span>
                      </div>
                      <div style={styles.orderTime}>
                        <span>🕐</span>
                        <span>{order.time}</span>
                      </div>
                    </div>
                    {order.items.map((item) => (
                      <div key={item.id}>
                        <div style={styles.itemRow}>
                          <span style={styles.itemName}>
                            {item.quantity}x {item.name}
                          </span>
                          <span style={styles.itemPrice}>
                            {formatMoney(item.price * item.quantity)}
                          </span>
                        </div>
                        {item.complements && item.complements.length > 0 && (
                          <>
                            {item.complements.map((complement) => (
                              <div key={complement.id} style={styles.complementRow}>
                                <span>- {complement.name}</span>
                                <span>{formatMoney(complement.price * complement.quantity)}</span>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar de pagamento à direita */}
          <div style={styles.paymentSidebar}>
            {/* Botões de Desconto e Acréscimo */}
            <div style={styles.discountSurchargeButtons}>
              <button
                style={
                  showDiscountSurchargeInput === 'discount' || discountSurcharge?.type === 'discount'
                    ? styles.discountSurchargeButtonActive
                    : styles.discountSurchargeButton
                }
                onClick={() => handleOpenDiscountSurcharge('discount')}
              >
                Desconto
              </button>
              <button
                style={
                  showDiscountSurchargeInput === 'surcharge' || discountSurcharge?.type === 'surcharge'
                    ? styles.discountSurchargeButtonActive
                    : styles.discountSurchargeButton
                }
                onClick={() => handleOpenDiscountSurcharge('surcharge')}
              >
                Acréscimo
              </button>
            </div>

            {/* Campo de entrada de desconto/acréscimo */}
            {showDiscountSurchargeInput && (
              <div style={styles.discountSurchargeInputContainer}>
                <div style={styles.discountSurchargeInputTitle}>
                  {showDiscountSurchargeInput === 'discount' ? 'Desconto' : 'Acréscimo'}
                </div>
                <div style={styles.radioGroup}>
                  <label style={styles.radioOption}>
                    <input
                      type="radio"
                      checked={!isPercentage}
                      onChange={() => setIsPercentage(false)}
                      style={styles.radioInput}
                    />
                    <span style={styles.radioLabel}>Valor em R$</span>
                  </label>
                  <label style={styles.radioOption}>
                    <input
                      type="radio"
                      checked={isPercentage}
                      onChange={() => setIsPercentage(true)}
                      style={styles.radioInput}
                    />
                    <span style={styles.radioLabel}>Porcentagem</span>
                  </label>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>
                    Valor do {showDiscountSurchargeInput === 'discount' ? 'desconto' : 'acréscimo'}:
                  </label>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => {
                        const formatted = formatMoneyInputLocal(e.target.value);
                        setInputValue(formatted);
                      }}
                      placeholder={isPercentage ? '0' : 'R$ 0,00'}
                      style={styles.valueInput}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleApplyDiscountSurcharge();
                        }
                      }}
                    />
                    {!isPercentage && (
                      <span style={{ fontSize: '18px', color: systemColors.text.secondary }}>$</span>
                    )}
                  </div>
                </div>
                <div style={styles.inputActions}>
                  <button
                    style={{ ...styles.paymentMethodButton, flex: 1 }}
                    onClick={handleCancelDiscountSurcharge}
                  >
                    Cancelar
                  </button>
                  <button
                    style={{ ...styles.paymentMethodButtonPrimary, flex: 1 }}
                    onClick={handleApplyDiscountSurcharge}
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            )}

            {/* Totais */}
            <div style={styles.totalsSection}>
              <div style={styles.totalRow}>
                <span>Subtotal:</span>
                <span>{formatMoney(finalSubtotal)}</span>
              </div>
              {discountSurcharge && (
                <div style={styles.discountSurchargeRow}>
                  <div style={styles.discountSurchargeLabel}>
                    <span>
                      {discountSurcharge.type === 'discount' ? 'Desconto' : 'Acréscimo'}
                      {discountSurcharge.isPercentage
                        ? ` (${discountSurcharge.value}%)`
                        : ''}
                    </span>
                    <button
                      style={styles.removeDiscountButton}
                      onClick={handleRemoveDiscountSurcharge}
                      title="Remover"
                    >
                      <AppIcons.Delete size={16} color={systemColors.text.secondary} />
                    </button>
                  </div>
                  <div style={styles.discountSurchargeValue}>
                    <span style={{ color: discountSurcharge.type === 'discount' ? '#28CA42' : '#FF5F57' }}>
                      {discountSurcharge.type === 'discount' ? '-' : '+'}
                      {formatMoney(discountSurcharge.isPercentage 
                        ? (totalSubtotal * discountSurcharge.value) / 100
                        : discountSurcharge.value
                      )}
                    </span>
                  </div>
                </div>
              )}
              {finalServiceFee > 0 && (
                <div style={styles.totalRow}>
                  <span>Taxa de serviço (10%):</span>
                  <span>{formatMoney(finalServiceFee)}</span>
                </div>
              )}
              <div style={styles.totalFinal}>
                <span>Valor total:</span>
                <span>{formatMoney(finalTotal)}</span>
              </div>
            </div>

            {/* Conteúdo scrollável */}
            <div style={styles.scrollableContent}>
              {/* Formas de pagamento */}
              <div>
                <h3 style={styles.paymentMethodsTitle}>Formas de Pagamento</h3>
                <div style={styles.paymentMethodsGrid}>
                  <button
                    style={showPaymentInput === 'money' ? styles.paymentMethodButtonPrimary : styles.paymentMethodButton}
                    onClick={() => handleOpenPaymentInput('money')}
                    disabled={selectedOrders.length === 0 || remainingAmount <= 0}
                  >
                    $ Dinheiro
                  </button>
                  <button
                    style={showPaymentInput === 'card' ? styles.paymentMethodButtonPrimary : styles.paymentMethodButton}
                    onClick={() => handleOpenPaymentInput('card')}
                    disabled={selectedOrders.length === 0 || remainingAmount <= 0}
                  >
                    💳 Cartão
                  </button>
                  <button
                    style={showPaymentInput === 'pix' ? styles.paymentMethodButtonPrimary : styles.paymentMethodButton}
                    onClick={() => handleOpenPaymentInput('pix')}
                    disabled={selectedOrders.length === 0 || remainingAmount <= 0}
                  >
                    📱 PIX
                  </button>
                  <button
                    style={showPaymentInput === 'other' ? styles.paymentMethodButtonPrimary : styles.paymentMethodButton}
                    onClick={() => handleOpenPaymentInput('other')}
                    disabled={selectedOrders.length === 0 || remainingAmount <= 0}
                  >
                    ⚙️ Outro
                  </button>
                </div>
              </div>

              {/* Input para valor do pagamento */}
              {showPaymentInput && (
                <div style={styles.paymentInputContainer}>
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>
                      Valor do pagamento ({getPaymentMethodLabel(showPaymentInput)}):
                    </label>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="text"
                        value={paymentInputValue}
                        onChange={(e) => {
                          const formatted = formatMoneyInputLocal(e.target.value);
                          setPaymentInputValue(formatted);
                        }}
                        placeholder="R$ 0,00"
                        style={styles.valueInput}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleConfirmPayment();
                          }
                        }}
                        autoFocus
                      />
                    </div>
                  </div>
                  <div style={styles.inputActions}>
                    <button
                      style={{ ...styles.paymentMethodButton, flex: 1 }}
                      onClick={handleCancelPaymentInput}
                    >
                      Cancelar
                    </button>
                    <button
                      style={{ ...styles.paymentMethodButton, flex: 1 }}
                      onClick={handleConfirmPayment}
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              )}

              {/* Lista de pagamentos */}
              {payments.length > 0 && (
                <div style={styles.paymentsList}>
                  {payments.map((payment) => (
                    <div key={payment.id} style={styles.paymentItem}>
                      <div>
                        <div style={styles.paymentMethodLabel}>
                          {getPaymentMethodLabel(payment.method)}
                        </div>
                        <div style={styles.paymentAmount}>
                          {formatMoney(payment.amount)}
                        </div>
                      </div>
                      <button
                        style={styles.removePaymentButton}
                        onClick={() => handleRemovePayment(payment.id)}
                        title="Remover pagamento"
                      >
                        <AppIcons.Close size={16} color={systemColors.text.secondary} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Valor restante e Botão confirmar */}
            <div style={styles.footerSection}>
              <div style={styles.remainingRow}>
                <span style={styles.remainingLabel}>Falta:</span>
                <span style={styles.remainingAmount}>
                  {formatMoney(remainingAmount)}
                </span>
              </div>
              <button
                style={styles.confirmButton}
                onClick={handleConfirmClose}
                disabled={remainingAmount !== 0}
              >
                Fechar conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

