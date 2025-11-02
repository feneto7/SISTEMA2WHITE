//--------------------------------------------------------------------
// GRID DE COMPLEMENTOS
// Grid para exibir complementos de um produto selecionado
// Permite selecionar quantidades de cada complemento e adicionar ao carrinho
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { GridTopBar } from './GridTopBar';
import { BackButton } from '../../../../../components/BackButton';
import { ProductCard } from './ProductCard';

interface Complement {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
}

interface ComplementsGridProps {
  product: {
    id: string;
    name: string;
    quantity: number;
  };
  complements?: Complement[];
  selectedComplements?: { complement: Complement; quantity: number }[];
  onBack: () => void;
  onAddToCart: (complements: { complement: Complement; quantity: number }[]) => void;
}

export function ComplementsGrid({ product, complements = [], selectedComplements = [], onBack, onAddToCart }: ComplementsGridProps): JSX.Element {
  // Inicializar as quantidades com os complementos já selecionados (caso estejamos editando)
  const initialQuantities = selectedComplements.reduce((acc, { complement, quantity }) => {
    acc[complement.id] = quantity;
    return acc;
  }, {} as { [key: string]: number });
  
  const [complementQuantities, setComplementQuantities] = useState<{ [key: string]: number }>(initialQuantities);
  const { systemStyles, systemColors } = useTheme();
  const playClickSound = useClickSound();

  const handleComplementQuantityChange = (complementId: string, quantity: number) => {
    setComplementQuantities(prev => ({
      ...prev,
      [complementId]: quantity
    }));
  };

  // Dados mock de complementos (exemplos)
  const mockComplements: Complement[] = complements.length > 0 ? complements : [
    { id: '101', name: 'Bacon Extra', price: 3.00 },
    { id: '102', name: 'Ovo', price: 2.00 },
    { id: '103', name: 'Queijo Extra', price: 3.50 },
    { id: '104', name: 'Batata Palha', price: 2.50 },
    { id: '105', name: 'Catupiry', price: 3.00 },
    { id: '106', name: 'Cebola', price: 1.00 }
  ];

  const displayComplements = mockComplements;

  const handleAddToCart = () => {
    const selectedComplements = displayComplements
      .filter(complement => (complementQuantities[complement.id] || 0) > 0)
      .map(complement => ({
        complement,
        quantity: complementQuantities[complement.id]
      }));

    onAddToCart(selectedComplements);
    playClickSound();
    setComplementQuantities({});
  };

  const hasComplementsSelected = displayComplements.some(complement => (complementQuantities[complement.id] || 0) > 0);

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
    contentWrapper: {
      display: 'flex',
      flexDirection: 'column' as const,
      flex: 1,
      overflow: 'hidden'
    },
    productInfo: {
      padding: 12,
      borderBottom: `1px solid ${systemColors.border.light}`,
      backgroundColor: systemColors.background.secondary
    },
    productInfoText: {
      fontSize: '13px',
      color: systemColors.text.secondary,
      margin: 0
    },
    complementsContainer: {
      flex: 1,
      overflow: 'auto',
      padding: 16
    },
    complementsGrid: {
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

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        {/* Barra superior com botão voltar e adicionar */}
        <GridTopBar
          leftContent={
            <BackButton 
              onClick={onBack}
              label="Voltar para produtos" 
            />
          }
          rightContent={
            <button
              style={{
                padding: '6px 16px',
                borderRadius: 8,
                background: hasComplementsSelected ? systemColors.selection.blue : systemColors.button.gradient,
                color: hasComplementsSelected ? '#FFFFFF' : systemColors.text.primary,
                border: `1px solid ${hasComplementsSelected ? systemColors.selection.blueDark : systemColors.button.defaultBorder}`,
                cursor: hasComplementsSelected ? 'pointer' : 'not-allowed',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.15s ease',
                opacity: hasComplementsSelected ? 1 : 0.5
              }}
              onClick={handleAddToCart}
              disabled={!hasComplementsSelected}
            >
              Adicionar ao Carrinho
            </button>
          }
        />

        {/* Informações do produto selecionado */}
        <div style={styles.productInfo}>
          <p style={styles.productInfoText}>
            Complementos para: <strong>{product.name}</strong> (Qtd: {product.quantity})
          </p>
        </div>

        {/* Grid de complementos */}
        <div style={styles.complementsContainer}>
          {displayComplements.length > 0 ? (
            <div style={styles.complementsGrid}>
              {displayComplements.map((complement) => (
                <ProductCard
                  key={complement.id}
                  product={complement}
                  quantity={complementQuantities[complement.id] || 0}
                  onQuantityChange={(qty) => handleComplementQuantityChange(complement.id, qty)}
                />
              ))}
            </div>
          ) : (
            <div style={styles.placeholder}>
              Nenhum complemento disponível
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

