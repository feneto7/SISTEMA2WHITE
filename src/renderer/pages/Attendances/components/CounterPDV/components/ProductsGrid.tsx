//--------------------------------------------------------------------
// GRID DE PRODUTOS
// Exibe os produtos de uma categoria selecionada
// Usado no PDV para adicionar produtos ao carrinho
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { GridTopBar } from './GridTopBar';
import { BackButton } from '../../../../../components/BackButton';
import { ProductCard } from './ProductCard';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  hasComplements?: boolean;
}

interface ProductsGridProps {
  categoryId: string | null;
  products?: Product[];
  onBack: () => void;
  onProductClick?: (product: Product, quantity: number) => void;
  onNextToComplements?: (product: Product, quantity: number) => void;
}

export function ProductsGrid({ categoryId, products = [], onBack, onProductClick, onNextToComplements }: ProductsGridProps): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [productQuantities, setProductQuantities] = useState<{ [key: string]: number }>({});
  const { systemStyles, systemColors } = useTheme();
  const playClickSound = useClickSound();

  const handleProductQuantityChange = (productId: string, quantity: number) => {
    // Permitir apenas 1 produto selecionado por vez
    if (quantity > 0) {
      // Limpar todos os outros produtos
      setProductQuantities({ [productId]: quantity });
    } else {
      // Se quantidade for 0, apenas limpar este produto
      setProductQuantities({});
    }
  };

  // Dados mock de produtos por categoria
  const mockProductsByCategory: { [key: string]: Product[] } = {
    '1': [ // Bebidas
      { id: '101', name: 'Coca-Cola 350ml', price: 5.50 },
      { id: '102', name: 'Guaraná 350ml', price: 5.00 },
      { id: '103', name: 'Água 500ml', price: 3.00 },
      { id: '104', name: 'Suco Natural', price: 8.00 },
      { id: '105', name: 'Cerveja Gelada', price: 7.50 },
      { id: '106', name: 'Refrigerante Zero', price: 5.50 }
    ],
    '2': [ // Lanches
      { id: '201', name: 'Hambúrguer', price: 15.00, hasComplements: true },
      { id: '202', name: 'Cheeseburguer', price: 17.00, hasComplements: true },
      { id: '203', name: 'X-Bacon', price: 20.00, hasComplements: true },
      { id: '204', name: 'X-Salada', price: 16.00, hasComplements: true },
      { id: '205', name: 'X-Tudo', price: 25.00, hasComplements: true },
      { id: '206', name: 'Batata Frita', price: 10.00 }
    ],
    '3': [ // Pizzas
      { id: '301', name: 'Pizza Mussarela', price: 35.00 },
      { id: '302', name: 'Pizza Calabresa', price: 38.00 },
      { id: '303', name: 'Pizza Portuguesa', price: 40.00 },
      { id: '304', name: 'Pizza 4 Queijos', price: 42.00 },
      { id: '305', name: 'Pizza Margherita', price: 36.00 },
      { id: '306', name: 'Pizza Frango', price: 39.00 }
    ],
    '4': [ // Sobremesas
      { id: '401', name: 'Pudim', price: 12.00 },
      { id: '402', name: 'Brigadeiro', price: 3.50 },
      { id: '403', name: 'Sorvete', price: 15.00 },
      { id: '404', name: 'Torta Alemã', price: 18.00 },
      { id: '405', name: 'Brownie', price: 14.00 },
      { id: '406', name: 'Açaí', price: 16.00 }
    ],
    '5': [ // Promoções
      { id: '501', name: 'Combo 1', price: 25.00 },
      { id: '502', name: 'Combo 2', price: 30.00 },
      { id: '503', name: 'Combo 3', price: 35.00 },
      { id: '504', name: 'Combo 4', price: 40.00 }
    ]
  };

  // Obter produtos da categoria selecionada
  const getProductsForCategory = (catId: string): Product[] => {
    if (products.length > 0) {
      return products;
    }
    return mockProductsByCategory[catId] || [];
  };

  const displayProducts = categoryId ? getProductsForCategory(categoryId) : [];

  // Obter o produto selecionado
  const selectedProduct = displayProducts.find(product => (productQuantities[product.id] || 0) > 0);
  const selectedProductQuantity = selectedProduct ? productQuantities[selectedProduct.id] : 0;
  const hasSelectedProductWithComplements = selectedProduct?.hasComplements === true;

  const handleAddAllToCart = () => {
    if (onProductClick && selectedProduct) {
      onProductClick(selectedProduct, selectedProductQuantity);
      playClickSound();
      setProductQuantities({});
    }
  };

  const handleNextToComplements = () => {
    if (onNextToComplements && selectedProduct) {
      onNextToComplements(selectedProduct, selectedProductQuantity);
      playClickSound();
      setProductQuantities({});
    }
  };

  const hasProductsSelected = selectedProductQuantity > 0;

  // Filtrar produtos baseado no termo de busca
  const filteredProducts = displayProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      background: systemColors.background.content,
      borderRadius: 10,
      border: `1px solid ${systemColors.border.light}`,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      height: '100%'
    },
    productsWrapper: {
      display: 'flex',
      flexDirection: 'column' as const,
      flex: 1,
      overflow: 'hidden'
    },
    productsContainer: {
      flex: 1,
      overflow: 'auto',
      padding: 16
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 12
    },
    placeholder: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: systemColors.text.secondary,
      fontSize: '16px'
    }
  };

  if (!categoryId) {
    return (
      <div style={styles.container}>
        <div style={styles.placeholder}>
          Selecione uma categoria
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {displayProducts.length > 0 ? (
        <div style={styles.productsWrapper}>
          {/* Barra superior com botão voltar e adicionar */}
          <GridTopBar
            leftContent={
              <BackButton 
                onClick={onBack} 
                label="Voltar para categorias" 
              />
            }
            rightContent={
              <button
                style={{
                  padding: '6px 16px',
                  borderRadius: 8,
                  background: hasProductsSelected ? systemColors.selection.blue : systemColors.button.gradient,
                  color: hasProductsSelected ? '#FFFFFF' : systemColors.text.primary,
                  border: `1px solid ${hasProductsSelected ? systemColors.selection.blueDark : systemColors.button.defaultBorder}`,
                  cursor: hasProductsSelected ? 'pointer' : 'not-allowed',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.15s ease',
                  opacity: hasProductsSelected ? 1 : 0.5
                }}
                onClick={hasSelectedProductWithComplements ? handleNextToComplements : handleAddAllToCart}
                disabled={!hasProductsSelected}
              >
                {hasSelectedProductWithComplements ? 'Próximo' : 'Adicionar ao Carrinho'}
              </button>
            }
          />

          {/* Grid de produtos */}
          <div style={styles.productsContainer}>
            <div style={styles.productsGrid}>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={productQuantities[product.id] || 0}
                  onQuantityChange={(qty) => handleProductQuantityChange(product.id, qty)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.placeholder}>
          Nenhum produto nesta categoria
        </div>
      )}
    </div>
  );
}
