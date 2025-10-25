//--------------------------------------------------------------------
// MODAL PARA REMOVER OU EDITAR PRODUTOS
// Modal para remover ou editar produtos da lista de vendas no PDV
// Usa estilos do sistema atual (modalStyles)
//--------------------------------------------------------------------
import React, { useState, useEffect, useRef } from 'react';
import { modalStyles } from '../../../styles/modalStyles';
import { convertCentsToReais, formatMoneyInput, convertReaisToCents } from '../../../utils/money';
import {
  formatQuantityByUnitType,
  getQuantityPlaceholderByUnitType,
  normalizeUnitType,
  convertQuantityToNumber
} from '../../../utils/quantityFormater';

//--------------------------------------------------------------------
// INTERFACES
// Interfaces para sistema de vendas simplificado
//--------------------------------------------------------------------

// Interface do item do carrinho
interface CartItem {
  id: string;
  product: {
    id?: string;
    name?: string;
    code?: string;
    barcode?: string;
    unitType?: '0' | '1';
  };
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface RemoveEditProductModalProps {
  isOpen: boolean;
  cartItems: CartItem[];
  onClose: () => void;
  onRemove: (itemId: string) => void;
  onEdit: (itemId: string, newQuantity: number, newUnitPrice: number, newSubtotal: number) => void;
}

//--------------------------------------------------------------------
// COMPONENTE PRINCIPAL DO MODAL
//--------------------------------------------------------------------

// Interface do item do carrinho
interface CartItem {
  id: string;
  product: {
    id?: string;
    name?: string;
    code?: string;
    barcode?: string;
    unitType?: '0' | '1';
  };
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface RemoveEditProductModalProps {
  isOpen: boolean;
  cartItems: CartItem[];
  onClose: () => void;
  onRemove: (itemId: string) => void;
  onEdit: (itemId: string, newQuantity: number, newUnitPrice: number, newSubtotal: number) => void;
}

const RemoveEditProductModal: React.FC<RemoveEditProductModalProps> = ({
  isOpen,
  cartItems,
  onClose,
  onRemove,
  onEdit
}) => {
  const [searchCode, setSearchCode] = useState('');
  const [foundItem, setFoundItem] = useState<CartItem | null>(null);
  const [editedQuantity, setEditedQuantity] = useState('');
  const [editedPrice, setEditedPrice] = useState('');
  const [error, setError] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const removeButtonRef = useRef<HTMLButtonElement>(null);

  // Focar no campo de pesquisa ao abrir
  useEffect(() => {
    if (isOpen) {
      setSearchCode('');
      setFoundItem(null);
      setEditedQuantity('');
      setEditedPrice('');
      setError('');
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Focar no botão Remover quando produto for encontrado
  useEffect(() => {
    if (foundItem && removeButtonRef.current) {
      setTimeout(() => {
        removeButtonRef.current?.focus();
      }, 100);
    }
  }, [foundItem]);

  // Buscar produto na lista
  const handleSearch = () => {
    if (!searchCode.trim()) {
      setError('Informe um código ou código de barras');
      return;
    }

    const normalizedSearch = searchCode.trim().toLowerCase();
    
    // Buscar por código ou código de barras
    const item = cartItems.find(item => {
      const productCode = item?.product?.code || '';
      const productBarcode = item?.product?.barcode || '';
      
      return productCode.toLowerCase() === normalizedSearch ||
             productBarcode.toLowerCase() === normalizedSearch;
    });

    if (item) {
      setFoundItem(item);
      setEditedQuantity(formatQuantityByUnitType(String(item.quantity), item.product?.unitType || '1'));
      setEditedPrice(convertCentsToReais(item.unitPrice));
      setError('');
    } else {
      setFoundItem(null);
      setEditedQuantity('');
      setEditedPrice('');
      setError(`Produto "${searchCode}" não encontrado na lista de vendas`);
    }
  };

  // Remover produto
  const handleRemove = () => {
    if (foundItem) {
      onRemove(foundItem.id);
      onClose();
    }
  };

  // Salvar edições (quantidade e/ou preço)
  const handleSaveEdits = () => {
    if (!foundItem) return;

    const quantityNum = convertQuantityToNumber(editedQuantity, foundItem.product?.unitType || '1');
    const priceInCents = convertReaisToCents(editedPrice);
    
    if (!quantityNum || quantityNum <= 0) {
      setError('Quantidade deve ser maior que zero');
      return;
    }

    if (!priceInCents || priceInCents <= 0) {
      setError('Preço deve ser maior que zero');
      return;
    }

    // Calcular novo subtotal
    const newSubtotal = Math.round(quantityNum * priceInCents);
    
    // Passar quantity, unitPrice e subtotal
    onEdit(foundItem.id, quantityNum, priceInCents, newSubtotal);
    onClose();
  };

  // Handler de teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !foundItem) {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!foundItem) return;
    const value = formatQuantityByUnitType(e.target.value, foundItem.product?.unitType || '1');
    setEditedQuantity(value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatMoneyInput(e.target.value);
    setEditedPrice(value);
  };

  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div 
        style={{
          ...modalStyles.container,
          width: '500px',
          maxWidth: '90vw'
        }}
        onKeyDown={handleKeyDown}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div style={{
          ...modalStyles.header,
          padding: '16px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          fontSize: '18px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'var(--accent)',
          color: 'white',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          textTransform: 'uppercase'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          Remover/Editar Produto da Venda
        </div>
        
        <div style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
          {/* Campo de pesquisa */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontWeight: '500',
              textTransform: 'uppercase'
            }}>
              Código ou Código de Barras:
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                ref={searchInputRef}
                type="text"
                value={searchCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchCode(e.target.value)}
                placeholder="Digite o código ou código de barras..."
                style={{
                  ...modalStyles.formInput,
                  flex: 1,
                  padding: '12px',
                  fontSize: '14px',
                  textTransform: 'uppercase'
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
              />
              <button 
                onClick={handleSearch}
                style={{
                  ...modalStyles.button,
                  ...modalStyles.buttonPrimary,
                  minWidth: '100px',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                Buscar
              </button>
            </div>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div style={{
              color: '#FF3B30',
              background: 'rgba(220, 53, 69, 0.1)',
              border: '1px solid #FF3B30',
              borderRadius: 'var(--border-radius-medium)',
              padding: '12px',
              fontSize: '14px',
              textAlign: 'center',
              textTransform: 'uppercase'
            }}>
              {error}
            </div>
          )}

          {/* Informações do produto encontrado */}
          {foundItem && (
            <div style={{
              background: 'rgba(246, 246, 246, 0.95)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: 'var(--border-radius-medium)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{
                color: 'var(--text-primary)',
                fontSize: '20px',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                {foundItem.product?.name || 'Produto sem nome'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: 'var(--text-secondary)',
                  fontSize: '14px'
                }}>
                  <span style={{ fontWeight: '500', textTransform: 'uppercase' }}>Código:</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                    {foundItem.product?.code || 'N/A'}
                  </span>
                </div>
                
                {/* Quantidade editável */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    fontWeight: '500',
                    textTransform: 'uppercase'
                  }}>
                    Quantidade:
                  </label>
                  <input
                    type="text"
                    value={editedQuantity}
                    onChange={handleQuantityChange}
                    placeholder={getQuantityPlaceholderByUnitType(normalizeUnitType(foundItem.product?.unitType || '1'))}
                    style={{
                      ...modalStyles.formInput,
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}
                  />
                </div>

                {/* Preço unitário editável */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    fontWeight: '500',
                    textTransform: 'uppercase'
                  }}>
                    Preço Unitário:
                  </label>
                  <input
                    type="text"
                    value={editedPrice}
                    onChange={handlePriceChange}
                    placeholder={convertCentsToReais(0)}
                    style={{
                      ...modalStyles.formInput,
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: 'var(--text-secondary)',
                  fontSize: '14px'
                }}>
                  <span style={{ fontWeight: '500', textTransform: 'uppercase' }}>Subtotal:</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                    R$ {convertCentsToReais(convertQuantityToNumber(editedQuantity, foundItem.product?.unitType || '1') * convertReaisToCents(editedPrice))}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            marginTop: '12px',
            textTransform: 'uppercase'
          }}>
            Enter: Buscar produto | Enter novamente: Remover | ESC: Fechar
          </div>
        </div>
        
        <div style={{
          ...modalStyles.footer,
          padding: '16px 24px',
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
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
            Fechar
          </button>
          {foundItem && (
            <>
              <button 
                ref={removeButtonRef}
                onClick={handleRemove}
                style={{
                  ...modalStyles.button,
                  background: 'linear-gradient(to bottom, #FF3B30, #d32f2f)',
                  color: 'white',
                  border: '1px solid #FF3B30',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleRemove();
                  }
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
                Remover
              </button>
              <button 
                onClick={handleSaveEdits}
                style={{
                  ...modalStyles.button,
                  ...modalStyles.buttonPrimary,
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Salvar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoveEditProductModal;

