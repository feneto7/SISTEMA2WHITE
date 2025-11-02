//--------------------------------------------------------------------
// ABA: PEDIDOS SALÃO
// Gestão de mesas e pedidos por mesa com status
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { useTheme } from '../../../../styles/ThemeProvider';
import { useClickSound } from '../../../../hooks/useClickSound';
import { TableCard } from './components/TableCard';
import { HallToolbar, SortOrder } from './components/HallToolbar';

interface Table {
  id: string;
  number: number;
  status: 'free' | 'occupied' | 'reserved';
}

interface HallOrdersTabProps {
  onNewOrder?: () => void;
}

export function HallOrdersTab({ onNewOrder }: HallOrdersTabProps = {}): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('alphabetical');
  const { systemStyles, systemColors } = useTheme();
  const playClickSound = useClickSound();

  // Dados mock das mesas (em produção viria da API)
  const mockTables: Table[] = [
    { id: '1', number: 1, status: 'free' },
    { id: '2', number: 2, status: 'free' },
    { id: '3', number: 3, status: 'occupied' },
    { id: '4', number: 4, status: 'free' },
    { id: '5', number: 5, status: 'reserved' },
    { id: '6', number: 6, status: 'free' },
    { id: '7', number: 7, status: 'occupied' },
    { id: '8', number: 8, status: 'free' },
    { id: '9', number: 9, status: 'free' },
    { id: '10', number: 10, status: 'free' },
    { id: '11', number: 11, status: 'free' },
    { id: '12', number: 12, status: 'occupied' }
  ];

  const handleAddOrder = (table: Table) => {
    console.log('Adicionar pedido para mesa:', table.number);
    playClickSound();
    // TODO: Implementar abertura do modal de novo pedido
  };

  const handleTableClick = (table: Table) => {
    console.log('Visualizar mesa:', table.number);
    playClickSound();
    // TODO: Implementar visualização da mesa e seus pedidos
  };

  const handleNewOrder = () => {
    console.log('Novo pedido');
    playClickSound();
    if (onNewOrder) {
      onNewOrder();
    }
  };

  // Filtrar mesas baseado na busca
  const filteredTables = mockTables.filter(table =>
    `Mesa ${table.number}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordenar mesas
  const sortedTables = [...filteredTables].sort((a, b) => {
    switch (sortOrder) {
      case 'number':
        return a.number - b.number;
      case 'status':
        const statusOrder = { 'free': 0, 'reserved': 1, 'occupied': 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      case 'alphabetical':
      default:
        return a.number - b.number;
    }
  });

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100%',
      overflow: 'hidden'
    },
    titleBar: {
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      padding: '8px 16px',
      marginBottom: 20,
      flexShrink: 0
    },
    titleBarCenter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
      ...systemStyles.page.title,
      margin: 0,
      fontSize: '16px'
    },
    content: {
      flex: 1,
      overflow: 'auto',
      padding: 20,
      background: systemColors.background.content
    },
    tablesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: 16
    }
  };

  return (
    <div style={styles.container}>
      {/* Barra de título */}
      <div style={styles.titleBar}>
        <div></div>
        <div style={styles.titleBarCenter}>
          <h2 style={styles.title}>Pedidos do Salão</h2>
        </div>
        <div></div>
      </div>
      
      {/* Toolbar com pesquisa, ordenação e botão novo pedido */}
      <HallToolbar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        onNewOrder={handleNewOrder}
      />

      {/* Grid de mesas */}
      <div style={styles.content}>
        <div style={styles.tablesGrid}>
          {sortedTables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              onAddOrder={() => handleAddOrder(table)}
              onClick={() => handleTableClick(table)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


