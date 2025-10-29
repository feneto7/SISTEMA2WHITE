//--------------------------------------------------------------------
// COMPONENTE DE INPUT DE PRODUTO
// Container com campos para adicionar produtos na venda
// Usado na página de vendas (Sales)
//--------------------------------------------------------------------
import React, { useState, useRef, useEffect } from 'react';
import { AddButton } from '../../../components/AddButton';
import { CurrencyInput, QuantityInput } from '../../../components/Inputs';
import { systemStyles, systemColors } from '../../../styles/systemStyle';
import { ProductSelectModal } from './ProductSelectModal';

interface ProductInputProps {
  onAddProduct: (product: string, quantity: string, price: string) => void;
}

interface Product {
  id: string;
  name: string;
  code: string;
  price: number;
  stock?: number;
  unit?: string;
}

export function ProductInput({ onAddProduct }: ProductInputProps): JSX.Element {
  const [productSearch, setProductSearch] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unitPrice, setUnitPrice] = useState('0,00');
  const [subtotal, setSubtotal] = useState('R$ 0,00');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const productInputRef = useRef<HTMLInputElement>(null);

  // Calcula subtotal quando quantidade ou preço mudam
  useEffect(() => {
    const qty = parseFloat(quantity.replace(',', '.')) || 0;
    const price = parseFloat(unitPrice.replace(',', '.')) || 0;
    const total = qty * price * 100; // converte para centavos
    
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(total / 100);
    
    setSubtotal(formatted);
  }, [quantity, unitPrice]);

  // Foca no campo de pesquisa quando o componente monta
  useEffect(() => {
    productInputRef.current?.focus();
  }, []);


  const handleAdd = () => {
    if (productSearch && quantity && unitPrice) {
      onAddProduct(productSearch, quantity, unitPrice);
      // Limpa campos após adicionar
      setProductSearch('');
      setQuantity('1');
      setUnitPrice('0,00');
      setSubtotal('R$ 0,00');
      // Foca no campo de pesquisa
      productInputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Se o campo estiver vazio, abre o modal de pesquisa
      if (!productSearch.trim()) {
        e.preventDefault();
        setIsProductModalOpen(true);
      } else {
        handleAdd();
      }
    }
  };

  // Handler para selecionar produto do modal
  const handleSelectProduct = (product: Product) => {
    const priceFormatted = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(product.price / 100);

    setProductSearch(product.name);
    setUnitPrice(priceFormatted);
    
    // Foca no campo de quantidade após selecionar produto
    setTimeout(() => {
      const quantityInput = document.querySelector('input[placeholder="1,000"]') as HTMLInputElement;
      quantityInput?.focus();
    }, 100);
  };

  const styles = {
    container: {
      ...systemStyles.searchBox.container,
      padding: '20px',
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-end'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '6px',
      flex: 1
    },
    inputGroupSmall: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '6px',
      width: '140px'
    },
    label: {
      ...systemStyles.input.label
    },
    input: {
      ...systemStyles.input.field,
      height: '28px',
      padding: '0 12px',
      fontSize: '14px',
      fontWeight: '500'
    } as React.CSSProperties,
    buttonContainer: {
      display: 'flex',
      alignItems: 'center'
    }
  };

  return (
    <>
      <div style={styles.container}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Pesquisar Produto</label>
          <input
            ref={productInputRef}
            type="text"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite o nome ou código (Enter para buscar)"
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroupSmall}>
          <QuantityInput
            value={quantity}
            onChange={setQuantity}
            placeholder="1,000"
            label="Quantidade"
            unitType="0"
            onKeyPress={handleKeyPress}
          />
        </div>

        <div style={styles.inputGroupSmall}>
          <CurrencyInput
            value={unitPrice}
            onChange={setUnitPrice}
            placeholder="0,00"
            label="Preço Unitário"
            onKeyPress={handleKeyPress}
          />
        </div>

        <div style={styles.inputGroupSmall}>
          <CurrencyInput
            value={subtotal}
            onChange={setSubtotal}
            placeholder="R$ 0,00"
            label="Subtotal"
            onKeyPress={handleKeyPress}
          />
        </div>

        <div style={styles.buttonContainer}>
          <AddButton onClick={handleAdd} label="Adicionar Produto" />
        </div>
      </div>

      {/* Modal de seleção de produto */}
      <ProductSelectModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSelectProduct={handleSelectProduct}
      />
    </>
  );
}


