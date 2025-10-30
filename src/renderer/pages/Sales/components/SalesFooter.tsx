//--------------------------------------------------------------------
// COMPONENTE FOOTER PDV
// Footer com teclas de atalho para operações do PDV
// Usado na página de vendas (Sales)
//--------------------------------------------------------------------
import React from 'react';
import { useTheme } from '../../../styles/ThemeProvider';

export function SalesFooter(): JSX.Element {
  const { systemStyles, systemColors } = useTheme();

  // Atalhos do sistema
  const paymentKeys = [
    { key: 'F1', label: 'Dinheiro' },
    { key: 'F2', label: 'Débito' },
    { key: 'F3', label: 'Crédito' },
    { key: 'F4', label: 'PIX' },
    { key: 'F5', label: 'Carnê' }
  ];

  const legendKeys = [
    { key: 'Ctrl+I', label: 'Cliente' },
    { key: 'Ctrl+O', label: 'Desconto/Acréscimo' },
    { key: 'Delete', label: 'Limpar Pagamentos' },
    { key: 'Ctrl+F11', label: 'Tela Cheia' }
  ];

  const styles = {
    container: {
      padding: '2px 16px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '3px'
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      flexWrap: 'wrap' as const
    },
    paymentItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      fontWeight: 600 as const,
      color: systemColors.text.primary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    key: {
      fontSize: '11px',
      fontWeight: 700 as const,
      fontFamily: 'monospace',
      color: systemColors.text.secondary
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '11px',
      fontWeight: 600 as const,
      color: systemColors.text.secondary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    legendKey: {
      fontSize: '10px',
      fontWeight: 700 as const,
      fontFamily: 'monospace',
      color: systemColors.text.secondary
    }
  };

  return (
    <div style={styles.container}>
      {/* Linha de formas de pagamento */}
      <div style={styles.row}>
        {paymentKeys.map(item => (
          <div key={item.key} style={styles.paymentItem as React.CSSProperties}>
            <span>{item.label}</span>
            <span style={styles.key as React.CSSProperties}>{item.key}</span>
          </div>
        ))}
      </div>

      {/* Linha de legenda/atalhos da tela */}
      <div style={styles.row}>
        {legendKeys.map(item => (
          <div key={item.key} style={styles.legendItem as React.CSSProperties}>
            <span style={styles.legendKey as React.CSSProperties}>{item.key}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
