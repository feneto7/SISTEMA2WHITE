//--------------------------------------------------------------------
// COMPONENTE FOOTER PDV
// Footer com teclas de atalho para operações do PDV
// Usado na página de vendas (Sales)
//--------------------------------------------------------------------
import React from 'react';
import { useTheme } from '../../../styles/ThemeProvider';

export function SalesFooter(): JSX.Element {
  const { systemStyles, systemColors } = useTheme();
  const shortcuts = [
    { key: 'Ctrl+I', label: 'Informar Cliente' }
  ];

  const styles = {
    container: {
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap' as const,
      gap: '16px'
    },
    shortcut: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    key: {
      padding: '4px 8px',
      background: systemColors.button.gradient,
      border: `1px solid ${systemColors.button.defaultBorder}`,
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: '600',
      color: systemColors.text.primary,
      fontFamily: 'monospace',
      boxShadow: '0 0.5px 1px rgba(0, 0, 0, 0.04)',
      textTransform: 'uppercase' as const
    },
    label: {
      fontSize: '12px',
      color: systemColors.text.secondary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const,
      fontWeight: '500'
    },
    divider: {
      width: '1px',
      height: '20px',
      background: systemColors.border.divider
    }
  };

  return (
    <div style={styles.container}>
      {shortcuts.map((shortcut, index) => (
        <React.Fragment key={shortcut.key}>
          <div style={styles.shortcut}>
            <span style={styles.key}>{shortcut.key}</span>
            <span style={styles.label}>{shortcut.label}</span>
          </div>
          {index < shortcuts.length - 1 && <div style={styles.divider} />}
        </React.Fragment>
      ))}
    </div>
  );
}


