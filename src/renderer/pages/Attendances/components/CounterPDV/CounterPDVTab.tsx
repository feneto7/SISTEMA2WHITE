//--------------------------------------------------------------------
// ABA: BALCÃO PDV
// Operação de balcão/retirada com foco em agilidade
// Layout com seleção de tipo de pedido (Balcão/Mesa) e área de produtos
//--------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../styles/ThemeProvider';
import { useClickSound } from '../../../../hooks/useClickSound';
import { AppIcons } from '../../../../components/Icons/AppIcons';
import { CartSidebar, CartItem, CartComplement } from './components/CartSidebar';
import { CategoriesGrid } from './components/CategoriesGrid';
import { ProductsGrid } from './components/ProductsGrid';
import { ComplementsGrid } from './components/ComplementsGrid';

type OrderType = 'counter' | 'table';
type ViewMode = 'categories' | 'products' | 'complements';

interface CounterPDVTabProps {
  initialOrderType?: OrderType;
  onClose?: () => void;
}

export function CounterPDVTab({ initialOrderType = 'counter', onClose }: CounterPDVTabProps = {}): JSX.Element {
  const [orderType, setOrderType] = useState<OrderType>(initialOrderType);
  const [viewMode, setViewMode] = useState<ViewMode>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string; quantity: number; price: number } | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemComplements, setEditingItemComplements] = useState<{ complement: any; quantity: number }[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const [isClosePressed, setIsClosePressed] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<{ id: string; number: number; status: 'free' | 'occupied' | 'reserved' } | null>(null);
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();

  // Sincronizar orderType quando initialOrderType mudar
  useEffect(() => {
    setOrderType(initialOrderType);
  }, [initialOrderType]);

  const handleOrderTypeChange = (type: OrderType) => {
    playClickSound();
    setOrderType(type);
    // Se mudou para "mesa" e ainda não tem mesa selecionada, abrir modal
    if (type === 'table' && !selectedTable) {
      setIsTableModalOpen(true);
    }
  };

  const handleTableSelect = (table: { id: string; number: number; status: 'free' | 'occupied' | 'reserved' }) => {
    setSelectedTable(table);
    setIsTableModalOpen(false);
  };

  const handleOpenTableModal = () => {
    setIsTableModalOpen(true);
  };

  const handleCloseTableModal = () => {
    setIsTableModalOpen(false);
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setViewMode('products');
  };

  const handleProductClick = (product: any, quantity: number) => {
    console.log('Produto selecionado:', product, 'Quantidade:', quantity);
    // Adicionar produto ao carrinho
    const cartItem: CartItem = {
      id: `${product.id}-${Date.now()}`, // ID único para cada item do carrinho
      name: product.name,
      quantity: quantity,
      price: product.price,
      hasComplements: false,
      productId: product.id
    };
    setCartItems([...cartItems, cartItem]);
  };

  const handleNextToComplements = (product: any, quantity: number) => {
    console.log('Ir para complementos:', product, 'Quantidade:', quantity);
    setSelectedProduct({
      id: product.id,
      name: product.name,
      quantity: quantity,
      price: product.price
    });
    setViewMode('complements');
  };

  const handleBackToCategories = () => {
    setViewMode('categories');
    setSelectedCategory(null);
  };

  const handleBackToProducts = () => {
    // Se estávamos editando, cancelar a edição
    if (editingItemId) {
      setEditingItemId(null);
      setEditingItemComplements([]);
    }
    setViewMode('products');
    setSelectedProduct(null);
  };

  const handleAddComplementsToCart = (complements: any[]) => {
    console.log('Adicionar produto com complementos ao carrinho:', selectedProduct, complements);
    
    if (!selectedProduct) return;

    // Mapear complementos para o formato CartComplement
    const cartComplements: CartComplement[] = complements.map(comp => ({
      id: comp.complement.id,
      name: comp.complement.name,
      quantity: comp.quantity,
      price: comp.complement.price
    }));

    // Se estamos editando um item, atualizar o item existente
    if (editingItemId) {
      const updatedItems = cartItems.map(item => {
        if (item.id === editingItemId) {
          return {
            ...item,
            quantity: selectedProduct.quantity,
            complements: cartComplements
          };
        }
        return item;
      });
      setCartItems(updatedItems);
      setEditingItemId(null);
      setEditingItemComplements([]);
    } else {
      // Adicionar produto com complementos ao carrinho
      const cartItem: CartItem = {
        id: `${selectedProduct.id}-${Date.now()}`, // ID único para cada item do carrinho
        name: selectedProduct.name,
        quantity: selectedProduct.quantity,
        price: selectedProduct.price,
        complements: cartComplements,
        hasComplements: true,
        productId: selectedProduct.id
      };
      setCartItems([...cartItems, cartItem]);
    }
    
    setViewMode('products');
    setSelectedProduct(null);
    setEditingItemComplements([]);
  };

  const handleStartEdit = (item: CartItem) => {
    console.log('Iniciar edição do item:', item);
    setEditingItemId(item.id);
    
    // Se o item tem complementos, reabrir a ComplementsGrid
    if (item.hasComplements || (item.complements && item.complements.length > 0)) {
      setSelectedProduct({
        id: item.productId || item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      });
      
      // Preparar complementos já selecionados para edição
      if (item.complements && item.complements.length > 0) {
        const selectedComps = item.complements.map(comp => ({
          complement: {
            id: comp.id,
            name: comp.name,
            price: comp.price
          },
          quantity: comp.quantity
        }));
        setEditingItemComplements(selectedComps);
      }
      
      setViewMode('complements');
    }
    // Se não tem complementos, apenas mostrar controles no CartSidebar
  };

  const handleUpdateEditingItem = (updatedItem: CartItem) => {
    console.log('Atualizar item em edição:', updatedItem);
    const updatedItems = cartItems.map(item => {
      if (item.id === updatedItem.id) {
        return updatedItem;
      }
      return item;
    });
    setCartItems(updatedItems);
    
    // Se estamos editando um produto com complementos, atualizar também o selectedProduct
    if (editingItemId === updatedItem.id && (updatedItem.hasComplements || (updatedItem.complements && updatedItem.complements.length > 0))) {
      setSelectedProduct(prev => prev ? {
        ...prev,
        quantity: updatedItem.quantity
      } : null);
    }
  };

  const handleFinishEditing = () => {
    console.log('Finalizar edição');
    setEditingItemId(null);
    setEditingItemComplements([]);
  };

  const handleDeleteItem = (itemId: string) => {
    console.log('Excluir item:', itemId);
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    // Se o item excluído estava sendo editado, cancelar a edição
    if (editingItemId === itemId) {
      setEditingItemId(null);
      setEditingItemComplements([]);
    }
  };

  const handleCheckout = () => {
    console.log('Finalizar pedido');
    // TODO: Implementar finalização do pedido
  };

  // Calcular total do carrinho
  const calculateTotal = (): number => {
    let total = 0;
    cartItems.forEach(item => {
      total += item.price * item.quantity;
      if (item.complements) {
        item.complements.forEach(comp => {
          total += comp.price * comp.quantity;
        });
      }
    });
    return total;
  };

  const styles = {
    container: {
      display: 'flex',
      height: '100%',
      overflow: 'hidden',
      gap: 16
    },
    productsArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100%',
      overflow: 'hidden',
      gap: 20,
      minWidth: 0
    },
    header: {
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      padding: '8px 16px',
      flexShrink: 0
    },
    headerLeft: {
      display: 'flex',
      gap: 12
    },
    headerCenter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    headerRight: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    title: {
      ...systemStyles.page.title,
      margin: 0,
      fontSize: '16px'
    },
    typeButton: (isActive: boolean) => ({
      ...systemStyles.button.default,
      padding: '10px 24px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      background: isActive ? systemColors.button.blue : systemColors.button.gradient,
      color: isActive ? '#FFFFFF' : systemColors.text.primary,
      border: isActive ? `0.5px solid ${systemColors.selection.blueDark}` : `0.5px solid ${systemColors.button.defaultBorder}`,
      boxShadow: isActive ? '0 0.5px 2px rgba(0, 122, 255, 0.25)' : '0 0.5px 1px rgba(0, 0, 0, 0.04)'
    }),
    productsContainer: {
      flex: 1,
      overflow: 'hidden',
      minHeight: 0
    }
  };

  return (
    <div style={styles.container}>
      {/* Área de produtos com header */}
      <div style={styles.productsArea}>
        {/* Header com botões de seleção de tipo */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <button
              style={styles.typeButton(orderType === 'counter')}
              onClick={() => handleOrderTypeChange('counter')}
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              onMouseLeave={() => setIsPressed(false)}
            >
              Balcão
            </button>
            <button
              style={styles.typeButton(orderType === 'table')}
              onClick={() => handleOrderTypeChange('table')}
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              onMouseLeave={() => setIsPressed(false)}
            >
              Mesa
            </button>
          </div>
          <div style={styles.headerCenter}>
            <h2 style={styles.title}>Balcão PDV</h2>
          </div>
          <div style={styles.headerRight}>
            {onClose && (
              <button
                onClick={onClose}
                onMouseEnter={() => setIsCloseHovered(true)}
                onMouseLeave={() => {
                  setIsCloseHovered(false);
                  setIsClosePressed(false);
                }}
                onMouseDown={() => setIsClosePressed(true)}
                onMouseUp={() => setIsClosePressed(false)}
                style={isClosePressed 
                  ? {
                      ...systemStyles.neumorphicButton.containerActive,
                      width: 'auto',
                      height: 'auto',
                      padding: '10px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }
                  : {
                      ...systemStyles.neumorphicButton.container,
                      width: 'auto',
                      height: 'auto',
                      padding: '10px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }
                }
              >
                <AppIcons.Close size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Grid de categorias, produtos ou complementos */}
        <div style={styles.productsContainer}>
          {viewMode === 'categories' ? (
            <CategoriesGrid
              onCategoryClick={handleCategoryClick}
            />
          ) : viewMode === 'products' ? (
            <ProductsGrid
              categoryId={selectedCategory}
              onBack={handleBackToCategories}
              onProductClick={handleProductClick}
              onNextToComplements={handleNextToComplements}
            />
          ) : (
            selectedProduct && (
              <ComplementsGrid
                product={selectedProduct}
                selectedComplements={editingItemComplements}
                onBack={handleBackToProducts}
                onAddToCart={handleAddComplementsToCart}
              />
            )
          )}
        </div>
      </div>

      {/* Sidebar do carrinho (lado direito) */}
      <CartSidebar
        items={cartItems}
        total={calculateTotal()}
        onCheckout={handleCheckout}
        editingItemId={editingItemId}
        onStartEdit={handleStartEdit}
        onUpdateEditingItem={handleUpdateEditingItem}
        onFinishEditing={handleFinishEditing}
        onDeleteItem={handleDeleteItem}
        orderType={orderType}
        isTableModalOpen={isTableModalOpen}
        onOpenTableModal={handleOpenTableModal}
        onCloseTableModal={handleCloseTableModal}
        onTableSelect={handleTableSelect}
        selectedTable={selectedTable}
      />
    </div>
  );
}

