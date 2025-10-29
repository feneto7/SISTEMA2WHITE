//--------------------------------------------------------------------
// COMPONENTE SIDEBAR PDV
// Sidebar lateral esquerdo que exibe totais da venda
// Usado na página de vendas (Sales)
//--------------------------------------------------------------------
import React from 'react';
import { useTheme } from '../../../styles/ThemeProvider';

interface SalesSidebarProps {
  subtotal: number;
  discount: number;
  total: number;
  itemsCount: number;
}

export function SalesSidebar({ subtotal, discount, total, itemsCount }: SalesSidebarProps): JSX.Element {
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
      padding: '32px 24px',
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
      justifyContent: 'center',
      padding: '32px 28px',
      gap: '40px',
      minHeight: 0
    },
    section: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '24px'
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
      padding: '24px 20px',
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
      fontSize: '42px',
      fontWeight: '700',
      color: systemColors.text.primary,
      margin: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      letterSpacing: '-1px'
    },
    totalBox: {
      background: systemColors.selection.background,
      borderRadius: '12px',
      padding: '32px 20px',
      textAlign: 'center' as const,
      border: `1px solid ${systemColors.selection.border}`,
      boxShadow: '0 4px 12px rgba(0, 122, 255, 0.1)'
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
      fontSize: '56px',
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
        {/* Seção Totais */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Totais</h2>
          
          {/* Subtotal */}
          <div style={styles.valueBox}>
            <p style={styles.valueLabel}>Subtotal:</p>
            <p style={styles.value}>{formatCurrency(subtotal)}</p>
          </div>
        </div>

        {/* Total Final */}
        <div style={styles.totalBox}>
          <p style={styles.totalLabel}>Total:</p>
          <p style={styles.totalValue}>{formatCurrency(total)}</p>
        </div>
      </div>
    </div>
  );
}
