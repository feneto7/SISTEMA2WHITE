//--------------------------------------------------------------------
// GRID DE PRODUTOS
// Área central para exibir categorias de produtos e produtos da categoria selecionada
// Suporta navegação entre categorias e produtos
//--------------------------------------------------------------------
import React from 'react';
import { useState } from 'react';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { BackButton } from '../../../../../components/BackButton';
import { SearchField } from '../../../../../components/SearchField';

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
}

interface ProductsGridProps {
  categories?: Category[];
  products?: Product[];
  onProductClick?: (product: Product) => void;
}

export function ProductsGrid({ categories = [], products = [], onProductClick }: ProductsGridProps): JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { systemStyles, systemColors } = useTheme();

  const formatMoney = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const handleProductClick = (product: Product) => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  // Por enquanto, usar dados mock quando não houver props
  const displayCategories = categories.length > 0 ? categories : [
    { id: '1', name: 'Bebidas' },
    { id: '2', name: 'Lanches' },
    { id: '3', name: 'Pizzas' },
    { id: '4', name: 'Sobremesas' },
    { id: '5', name: 'Promoções' }
  ];

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
      { id: '201', name: 'Hambúrguer', price: 15.00 },
      { id: '202', name: 'Cheeseburguer', price: 17.00 },
      { id: '203', name: 'X-Bacon', price: 20.00 },
      { id: '204', name: 'X-Salada', price: 16.00 },
      { id: '205', name: 'X-Tudo', price: 25.00 },
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
  const getProductsForCategory = (categoryId: string): Product[] => {
    if (products.length > 0) {
      return products;
    }
    return mockProductsByCategory[categoryId] || [];
  };

  const displayProducts = selectedCategory ? getProductsForCategory(selectedCategory) : [];

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
    categoriesWrapper: {
      display: 'flex',
      flexDirection: 'column' as const,
      flex: 1,
      overflow: 'hidden'
    },
    categoriesContainer: {
      padding: 16,
      flex: 1,
      overflow: 'auto'
    },
    categoriesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: 12
    },
    categoryCard: (isSelected: boolean) => ({
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      borderRadius: 10,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      background: isSelected ? systemColors.selection.background : systemColors.background.primary,
      border: `1px solid ${isSelected ? systemColors.selection.border : systemColors.border.light}`,
      boxShadow: isSelected ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'
    }),
    categoryName: (isSelected: boolean) => ({
      fontSize: '14px',
      fontWeight: '600',
      color: isSelected ? systemColors.selection.blue : systemColors.text.primary,
      marginTop: 8,
      textAlign: 'center' as const
    }),
    productsWrapper: {
      display: 'flex',
      flexDirection: 'column' as const,
      flex: 1,
      overflow: 'hidden'
    },
    topBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      borderBottom: `1px solid ${systemColors.border.light}`,
      flexShrink: 0
    },
    topBarLeft: {
      display: 'flex',
      alignItems: 'center'
    },
    topBarRight: {
      display: 'flex',
      alignItems: 'center'
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
    productCard: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      borderRadius: 8,
      border: `1px solid ${systemColors.border.light}`,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      background: systemColors.background.primary
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

  return (
    <div style={styles.container}>
      {/* Se não tiver categoria selecionada, mostra as categorias */}
      {!selectedCategory && (
        displayCategories.length > 0 ? (
          <div style={styles.categoriesWrapper}>
            {/* Barra superior com busca */}
            <div style={styles.topBar}>
              <div style={styles.topBarLeft}>
                {/* Espaço vazio para alinhar com produtos */}
              </div>
              <div style={styles.topBarRight}>
                <div style={{ height: 32, display: 'flex', alignItems: 'center', width: 250 }}>
                  <SearchField
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Buscar categoria"
                  />
                </div>
              </div>
            </div>

            {/* Grid de categorias */}
            <div style={styles.categoriesContainer}>
              <div style={styles.categoriesGrid}>
                {displayCategories.map((category) => (
                  <div
                    key={category.id}
                    style={styles.categoryCard(false)}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    {/* Ícone da categoria será adicionado aqui */}
                    <div style={{ fontSize: '32px', marginBottom: 8 }}>📦</div>
                    <span style={styles.categoryName(false)}>
                      {category.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={styles.placeholder}>
            Nenhuma categoria disponível
          </div>
        )
      )}

      {/* Se tiver categoria selecionada, mostra somente os produtos */}
      {selectedCategory && (
        displayProducts.length > 0 ? (
          <div style={styles.productsWrapper}>
            {/* Barra superior com botão voltar e busca */}
            <div style={styles.topBar}>
              <div style={styles.topBarLeft}>
                <BackButton 
                  onClick={() => setSelectedCategory(null)} 
                  label="Voltar para categorias" 
                />
              </div>
              <div style={styles.topBarRight}>
                <div style={{ height: 32, display: 'flex', alignItems: 'center', width: 250 }}>
                  <SearchField
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Buscar produto"
                  />
                </div>
              </div>
            </div>

            {/* Grid de produtos */}
            <div style={styles.productsContainer}>
              <div style={styles.productsGrid}>
                {displayProducts.map((product) => (
                  <div
                    key={product.id}
                    style={styles.productCard}
                    onClick={() => handleProductClick(product)}
                  >
                    <div style={{ fontSize: '24px', textAlign: 'center' as const }}>🍔</div>
                    <div style={{ fontSize: '12px', fontWeight: '600', marginTop: 8, textAlign: 'center' as const }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: systemColors.selection.blue, textAlign: 'center' as const, marginTop: 4 }}>
                      {formatMoney(product.price)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={styles.placeholder}>
            Nenhum produto nesta categoria
          </div>
        )
      )}
    </div>
  );
}

