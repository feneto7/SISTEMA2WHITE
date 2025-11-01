//--------------------------------------------------------------------
// ABA: BALCÃO PDV
// Operação de balcão/retirada com foco em agilidade
// Layout com seleção de tipo de pedido (Balcão/Mesa) e área de produtos
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { useTheme } from '../../../../styles/ThemeProvider';
import { useClickSound } from '../../../../hooks/useClickSound';
import { CartSidebar } from './components/CartSidebar';
import { ProductsGrid } from './components/ProductsGrid';

type OrderType = 'counter' | 'table';

export function CounterPDVTab(): JSX.Element {
  const [orderType, setOrderType] = useState<OrderType>('counter');
  const [isPressed, setIsPressed] = useState(false);
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();

  const handleOrderTypeChange = (type: OrderType) => {
    playClickSound();
    setOrderType(type);
  };

  const handleProductClick = (product: any, quantity: number) => {
    console.log('Produto selecionado:', product, 'Quantidade:', quantity);
    // TODO: Adicionar produto ao carrinho com a quantidade
  };

  const handleCheckout = () => {
    console.log('Finalizar pedido');
    // TODO: Implementar finalização do pedido
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
          <div style={styles.headerRight}></div>
        </div>

        {/* Grid de produtos */}
        <div style={styles.productsContainer}>
          <ProductsGrid
            onProductClick={handleProductClick}
          />
        </div>
      </div>

      {/* Sidebar do carrinho (lado direito) */}
      <CartSidebar
        onCheckout={handleCheckout}
      />
    </div>
  );
}

