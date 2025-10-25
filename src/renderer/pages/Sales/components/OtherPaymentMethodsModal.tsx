//--------------------------------------------------------------------
// MODAL DE OUTROS MÉTODOS DE PAGAMENTO
// Modal para listar "Outros" métodos de pagamento vindos da API
// Usa estilos do sistema atual (modalStyles)
//--------------------------------------------------------------------
import React, { useEffect, useState } from 'react';
import { modalStyles } from '../../../styles/modalStyles';

//--------------------------------------------------------------------
// INTERFACES
// Interfaces para sistema de vendas simplificado
//--------------------------------------------------------------------

export interface OtherPaymentMethodsModalProps {
  isOpen: boolean;
  excludedMethodNames: string[]; // métodos já mapeados para F2..F6
  onClose: () => void;
  onSelect: (method: { id: number; name: string }) => void;
}

//--------------------------------------------------------------------
// COMPONENTE PRINCIPAL DO MODAL
//--------------------------------------------------------------------

const OtherPaymentMethodsModal: React.FC<OtherPaymentMethodsModalProps> = ({
  isOpen,
  excludedMethodNames,
  onClose,
  onSelect
}) => {
  const [methods, setMethods] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    // Mock de métodos de pagamento para demonstração
    const mockMethods = [
      { id: 1, name: 'PIX' },
      { id: 2, name: 'Cartão de Crédito' },
      { id: 3, name: 'Cartão de Débito' },
      { id: 4, name: 'Transferência' }
    ];
    
    const filtered = mockMethods.filter(m => 
      !excludedMethodNames.map(n => n.toLowerCase()).includes(m.name.toLowerCase())
    );
    setMethods(filtered);
  }, [isOpen, excludedMethodNames]);

  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div 
        style={{
          ...modalStyles.container,
          width: '520px'
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
          Outras formas de pagamento
        </div>
        
        <div style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}>
            {methods.map(m => (
              <button 
                key={m.id} 
                onClick={() => onSelect(m)}
                style={{
                  ...modalStyles.button,
                  height: '42px',
                  fontSize: '1rem',
                  textTransform: 'uppercase'
                }}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, modalStyles.buttonHover);
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, modalStyles.button);
                }}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>
        
        <div style={{
          ...modalStyles.footer,
          padding: '16px',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button 
            onClick={onClose}
            style={{
              ...modalStyles.button,
              fontSize: '13px',
              textTransform: 'uppercase'
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtherPaymentMethodsModal;


