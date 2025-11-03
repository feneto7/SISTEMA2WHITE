//--------------------------------------------------------------------
// ABA: PEDIDOS SALÃO
// Gestão de mesas e pedidos por mesa com status
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { useTheme } from '../../../../styles/ThemeProvider';
import { useClickSound } from '../../../../hooks/useClickSound';
import { AppIcons } from '../../../../components/Icons/AppIcons';
import { TableCard } from './components/TableCard';
import { HallToolbar, SortOrder } from './components/HallToolbar';
import { TablesWithOrdersList, TableWithOrders } from './components/TablesWithOrdersList';
import { TableOrderDetails, Order } from './components/TableOrderDetails';

interface Table {
  id: string;
  number: number;
  status: 'free' | 'occupied' | 'reserved';
}

interface HallOrdersTabProps {
  onNewOrder?: () => void;
  onOpenPDVWithTable?: (table: Table) => void;
  onViewTableOrders?: (tableId: string) => void;
}

export function HallOrdersTab({ onNewOrder, onOpenPDVWithTable, onViewTableOrders }: HallOrdersTabProps = {}): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('alphabetical');
  const [viewMode, setViewMode] = useState<'tables' | 'tablesWithOrders'>('tables');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [searchOrdersTerm, setSearchOrdersTerm] = useState('');
  const { systemStyles, systemColors } = useTheme();
  const playClickSound = useClickSound();
  const [orderDeliveryStatus, setOrderDeliveryStatus] = useState<Record<string, boolean>>({});

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
    // Abrir PDV em tela cheia com a mesa selecionada
    if (onOpenPDVWithTable) {
      onOpenPDVWithTable(table);
    }
  };

  const handleTableClick = (table: Table) => {
    console.log('Visualizar mesa:', table.number);
    playClickSound();
    
    // Se a mesa está livre, abrir PDV com a mesa selecionada
    if (table.status === 'free') {
      if (onOpenPDVWithTable) {
        onOpenPDVWithTable(table);
      }
    } 
    // Se a mesa está ocupada, mostrar os pedidos da mesa
    else if (table.status === 'occupied') {
      // Mudar para view de mesas com pedidos e selecionar a mesa
      setViewMode('tablesWithOrders');
      setSelectedTableId(table.id);
    }
    // Se a mesa está reservada, apenas mostrar os pedidos também
    else if (table.status === 'reserved') {
      setViewMode('tablesWithOrders');
      setSelectedTableId(table.id);
    }
  };

  const handleNewOrder = () => {
    console.log('Novo pedido');
    playClickSound();
    if (onNewOrder) {
      onNewOrder();
    }
  };

  const handleViewTablesWithOrders = () => {
    console.log('Ver mesas com pedidos');
    playClickSound();
    setViewMode('tablesWithOrders');
    // Selecionar primeira mesa automaticamente se houver
    const tablesWithOrders = getTablesWithOrders();
    if (tablesWithOrders.length > 0 && !selectedTableId) {
      setSelectedTableId(tablesWithOrders[0].id);
    }
  };

  // Dados mock das mesas com pedidos (em produção viria da API)
  // Retorna mesas ocupadas/reservadas + mesas com pedidos mockados
  const getTablesWithOrders = (): TableWithOrders[] => {
    const occupiedTables = mockTables.filter(t => t.status === 'occupied' || t.status === 'reserved');
    
    // Dados mock específicos para algumas mesas (em produção viria da API)
    const mockOrdersData: Record<string, { ordersCount: number; total: number }> = {
      '1': { ordersCount: 1, total: 33.00 },
      '3': { ordersCount: 1, total: 49.50 }, // Mesa 3 está ocupada
      '4': { ordersCount: 1, total: 11.00 },
      '7': { ordersCount: 2, total: 77.00 }, // Mesa 7 está ocupada (55.00 + 22.00)
      '12': { ordersCount: 1, total: 24.20 } // Mesa 12 está ocupada
    };
    
    return occupiedTables.map(table => {
      const mockData = mockOrdersData[table.id];
      if (mockData) {
        return {
          id: table.id,
          number: table.number,
          ordersCount: mockData.ordersCount,
          total: mockData.total
        };
      }
      // Se não tem dados mock, retorna valores padrão
      return {
        id: table.id,
        number: table.number,
        ordersCount: 0,
        total: 0
      };
    });
  };

  // Dados mock dos pedidos de uma mesa (em produção viria da API)
  const getOrdersForTable = (tableId: string): Order[] => {
    if (tableId === '1') {
      return [
        {
          id: 'order-1',
          number: 24,
          time: '12:30',
          source: 'PDV',
          items: [
            {
              id: 'item-1',
              name: 'Sanduíche presunto/queijo',
              quantity: 1,
              price: 15.00,
              complements: [
                { id: 'comp-1', name: 'Bacon', quantity: 1, price: 6.00 },
                { id: 'comp-2', name: 'Queijo', quantity: 1, price: 4.00 },
                { id: 'comp-3', name: 'Queijo', quantity: 1, price: 5.00 }
              ]
            }
          ],
          subtotal: 30.00,
          serviceFee: 3.00,
          total: 33.00,
          isDelivered: false
        }
      ];
    }
    if (tableId === '4') {
      return [
        {
          id: 'order-2',
          number: 25,
          time: '13:15',
          source: 'PDV',
          items: [
            {
              id: 'item-2',
              name: 'Refrigerante 600 ml',
              quantity: 1,
              price: 11.00,
              complements: []
            }
          ],
          subtotal: 11.00,
          serviceFee: 0,
          total: 11.00,
          isDelivered: false
        }
      ];
    }
    if (tableId === '3') {
      return [
        {
          id: 'order-3',
          number: 26,
          time: '13:45',
          source: 'PDV',
          items: [
            {
              id: 'item-3',
              name: 'Pizza Grande',
              quantity: 1,
              price: 40.00,
              complements: [
                { id: 'comp-4', name: 'Bacon Extra', quantity: 1, price: 5.00 }
              ]
            }
          ],
          subtotal: 45.00,
          serviceFee: 4.50,
          total: 49.50,
          isDelivered: false
        }
      ];
    }
    if (tableId === '7') {
      return [
        {
          id: 'order-4',
          number: 27,
          time: '14:00',
          source: 'PDV',
          items: [
            {
              id: 'item-4',
              name: 'Hambúrguer Artesanal',
              quantity: 2,
              price: 25.00,
              complements: []
            }
          ],
          subtotal: 50.00,
          serviceFee: 5.00,
          total: 55.00,
          isDelivered: false
        },
        {
          id: 'order-5',
          number: 28,
          time: '14:30',
          source: 'PDV',
          items: [
            {
              id: 'item-5',
              name: 'Batata Frita',
              quantity: 2,
              price: 10.00,
              complements: []
            }
          ],
          subtotal: 20.00,
          serviceFee: 2.00,
          total: 22.00,
          isDelivered: false
        }
      ];
    }
    if (tableId === '12') {
      return [
        {
          id: 'order-6',
          number: 29,
          time: '15:00',
          source: 'PDV',
          items: [
            {
              id: 'item-6',
              name: 'Refrigerante 1L',
              quantity: 1,
              price: 22.00,
              complements: []
            }
          ],
          subtotal: 22.00,
          serviceFee: 2.20,
          total: 24.20,
          isDelivered: false
        }
      ];
    }
    return [];
  };

  const handleSelectTableWithOrders = (tableId: string) => {
    setSelectedTableId(tableId);
    playClickSound();
  };

  const handleMarkDelivered = (orderId: string) => {
    playClickSound();
    setOrderDeliveryStatus(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleCloseAccount = () => {
    console.log('Fechar conta da mesa:', selectedTableId);
    playClickSound();
    // TODO: Implementar fechamento de conta
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

  const selectedTableWithOrders = getTablesWithOrders().find(t => t.id === selectedTableId);
  const ordersForSelectedTable = selectedTableId ? getOrdersForTable(selectedTableId).map(order => ({
    ...order,
    isDelivered: orderDeliveryStatus[order.id] ?? order.isDelivered
  })) : [];

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100%',
      overflow: 'hidden'
    },
    twoColumnContainer: {
      display: 'flex',
      flex: 1,
      height: '100%',
      overflow: 'hidden',
      gap: '16px',
      alignItems: 'flex-start'
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

  // Renderizar visualização de mesas com pedidos
  if (viewMode === 'tablesWithOrders') {
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

        {/* Toolbar simplificado para mesas com pedidos */}
        <div style={{
          ...systemStyles.searchBox.container,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px'
        }}>
          {/* Campo de pesquisa */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            maxWidth: 400,
            position: 'relative' as const
          }}>
            <div style={{
              position: 'absolute' as const,
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none' as const
            }}>
              <AppIcons.Search size={16} color={systemColors.text.tertiary} />
            </div>
            <input
              type="text"
              placeholder="Mesa"
              value={searchOrdersTerm}
              onChange={(e) => setSearchOrdersTerm(e.target.value)}
              style={{
                width: '100%',
                height: 36,
                padding: '6px 10px 6px 32px',
                fontSize: 14,
                color: systemColors.text.primary,
                background: systemColors.input.background,
                border: `1px solid ${systemColors.input.border}`,
                borderRadius: 8,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                outline: 'none',
                transition: 'all 0.15s ease'
              }}
            />
          </div>

          {/* Espaço flexível */}
          <div style={{ flex: 1 }}></div>

          {/* Botão ver mapa de mesas */}
          <button
            style={{
              ...systemStyles.button.default,
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              borderRadius: 8
            }}
            onClick={() => {
              playClickSound();
              setViewMode('tables');
            }}
          >
            Ver mapa de mesas
          </button>
        </div>

        {/* Layout de duas colunas */}
        <div style={styles.twoColumnContainer}>
          {/* Lista de mesas à esquerda */}
          <TablesWithOrdersList
            tables={getTablesWithOrders()}
            selectedTableId={selectedTableId}
            onSelectTable={handleSelectTableWithOrders}
            searchValue={searchOrdersTerm}
            onSearchChange={setSearchOrdersTerm}
            hideHeader={true}
          />

          {/* Detalhes da mesa à direita */}
          <TableOrderDetails
            tableNumber={selectedTableWithOrders?.number || 0}
            tableTotal={selectedTableWithOrders?.total || 0}
            orders={ordersForSelectedTable}
            onNewOrder={() => {
              if (selectedTableId && onNewOrder) {
                onNewOrder();
              }
            }}
            onCloseAccount={handleCloseAccount}
            onMarkDelivered={handleMarkDelivered}
          />
        </div>
      </div>
    );
  }

  // Renderizar visualização normal de mesas
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
        onViewTablesWithOrders={handleViewTablesWithOrders}
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


