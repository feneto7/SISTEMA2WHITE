//--------------------------------------------------------------------
// MODAL DE FINALIZAÇÃO DE VENDA
// Modal de resumo e confirmação da venda antes de finalizar
// Abre quando o pagamento é igual ou maior que o total da venda
//--------------------------------------------------------------------

import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../../styles/ThemeProvider';
import { WindowHeader } from '../../../components/WindowHeader/WindowHeader';
import { convertCentsToReais } from '../../../utils/money';

interface PaymentEntry {
  method: string;
  amountCents: number;
}

interface FinishSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinish: () => void;
  totalSaleCents: number;
  payments: PaymentEntry[];
}

export function FinishSaleModal({ isOpen, onClose, onFinish, totalSaleCents, payments }: FinishSaleModalProps): JSX.Element | null {
  const { systemStyles, systemColors } = useTheme();
  const finishButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    // Foca diretamente no botão "Finalizar Venda" para permitir Enter imediato
    const t = setTimeout(() => {
      finishButtonRef.current?.focus();
    }, 0);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onFinish();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onFinish, onClose]);

  if (!isOpen) return null;

  const totalPaid = payments.reduce((sum, p) => sum + p.amountCents, 0);
  const change = Math.max(totalPaid - totalSaleCents, 0);

  const formatCurrency = (cents: number): string => {
      return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100);
  };

  const styles = {
    modal: {
      ...systemStyles.modal.container,
      width: '720px',
      height: 'auto',
      maxHeight: 'unset',
      border: `1px solid ${systemColors.border.light}`,
      outline: 'none'
    },
    content: {
      padding: '20px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px'
    },
    section: {
      background: systemColors.background.primary,
      border: `1px solid ${systemColors.border.light}`,
      borderRadius: '10px',
      padding: '14px 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    sectionLabel: {
      fontSize: '13px',
      fontWeight: 700,
      color: systemColors.text.primary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    sectionValue: {
      fontSize: '64px',
      fontWeight: 700,
      color: systemColors.text.primary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    paymentHeader: {
      fontSize: '11px',
      fontWeight: 700,
      color: systemColors.text.secondary,
      textTransform: 'uppercase' as const,
      marginBottom: '8px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    paymentItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '14px',
      fontWeight: 600,
      color: systemColors.text.primary,
      padding: '6px 0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    paymentItemValue: {
      fontSize: '44px',
      fontWeight: 700,
      color: systemColors.text.primary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    changeBox: {
      background: systemColors.background.primary,
      border: `2px solid ${systemColors.selection.border}`,
      borderRadius: '10px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '8px'
    },
    changeLabel: {
      fontSize: '11px',
      fontWeight: 700,
      color: systemColors.text.primary,
      textTransform: 'uppercase' as const,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    changeValue: {
      fontSize: '80px',
      fontWeight: 700,
      color: systemColors.selection.blue,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    instructions: {
      fontSize: '11px',
      color: systemColors.text.secondary,
      textAlign: 'center' as const,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '10px',
      paddingTop: '8px'
    },
    button: {
      padding: '10px 16px',
      borderRadius: '10px',
      border: `1px solid ${systemColors.border.light}`,
      background: systemColors.background.primary,
      color: systemColors.text.primary,
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    buttonPrimary: {
      background: systemColors.selection.background,
      color: systemColors.selection.blue,
      border: `1px solid ${systemColors.selection.border}`
    }
  };

  return (
    <div style={systemStyles.modal.overlay}>
      <div style={styles.modal}>
        <WindowHeader title="Finalizar Venda" onClose={onClose} />

        {/* Conteúdo */}
        <div style={styles.content}>
          {/* Total da Venda */}
          <div style={styles.section}>
            <span style={styles.sectionLabel}>Total da Venda:</span>
            <span style={styles.sectionValue}>{formatCurrency(totalSaleCents)}</span>
          </div>

          {/* Formas de Pagamento */}
          <div>
            <div style={styles.paymentHeader}>Formas de Pagamento</div>
            {payments.map((p) => (
              <div key={p.method} style={styles.paymentItem}>
                <span>{p.method}</span>
                <span style={styles.paymentItemValue as React.CSSProperties}>{formatCurrency(p.amountCents)}</span>
              </div>
            ))}
            <div style={{ ...styles.paymentItem, marginTop: '4px', paddingTop: '8px', borderTop: `1px solid ${systemColors.border.light}` }}>
              <span style={{ fontWeight: 700 }}>Total Pago:</span>
              <span style={styles.sectionValue as React.CSSProperties}>{formatCurrency(totalPaid)}</span>
            </div>
          </div>

          {/* Troco (se houver) */}
          {change > 0 && (
            <div style={styles.changeBox}>
              <span style={styles.changeLabel}>Troco</span>
              <span style={styles.changeValue}>{formatCurrency(change)}</span>
            </div>
          )}

          {/* Instruções */}
          <div style={styles.instructions}>
            Pressione Enter para confirmar ou ESC para voltar
          </div>

          {/* Botões */}
          <div style={styles.footer}>
            <button 
              style={styles.button as React.CSSProperties} 
              onClick={onClose}
            >
              ✕ Voltar
            </button>
            <button
              style={{ ...(styles.button as React.CSSProperties), ...(styles.buttonPrimary as React.CSSProperties) }}
              onClick={onFinish}
              ref={finishButtonRef}
            >
              ✓ Finalizar Venda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

