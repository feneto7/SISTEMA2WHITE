//--------------------------------------------------------------------
// COMPONENTE DO FORMULÁRIO DE ADIÇÃO DE PRODUTOS
// Formulário de adição de produtos no PDV
// Usa estilos do sistema atual (macStyles)
//--------------------------------------------------------------------
import React, { RefObject } from 'react';
import { macStyles } from '../../../styles/style';
import { convertCentsToReais } from '../../../utils/money';
import {
  formatQuantityByUnitType,
  getQuantityPlaceholderByUnitType,
  normalizeUnitType
} from '../../../utils/quantityFormater';

//--------------------------------------------------------------------
// INTERFACES
// Interfaces para sistema de vendas simplificado
//--------------------------------------------------------------------

// Interface do produto (simplificada)
interface Product {
  id: string;
  name: string;
  code: string;
  price: number;
  stock: number;
  unitType: '0' | '1';
  barcode: string;
  reference: string;
  stockPV?: number;
  stockLJ?: number;
  estoquePV?: number;
  estoqueLJ?: number;
  wholesalePrices?: any[];
  parentId?: string;
  isVariation: boolean;
  parentName?: string;
  variationDescription?: string;
  originalProduct: any;
}

// Interface das props do componente
interface SalesProductFormProps {
  searchTerm: string;
  quantity: string;
  unitPrice: string;
  subtotal: string;
  selectedProduct: Product | null;
  searchInputProducts: ProductSearchInputProduct[];
  searchInputRef?: RefObject<HTMLInputElement | null>;
  quantityInputRef: RefObject<HTMLInputElement | null>;
  onSearchTermChange: (value: string) => void;
  onQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUnitPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubtotalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProductSearchSelect: (product: ProductSearchInputProduct) => void;
  onProductSearch: () => void;
  onClearProductSelection: () => void;
  onQuantityKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPriceKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubtotalKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onAddProduct: () => void;
  convertToSearchInputProduct: (product: Product) => ProductSearchInputProduct;
}

// Interface para ProductSearchInput (mock)
interface ProductSearchInputProduct {
  id: string;
  name: string;
  code: string;
  price: number;
}

//--------------------------------------------------------------------
// COMPONENTE PRINCIPAL DO FORMULÁRIO
//--------------------------------------------------------------------

// Componente principal do formulário
const SalesProductForm: React.FC<SalesProductFormProps> = ({
  searchTerm,
  quantity,
  unitPrice,
  subtotal,
  selectedProduct,
  searchInputProducts,
  searchInputRef,
  quantityInputRef,
  onSearchTermChange,
  onQuantityChange,
  onUnitPriceChange,
  onSubtotalChange,
  onProductSearchSelect,
  onProductSearch,
  onClearProductSelection,
  onQuantityKeyDown,
  onPriceKeyDown,
  onSubtotalKeyDown,
  onAddProduct,
  convertToSearchInputProduct
}) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
      gap: '20px',
      alignItems: 'end',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.9)',
      borderRadius: 'var(--border-radius-large)',
      padding: '24px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      {/* Campo de pesquisa - simplificado */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{
          color: 'var(--text-primary)',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '4px',
          textTransform: 'uppercase'
        }}>
          Pesquisar Produto
        </label>
        <input
          ref={searchInputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          placeholder="Digite o código, referência ou nome do produto..."
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #c0c0c0',
            borderRadius: 'var(--border-radius-small)',
            fontSize: '13px',
            backgroundColor: '#ffffff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
            outline: 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            textTransform: 'uppercase'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#007aff';
            e.target.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(0, 122, 255, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#c0c0c0';
            e.target.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.1)';
          }}
        />
      </div>

      {/* Campo de quantidade */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{
          color: 'var(--text-primary)',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '4px',
          textTransform: 'uppercase'
        }}>
          Quantidade
        </label>
        <input
          type="text"
          value={quantity}
          onChange={onQuantityChange}
          onKeyDown={onQuantityKeyDown}
          ref={quantityInputRef as React.RefObject<HTMLInputElement>}
          placeholder={getQuantityPlaceholderByUnitType(normalizeUnitType(selectedProduct?.unitType))}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #c0c0c0',
            borderRadius: 'var(--border-radius-small)',
            fontSize: '13px',
            backgroundColor: '#ffffff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
            outline: 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            textAlign: 'center',
            fontWeight: '500',
            textTransform: 'uppercase'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#007aff';
            e.target.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(0, 122, 255, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#c0c0c0';
            e.target.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.1)';
          }}
        />
      </div>

      {/* Campo de preço unitário */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{
          color: 'var(--text-primary)',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '4px',
          textTransform: 'uppercase'
        }}>
          Preço Unit.
        </label>
        <input
          type="text"
          value={unitPrice}
          onChange={onUnitPriceChange}
          onKeyDown={onPriceKeyDown}
          placeholder={convertCentsToReais(0)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #c0c0c0',
            borderRadius: 'var(--border-radius-small)',
            fontSize: '13px',
            backgroundColor: '#ffffff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
            outline: 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            textAlign: 'right',
            fontWeight: '500',
            textTransform: 'uppercase'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#007aff';
            e.target.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(0, 122, 255, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#c0c0c0';
            e.target.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.1)';
          }}
        />
      </div>

      {/* Campo de subtotal */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{
          color: 'var(--text-primary)',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '4px',
          textTransform: 'uppercase'
        }}>
          Subtotal
        </label>
        <input
          type="text"
          value={subtotal}
          onChange={onSubtotalChange}
          onKeyDown={onSubtotalKeyDown}
          placeholder={convertCentsToReais(0)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #c0c0c0',
            borderRadius: 'var(--border-radius-small)',
            fontSize: '13px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
            outline: 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            textAlign: 'right',
            fontWeight: '500',
            textTransform: 'uppercase'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#007aff';
            e.target.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(0, 122, 255, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#c0c0c0';
            e.target.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.1)';
          }}
        />
      </div>

      {/* Botão de adicionar */}
      <button 
        onClick={onAddProduct}
        style={{
          borderRadius: 'var(--border-radius-small)',
          border: '1px solid rgba(0, 0, 0, 0.2)',
          background: 'linear-gradient(to bottom, var(--accent), #0056b3)',
          color: 'white',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 2px rgba(10, 132, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          fontSize: '13px',
          fontWeight: '600',
          padding: '8px 16px',
          height: '35px',
          minWidth: '120px',
          textTransform: 'uppercase',
          gap: '6px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(to bottom, #0056b3, #004494)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(10, 132, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(to bottom, var(--accent), #0056b3)';
          e.currentTarget.style.boxShadow = '0 1px 2px rgba(10, 132, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        Adicionar
      </button>
    </div>
  );
};

export default SalesProductForm;

