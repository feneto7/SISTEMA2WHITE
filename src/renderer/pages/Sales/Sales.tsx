//--------------------------------------------------------------------
// PÁGINA DE VENDAS (PDV)
// Sistema de Ponto de Venda - Interface principal para vendas
// Integra todos os componentes do sistema de vendas
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { useNavigation } from '../../router/Navigation';
import { BackButton } from '../../components/BackButton';
import { SalesSidebar, ProductInput, ProductList, SalesFooter } from './components';
import { SaleProduct } from './components/ProductList';
import { convertReaisToCents } from '../../utils/money';
import { systemStyles, systemColors } from '../../styles/systemStyle';

function Sales(): JSX.Element {
  const { navigate } = useNavigation();
  const [products, setProducts] = useState<SaleProduct[]>([]);

  // Calcula totais da venda
  const subtotal = products.reduce((sum, product) => sum + product.subtotal, 0);
  const discount = 0; // TODO: Implementar desconto
  const total = subtotal - discount;
  const itemsCount = products.length;

  // Adiciona produto à lista
  const handleAddProduct = (productName: string, quantity: string, unitPrice: string) => {
    const qty = parseFloat(quantity.replace(',', '.')) || 0;
    const price = convertReaisToCents(unitPrice);
    const subtotal = Math.round(qty * price);

    const newProduct: SaleProduct = {
      id: Date.now().toString(),
      name: productName,
      quantity: quantity,
      unitPrice: price,
      subtotal: subtotal
    };

    setProducts([...products, newProduct]);
  };

  // Remove produto da lista
  const handleRemoveProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const styles = {
    container: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      background: systemColors.background.content,
      padding: '20px',
      gap: '20px'
    },
    header: {
      ...systemStyles.page.header,
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      padding: '12px 20px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start'
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
      fontSize: '28px',
      fontWeight: '700',
      textTransform: 'uppercase' as const,
      letterSpacing: '1px',
      margin: 0
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      overflow: 'hidden',
      gap: '20px',
      background: systemColors.background.content
    },
    rightPanel: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px'
    },
    footer: {
      background: systemColors.background.primary,
      padding: '12px 0',
      borderRadius: '10px',
      boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.05)',
      border: `1px solid ${systemColors.border.light}`
    }
  };

  return (
    <div style={styles.container}>
      {/* Header com botão voltar e título */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <BackButton onClick={() => navigate('home')} label="Voltar para Home" />
        </div>
        <div style={styles.headerCenter}>
          <h1 style={styles.title}>PDV</h1>
        </div>
        <div style={styles.headerRight}>
          {/* Espaço para controles futuros */}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div style={styles.mainContent}>
        {/* Sidebar esquerdo com totais */}
        <SalesSidebar
          subtotal={subtotal}
          discount={discount}
          total={total}
          itemsCount={itemsCount}
        />

        {/* Painel direito com input e lista */}
        <div style={styles.rightPanel}>
          {/* Input de produtos */}
          <ProductInput onAddProduct={handleAddProduct} />

          {/* Lista de produtos */}
          <ProductList products={products} onRemoveProduct={handleRemoveProduct} />
        </div>
      </div>

      {/* Footer com teclas de atalho */}
      <div style={styles.footer}>
        <SalesFooter />
      </div>
    </div>
  );
}

export default Sales;


