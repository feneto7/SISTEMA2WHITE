import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { SearchIcon, EditIcon, DeleteIcon } from '../../../components/Icons/Icons';
import { useTheme } from '../../../styles/ThemeProvider';
import { useClickSound } from '../../../hooks/useClickSound';
import { VirtualList, useListPerformance, useDebounce } from '../../../hooks/useVirtualization';
import { ActionButton } from '../../../components/ActionButton';

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
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);
  const { systemStyles, systemColors } = useTheme();

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

  // Estilos inline para estado vazio
  const emptyStateStyles = {
    emptyState: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      color: systemColors.text.secondary
    },
    emptyText: {
      fontSize: '16px',
      fontWeight: '500',
      marginTop: '16px',
      marginBottom: '8px'
    },
    emptySubtext: {
      fontSize: '14px',
      opacity: 0.7
    }
  };

  // Memoizar estado vazio para evitar recriações
  const emptyState = useMemo(() => (
    <div style={emptyStateStyles.emptyState}>
      <SearchIcon size={48} color="rgba(0, 0, 0, 0.2)" />
      <p style={emptyStateStyles.emptyText}>Nenhum produto encontrado</p>
      <p style={emptyStateStyles.emptySubtext}>Tente buscar com outros termos</p>
    </div>
  ), []);

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
        style={systemStyles.list.content}
      />
    );
  }

  // Renderização normal para listas pequenas
  return (
    <div style={systemStyles.list.content} className="list-content" ref={listRef}>
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
  const playClickSound = useClickSound();
  const { systemColors } = useTheme();

  // Memoizar estilo da linha para evitar recálculos desnecessários
  const rowStyle = useMemo(() => {
    const baseStyle = {
      gridTemplateColumns: `${nameColumnWidth}px 1fr 0.8fr 0.8fr 1fr 80px`,
      padding: '16px 12px',
      borderBottom: `1px solid ${systemColors.border.divider}`,
      display: 'grid',
      gap: '16px',
      animationDelay: `${index * 0.05}s`,
      animation: 'fadeIn 0.3s ease forwards',
      opacity: 0,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
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
  }, [nameColumnWidth, index, isSelected, isHovered]);

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

  // Estilos inline consistentes com ClientList
  const cellStyle = {
    display: 'flex',
    alignItems: 'center'
  };

  return (
    <div
      ref={ref}
      style={rowStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div style={cellStyle} className="cell-name">
        <div style={{
          fontSize: '14px',
          fontWeight: '500',
          color: systemColors.text.primary,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>{product.name}</div>
      </div>
      <div style={cellStyle} className="cell-category">
        <span style={{
          fontSize: '11px',
          fontWeight: '600',
          color: systemColors.text.secondary,
          background: systemColors.control.background,
          padding: '4px 10px',
          borderRadius: '6px',
          border: `1px solid ${systemColors.border.light}`
        }}>{product.category}</span>
      </div>
      <div style={cellStyle} className="cell-type">
        <span style={{
          fontSize: '11px',
          fontWeight: '600',
          color: product.type === 'product' ? '#1976D2' : '#7B1FA2',
          background: product.type === 'product' ? 'rgba(25, 118, 210, 0.1)' : 'rgba(123, 31, 162, 0.1)',
          padding: '4px 10px',
          borderRadius: '6px'
        }}>
          {product.type === 'product' ? 'Produto' : 'Serviço'}
        </span>
      </div>
      <div style={cellStyle} className="cell-stock">
        {product.stock !== undefined ? (
          <span style={{
            fontSize: '13px',
            fontWeight: '500',
            color: product.stock > 10 ? '#2E7D32' : product.stock > 0 ? '#F57C00' : '#C62828'
          }}>
            {product.stock} un.
          </span>
        ) : (
          <span style={{
            fontSize: '13px',
            color: systemColors.text.tertiary,
            fontStyle: 'italic'
          }}>N/A</span>
        )}
      </div>
      <div style={cellStyle} className="cell-price">
        <span style={{
          fontSize: '13px',
          fontWeight: '500',
          color: systemColors.text.primary
        }}>{formatCurrency(product.price)}</span>
      </div>
      <div style={cellStyle} className="cell-actions">
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {onEditProduct && (
            <ActionButton
              icon={<EditIcon size={16} color={systemColors.text.secondary} />}
              onClick={handleEdit}
              title="Editar produto"
            />
          )}
          {onDeleteProduct && (
            <ActionButton
              icon={<DeleteIcon size={16} color="#FF3B30" />}
              onClick={handleDelete}
              title="Excluir produto"
            />
          )}
        </div>
      </div>
    </div>
  );
}));

ProductRow.displayName = 'ProductRow';

