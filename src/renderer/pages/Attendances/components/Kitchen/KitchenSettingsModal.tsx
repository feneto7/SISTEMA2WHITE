//--------------------------------------------------------------------
// MODAL DE CONFIGURAÇÃO DA COZINHA
// Permite editar nome, tempo médio e categorias atendidas
//--------------------------------------------------------------------

import React, { useEffect, useMemo, useState } from 'react';
import { WindowHeader } from '../../../../components/WindowHeader/WindowHeader';
import { useTheme } from '../../../../styles/ThemeProvider';
import { useClickSound } from '../../../../hooks/useClickSound';
import { AppIcons } from '../../../../components/Icons/AppIcons';
import { KitchenStation } from './types';
import {
  formatQuantityByUnitType,
  convertQuantityToNumber,
  normalizeUnitType
} from '../../../../utils/quantityFormater';

interface KitchenSettingsModalProps {
  isOpen: boolean;
  kitchen: KitchenStation | null;
  availableCategories: string[];
  onClose: () => void;
  onSave: (data: {
    id: string;
    kdsName: string;
    averagePrepTime: number;
    categories: string[];
  }) => void;
}

export function KitchenSettingsModal({
  isOpen,
  kitchen,
  availableCategories,
  onClose,
  onSave
}: KitchenSettingsModalProps): JSX.Element | null {
  const { systemStyles, systemColors } = useTheme();
  const playClickSound = useClickSound();

  const [kdsName, setKdsName] = useState('');
  const [prepTime, setPrepTime] = useState('15');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const normalizedUnit = useMemo(() => normalizeUnitType('1'), []);

  useEffect(() => {
    if (!kitchen) {
      setKdsName('');
      setPrepTime('15');
      setSelectedCategories([]);
      return;
    }

    setKdsName(kitchen.kdsName);
    setPrepTime(String(kitchen.averagePrepTime));
    setSelectedCategories(kitchen.categories);
  }, [kitchen]);

  if (!isOpen || !kitchen) {
    return null;
  }

  const handleToggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(item => item !== category)
        : [...prev, category]
    );
  };

  const handleSave = () => {
    if (!kdsName.trim()) {
      alert('O nome da tela KDS é obrigatório.');
      return;
    }

    const averagePrep = convertQuantityToNumber(prepTime, normalizedUnit);
    if (averagePrep <= 0) {
      alert('Informe um tempo médio válido.');
      return;
    }

    onSave({
      id: kitchen.id,
      kdsName: kdsName.trim(),
      averagePrepTime: averagePrep,
      categories: selectedCategories
    });
    playClickSound();
  };

  return (
    <div style={systemStyles.modal.overlay}>
      <div
        style={{
          ...systemStyles.modal.container,
          width: '720px',
          maxWidth: '92vw',
          height: '560px',
          maxHeight: '92vh'
        }}
      >
        <WindowHeader title="Configurações da Cozinha" onClose={onClose} />

        <div
          style={{
            ...systemStyles.modal.content,
            padding: '24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px'
          }}
        >
          <section style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label
                style={{
                  ...systemStyles.input.label,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Nome da tela KDS <span style={{ color: systemColors.selection.blue }}>*</span>
              </label>
              <input
                type="text"
                value={kdsName}
                onChange={(event) => setKdsName(event.target.value)}
                style={systemStyles.input.field}
                placeholder="Ex: Cozinha Principal"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={systemStyles.input.label}>Tempo médio de preparação (min)</label>
              <input
                type="text"
                value={prepTime}
                onChange={(event) =>
                  setPrepTime(formatQuantityByUnitType(event.target.value, normalizedUnit))
                }
                style={systemStyles.input.field}
                placeholder="15"
              />
              <span style={{ fontSize: '12px', color: systemColors.text.secondary }}>
                Esse valor é usado para monitorar atrasos na tela KDS.
              </span>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: '12px',
              border: `1px solid ${systemColors.border.light}`,
              background: systemColors.background.primary,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AppIcons.Info size={16} color={systemColors.selection.blue} />
                <span style={{ fontSize: '12px', color: systemColors.text.secondary }}>
                  Somente pedidos das categorias selecionadas serão exibidos nessa cozinha.
                </span>
              </div>
            </div>
          </section>

          <section
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              overflow: 'hidden'
            }}
          >
            <h4
              style={{
                margin: 0,
                fontSize: '14px',
                fontWeight: 600,
                color: systemColors.text.primary
              }}
            >
              Categorias atendidas
            </h4>

            <div
              style={{
                border: `1px solid ${systemColors.border.light}`,
                borderRadius: '12px',
                background: systemColors.background.primary,
                padding: '12px',
                overflowY: 'auto',
                maxHeight: '360px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              {availableCategories.map((category) => {
                const isChecked = selectedCategories.includes(category);
                return (
                  <div
                    key={category}
                    style={systemStyles.checkbox.container}
                    onClick={() => handleToggleCategory(category)}
                  >
                    <div
                      style={{
                        ...systemStyles.checkbox.box,
                        ...(isChecked ? systemStyles.checkbox.boxChecked : {})
                      }}
                    >
                      {isChecked && <AppIcons.Check size={12} color="#FFFFFF" />}
                    </div>
                    <span style={systemStyles.checkbox.label}>{category}</span>
                  </div>
                );
              })}

              {availableCategories.length === 0 && (
                <span style={{ fontSize: '12px', color: systemColors.text.secondary }}>
                  Nenhuma categoria cadastrada.
                </span>
              )}
            </div>
          </section>
        </div>

        <div style={systemStyles.modal.footer}>
          <div style={systemStyles.modal.footerLeft}>
            <button
              style={systemStyles.button.default}
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
          <div style={systemStyles.modal.footerRight}>
            <button
              style={{
                ...systemStyles.button.primary
              }}
              onClick={handleSave}
            >
              Salvar alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



