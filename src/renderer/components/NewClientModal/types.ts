// Tipos compartilhados do módulo de Novo Cliente
// Usado pelas abas e pelo modal principal

export interface Plan {
  id: string;
  name: 'basic' | 'pro' | 'enterprise';
  value: number; // valor em centavos
  kind: 'mensal' | 'anual';
  startDate: string; // ISO date (YYYY-MM-DD)
}

// Item de catálogo de planos para seleção no submodal (sem data de início)
export interface PlanCatalogItem {
  id: string;
  name: 'basic' | 'pro' | 'enterprise' | string;
  value: number;
  kind: 'mensal' | 'anual';
}


