//--------------------------------------------------------------------
// GRID DE CATEGORIAS
// Exibe as categorias de produtos disponíveis
// Usado no PDV para selecionar categorias antes de produtos
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { GridTopBar } from './GridTopBar';
import { CategoryCard } from './CategoryCard';

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface CategoriesGridProps {
  categories?: Category[];
  onCategoryClick: (categoryId: string) => void;
}

export function CategoriesGrid({ categories = [], onCategoryClick }: CategoriesGridProps): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const { systemStyles, systemColors } = useTheme();

  // Por enquanto, usar dados mock quando não houver props
  const displayCategories = categories.length > 0 ? categories : [
    { id: '1', name: 'Bebidas' },
    { id: '2', name: 'Lanches' },
    { id: '3', name: 'Pizzas' },
    { id: '4', name: 'Sobremesas' },
    { id: '5', name: 'Promoções' }
  ];

  // Filtrar categorias baseado no termo de busca
  const filteredCategories = displayCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      {displayCategories.length > 0 ? (
        <div style={styles.categoriesWrapper}>
          {/* Barra superior com busca */}
          <GridTopBar
            showSearch
            searchValue={searchTerm}
            searchPlaceholder="Buscar categoria"
            onSearchChange={setSearchTerm}
          />

          {/* Grid de categorias */}
          <div style={styles.categoriesContainer}>
            <div style={styles.categoriesGrid}>
              {filteredCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  isSelected={false}
                  onClick={() => onCategoryClick(category.id)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.placeholder}>
          Nenhuma categoria disponível
        </div>
      )}
    </div>
  );
}

