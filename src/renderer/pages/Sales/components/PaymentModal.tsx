//--------------------------------------------------------------------
// MODAL DE PAGAMENTO DA VENDA
// Modal compacto para informar o valor do pagamento por forma escolhida
// Utilizado na página de Vendas (PDV) quando usuário pressiona F1..F5
//--------------------------------------------------------------------

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../../styles/ThemeProvider';
import { WindowHeader } from '../../../components/WindowHeader/WindowHeader';
import { convertCentsToReais, formatMoneyInput, convertReaisToCents } from '../../../utils/money';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  methodLabel: string;
  totalCents: number;
  onConfirm: (paidCents: number) => void;
  allowOverpayment?: boolean; // Apenas Dinheiro permite valor maior que o total
}

export function PaymentModal({ isOpen, onClose, methodLabel, totalCents, onConfirm, allowOverpayment = false }: PaymentModalProps): JSX.Element | null {
  const { systemStyles, systemColors } = useTheme();
  const [value, setValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setValue(convertCentsToReais(totalCents));
      // Aguarda renderizar para selecionar todo o conteúdo do input
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      });
      // Reforço: após um tick adicional garante seleção visível
      const timeout = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, totalCents]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const cents = convertReaisToCents(value || '0');
    
    // Validação: apenas Dinheiro pode exceder o total restante
    if (!allowOverpayment && cents > totalCents) {
      // Limita ao valor restante se não permitir overpayment
      onConfirm(totalCents);
    } else {
      // Caso contrário, usa o valor informado (inclui Dinheiro com troco)
      onConfirm(cents);
    }
    
    onClose();
  };

  const styles = {
    modal: {
      ...systemStyles.modal.container,
      width: '560px',
      height: 'auto',
      maxHeight: 'unset',
    },
    content: {
      padding: '16px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px'
    },
    label: {
      fontSize: '16px',
      color: systemColors.text.secondary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    input: {
      width: '100%',
      padding: '20px 22px',
      borderRadius: '8px',
      border: `1px solid ${systemColors.border.light}`,
      background: systemColors.background.primary,
      color: systemColors.text.primary,
      fontSize: '56px',
      fontWeight: 800,
      lineHeight: 1.1,
      outline: 'none',
      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '8px',
      paddingTop: '8px'
    },
    button: {
      padding: '8px 12px',
      borderRadius: '8px',
      border: `1px solid ${systemColors.border.light}`,
      background: systemColors.background.primary,
      color: systemColors.text.primary,
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 600
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
        <WindowHeader title={`Pagamento - ${methodLabel}`} onClose={onClose} />

        {/* Conteúdo */}
        <div style={styles.content}>
          <div style={styles.label}>Valor do pagamento</div>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(formatMoneyInput(e.target.value))}
            onFocus={(e) => e.currentTarget.select()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleConfirm();
              }
            }}
            style={styles.input as React.CSSProperties}
            placeholder={convertCentsToReais(totalCents)}
            autoFocus
          />

          <div style={styles.footer}>
            <button style={styles.button as React.CSSProperties} onClick={onClose}>Cancelar</button>
            <button
              style={{ ...(styles.button as React.CSSProperties), ...(styles.buttonPrimary as React.CSSProperties) }}
              onClick={handleConfirm}
            >Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  );
}


