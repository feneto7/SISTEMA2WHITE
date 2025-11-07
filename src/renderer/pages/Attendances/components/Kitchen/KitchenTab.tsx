//--------------------------------------------------------------------
// ABA: COZINHA
// Visualização de pedidos em produção para a equipe da cozinha
//--------------------------------------------------------------------
import React, { useMemo, useState } from 'react';
import { useTheme } from '../../../../styles/ThemeProvider';
import { useClickSound } from '../../../../hooks/useClickSound';
import { KitchenCard } from './KitchenCard';
import { KitchenSettingsModal } from './KitchenSettingsModal';
import { KitchenKDSView } from './KitchenKDSView';
import { KitchenStation, KitchenOrder } from './types';
import { AppIcons } from '../../../../components/Icons/AppIcons';

const defaultCategories = [
  'Pratos principais',
  'Entradas',
  'Sobremesas',
  'Bebidas quentes',
  'Pizzas',
  'Lanches rápidos'
];

const createDefaultOrders = (): KitchenOrder[] => ([
  {
    id: 'order-1',
    code: '#1024',
    table: 'Mesa 12',
    type: 'mesa',
    createdAt: new Date().toISOString(),
    elapsedMinutes: 8,
    status: 'preparing',
    priority: 'normal',
    items: [
      {
        id: 'item-1',
        name: 'Sanduíche presunto/queijo',
        quantity: 1,
        notes: 'Turbinado',
        complements: ['Bacon', 'Queijo'],
        extraPriceCents: 500,
        isReady: false
      },
      {
        id: 'item-2',
        name: 'Açaí 200 ml',
        quantity: 1,
        complements: ['Granola', 'Leite', 'Amendoim'],
        isReady: false
      }
    ]
  },
  {
    id: 'order-2',
    code: '#1025',
    table: 'Retirada balcão',
    type: 'balcao',
    createdAt: new Date().toISOString(),
    elapsedMinutes: 12,
    status: 'preparing',
    priority: 'high',
    items: [
      {
        id: 'item-3',
        name: 'Hambúrguer premium',
        quantity: 2,
        notes: 'Adicionar queijo',
        complements: ['Ponto médio'],
        isReady: false
      },
      {
        id: 'item-4',
        name: 'Batata rústica',
        quantity: 1,
        complements: ['Molho da casa'],
        isReady: false
      }
    ]
  },
  {
    id: 'order-3',
    code: '#1026',
    table: 'Mesa 4',
    type: 'mesa',
    createdAt: new Date().toISOString(),
    elapsedMinutes: 5,
    status: 'preparing',
    priority: 'normal',
    items: [
      {
        id: 'item-5',
        name: 'Risoto de cogumelos',
        quantity: 1,
        notes: 'Sem queijo',
        complements: ['Cogumelo extra'],
        isReady: false
      }
    ]
  },
  {
    id: 'order-4',
    code: '#1027',
    table: 'Delivery',
    type: 'delivery',
    createdAt: new Date().toISOString(),
    elapsedMinutes: 18,
    status: 'preparing',
    priority: 'high',
    items: [
      {
        id: 'item-6',
        name: 'Yakissoba light',
        quantity: 2,
        complements: ['Molho agridoce'],
        isReady: false
      },
      {
        id: 'item-7',
        name: 'Suco natural 500 ml',
        quantity: 1,
        notes: 'Pouco gelo',
        isReady: false
      }
    ]
  },
  {
    id: 'order-5',
    code: '#1028',
    table: 'Mesa 18',
    type: 'mesa',
    createdAt: new Date().toISOString(),
    elapsedMinutes: 22,
    status: 'preparing',
    priority: 'normal',
    items: [
      {
        id: 'item-8',
        name: 'Pizza quatro queijos',
        quantity: 1,
        complements: ['Borda recheada'],
        isReady: false
      },
      {
        id: 'item-9',
        name: 'Refrigerante lata',
        quantity: 2,
        isReady: false
      }
    ]
  }
]);

const buildDefaultStations = (): KitchenStation[] => [
  {
    id: 'station-main',
    kdsName: 'Cozinha',
    averagePrepTime: 15,
    categories: ['Pratos principais', 'Entradas'],
    isPrimary: true,
    orders: createDefaultOrders(),
    lastSync: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }
];

interface AddKitchenTileProps {
  onClick: () => void;
}

function AddKitchenTile({ onClick }: AddKitchenTileProps): JSX.Element {
  const { systemStyles, systemColors } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...systemStyles.kitchen.addCard.container,
        ...(isHovered ? systemStyles.kitchen.addCard.containerHover : {})
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={systemStyles.kitchen.addCard.iconWrapper}>
        <AppIcons.Add
          size={18}
          color={isHovered ? systemColors.selection.blue : systemColors.text.secondary}
        />
      </div>
      <span style={systemStyles.kitchen.addCard.label}>Adicionar tela KDS</span>
    </div>
  );
}

export function KitchenTab(): JSX.Element {
  const { systemStyles, systemColors } = useTheme();
  const playClickSound = useClickSound();

  const [kitchens, setKitchens] = useState<KitchenStation[]>(() => buildDefaultStations());
  const [selectedKitchenId, setSelectedKitchenId] = useState<string | null>(null);
  const [settingsKitchenId, setSettingsKitchenId] = useState<string | null>(null);

  const activeKitchen = useMemo(
    () => kitchens.find(kitchen => kitchen.id === selectedKitchenId) ?? null,
    [kitchens, selectedKitchenId]
  );

  const editingKitchen = useMemo(
    () => kitchens.find(kitchen => kitchen.id === settingsKitchenId) ?? null,
    [kitchens, settingsKitchenId]
  );

  const handleOpenKDS = (stationId: string) => {
    playClickSound();
    setSelectedKitchenId(stationId);
  };

  const handleCloseKDS = () => {
    setSelectedKitchenId(null);
  };

  const handleOpenSettings = (stationId: string) => {
    playClickSound();
    setSettingsKitchenId(stationId);
  };

  const handleCloseSettings = () => {
    setSettingsKitchenId(null);
  };

  const handleAddKitchen = () => {
    playClickSound();
    const nextIndex = kitchens.length + 1;
    const newKitchenId = `station-${Date.now()}`;
    const newKitchen: KitchenStation = {
      id: newKitchenId,
      kdsName: `Cozinha ${nextIndex}`,
      averagePrepTime: 15,
      categories: [],
      isPrimary: false,
      orders: [],
      lastSync: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setKitchens(prev => [...prev, newKitchen]);
    setSettingsKitchenId(newKitchenId);
  };

  const handleSaveSettings = (data: {
    id: string;
    kdsName: string;
    averagePrepTime: number;
    categories: string[];
  }) => {
    setKitchens(prev =>
      prev.map(kitchen =>
        kitchen.id === data.id
          ? {
              ...kitchen,
              kdsName: data.kdsName,
              averagePrepTime: data.averagePrepTime,
              categories: data.categories
            }
          : kitchen
      )
    );
    handleCloseSettings();
  };

  const handleDeleteKitchen = (stationId: string) => {
    if (kitchens.length === 1) {
      alert('Mantenha pelo menos uma cozinha cadastrada.');
      return;
    }

    setKitchens(prev => prev.filter(kitchen => kitchen.id !== stationId));
    if (selectedKitchenId === stationId) {
      setSelectedKitchenId(null);
    }
    if (settingsKitchenId === stationId) {
      setSettingsKitchenId(null);
    }
  };

  const handleRefreshKitchen = (stationId: string) => {
    setKitchens(prev =>
      prev.map(kitchen =>
        kitchen.id === stationId
          ? {
              ...kitchen,
              lastSync: new Date().toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              })
            }
          : kitchen
      )
    );
  };

  const handleMarkOrderReady = (stationId: string, orderId: string) => {
    setKitchens(prev =>
      prev.map(kitchen => {
        if (kitchen.id !== stationId) return kitchen;
        return {
          ...kitchen,
          orders: kitchen.orders.map(order =>
            order.id === orderId
              ? { ...order, status: 'ready' }
              : order
          )
        };
      })
    );
  };

  const handleToggleItemReady = (stationId: string, orderId: string, itemId: string) => {
    setKitchens(prev =>
      prev.map(kitchen => {
        if (kitchen.id !== stationId) return kitchen;
        return {
          ...kitchen,
          orders: kitchen.orders.map(order => {
            if (order.id !== orderId) return order;
            const updatedItems = order.items.map(item =>
              item.id === itemId
                ? { ...item, isReady: !item.isReady }
                : item
            );

            return {
              ...order,
              items: updatedItems
            };
          })
        };
      })
    );
  };

  const kitchenStyles = systemStyles.kitchen;

  return (
    <div style={kitchenStyles.container}>
      <div style={kitchenStyles.header}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
          <h2 style={kitchenStyles.title}>Cozinhas (KDS)</h2>
          <p style={kitchenStyles.description}>
            Organize as estações de preparo e acompanhe os pedidos em tempo real na tela KDS.
          </p>
        </div>
      </div>

      <div style={kitchenStyles.grid}>
        <AddKitchenTile onClick={handleAddKitchen} />
        {kitchens.map(kitchen => (
          <KitchenCard
            key={kitchen.id}
            station={kitchen}
            onOpenKDS={handleOpenKDS}
            onEdit={handleOpenSettings}
            onDelete={handleDeleteKitchen}
            disableDelete={kitchens.length === 1}
          />
        ))}
      </div>

      {kitchens.length === 0 && (
        <div style={{ ...kitchenStyles.emptyState, border: 'none', padding: '20px 0' }}>
          <AppIcons.Info size={20} color={systemColors.selection.blue} />
          <span>Crie sua primeira tela KDS para direcionar pedidos da cozinha.</span>
        </div>
      )}

      {editingKitchen && (
        <KitchenSettingsModal
          isOpen={Boolean(editingKitchen)}
          kitchen={editingKitchen}
          availableCategories={defaultCategories}
          onClose={handleCloseSettings}
          onSave={handleSaveSettings}
        />
      )}

      {activeKitchen && (
        <KitchenKDSView
          kitchen={activeKitchen}
          onClose={handleCloseKDS}
          onRefresh={handleRefreshKitchen}
          onMarkAsReady={handleMarkOrderReady}
          onToggleItemReady={handleToggleItemReady}
        />
      )}
    </div>
  );
}

