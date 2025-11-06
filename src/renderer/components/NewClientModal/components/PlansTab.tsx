import React, { useMemo, useState } from 'react';
import { useTheme } from '../../../styles/ThemeProvider';
import { Plan, PlanCatalogItem } from '../types';
import { PlanCatalogModal } from './PlanCatalogModal';
import { useClickSound } from '../../../hooks/useClickSound';

interface PlansTabProps {
  plans: Plan[];
  onAddPlan: (plan: Omit<Plan, 'id'>) => void;
  onRemovePlan: (planId: string) => void;
}

// Aba de planos: botão de adicionar e listagem dos planos vinculados ao cliente
export function PlansTab({ plans, onAddPlan, onRemovePlan }: PlansTabProps): JSX.Element {
  const { systemStyles, systemColors } = useTheme();
  const playClickSound = useClickSound();

  // Editor inline removido: agora apenas via catálogo

  // Submodal (catálogo)
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [catalogPlans, setCatalogPlans] = useState<PlanCatalogItem[]>([
    { id: 'cat-basic', name: 'basic', value: 2990, kind: 'mensal' },
    { id: 'cat-pro', name: 'pro', value: 9990, kind: 'mensal' },
    { id: 'cat-enterprise', name: 'enterprise', value: 29990, kind: 'mensal' }
  ]);

  const currencyFormatter = useMemo(() => new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }), []);

  // Sem editor inline

  const openCatalogModal = () => setIsCatalogModalOpen(true);

  const handleSelectFromCatalog = (item: PlanCatalogItem, startDate: string) => {
    onAddPlan({
      name: (['basic', 'pro', 'enterprise'].includes(item.name) ? (item.name as Plan['name']) : 'basic'),
      value: item.value,
      kind: item.kind,
      startDate: startDate || new Date().toISOString().slice(0, 10)
    });
    setIsCatalogModalOpen(false);
  };

  const handleAddCatalogPlan = (item: PlanCatalogItem) => {
    setCatalogPlans(prev => [item, ...prev]);
  };

  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Ações superiores */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          style={{ ...systemStyles.button.default }}
          onClick={() => { playClickSound(); openCatalogModal(); }}
        >
          Abrir Catálogo
        </button>
      </div>

      {/* Editor inline removido */}

      {/* Tabela de planos */}
      <div style={{
        border: `1px solid ${systemColors.border.light}`,
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr 1fr 80px',
          gap: '0',
          background: systemColors.background.primary,
          borderBottom: `1px solid ${systemColors.border.light}`,
          padding: '10px 12px',
          fontWeight: 600,
          fontSize: '12px',
          color: systemColors.text.label
        }}>
          <div>Plano</div>
          <div>Valor</div>
          <div>Tipo</div>
          <div>Data de Início</div>
          <div>Ações</div>
        </div>

        {plans.length === 0 && (
          <div style={{ padding: '14px 12px', color: systemColors.text.secondary, fontSize: '13px' }}>
            Nenhum plano vinculado.
          </div>
        )}

        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr 1fr 80px',
              padding: '10px 12px',
              borderTop: `1px solid ${systemColors.border.divider}`,
              alignItems: 'center'
            }}
          >
            <div>{plan.name === 'basic' ? 'Básico' : plan.name === 'pro' ? 'Pro' : 'Enterprise'}</div>
            <div>{currencyFormatter.format((plan.value || 0) / 100)}</div>
            <div style={{ textTransform: 'capitalize' }}>{plan.kind}</div>
            <div>{new Date(plan.startDate).toLocaleDateString('pt-BR')}</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                style={systemStyles.actionButton.container}
                onMouseDown={(e) => Object.assign(e.currentTarget.style, systemStyles.actionButton.containerActive)}
                onMouseUp={(e) => Object.assign(e.currentTarget.style, systemStyles.actionButton.container)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, systemStyles.actionButton.container)}
                onClick={() => { playClickSound(); onRemovePlan(plan.id); }}
                aria-label="Remover"
                title="Remover"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    <PlanCatalogModal
      isOpen={isCatalogModalOpen}
      onClose={() => setIsCatalogModalOpen(false)}
      catalogPlans={catalogPlans}
      onAddCatalogPlan={handleAddCatalogPlan}
      onEditCatalogPlan={(edited) => setCatalogPlans(prev => prev.map(p => p.id === edited.id ? edited : p))}
      onSelectPlan={handleSelectFromCatalog}
      defaultStartDate={new Date().toISOString().slice(0, 10)}
    />
    </>
  );
}


