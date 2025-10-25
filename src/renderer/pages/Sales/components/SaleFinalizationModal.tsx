//--------------------------------------------------------------------
// MODAL DE FINALIZAÇÃO DE VENDA
// Modal que exibe troco, formas de pagamento e confirma venda
// Usa estilos do sistema atual (modalStyles)
//--------------------------------------------------------------------
import React, { useEffect, useRef } from 'react';
import { modalStyles } from '../../../styles/modalStyles';
import { convertCentsToReais } from '../../../utils/money';

//--------------------------------------------------------------------
// INTERFACES
// Interfaces para sistema de vendas simplificado
//--------------------------------------------------------------------

export interface PaymentItem {
  paymentMethodId: string;
  paymentMethodName: string;
  amount: number;
}

export interface SaleFinalizationModalProps {
  isOpen: boolean;
  payments: PaymentItem[];
  totalAmount: number; // em centavos
  change: number; // em centavos
  onClose: () => void;
  onConfirm: () => void;
}

//--------------------------------------------------------------------
// COMPONENTE PRINCIPAL DO MODAL
//--------------------------------------------------------------------

const SaleFinalizationModal: React.FC<SaleFinalizationModalProps> = ({
  isOpen,
  payments,
  totalAmount,
  change,
  onClose,
  onConfirm
}) => {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // Focar botão de confirmar ao abrir
  useEffect(() => {
    if (isOpen && confirmButtonRef.current) {
      setTimeout(() => {
        confirmButtonRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Listener de teclado
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        onConfirm();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onConfirm, onClose]);

  if (!isOpen) return null;

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div 
        style={{
          ...modalStyles.container,
          width: '800px',
          maxWidth: '95vw',
          maxHeight: '96vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div style={{
          ...modalStyles.header,
          padding: '20px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          fontSize: 'clamp(2rem, 2.5vw + 0.5rem, 3rem)',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          background: 'var(--accent)',
          color: 'white',
          lineHeight: '1.15',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          textTransform: 'uppercase'
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          Finalizar Venda
        </div>
        
        <div style={{
          padding: '24px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          flex: 1,
          minHeight: 0,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
          {/* Total da venda */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '20px',
              background: 'rgba(246, 246, 246, 0.95)',
              borderRadius: 'var(--border-radius-medium)',
              border: '1px solid rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                fontSize: 'clamp(1.4rem, 1.2vw + 0.6rem, 2rem)',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  color: 'var(--text-primary)',
                  fontWeight: '600',
                  fontSize: '2.5rem',
                  textTransform: 'uppercase'
                }}>
                  Total da Venda:
                </div>
                <div style={{
                  color: 'var(--text-primary)',
                  fontWeight: '600',
                  fontSize: '3.5rem'
                }}>
                  R$ {convertCentsToReais(totalAmount)}
                </div>
              </div>
            </div>
          </div>

          {/* Formas de pagamento */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              fontSize: 'clamp(1.4rem, 1.2vw + 0.8rem, 2rem)',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Formas de Pagamento
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '20px',
              background: 'rgba(246, 246, 246, 0.95)',
              borderRadius: 'var(--border-radius-medium)',
              border: '1px solid rgba(0, 0, 0, 0.1)'
            }}>
              {payments.map((payment, idx) => (
                <div key={`${payment.paymentMethodId}-${idx}`} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  fontSize: 'clamp(1.4rem, 1.2vw + 0.6rem, 2rem)',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    color: 'var(--text-primary)',
                    fontWeight: '500',
                    fontSize: 'clamp(1.4rem, 1.2vw + 0.6rem, 2rem)',
                    textTransform: 'uppercase'
                  }}>
                    {payment.paymentMethodName}
                  </div>
                  <div style={{
                    color: 'var(--text-primary)',
                    fontWeight: '600',
                    fontSize: 'clamp(1.6rem, 1.6vw + 0.8rem, 2.5rem)'
                  }}>
                    R$ {convertCentsToReais(payment.amount)}
                  </div>
                </div>
              ))}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                fontSize: 'clamp(1.4rem, 1.2vw + 0.6rem, 2rem)',
                flexWrap: 'wrap',
                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                paddingTop: '12px',
                marginTop: '8px'
              }}>
                <div style={{
                  color: 'var(--text-primary)',
                  fontWeight: '600',
                  fontSize: '2.2rem',
                  textTransform: 'uppercase'
                }}>
                  Total Pago:
                </div>
                <div style={{
                  color: 'var(--text-primary)',
                  fontWeight: '600',
                  fontSize: '3rem'
                }}>
                  R$ {convertCentsToReais(totalPaid)}
                </div>
              </div>
            </div>
          </div>

          {/* Troco (se houver) */}
          {change > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '32px',
                background: 'rgba(40, 167, 69, 0.1)',
                borderRadius: 'var(--border-radius-large)',
                border: '3px solid #34C759',
                gap: '16px'
              }}>
                <div style={{
                  color: 'var(--text-secondary)',
                  fontSize: 'clamp(1.6rem, 1.6vw + 0.4rem, 2.5rem)',
                  fontWeight: '500',
                  textTransform: 'uppercase'
                }}>
                  Troco
                </div>
                <div style={{
                  color: '#34C759',
                  fontSize: 'clamp(2.2rem, 3.4vw + 0.8rem, 5rem)',
                  fontWeight: '600'
                }}>
                  R$ {convertCentsToReais(change)}
                </div>
              </div>
            </div>
          )}

          <div style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: 'clamp(1.2rem, 0.8vw + 0.6rem, 1.5rem)',
            marginTop: '12px',
            textTransform: 'uppercase'
          }}>
            Pressione Enter para confirmar ou ESC para voltar
          </div>
        </div>
        
        <div style={{
          ...modalStyles.footer,
          padding: '16px 24px',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          background: 'rgba(246, 246, 246, 0.5)',
          flexShrink: 0
        }}>
          <button 
            onClick={onClose}
            style={{
              ...modalStyles.button,
              fontSize: 'clamp(1.4rem, 1vw + 0.6rem, 1.8rem)',
              padding: '14px 24px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, modalStyles.buttonHover);
            }}
            onMouseLeave={(e) => {
              Object.assign(e.currentTarget.style, modalStyles.button);
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
            Voltar
          </button>
          <button 
            ref={confirmButtonRef}
            onClick={onConfirm}
            style={{
              ...modalStyles.button,
              ...modalStyles.buttonPrimary,
              minWidth: '180px',
              fontSize: 'clamp(1.4rem, 1vw + 0.6rem, 1.8rem)',
              padding: '14px 24px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, modalStyles.buttonPrimaryHover);
            }}
            onMouseLeave={(e) => {
              Object.assign(e.currentTarget.style, { ...modalStyles.button, ...modalStyles.buttonPrimary });
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            Finalizar Venda
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaleFinalizationModal;

