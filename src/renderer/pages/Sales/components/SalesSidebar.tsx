//--------------------------------------------------------------------
// COMPONENTE SIDEBAR PDV
// Sidebar lateral esquerdo que exibe totais da venda
// Usado na página de vendas (Sales)
//--------------------------------------------------------------------
import React from 'react';
import { useTheme } from '../../../styles/ThemeProvider';

interface PaymentEntry {
  method: string;
  amountCents: number;
}

interface SalesSidebarProps {
  subtotal: number;
  discount: number;
  total: number;
  itemsCount: number;
  payments?: PaymentEntry[];
  adjustment?: { label: string; valueCents: number };
}

export function SalesSidebar({ subtotal, discount, total, itemsCount, payments = [], adjustment }: SalesSidebarProps): JSX.Element {
  const { systemStyles, systemColors } = useTheme();
  // Formata valores para exibição em moeda brasileira
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100);
  };

  const styles = {
    container: {
      width: '380px',
      minHeight: '0',
      flex: '0 0 auto',
      background: systemColors.background.sidebar,
      borderRadius: '10px',
      border: `1px solid ${systemColors.border.light}`,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      alignSelf: 'stretch'
    },
    header: {
      padding: '24px 24px',
      textAlign: 'center' as const,
      background: systemColors.background.sidebar,
      borderBottom: `1px solid ${systemColors.border.light}`
    },
    logo: {
      fontSize: '28px',
      fontWeight: '700',
      color: systemColors.text.primary,
      margin: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      letterSpacing: '2px',
      textTransform: 'uppercase' as const
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'flex-start',
      padding: '16px 18px 12px 18px',
      gap: '16px',
      minHeight: 0,
      overflow: 'hidden' as const
    },
    section: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '24px'
    },
    paymentsList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '6px',
      marginTop: '2px'
    },
    paymentRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: systemColors.text.primary,
      background: 'transparent',
      border: `1px solid ${systemColors.border.light}`,
      borderRadius: '8px',
      padding: '6px 10px'
    },
    paymentName: {
      fontWeight: 600
    },
    paymentValue: {
      fontWeight: 700
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: systemColors.text.primary,
      margin: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textAlign: 'center' as const,
      textTransform: 'uppercase' as const,
      letterSpacing: '1px'
    },
    valueBox: {
      padding: '16px 16px',
      textAlign: 'center' as const
    },
    valueLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: systemColors.text.secondary,
      margin: '0 0 8px 0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const,
      letterSpacing: '1px'
    },
    value: {
      fontSize: '36px',
      fontWeight: '700',
      color: systemColors.text.primary,
      margin: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      letterSpacing: '-1px'
    },
    totalBox: {
      background: systemColors.selection.background,
      borderRadius: '10px',
      padding: '18px 16px',
      textAlign: 'center' as const,
      border: `1px solid ${systemColors.selection.border}`,
      boxShadow: '0 3px 10px rgba(0, 122, 255, 0.08)',
      marginTop: 'auto'
    },
    totalLabel: {
      fontSize: '16px',
      fontWeight: '600',
      color: systemColors.text.primary,
      margin: '0 0 12px 0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const,
      letterSpacing: '1.5px'
    },
    totalValue: {
      fontSize: '48px',
      fontWeight: '700',
      color: systemColors.selection.blue,
      margin: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      letterSpacing: '-2px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header com logo/nome */}
      <div style={styles.header}>
        <h1 style={styles.logo}>NETINOVE</h1>
      </div>

      {/* Conteúdo com totais */}
      <div style={styles.content}>
        {/* Subtotal (sem label "TOTAIS") */}
        <div style={styles.section}>
          <div style={styles.valueBox}>
            <p style={styles.valueLabel}>Subtotal:</p>
            <p style={styles.value}>{formatCurrency(subtotal)}</p>
          </div>
        </div>

        {/* Desconto / Acréscimo (abaixo do subtotal) */}
        {adjustment && adjustment.valueCents > 0 && (
          <div style={styles.section}>
            <div style={styles.paymentsList}>
              <div style={styles.paymentRow}>
                <span style={styles.paymentName as React.CSSProperties}>{adjustment.label}</span>
                <span style={styles.paymentValue as React.CSSProperties}>{formatCurrency(adjustment.valueCents)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Pagamentos lançados */}
        {payments.length > 0 && (
          <div style={styles.section}>
            <div>
              <p style={styles.valueLabel}>Pagamentos:</p>
              <div style={styles.paymentsList}>
                {payments.map((p) => (
                  <div key={p.method} style={styles.paymentRow}>
                    <span style={styles.paymentName as React.CSSProperties}>{p.method}</span>
                    <span style={styles.paymentValue as React.CSSProperties}>{formatCurrency(p.amountCents)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Total Final */}
        <div style={styles.totalBox}>
          <p style={styles.totalLabel}>Total:</p>
          <p style={styles.totalValue}>{formatCurrency(total)}</p>
        </div>
      </div>
    </div>
  );
}
