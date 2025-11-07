//--------------------------------------------------------------------
// TIPOS DE DADOS DA COZINHA KDS
// Mantém as interfaces compartilhadas entre os componentes do módulo
//--------------------------------------------------------------------

export type KitchenOrderStatus = 'preparing' | 'ready';
export type KitchenOrderPriority = 'normal' | 'high';

export interface KitchenOrderItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  complements?: string[];
  extraPriceCents?: number;
  isReady?: boolean;
}

export interface KitchenOrder {
  id: string;
  code: string;
  table: string;
  type: 'mesa' | 'balcao' | 'delivery';
  createdAt: string;
  elapsedMinutes: number;
  status: KitchenOrderStatus;
  priority: KitchenOrderPriority;
  items: KitchenOrderItem[];
}

export interface KitchenStation {
  id: string;
  kdsName: string;
  averagePrepTime: number;
  categories: string[];
  isPrimary: boolean;
  orders: KitchenOrder[];
  lastSync: string;
}


