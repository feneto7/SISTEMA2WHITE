import React, { useState, useRef, useEffect } from 'react';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { AppIcons } from '../../../../../components/Icons/AppIcons';
import { Dialog } from '../../../../../components/Dialog';

interface Document {
  id: string;
  documentType: string;
  number: string;
  series: string;
  accessKey: string;
  issuer: string;
  recipient: string;
  value: number;
  grossWeight: number;
  issueDate: string;
  status: string;
  issuerState?: string;
  issuerCityName?: string;
  issuerCityCode?: string;
  recipientState?: string;
  recipientCityName?: string;
  recipientCityCode?: string;
  reinvoicingIndicator?: string;
  // Predominant product data
  productDescription?: string;
  ncmCode?: string;
  gtin?: string;
}

interface DocumentsTabProps {
  formData: any;
  onUpdateFormData: (field: string, value: any) => void;
}

export function DocumentsTab({ formData, onUpdateFormData }: DocumentsTabProps): JSX.Element {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  const [documents, setDocuments] = useState<Document[]>([]);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importDialogType, setImportDialogType] = useState<'success' | 'error' | 'info'>('success');
  const [importDialogMessage, setImportDialogMessage] = useState('');
  const [importDialogHint, setImportDialogHint] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);


  // Sincroniza o estado local com formData.invoices quando o componente monta ou quando muda
  useEffect(() => {
    if (formData.invoices && Array.isArray(formData.invoices)) {
      setDocuments(formData.invoices);
    }
  }, [formData.invoices]);

  const handleAddDocument = async () => {
    playClickSound();
    
    try {
      // Verifica se o electron está disponível
      if (window.electron && window.electron.showOpenDialog) {
        // Abre dialog para selecionar múltiplos arquivos XML
        const filePaths = await window.electron.showOpenDialog({
          properties: ['openFile', 'multiSelections'],
          title: 'Selecionar XMLs de Notas Fiscais',
          filters: [
            { name: 'XML Files', extensions: ['xml'] }
          ]
        });

        if (filePaths && filePaths.length > 0) {
          // Importa os XMLs selecionados
          const importedDocs = await window.electron.invoke('import-nfe-xmls-from-files', filePaths);
          
          if (importedDocs && importedDocs.length > 0) {
            const newDocuments = importedDocs.map((doc: any) => ({
              id: doc.chave || `doc-${Date.now()}-${Math.random()}`,
              documentType: doc.tipo || 'NF-e',
              number: doc.numero || '',
              series: doc.serie || '',
              accessKey: doc.chave || '',
              issuer: doc.emitente || '',
              recipient: doc.destinatario || '',
              value: doc.valor || 0,
              grossWeight: doc.pesoBruto || 0,
              issueDate: doc.dataEmissao || new Date().toISOString().split('T')[0],
              status: 'importado',
              issuerState: doc.emitenteUF || '',
              issuerCityName: doc.emitenteMunicipioNome || '',
              issuerCityCode: doc.emitenteCodigoMunicipio || '',
              recipientState: doc.destinatarioUF || '',
              recipientCityName: doc.destinatarioMunicipioNome || '',
              recipientCityCode: doc.destinatarioCodigoMunicipio || '',
              reinvoicingIndicator: doc.indReentrega || '0',
              // Predominant product data
              productDescription: doc.descricaoProduto || '',
              ncmCode: doc.codigoNCM || '',
              gtin: doc.gtin || ''
            }));

            const allDocuments = [...documents, ...newDocuments];
            setDocuments(allDocuments);
            
            // Calcula totalizadores automaticamente
            const totalInvoicesCount = allDocuments.length;
            const totalCargoValue = allDocuments.reduce((sum, doc) => sum + doc.value, 0);
            const totalCargoWeight = allDocuments.reduce((sum, doc) => sum + (doc.grossWeight || 0), 0);
            
            // Verifica notas sem peso bruto
            const invoicesWithoutWeight = allDocuments
              .filter(doc => !doc.grossWeight || doc.grossWeight === 0)
              .map(doc => doc.number);
            
            // Atualiza formData com as notas fiscais e totalizadores
            onUpdateFormData('invoices', allDocuments);
            onUpdateFormData('totalInvoicesCount', totalInvoicesCount.toString());
            onUpdateFormData('totalCargoValue', totalCargoValue.toFixed(2).replace('.', ','));
            onUpdateFormData('totalCargoWeight', totalCargoWeight.toFixed(4).replace('.', ','));
            onUpdateFormData('invoicesWithoutGrossWeight', invoicesWithoutWeight);

            // Atualiza automaticamente dados de rota com base na primeira nota importada, caso ainda não preenchidos
            const firstInvoice = newDocuments[0];
            if (firstInvoice) {
              // Preenche dados de rota (carregamento e descarregamento)
              if (!formData.loadingCity && firstInvoice.issuerCityName) {
                onUpdateFormData('loadingCity', firstInvoice.issuerCityName);
              }
              if (!formData.loadingState && firstInvoice.issuerState) {
                onUpdateFormData('loadingState', firstInvoice.issuerState);
              }
              if (!formData.unloadingCity && firstInvoice.recipientCityName) {
                onUpdateFormData('unloadingCity', firstInvoice.recipientCityName);
              }
              if (!formData.unloadingState && firstInvoice.recipientState) {
                onUpdateFormData('unloadingState', firstInvoice.recipientState);
              }
              
              // Preenche dados de produto predominante na aba Totalizadores
              if (!formData.productDescription && firstInvoice.productDescription) {
                onUpdateFormData('productDescription', firstInvoice.productDescription);
              }
              if (!formData.ncmCode && firstInvoice.ncmCode) {
                onUpdateFormData('ncmCode', firstInvoice.ncmCode);
              }
              if (!formData.gtin && firstInvoice.gtin) {
                onUpdateFormData('gtin', firstInvoice.gtin);
              }
            }
            
            // Mostra dialog de sucesso
            setImportDialogType('success');
            setImportDialogMessage(`${importedDocs.length} nota(s) fiscal(is) importada(s) com sucesso!`);
            setImportDialogHint(`Totalizadores atualizados:\n\n• Quantidade: ${totalInvoicesCount}\n• Valor Total: R$ ${totalCargoValue.toFixed(2).replace('.', ',')}\n• Peso Total: ${totalCargoWeight.toFixed(4).replace('.', ',')} kg`);
            setShowImportDialog(true);
          } else {
            setImportDialogType('error');
            setImportDialogMessage('Nenhum dado válido encontrado.');
            setImportDialogHint('Verifique se os arquivos XML selecionados contêm dados válidos.');
            setShowImportDialog(true);
          }
        }
      } else {
        // Fallback para desenvolvimento sem Electron
        console.log('Importar documentos (Electron não disponível)');
        setImportDialogType('info');
        setImportDialogMessage('Funcionalidade de importação requer Electron.');
        setImportDialogHint('Esta funcionalidade está disponível apenas na versão Electron do sistema.');
        setShowImportDialog(true);
      }
    } catch (error) {
      console.error('Erro ao importar documentos:', error);
      setImportDialogType('error');
      setImportDialogMessage('Erro ao importar documentos.');
      setImportDialogHint(`Detalhes: ${error instanceof Error ? error.message : String(error)}`);
      setShowImportDialog(true);
    }
  };

  const handleEditDocument = (document: Document) => {
    playClickSound();
    // TODO: Implementar edição de documento
    console.log('Editar documento:', document);
  };

  const handleDeleteDocument = (id: string) => {
    playClickSound();
    setDocumentToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteDocument = () => {
    if (documentToDelete) {
      const updatedDocuments = documents.filter(d => d.id !== documentToDelete);
      setDocuments(updatedDocuments);
      
      // Recalcula totalizadores
      const totalInvoicesCount = updatedDocuments.length;
      const totalCargoValue = updatedDocuments.reduce((sum, doc) => sum + doc.value, 0);
      const totalCargoWeight = updatedDocuments.reduce((sum, doc) => sum + (doc.grossWeight || 0), 0);
      
      // Verifica notas sem peso bruto
      const invoicesWithoutWeight = updatedDocuments
        .filter(doc => !doc.grossWeight || doc.grossWeight === 0)
        .map(doc => doc.number);
      
      // Atualiza formData
      onUpdateFormData('invoices', updatedDocuments);
      onUpdateFormData('totalInvoicesCount', totalInvoicesCount.toString());
      onUpdateFormData('totalCargoValue', totalCargoValue.toFixed(2).replace('.', ','));
      onUpdateFormData('totalCargoWeight', totalCargoWeight.toFixed(4).replace('.', ','));
      onUpdateFormData('invoicesWithoutGrossWeight', invoicesWithoutWeight);
      
      setShowDeleteDialog(false);
      setDocumentToDelete(null);
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

  const totalValue = documents.reduce((sum, doc) => sum + doc.value, 0);

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
            Importar Documento
          </button>
        </div>

        {/* Lista de Documentos */}
        <div ref={listContainerRef} className="scrollbar-list" style={styles.listContainer}>
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
                  e.currentTarget.style.background = systemColors.control.hover as string;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={styles.rowCell}>{document.documentType}</div>
                <div style={styles.rowCell}>{document.number}</div>
                <div style={styles.rowCell}>{document.issuer}</div>
                <div style={styles.rowCell}>{document.recipient}</div>
                <div style={styles.rowCell}>{formatCurrency(document.value)}</div>
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

      {/* Dialog de importação */}
      <Dialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onConfirm={() => setShowImportDialog(false)}
        icon={
          importDialogType === 'success' 
            ? <AppIcons.CheckCircle size={60} color="#28CA42" />
            : importDialogType === 'error'
            ? <AppIcons.Alert size={60} color="#ff5f57" />
            : <AppIcons.Info size={60} color="#007AFF" />
        }
        warning={importDialogMessage}
        hint={importDialogHint}
        confirmLabel="OK"
        showCancel={false}
        width="500px"
      />

      {/* Dialog de confirmação de exclusão */}
      <Dialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDocumentToDelete(null);
        }}
        onConfirm={confirmDeleteDocument}
        icon={<AppIcons.Alert size={60} color="#ff5f57" />}
        warning="Tem certeza que deseja excluir este documento?"
        hint="Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        width="450px"
      />
    </div>
  );
}
