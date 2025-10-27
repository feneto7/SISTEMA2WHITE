import React, { useState, useRef } from 'react';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { systemStyles, systemColors } from '../../../../../styles/systemStyle';
import { AppIcons } from '../../../../../components/Icons/AppIcons';
import { useElementScrollbarStyles } from '../../../../../hooks/useScrollbarStyles';

interface Document {
  id: string;
  tipo: string;
  numero: string;
  serie: string;
  chave: string;
  emitente: string;
  destinatario: string;
  valor: number;
  dataEmissao: string;
  status: string;
}

interface DocumentsTabProps {
  formData: any;
  onUpdateFormData: (field: string, value: any) => void;
}

export function DocumentsTab({ formData, onUpdateFormData }: DocumentsTabProps): JSX.Element {
  const playClickSound = useClickSound();
  const [documents, setDocuments] = useState<Document[]>([]);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Aplicar estilos de scrollbar específicos para listas
  useElementScrollbarStyles(listContainerRef, 'list');

  const handleAddDocument = () => {
    playClickSound();
    // TODO: Implementar modal para adicionar documento
    console.log('Adicionar documento');
  };

  const handleEditDocument = (document: Document) => {
    playClickSound();
    // TODO: Implementar edição de documento
    console.log('Editar documento:', document);
  };

  const handleDeleteDocument = (id: string) => {
    playClickSound();
    if (confirm('Tem certeza que deseja excluir este documento?')) {
      setDocuments(prev => prev.filter(d => d.id !== id));
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    addButton: {
      ...systemStyles.button.primary,
      padding: '8px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    section: {
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '13px',
      fontWeight: '600',
      color: systemColors.text.primary,
      margin: '0 0 16px 0'
    },
    listContainer: {
      background: systemColors.background.content,
      borderRadius: '8px',
      border: `1px solid ${systemColors.border.light}`,
      overflow: 'hidden'
    },
    listHeader: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 80px',
      gap: '16px',
      padding: '12px 16px',
      background: systemColors.background.primary,
      borderBottom: `1px solid ${systemColors.border.light}`,
      ...systemStyles.list.headerCell
    },
    headerCell: {
      ...systemStyles.list.headerCell
    },
    listContent: {
      maxHeight: '400px',
      overflow: 'auto'
    },
    listRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 80px',
      gap: '16px',
      padding: '12px 16px',
      borderBottom: `1px solid ${systemColors.border.divider}`,
      transition: 'all 0.15s ease',
      cursor: 'pointer'
    },
    rowCell: {
      fontSize: '12px',
      color: systemColors.text.primary,
      display: 'flex',
      alignItems: 'center'
    },
    actionButtons: {
      display: 'flex',
      gap: '6px',
      justifyContent: 'center',
      alignItems: 'center'
    },
    actionButton: {
      ...systemStyles.button.default,
      padding: '4px',
      width: '24px',
      height: '24px'
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      color: systemColors.text.secondary
    },
    emptyText: {
      fontSize: '14px',
      margin: 0
    },
    infoSection: {
      marginTop: '16px',
      padding: '16px',
      background: systemColors.background.content,
      borderRadius: '8px',
      border: `1px solid ${systemColors.border.light}`
    },
    infoSectionTitle: {
      fontSize: '13px',
      fontWeight: '600',
      color: systemColors.text.primary,
      marginBottom: '12px'
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: `1px solid ${systemColors.border.divider}`
    },
    summaryLabel: {
      fontSize: '12px',
      color: systemColors.text.secondary
    },
    summaryValue: {
      fontSize: '12px',
      fontWeight: '600',
      color: systemColors.text.primary
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0 0 0',
      marginTop: '8px',
      borderTop: `2px solid ${systemColors.border.light}`
    },
    totalLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: systemColors.text.primary
    },
    totalValue: {
      fontSize: '16px',
      fontWeight: '700',
      color: systemColors.text.primary
    }
  };

  const totalValue = documents.reduce((sum, doc) => sum + doc.valor, 0);

  return (
    <div>
      {/* Seção de Documentos Anexados */}
      <div style={styles.section}>
        <div style={styles.header}>
          <h4 style={styles.sectionTitle}>Documentos Anexados</h4>
          <button
            style={styles.addButton}
            onClick={handleAddDocument}
          >
            <AppIcons.Add size={14} />
            Adicionar Documento
          </button>
        </div>

        {/* Lista de Documentos */}
        <div ref={listContainerRef} style={styles.listContainer}>
        <div style={styles.listHeader}>
          <div style={styles.headerCell}>Tipo</div>
          <div style={styles.headerCell}>Número</div>
          <div style={styles.headerCell}>Emitente</div>
          <div style={styles.headerCell}>Destinatário</div>
          <div style={styles.headerCell}>Valor</div>
          <div style={styles.headerCell}>Ações</div>
        </div>
        
        <div style={styles.listContent}>
          {documents.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>Nenhum documento anexado</p>
            </div>
          ) : (
            documents.map((document) => (
              <div
                key={document.id}
                style={styles.listRow}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={styles.rowCell}>{document.tipo}</div>
                <div style={styles.rowCell}>{document.numero}</div>
                <div style={styles.rowCell}>{document.emitente}</div>
                <div style={styles.rowCell}>{document.destinatario}</div>
                <div style={styles.rowCell}>{formatCurrency(document.valor)}</div>
                <div style={styles.actionButtons}>
                  <button
                    style={styles.actionButton}
                    onClick={() => handleEditDocument(document)}
                    title="Editar"
                  >
                    <AppIcons.Edit size={12} />
                  </button>
                  <button
                    style={styles.actionButton}
                    onClick={() => handleDeleteDocument(document.id)}
                    title="Excluir"
                  >
                    <AppIcons.Delete size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
          </div>
        </div>
      </div>

      {/* Resumo dos Documentos */}
      {documents.length > 0 && (
        <div style={styles.infoSection}>
          <h4 style={styles.infoSectionTitle}>Resumo dos Documentos</h4>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Quantidade de Documentos:</span>
            <span style={styles.summaryValue}>{documents.length}</span>
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Valor Total:</span>
            <span style={styles.summaryValue}>{formatCurrency(totalValue)}</span>
          </div>
          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Total MDF-e:</span>
            <span style={styles.totalValue}>{formatCurrency(totalValue)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
