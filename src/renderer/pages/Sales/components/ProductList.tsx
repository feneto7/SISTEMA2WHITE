//--------------------------------------------------------------------
// COMPONENTE DE LISTA DE PRODUTOS
// Lista produtos adicionados à venda com fontes grandes
// Usado na página de vendas (Sales)
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { systemStyles, systemColors } from '../../../styles/systemStyle';

export interface SaleProduct {
  id: string;
  name: string;
  quantity: string;
  unitPrice: number; // em centavos
  subtotal: number; // em centavos
}

interface ProductListProps {
  products: SaleProduct[];
  onRemoveProduct: (id: string) => void;
}

export function ProductList({ products, onRemoveProduct }: ProductListProps): JSX.Element {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // Formata valores para exibição em moeda brasileira
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100);
  };

  const styles = {
    container: {
      ...systemStyles.list.container,
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const
    },
    header: {
      ...systemStyles.list.header,
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr',
      gap: '16px'
    },
    headerCell: {
      ...systemStyles.list.headerCell
    },
    content: {
      ...systemStyles.list.content,
      flex: 1,
      padding: '8px'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr',
      gap: '16px',
      padding: '16px 12px',
      borderRadius: '8px',
      transition: 'all 0.15s ease',
      cursor: 'pointer',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      alignItems: 'center',
      animation: 'fadeIn 0.3s ease forwards',
      opacity: 0
    },
    rowHover: {
      background: systemColors.control.hover,
      transform: 'translateX(4px)'
    },
    productName: {
      fontSize: '18px',
      fontWeight: '600',
      color: systemColors.text.primary,
      textTransform: 'uppercase' as const,
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    quantity: {
      fontSize: '18px',
      fontWeight: '500',
      color: systemColors.text.primary
    },
    price: {
      fontSize: '18px',
      fontWeight: '500',
      color: systemColors.text.primary
    },
    subtotal: {
      fontSize: '20px',
      fontWeight: '700',
      color: systemColors.selection.blue
    },
    removeButton: {
      width: '32px',
      height: '32px',
      borderRadius: '6px',
      border: '1px solid rgba(255, 59, 48, 0.3)',
      background: 'linear-gradient(to bottom, #FF6B6B, #FF3B30)',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    removeButtonHover: {
      background: 'linear-gradient(to bottom, #FF8080, #FF4D40)',
      boxShadow: '0 2px 4px rgba(255, 59, 48, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
      transform: 'translateY(-1px)'
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: '12px',
      padding: '40px'
    },
    emptyText: {
      fontSize: '18px',
      fontWeight: '600',
      color: systemColors.text.secondary,
      margin: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const
    },
    emptySubtext: {
      fontSize: '14px',
      color: systemColors.text.tertiary,
      margin: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const
    }
  };

  if (products.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>Nenhum produto adicionado</p>
          <p style={styles.emptySubtext}>Adicione produtos para iniciar a venda</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerCell}>Produto</div>
        <div style={styles.headerCell}>Quantidade</div>
        <div style={styles.headerCell}>Preço Unit.</div>
        <div style={styles.headerCell}>Subtotal</div>
      </div>

      <div style={styles.content}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              ...styles.row,
              ...(hoveredRow === product.id ? styles.rowHover : {})
            }}
            onMouseEnter={() => setHoveredRow(product.id)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            <div style={styles.productName}>{product.name}</div>
            <div style={styles.quantity}>{product.quantity}</div>
            <div style={styles.price}>{formatCurrency(product.unitPrice)}</div>
            <div style={styles.subtotal}>{formatCurrency(product.subtotal)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


