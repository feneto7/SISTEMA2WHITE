import React, { useState, lazy, Suspense } from 'react';
import { useTheme } from '../../styles/ThemeProvider';
import { SearchBox, ProductList } from './components';
import { useNavigation } from '../../router/Navigation';
import { useClickSound } from '../../hooks/useClickSound';
import { BackButton } from '../../components/BackButton';

// Lazy loading do modal para melhor performance
// Carrega apenas quando necessário
const NewProductModal = lazy(() => import('../../components/NewProductModal').then(module => ({ default: module.NewProductModal })));

// Ícone de plus simples para o botão novo produto
const PlusIcon = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

// Página de Produtos/Serviços do sistema
// Permite buscar, visualizar e gerenciar produtos e serviços cadastrados
// Estilos importados de @styles/style.ts e componentes modularizados
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'product' | 'service';
  category: string;
  stock?: number;
}

export function Products(): JSX.Element {
  const { navigate } = useNavigation();
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Mouse Gamer RGB',
      description: 'Mouse gamer com iluminação RGB, 6 botões programáveis',
      price: 15990,
      type: 'product',
      category: 'Periféricos',
      stock: 25
    },
    {
      id: '2',
      name: 'Teclado Mecânico',
      description: 'Teclado mecânico com switches blue, layout ABNT2',
      price: 32990,
      type: 'product',
      category: 'Periféricos',
      stock: 15
    },
    {
      id: '3',
      name: 'Manutenção de Computadores',
      description: 'Serviço de manutenção preventiva e corretiva',
      price: 8000,
      type: 'service',
      category: 'Serviços'
    },
    {
      id: '4',
      name: 'Monitor LED 24"',
      description: 'Monitor LED Full HD, 75Hz, HDMI e DisplayPort',
      price: 65000,
      type: 'product',
      category: 'Monitores',
      stock: 8
    },
    {
      id: '5',
      name: 'Instalação de Software',
      description: 'Instalação e configuração de softwares',
      price: 5000,
      type: 'service',
      category: 'Serviços'
    }
  ]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100);
  };

  // Funções de callback para ações dos produtos
  const handleEditProduct = (product: Product) => {
    console.log('Editar produto:', product);
    // Aqui você pode abrir um modal de edição ou navegar para uma página de edição
  };

  const handleDeleteProduct = (product: Product) => {
    console.log('Excluir produto:', product);
    // Aqui você pode mostrar uma confirmação e excluir o produto
  };

  const [nameColumnWidth, setNameColumnWidth] = useState<number>(360);
  const [isNewProductHovered, setIsNewProductHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const minWidth = 240;
  const maxWidth = 640;

  return (
    <div style={{
      ...systemStyles.page.container,
      padding: '20px',
      gap: '20px',
      overflow: 'hidden'
    }}>
      {/* Header com botão voltar */}
      <div style={systemStyles.page.header}>
        <BackButton 
          onClick={() => navigate('home')} 
          label="Voltar para Home" 
        />
        <h1 style={systemStyles.page.title}>Produtos e Serviços</h1>
        <div style={{ width: '80px' }} />
      </div>

      {/* Barra de pesquisa (container já usa tema via systemStyles.searchBox.container) */}
      <SearchBox
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Buscar produtos ou serviços..."
        resultsCount={filteredProducts.length}
        additionalButton={
          <button
            style={{
              ...systemStyles.button.primary,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              ...(isNewProductHovered ? systemStyles.button.primaryHover : {})
            }}
            onMouseEnter={() => setIsNewProductHovered(true)}
            onMouseLeave={() => setIsNewProductHovered(false)}
            onClick={() => {
              playClickSound();
              setIsModalOpen(true);
            }}
          >
            <PlusIcon size={14} />
            Novo Produto
          </button>
        }
      />

      {/* Lista de produtos */}
      <div style={{
        ...systemStyles.list.container,
        flexDirection: 'column' as const
      }}>
        <div style={{
          ...systemStyles.list.header,
          gridTemplateColumns: `${nameColumnWidth}px 1fr 0.8fr 0.8fr 1fr 80px`,
          display: 'grid'
        }}>
          <div style={{ 
            ...systemStyles.list.headerCell, 
            width: nameColumnWidth, 
            cursor: 'col-resize'
          }}
            onMouseDown={(e) => {
              const startX = e.clientX;
              const startWidth = nameColumnWidth;
              const onMove = (ev: MouseEvent) => {
                const delta = ev.clientX - startX;
                const next = Math.min(maxWidth, Math.max(minWidth, startWidth + delta));
                setNameColumnWidth(next);
              };
              const onUp = () => {
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onUp);
              };
              window.addEventListener('mousemove', onMove);
              window.removeEventListener('mouseup', onUp);
            }}
          >
            Produto/Serviço
          </div>
          <div style={systemStyles.list.headerCell}>Categoria</div>
          <div style={systemStyles.list.headerCell}>Tipo</div>
          <div style={systemStyles.list.headerCell}>Estoque</div>
          <div style={systemStyles.list.headerCell}>Preço</div>
          <div style={systemStyles.list.headerCell}>Ações</div>
        </div>

        <ProductList 
          products={filteredProducts} 
          formatCurrency={formatCurrency}
          nameColumnWidth={nameColumnWidth}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      </div>

      {/* Modal de novo produto com lazy loading */}
      {isModalOpen && (
        <Suspense fallback={null}>
          <NewProductModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />
        </Suspense>
      )}
    </div>
  );
}