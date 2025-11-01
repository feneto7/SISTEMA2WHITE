//--------------------------------------------------------------------
// CARRINHO SIDEBAR
// Sidebar lateral para exibir itens adicionados ao carrinho e totais
// Componente reutilizável para PDV e operações de pedidos
//--------------------------------------------------------------------
import React from 'react';
import { useTheme } from '../../../../../styles/ThemeProvider';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface CartSidebarProps {
  items?: CartItem[];
  total?: number;
  onCheckout?: () => void;
}

export function CartSidebar({ items = [], total = 0, onCheckout }: CartSidebarProps): JSX.Element {
  const { systemStyles, systemColors } = useTheme();

  const formatMoney = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

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
      padding: '8px'
    },
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
      marginBottom: 12,
      fontSize: '18px',
      fontWeight: '600',
      color: systemColors.text.primary
    },
    totalLabel: {
      color: systemColors.text.secondary,
      fontSize: '14px'
    },
    totalValue: {
      color: systemColors.text.primary,
      fontSize: '20px',
      fontWeight: '700'
    },
    checkoutButton: {
      ...systemStyles.button.primary,
      width: '100%',
      padding: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer'
    }
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
            {/* Lista de itens será adicionada aqui */}
            {items.map((item) => (
              <div key={item.id}>
                {item.name} - {item.quantity}x - {formatMoney(item.price * item.quantity)}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <div style={styles.total}>
          <span style={styles.totalLabel}>Total:</span>
          <span style={styles.totalValue}>{formatMoney(total)}</span>
        </div>
        <button style={styles.checkoutButton} onClick={onCheckout}>
          Finalizar Pedido
        </button>
      </div>
    </div>
  );
}

