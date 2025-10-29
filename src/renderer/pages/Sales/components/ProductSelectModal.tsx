//--------------------------------------------------------------------
// MODAL DE SELEÇÃO DE PRODUTO
// Modal para pesquisar e selecionar um produto na venda
// Acionado ao pressionar Enter com campo vazio no input de produto
//--------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { systemStyles, systemColors } from '../../../styles/systemStyle';
import { SearchField } from '../../../components/SearchField';
import { NewProductModal } from '../../../components/NewProductModal/NewProductModal';

interface Product {
  id: string;
  name: string;
  code: string;
  price: number;
  stock?: number;
  unit?: string;
}

interface ProductSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export function ProductSelectModal({ isOpen, onClose, onSelectProduct }: ProductSelectModalProps): JSX.Element | null {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const selectedItemRef = React.useRef<HTMLDivElement>(null);
  const [products] = useState<Product[]>([
    { id: '1', name: 'Camiseta Básica Branca', code: '001', price: 4990, stock: 50, unit: 'UN' },
    { id: '2', name: 'Calça Jeans Masculina', code: '002', price: 12990, stock: 30, unit: 'UN' },
    { id: '3', name: 'Tênis Esportivo', code: '003', price: 19990, stock: 20, unit: 'UN' },
    { id: '4', name: 'Jaqueta de Couro', code: '004', price: 29990, stock: 15, unit: 'UN' },
    { id: '5', name: 'Boné Personalizado', code: '005', price: 3990, stock: 100, unit: 'UN' },
    { id: '6', name: 'Mochila Escolar', code: '006', price: 8990, stock: 25, unit: 'UN' },
    { id: '7', name: 'Relógio Digital', code: '007', price: 15990, stock: 40, unit: 'UN' },
    { id: '8', name: 'Óculos de Sol', code: '008', price: 9990, stock: 60, unit: 'UN' }
  ]);

  // Filtrar produtos baseado na pesquisa
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.includes(searchTerm)
  );

  // Resetar índice quando mudar a pesquisa
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  // Scroll automático para o item selecionado
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [selectedIndex]);

  // Listener de teclado
  useEffect(() => {
    // Não processa teclas se o modal de novo produto estiver aberto
    if (!isOpen || isNewProductModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredProducts.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredProducts[selectedIndex]) {
            onSelectProduct(filteredProducts[selectedIndex]);
            onClose();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isNewProductModalOpen, selectedIndex, filteredProducts, onClose, onSelectProduct]);

  // Formatar preço
  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(priceInCents / 100);
  };

  if (!isOpen) return null;

  const styles = {
    modal: {
      ...systemStyles.modal.container,
      width: '900px',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden'
    },
    searchContainer: {
      padding: '16px 20px',
      borderBottom: `1px solid ${systemColors.border.light}`,
      background: systemColors.background.primary,
      flexShrink: 0
    },
    cellName: {
      fontSize: '14px',
      fontWeight: '600',
      color: systemColors.text.primary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    cellText: {
      fontSize: '13px',
      color: systemColors.text.primary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    cellPrice: {
      fontSize: '14px',
      fontWeight: '600',
      color: systemColors.selection.blue,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    cellStock: {
      fontSize: '13px',
      color: systemColors.text.secondary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    emptyState: {
      padding: '40px 20px',
      textAlign: 'center' as const,
      color: systemColors.text.secondary,
      fontSize: '14px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }
  };

  const getProductRowStyle = (index: number) => {
    const isSelected = index === selectedIndex;
    const isHovered = index === hoveredIndex;

    const baseStyle = {
      ...systemStyles.list.row,
      gridTemplateColumns: '2fr 1fr 1fr 1fr',
      display: 'grid',
      cursor: 'pointer',
      animationDelay: `${index * 0.05}s`
    };

    if (isSelected) {
      return {
        ...baseStyle,
        ...systemStyles.list.rowSelected,
        transform: 'translateX(4px)',
        boxShadow: '0 2px 8px rgba(10, 132, 255, 0.2)'
      };
    } else if (isHovered) {
      return {
        ...baseStyle,
        ...systemStyles.list.rowHover
      };
    }

    return baseStyle;
  };

  return (
    <div style={systemStyles.modal.overlay}>
      <div style={styles.modal}>
        {/* Title Bar com traffic lights */}
        <div style={{ ...systemStyles.modal.titleBar, flexShrink: 0 }}>
          <div style={systemStyles.trafficLights.container}>
            <button 
              style={{...systemStyles.trafficLights.button, ...systemStyles.trafficLights.red}} 
              onClick={onClose}
            ></button>
            <button style={{...systemStyles.trafficLights.button, ...systemStyles.trafficLights.yellow}}></button>
            <button style={{...systemStyles.trafficLights.button, ...systemStyles.trafficLights.green}}></button>
          </div>
          <div style={systemStyles.modal.title}>Selecionar Produto</div>
          <div style={{ width: '60px' }}></div>
        </div>

        {/* Campo de pesquisa */}
        <div style={styles.searchContainer}>
          <SearchField
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Pesquisar por nome ou código do produto"
          />
        </div>

        {/* Header da lista */}
        <div style={{
          ...systemStyles.list.header,
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          display: 'grid',
          flexShrink: 0
        }}>
          <div style={systemStyles.list.headerCell}>Produto</div>
          <div style={systemStyles.list.headerCell}>Código</div>
          <div style={systemStyles.list.headerCell}>Preço</div>
          <div style={systemStyles.list.headerCell}>Estoque</div>
        </div>

        {/* Lista de produtos */}
        <div style={{ ...systemStyles.list.content, flex: 1, minHeight: 0 }} className="scrollbar-list">
          {filteredProducts.length === 0 ? (
            <div style={styles.emptyState}>
              {searchTerm
                ? 'Nenhum produto encontrado com os critérios de busca'
                : 'Nenhum produto cadastrado'}
            </div>
          ) : (
            filteredProducts.map((product, index) => (
              <div
                key={product.id}
                ref={index === selectedIndex ? selectedItemRef : null}
                style={getProductRowStyle(index)}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={styles.cellName}>{product.name}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={styles.cellText}>{product.code}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={styles.cellPrice}>{formatPrice(product.price)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={styles.cellStock}>
                    {product.stock || 0} {product.unit || 'UN'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer com botões */}
        <div style={{ ...systemStyles.modal.footer, flexShrink: 0 }}>
          <div style={systemStyles.modal.footerLeft}>
            <button
              style={systemStyles.button.default}
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
          <div style={systemStyles.modal.footerRight}>
            <button
              style={systemStyles.button.primary}
              onClick={() => setIsNewProductModalOpen(true)}
            >
              Novo
            </button>
          </div>
        </div>
      </div>

      {/* Animação fadeIn para as linhas */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {/* Modal de Novo Produto */}
      <NewProductModal
        isOpen={isNewProductModalOpen}
        onClose={() => setIsNewProductModalOpen(false)}
      />
    </div>
  );
}

