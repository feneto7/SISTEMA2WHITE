//--------------------------------------------------------------------
// MODAL DE PAGAMENTO RÁPIDO
// Modal pequeno para confirmação rápida de pagamento no PDV
// Usa estilos do sistema atual (modalStyles)
//--------------------------------------------------------------------
import React, { useEffect, useState, useRef } from 'react';
import { modalStyles } from '../../../styles/modalStyles';
import { convertCentsToReais, convertReaisToCents, formatMoneyInput } from '../../../utils/money';

//--------------------------------------------------------------------
// INTERFACES
// Interfaces para sistema de vendas simplificado
//--------------------------------------------------------------------

export interface QuickPaymentModalProps {
  isOpen: boolean;
  paymentMethodName: string;
  defaultAmount: number; // em centavos
  remainingAmount: number; // em centavos - quanto falta pagar
  onClose: () => void;
  onConfirm: (amountInCents: number) => void;
}

//--------------------------------------------------------------------
// COMPONENTE PRINCIPAL DO MODAL
//--------------------------------------------------------------------

const QuickPaymentModal: React.FC<QuickPaymentModalProps> = ({
  isOpen,
  paymentMethodName,
  defaultAmount,
  remainingAmount,
  onClose,
  onConfirm
}) => {
  const [amount, setAmount] = useState(convertCentsToReais(defaultAmount));
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAmount(convertCentsToReais(defaultAmount));
      setError('');
      // Selecionar todo o texto do input após abrir
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.select();
        }
      }, 100);
    }
  }, [isOpen, defaultAmount]);

  const handleConfirm = () => {
    const amountInCents = convertReaisToCents(amount);
    
    // Validação: apenas Dinheiro pode ter valor maior que o restante
    const isDinheiro = paymentMethodName.toLowerCase().includes('dinheiro');
    if (!isDinheiro && amountInCents > remainingAmount) {
      setError(`Apenas Dinheiro permite valor maior que o restante. Máximo: ${convertCentsToReais(remainingAmount)}`);
      return;
    }
    
    setError('');
    onConfirm(amountInCents);
  };

  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div 
        style={{
          ...modalStyles.container,
          width: '360px'
        }}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div style={{
          ...modalStyles.header,
          padding: '16px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          fontSize: '18px',
          fontWeight: '600',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          textTransform: 'uppercase'
        }}>
          {paymentMethodName}
        </div>
        
        <div style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
          <label style={{ 
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--text-primary)',
            textTransform: 'uppercase'
          }}>
            Valor
          </label>
          <input
            ref={inputRef}
            autoFocus
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setAmount(formatMoneyInput(e.target.value));
              setError('');
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                handleConfirm();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }
            }}
            style={{
              ...modalStyles.formInput,
              fontSize: '1.1rem',
              textAlign: 'right',
              textTransform: 'uppercase'
            }}
          />
          {error && (
            <div style={{ 
              color: '#FF3B30', 
              fontSize: '12px',
              marginTop: '8px',
              textTransform: 'uppercase'
            }}>
              {error}
            </div>
          )}
        </div>
        
        <div style={{
          ...modalStyles.footer,
          padding: '16px',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button 
            onClick={onClose}
            style={{
              ...modalStyles.button,
              fontSize: '13px',
              textTransform: 'uppercase'
            }}
          >
            Cancelar
          </button>
          <button 
            onClick={handleConfirm}
            style={{
              ...modalStyles.button,
              ...modalStyles.buttonPrimary,
              fontSize: '13px',
              textTransform: 'uppercase'
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickPaymentModal;


