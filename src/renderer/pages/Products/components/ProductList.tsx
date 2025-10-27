import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { SearchIcon, EditIcon, DeleteIcon } from '../../../components/Icons/Icons';
import { macStyles } from '../../../styles/style';
import { systemStyles, systemColors } from '../../../styles/systemStyle';
import { useClickSound } from '../../../hooks/useClickSound';
import { VirtualList, useListPerformance, useDebounce } from '../../../hooks/useVirtualization';

// Componente de listagem de produtos/serviços
// Modularizado e reutilizável seguindo as regras do projeto
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'product' | 'service';
  category: string;
  stock?: number;
}

interface ProductListProps {
  products: Product[];
  formatCurrency: (value: number) => string;
  nameColumnWidth: number;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (product: Product) => void;
}

export const ProductList = React.memo<ProductListProps>(({ products, formatCurrency, nameColumnWidth, onEditProduct, onDeleteProduct }) => {
  const styles = macStyles.pages.products;
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);

  // Verificar se precisa de virtualização
  const { shouldVirtualize, itemCount } = useListPerformance(products, 50);

  // Memoizar função de navegação por teclado para evitar recriações desnecessárias
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (products.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev < products.length - 1 ? prev + 1 : 0;
          return newIndex;
        });
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev > 0 ? prev - 1 : products.length - 1;
          return newIndex;
        });
        break;
      
      case 'Home':
        e.preventDefault();
        setSelectedIndex(0);
        break;
      
      case 'End':
        e.preventDefault();
        setSelectedIndex(products.length - 1);
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < products.length) {
          // Aqui você pode adicionar ação ao pressionar Enter
          console.log('Produto selecionado:', products[selectedIndex]);
        }
        break;
      
      case 'Escape':
        e.preventDefault();
        setSelectedIndex(-1);
        break;
    }
  }, [products.length, selectedIndex, products]);

  // Adicionar listener de teclado quando o componente monta
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Scroll automático para o item selecionado
  useEffect(() => {
    if (selectedItemRef.current && listRef.current) {
      const listRect = listRef.current.getBoundingClientRect();
      const itemRect = selectedItemRef.current.getBoundingClientRect();
      
      // Verificar se o item está visível
      if (itemRect.top < listRect.top || itemRect.bottom > listRect.bottom) {
        selectedItemRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [selectedIndex]);

  // Resetar seleção quando a lista de produtos muda
  useEffect(() => {
    setSelectedIndex(-1);
  }, [products]);

  // Memoizar estado vazio para evitar recriações
  const emptyState = useMemo(() => (
    <div style={styles.emptyState}>
      <SearchIcon size={48} color="rgba(0, 0, 0, 0.2)" />
      <p style={styles.emptyText}>Nenhum produto encontrado</p>
      <p style={styles.emptySubtext}>Tente buscar com outros termos</p>
    </div>
  ), [styles.emptyState, styles.emptyText, styles.emptySubtext]);

  // Função para renderizar item individual
  const renderProductItem = useCallback((product: Product, index: number) => (
    <ProductRow 
      key={product.id} 
      product={product} 
      index={index} 
      formatCurrency={formatCurrency}
      nameColumnWidth={nameColumnWidth}
      isSelected={index === selectedIndex}
      onEditProduct={onEditProduct}
      onDeleteProduct={onDeleteProduct}
      ref={index === selectedIndex ? selectedItemRef : null}
    />
  ), [formatCurrency, nameColumnWidth, selectedIndex, onEditProduct, onDeleteProduct]);

  if (products.length === 0) {
    return emptyState;
  }

  // Usar virtualização para listas grandes
  if (shouldVirtualize) {
    return (
      <VirtualList
        items={products}
        itemHeight={60} // Altura estimada de cada item
        containerHeight={400} // Altura do container
        renderItem={renderProductItem}
        overscan={5}
        className="list-content"
        style={styles.listContent}
      />
    );
  }

  // Renderização normal para listas pequenas
  return (
    <div style={{
      ...styles.listContent,
      background: systemColors.background.content
    }} className="list-content" ref={listRef}>
      {products.map((product, index) => renderProductItem(product, index))}
    </div>
  );
});

ProductList.displayName = 'ProductList';

interface ProductRowProps {
  product: Product;
  index: number;
  formatCurrency: (value: number) => string;
  nameColumnWidth: number;
  isSelected: boolean;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (product: Product) => void;
}

const ProductRow = React.memo(React.forwardRef<HTMLDivElement, ProductRowProps>(({ 
  product, 
  index, 
  formatCurrency, 
  nameColumnWidth, 
  isSelected,
  onEditProduct,
  onDeleteProduct
}, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const styles = macStyles.pages.products;
  const playClickSound = useClickSound();

  // Memoizar estilo da linha para evitar recálculos desnecessários
  const rowStyle = useMemo(() => {
    const baseStyle = {
      ...styles.listRow,
      gridTemplateColumns: `${nameColumnWidth}px 1fr 0.8fr 0.8fr 1fr 80px`,
      animationDelay: `${index * 0.05}s`,
      cursor: 'pointer',
      transition: 'all 0.15s ease'
    };

    // Aplicar estilo de hover ou seleção
    if (isSelected) {
      return {
        ...baseStyle,
        background: systemColors.selection.background,
        border: `1px solid ${systemColors.selection.border}`,
        transform: 'translateX(4px)',
        boxShadow: '0 2px 8px rgba(10, 132, 255, 0.2)'
      };
    } else if (isHovered) {
      return { 
        ...baseStyle, 
        background: systemColors.control.hover
      };
    }
    
    return baseStyle;
  }, [styles.listRow, styles.listRowHover, nameColumnWidth, index, isSelected, isHovered]);

  // Memoizar callbacks para evitar recriações
  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    onEditProduct?.(product);
  }, [playClickSound, onEditProduct, product]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    onDeleteProduct?.(product);
  }, [playClickSound, onDeleteProduct, product]);

  const handleClick = useCallback(() => {
    console.log('Produto clicado:', product);
  }, [product]);

  return (
    <div
      ref={ref}
      style={rowStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div style={styles.rowCell} className="cell-name">
        <div style={styles.productName}>{product.name}</div>
      </div>
      <div style={styles.rowCell} className="cell-category">
        <span style={styles.categoryBadge}>{product.category}</span>
      </div>
      <div style={styles.rowCell} className="cell-type">
        <span style={product.type === 'product' ? styles.typeBadgeProduct : styles.typeBadgeService}>
          {product.type === 'product' ? 'Produto' : 'Serviço'}
        </span>
      </div>
      <div style={styles.rowCell} className="cell-stock">
        {product.stock !== undefined ? (
          <span style={product.stock > 10 ? styles.stockGood : product.stock > 0 ? styles.stockLow : styles.stockOut}>
            {product.stock} un.
          </span>
        ) : (
          <span style={styles.stockNA}>N/A</span>
        )}
      </div>
      <div style={styles.rowCell} className="cell-price">
        <span style={styles.priceText}>{formatCurrency(product.price)}</span>
      </div>
      <div style={styles.rowCell} className="cell-actions">
        <div style={styles.actionButtons}>
          {onEditProduct && (
            <button
              style={{
                ...systemStyles.button.default,
                padding: '4px 8px',
                minWidth: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={handleEdit}
              title="Editar produto"
            >
              <EditIcon size={16} color={systemColors.text.secondary} />
            </button>
          )}
          {onDeleteProduct && (
            <button
              style={{
                ...systemStyles.button.default,
                padding: '4px 8px',
                minWidth: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FF3B30'
              }}
              onClick={handleDelete}
              title="Excluir produto"
            >
              <DeleteIcon size={16} color="#FF3B30" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}));

ProductRow.displayName = 'ProductRow';

