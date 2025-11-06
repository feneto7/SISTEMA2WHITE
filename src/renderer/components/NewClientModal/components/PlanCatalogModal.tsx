import React, { useMemo, useState } from 'react';
import { useTheme } from '../../../styles/ThemeProvider';
import { Plan, PlanCatalogItem } from '../types';
import { AddButton } from '../../AddButton/AddButton';
import { WindowHeader } from '../../WindowHeader/WindowHeader';
import { useClickSound } from '../../../hooks/useClickSound';

interface PlanCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalogPlans: PlanCatalogItem[];
  onAddCatalogPlan: (item: PlanCatalogItem) => void;
  onEditCatalogPlan?: (item: PlanCatalogItem) => void;
  onSelectPlan: (item: PlanCatalogItem, startDate: string) => void;
  defaultStartDate?: string;
}

// Submodal para selecionar ou cadastrar um plano no catálogo
export function PlanCatalogModal({
  isOpen,
  onClose,
  catalogPlans,
  onAddCatalogPlan,
  onEditCatalogPlan,
  onSelectPlan,
  defaultStartDate
}: PlanCatalogModalProps): JSX.Element | null {
  const { systemStyles, systemColors } = useTheme();
  const playClickSound = useClickSound();

  const [createPlan, setCreatePlan] = useState<PlanCatalogItem>({ id: '', name: 'basic', value: 0, kind: 'mensal' });
  const [createStartDate, setCreateStartDate] = useState<string>(
    defaultStartDate || new Date().toISOString().slice(0, 10)
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  const currencyFormatter = useMemo(() => new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }), []);

  if (!isOpen) return null;

  const handleCreateCatalogPlan = () => {
    const normalizedName = (['basic', 'pro', 'enterprise'].includes(createPlan.name)
      ? createPlan.name
      : createPlan.name.trim() || 'basic') as PlanCatalogItem['name'];

    if (editingId) {
      const edited: PlanCatalogItem = {
        id: editingId,
        name: normalizedName,
        value: createPlan.value || 0,
        kind: createPlan.kind
      };
      onEditCatalogPlan?.(edited);
      setEditingId(null);
      return;
    }

    const id = `cat-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    const newItem: PlanCatalogItem = {
      id,
      name: normalizedName,
      value: createPlan.value || 0,
      kind: createPlan.kind
    };
    onAddCatalogPlan(newItem);
  };

  const formatPlanName = (name: PlanCatalogItem['name'] | Plan['name']) => (
    name === 'basic' ? 'Básico' : name === 'pro' ? 'Pro' : (name === 'enterprise' ? 'Enterprise' : String(name))
  );

  return (
    <div style={systemStyles.modal.overlay}>
      <div style={{ ...systemStyles.modal.container, width: '720px', maxWidth: '92vw' }}>
        <WindowHeader title="Planos" onClose={onClose} />

        <div style={systemStyles.modal.content}>
          {/* Formulário inline para novo plano do catálogo */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr 1fr 1fr auto',
            gap: '12px',
            alignItems: 'end',
            marginBottom: '12px'
          }}>
            <div style={systemStyles.input.container}>
              <label style={systemStyles.input.label}>Plano</label>
              <input
                style={systemStyles.input.field}
                placeholder="Nome do plano"
                value={createPlan.name}
                onChange={(e) => setCreatePlan(p => ({ ...p, name: e.target.value }))}
                onFocus={(e) => Object.assign(e.currentTarget.style, systemStyles.input.fieldFocus)}
                onBlur={(e) => Object.assign(e.currentTarget.style, systemStyles.input.field)}
              />
            </div>
            <div style={systemStyles.input.container}>
              <label style={systemStyles.input.label}>Valor</label>
              <input
                style={systemStyles.input.field}
                inputMode="numeric"
                value={currencyFormatter.format((createPlan.value || 0) / 100)}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/[^\d]/g, '');
                  const cents = Number(onlyDigits || '0');
                  setCreatePlan(p => ({ ...p, value: cents }));
                }}
                placeholder="R$ 0,00"
                onFocus={(e) => Object.assign(e.currentTarget.style, systemStyles.input.fieldFocus)}
                onBlur={(e) => Object.assign(e.currentTarget.style, systemStyles.input.field)}
              />
            </div>
            <div style={systemStyles.input.container}>
              <label style={systemStyles.input.label}>Tipo</label>
              <div style={systemStyles.select.fieldWrapper}>
                <select
                  style={systemStyles.select.field}
                  value={createPlan.kind}
                  onChange={(e) => setCreatePlan(p => ({ ...p, kind: e.target.value as PlanCatalogItem['kind'] }))}
                  onFocus={(e) => Object.assign(e.currentTarget.style, systemStyles.input.fieldFocus)}
                  onBlur={(e) => Object.assign(e.currentTarget.style, systemStyles.select.field)}
                >
                  <option value="mensal">Mensal</option>
                  <option value="anual">Anual</option>
                </select>
                <div style={systemStyles.select.arrow}>
                  <span style={systemStyles.select.arrowIcon}></span>
                </div>
              </div>
            </div>
            <div style={systemStyles.input.container}>
              <label style={systemStyles.input.label}>Data de Início</label>
              <input
                style={systemStyles.input.field}
                type="date"
                value={createStartDate}
                onChange={(e) => setCreateStartDate(e.target.value)}
                onFocus={(e) => Object.assign(e.currentTarget.style, systemStyles.input.fieldFocus)}
                onBlur={(e) => Object.assign(e.currentTarget.style, systemStyles.input.field)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <AddButton onClick={() => { playClickSound(); handleCreateCatalogPlan(); }} label={editingId ? 'Editar' : 'Adicionar'} variant={editingId ? 'edit' : 'add'} />
            </div>
          </div>

          {/* Lista do catálogo */}
          <div style={{ position: 'relative' as const }}>
            <div style={{
                border: `1px solid ${systemColors.border.light}`,
                borderRadius: '8px',
                overflow: 'hidden',
                filter: editingId ? 'blur(2px) grayscale(0.6)' : 'none',
                pointerEvents: editingId ? 'none' : 'auto'
              }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 1fr 100px',
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
                <div>Ações</div>
              </div>
              {catalogPlans.length === 0 && (
                <div style={{ padding: '14px 12px', color: systemColors.text.secondary, fontSize: '13px' }}>
                  Nenhum plano no catálogo.
                </div>
              )}
               {catalogPlans.map(item => (
                <div key={item.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr 1fr 100px',
                  padding: '10px 12px',
                  borderTop: `1px solid ${systemColors.border.divider}`,
                  alignItems: 'center'
                }}>
                  <div>{formatPlanName(item.name)}</div>
                  <div>{currencyFormatter.format((item.value || 0) / 100)}</div>
                  <div style={{ textTransform: 'capitalize' }}>{item.kind}</div>
                   <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                     <button
                       style={systemStyles.actionButton.container}
                       onMouseDown={(e) => Object.assign(e.currentTarget.style, systemStyles.actionButton.containerActive)}
                       onMouseUp={(e) => Object.assign(e.currentTarget.style, systemStyles.actionButton.container)}
                       onMouseLeave={(e) => Object.assign(e.currentTarget.style, systemStyles.actionButton.container)}
                       onClick={() => { playClickSound(); onSelectPlan(item, createStartDate); }}
                       aria-label="Selecionar"
                       title="Selecionar"
                     >
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                         <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                       </svg>
                     </button>
                     <button
                       style={systemStyles.actionButton.container}
                       onMouseDown={(e) => Object.assign(e.currentTarget.style, systemStyles.actionButton.containerActive)}
                       onMouseUp={(e) => Object.assign(e.currentTarget.style, systemStyles.actionButton.container)}
                       onMouseLeave={(e) => Object.assign(e.currentTarget.style, systemStyles.actionButton.container)}
                       onClick={() => { playClickSound(); setCreatePlan({ id: item.id, name: item.name, value: item.value, kind: item.kind }); setEditingId(item.id); }}
                       aria-label="Editar"
                       title="Editar"
                     >
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                         <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" />
                       </svg>
                     </button>
                   </div>
                </div>
              ))}
            </div>

            {editingId && (
              <div style={{
                position: 'absolute' as const,
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <button
                  style={{ ...systemStyles.button.default, padding: '8px 14px' }}
                  onClick={() => { setEditingId(null); }}
                >
                  Cancelar edição
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ ...systemStyles.modal.footer, justifyContent: 'flex-end' }}>
          <div style={systemStyles.modal.footerRight}>
            <button style={systemStyles.button.default} onClick={() => { playClickSound(); onClose(); }}>Fechar</button>
          </div>
        </div>
      </div>
    </div>
  );
}


