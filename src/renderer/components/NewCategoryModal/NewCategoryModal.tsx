import React, { useMemo, useState } from 'react';
import { useTheme } from '../../styles/ThemeProvider';
import { useClickSound } from '../../hooks/useClickSound';
import { AddButton } from '../AddButton/AddButton';
import { WindowHeader } from '../WindowHeader/WindowHeader';
import { AppIcons } from '../Icons/AppIcons';

// Modal para cadastro rápido de categorias
interface NewCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingCategories: string[];
  onAdd: (category: { description: string; inMenu: boolean }) => void;
  onEdit?: (oldDescription: string, category: { description: string; inMenu: boolean }) => void;
}

export function NewCategoryModal({ isOpen, onClose, existingCategories, onAdd, onEdit }: NewCategoryModalProps): JSX.Element | null {
  // Guard clause ANTES de qualquer Hook para manter ordem estável entre renders
  if (!isOpen) return null;

  const { systemStyles, systemColors } = useTheme();
  const playClickSound = useClickSound();

  const [description, setDescription] = useState('');
  const [inMenu, setInMenu] = useState(false);
  const [localCategories, setLocalCategories] = useState<Array<{ description: string; inMenu: boolean }>>([]);
  const [editingOriginal, setEditingOriginal] = useState<string | null>(null);

  // Sincroniza lista local com props quando abrir/atualizar
  React.useEffect(() => {
    if (isOpen) {
      const base = (existingCategories || []).map((c) => ({ description: c, inMenu: false }));
      setLocalCategories(base);
    }
  }, [isOpen, existingCategories]);

  // Mantido fora de condicionais para respeitar as regras de Hooks
  const isDisabled = useMemo(() => {
    const trimmed = description.trim();
    // Verifica duplicidade desconsiderando o próprio item quando em edição
    const isDuplicate = localCategories.some((c) => {
      const sameName = c.description.toLowerCase() === trimmed.toLowerCase();
      if (!editingOriginal) return sameName;
      return sameName && c.description.toLowerCase() !== editingOriginal.toLowerCase();
    });

    // Em modo edição, habilita salvar quando houver QUALQUER mudança
    let hasChanges = true;
    if (editingOriginal) {
      const original = localCategories.find((c) => c.description === editingOriginal);
      hasChanges = (trimmed !== editingOriginal) || (original ? original.inMenu !== inMenu : false);
    }

    if (trimmed.length === 0) return true;
    if (isDuplicate) return true;
    if (editingOriginal) return !hasChanges;
    return false;
  }, [description, inMenu, localCategories, editingOriginal]);

  const handleAdd = () => {
    if (isDisabled) return;
    playClickSound();
    if (editingOriginal) {
      const updated = { description: description.trim(), inMenu };
      setLocalCategories((prev) => prev.map((c) => (c.description === editingOriginal ? updated : c)));
      onEdit?.(editingOriginal, updated);
      setEditingOriginal(null);
      setDescription('');
      setInMenu(false);
    } else {
      onAdd({ description: description.trim(), inMenu });
      setLocalCategories((prev) => {
        const next = [...prev, { description: description.trim(), inMenu }];
        return next;
      });
      setDescription('');
      setInMenu(false);
    }
  };

  const handleEdit = (item: { description: string; inMenu: boolean }) => {
    setDescription(item.description);
    setInMenu(item.inMenu);
    setEditingOriginal(item.description);
  };

  const sortedCategories = useMemo(() => {
    return [...localCategories].sort((a, b) => a.description.localeCompare(b.description, 'pt-BR', { sensitivity: 'base' }));
  }, [localCategories]);

  return (
    <div style={systemStyles.modal.overlay}>
      <div style={{
        ...systemStyles.window,
        background: systemColors.background.window,
        width: 520,
        maxWidth: '92vw',
        height: 420,
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column' as const,
        overflow: 'hidden'
      }}>
        <WindowHeader title="Nova Categoria" onClose={onClose} />

        {/* Conteúdo */}
        <div style={{
          background: systemColors.background.content,
          padding: 20,
          paddingBottom: 28,
          display: 'flex',
          flexDirection: 'column' as const,
          gap: 16,
          flex: 1,
          overflow: 'hidden'
        }}>
          {/* Linha de cadastro rápido */}
          <div>
            <label style={systemStyles.input.label}>Descrição:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 12, alignItems: 'end' }}>
              <input
                type="text"
                style={{ ...systemStyles.input.field, width: '100%' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
                placeholder="Nome da categoria"
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={inMenu}
                  onChange={(e) => setInMenu(e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ fontSize: 12, color: systemColors.text.label }}>Cardápio</span>
              </label>
              <div>
                <AddButton
                  label={editingOriginal ? 'Editar' : 'Cadastrar'}
                  variant={editingOriginal ? 'edit' : 'add'}
                  onClick={handleAdd}
                  disabled={isDisabled}
                />
              </div>
            </div>
          </div>

          {/* Lista de categorias existentes */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' as const }}>
            <h4 style={{
              fontSize: 13,
              fontWeight: 600,
              color: systemColors.text.secondary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              margin: '8px 0 8px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
            }}>Categorias cadastradas</h4>

            <div style={{ position: 'relative' as const, flex: 1, minHeight: 0 }}>
              <div style={{
                ...systemStyles.modalList.container,
                filter: editingOriginal ? 'blur(2px) grayscale(0.6)' : 'none',
                pointerEvents: editingOriginal ? 'none' : 'auto',
                overflowY: 'auto',
                overflowX: 'hidden'
              }}>
                {sortedCategories.length === 0 ? (
                  <div style={{ padding: 16, fontSize: 12, color: systemColors.text.secondary }}>
                    Nenhuma categoria cadastrada
                  </div>
                ) : (
                  <div style={{ padding: 8 }}>
                    {/* Cabeçalho */}
                    <div style={systemStyles.modalList.header}>
                      <div>Descrição</div>
                      <div>Cardápio</div>
                      <div style={{ textAlign: 'right' as const }}>Ações</div>
                    </div>

                    {/* Linhas */}
                    {sortedCategories.map((item) => (
                      <div key={item.description} style={systemStyles.modalList.row}>
                        <div style={{ fontSize: 13 }}>{item.description}</div>
                        <div style={{ fontSize: 13 }}>{item.inMenu ? 'Sim' : 'Não'}</div>
                        <div style={systemStyles.modalList.actions}>
                          <button
                            onClick={() => handleEdit(item)}
                            title="Editar"
                            aria-label="Editar"
                            style={{
                              border: 'none',
                              background: 'transparent',
                              padding: 4,
                              borderRadius: 6,
                              cursor: 'pointer'
                            }}
                          >
                            <AppIcons.Edit size={14} color={systemColors.text.secondary} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {editingOriginal && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <button
                    style={{ ...systemStyles.button.default, padding: '10px 16px' }}
                    onClick={() => { setEditingOriginal(null); setDescription(''); setInMenu(false); }}
                  >
                    Cancelar edição
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer removido - o cadastro é feito pelo AddButton ao lado do campo */}
      </div>
    </div>
  );
}


