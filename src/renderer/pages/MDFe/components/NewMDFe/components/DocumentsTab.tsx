import React, { useState, useRef } from 'react';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { modalStyles } from '../../../../../styles/modalStyles';
import { PlusIcon, EditIcon, DeleteIcon } from '../../../../../components/Icons';
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
      borderRadius: '6px',
      border: '1px solid var(--accent)',
      background: 'linear-gradient(to bottom, var(--accent), #0056b3)',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      boxShadow: '0 1px 2px rgba(10, 132, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      fontSize: '13px',
      fontWeight: '500',
      padding: '8px 12px',
      gap: '6px',
      textTransform: 'uppercase' as const
    },
    listContainer: {
      background: 'rgba(255, 255, 255, 0.6)',
      borderRadius: '8px',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    },
    listHeader: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 80px',
      gap: '16px',
      padding: '12px 16px',
      background: 'rgba(246, 246, 246, 0.95)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    headerCell: {
      fontSize: '11px',
      fontWeight: '600',
      color: 'var(--text-secondary)',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px'
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
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      transition: 'all 0.15s ease',
      cursor: 'pointer',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    rowCell: {
      fontSize: '12px',
      color: 'var(--text-primary)',
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
      borderRadius: '4px',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      background: 'linear-gradient(to bottom, #f5f5f5, #e8e8e8)',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgba(0, 0, 0, 0.7)',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      fontSize: '12px',
      fontWeight: '500',
      padding: '4px',
      width: '24px',
      height: '24px',
      textTransform: 'uppercase' as const
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      color: 'var(--text-secondary)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    emptyText: {
      fontSize: '14px',
      margin: 0,
      textTransform: 'uppercase' as const
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    summaryLabel: {
      fontSize: '12px',
      color: 'var(--text-secondary)',
      textTransform: 'uppercase' as const
    },
    summaryValue: {
      fontSize: '12px',
      fontWeight: '600',
      color: 'var(--text-primary)'
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0 0 0',
      marginTop: '8px',
      borderTop: '2px solid rgba(0, 0, 0, 0.1)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    totalLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: 'var(--text-primary)',
      textTransform: 'uppercase' as const
    },
    totalValue: {
      fontSize: '16px',
      fontWeight: '700',
      color: 'var(--text-primary)'
    }
  };

  const totalValue = documents.reduce((sum, doc) => sum + doc.valor, 0);

  return (
    <div>
      {/* Seção de Documentos Anexados */}
      <div style={modalStyles.formSection}>
        <div style={styles.header}>
          <h4 style={modalStyles.formSectionTitle}>Documentos Anexados</h4>
          <button
            style={styles.addButton}
            onClick={handleAddDocument}
          >
            <PlusIcon size={14} />
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
                    <EditIcon size={12} />
                  </button>
                  <button
                    style={styles.actionButton}
                    onClick={() => handleDeleteDocument(document.id)}
                    title="Excluir"
                  >
                    <DeleteIcon size={12} />
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
        <div style={modalStyles.formSectionInfo}>
          <h4 style={modalStyles.formSectionInfoTitle}>Resumo dos Documentos</h4>
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
