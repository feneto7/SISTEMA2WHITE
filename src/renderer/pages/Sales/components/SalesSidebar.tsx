//--------------------------------------------------------------------
// COMPONENTE DA SIDEBAR LATERAL ESQUERDA
// Sidebar com logo e totais da venda no PDV
// Usa estilos do sistema atual (macStyles)
//--------------------------------------------------------------------
import React from 'react';
import { macStyles } from '../../../styles/style';
import { convertCentsToReais } from '../../../utils/money';

//--------------------------------------------------------------------
// INTERFACES
// Interfaces para sistema de vendas simplificado
//--------------------------------------------------------------------

// Interface das props do componente
interface SalesSidebarProps {
  cartSubtotal: number; // em centavos
  cartTotal: number; // em centavos
  discountPercentage: number;
  discountValue: number;
  discountAmount: number;
  quickPayments: PaymentItem[];
  remainingToPay: number; // em centavos
}

// Interface para itens de pagamento
interface PaymentItem {
  paymentMethodId: string;
  paymentMethodName: string;
  amount: number;
}

//--------------------------------------------------------------------
// COMPONENTE PRINCIPAL DA SIDEBAR
//--------------------------------------------------------------------

// Componente principal da sidebar
const SalesSidebar: React.FC<SalesSidebarProps> = ({
  cartSubtotal,
  cartTotal,
  discountPercentage,
  discountValue,
  discountAmount,
  quickPayments,
  remainingToPay
}) => {
  return (
    <div style={{
      width: '400px',
      minWidth: '300px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.9)',
      borderRadius: 'var(--border-radius-large)',
      padding: '20px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
      minHeight: 0,
      maxHeight: '100%',
      overflowY: 'auto',
      overflowX: 'hidden',
      flexShrink: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      {/* Bloco da logo */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 'var(--border-radius-large)',
        border: '1px solid rgba(255, 255, 255, 0.9)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        <img 
          src="/assets/images/logo.png" 
          alt="Netinove Logo" 
          style={{
            width: '180px',
            height: 'auto',
            marginBottom: '12px'
          }}
        />
      </div>

      {/* Bloco de totais */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 'var(--border-radius-large)',
        border: '1px solid rgba(255, 255, 255, 0.9)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          color: 'var(--text-primary)',
          fontSize: '18px',
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: '12px',
          textTransform: 'uppercase'
        }}>
          Totais
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '12px 0',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            color: 'var(--text-secondary)',
            fontSize: '14px',
            fontWeight: '500',
            textAlign: 'center',
            textTransform: 'uppercase'
          }}>
            Subtotal:
          </div>
          <div style={{
            color: 'var(--text-primary)',
            fontSize: '2.8rem',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            overflow: 'visible'
          }}>
            R$ {convertCentsToReais(cartSubtotal)}
          </div>
        </div>
        
        {/* Container compacto para descontos */}
        {(discountPercentage > 0 || discountValue > 0) && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '12px',
            background: 'rgba(220, 53, 69, 0.1)',
            borderRadius: 'var(--border-radius-medium)',
            border: '1px solid rgba(220, 53, 69, 0.3)',
            marginTop: '8px'
          }}>
            {discountPercentage > 0 ? (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px'
              }}>
                <div style={{
                  color: '#FF3B30',
                  fontWeight: '500',
                  textTransform: 'uppercase'
                }}>
                  Desconto ({discountPercentage}%):
                </div>
                <div style={{
                  color: '#FF3B30',
                  fontWeight: '600',
                  fontSize: '1.2rem'
                }}>
                  -R$ {convertCentsToReais(discountAmount)}
                </div>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px'
              }}>
                <div style={{
                  color: '#FF3B30',
                  fontWeight: '500',
                  textTransform: 'uppercase'
                }}>
                  Desconto (R$):
                </div>
                <div style={{
                  color: '#FF3B30',
                  fontWeight: '600',
                  fontSize: '1.2rem'
                }}>
                  -R$ {convertCentsToReais(discountValue)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pagamentos parciais registrados */}
        {quickPayments.length > 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '12px',
            background: 'rgba(0,123,255,0.08)',
            borderRadius: 'var(--border-radius-medium)',
            border: '1px solid rgba(0,123,255,0.35)',
            marginTop: '8px'
          }}>
            {quickPayments.map((p, i) => (
              <div key={`${p.paymentMethodId}-${i}`} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px'
              }}>
                <div style={{
                  color: 'var(--text-primary)',
                  fontWeight: '500',
                  textTransform: 'uppercase'
                }}>
                  {p.paymentMethodName}:
                </div>
                <div style={{
                  color: 'var(--text-primary)',
                  fontWeight: '600',
                  fontSize: '1.2rem'
                }}>
                  R$ {convertCentsToReais(p.amount)}
                </div>
              </div>
            ))}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px'
            }}>
              <div style={{
                color: 'var(--text-secondary)',
                fontWeight: '500',
                textTransform: 'uppercase'
              }}>
                A pagar:
              </div>
              <div style={{
                color: 'var(--text-secondary)',
                fontWeight: '600',
                fontSize: '1.2rem'
              }}>
                R$ {convertCentsToReais(remainingToPay)}
              </div>
            </div>
          </div>
        )}
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          background: 'var(--accent)',
          borderRadius: 'var(--border-radius-medium)',
          padding: '16px',
          marginTop: '12px'
        }}>
          <div style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: '600',
            textAlign: 'center',
            textTransform: 'uppercase'
          }}>
            {quickPayments.length > 0 ? (remainingToPay > 0 ? 'A pagar:' : 'Pago / Troco:') : 'Total:'}
          </div>
          <div style={{
            color: 'white',
            fontSize: '3.6rem',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            overflow: 'visible'
          }}>
            {quickPayments.length > 0
              ? (remainingToPay > 0 ? `R$ ${convertCentsToReais(remainingToPay)}` : 'R$ 0,00')
              : `R$ ${convertCentsToReais(cartTotal)}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesSidebar;

