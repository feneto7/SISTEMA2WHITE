import React, { useState } from 'react';
import { useTheme } from '../../../../styles/ThemeProvider';
import { useClickSound } from '../../../../hooks/useClickSound';
import { DocumentsTab, TransportTab, DriversTab, RouteTab, FreightTab, InsuranceTab, TotalizersTab } from './components';
import { validateMDFe, generateMDFeJSON, ValidationError } from '../../../../utils/mdfeValidator';
import { WindowHeader } from '../../../../components/WindowHeader/WindowHeader';
import { Dialog } from '../../../../components/Dialog';
import { AppIcons } from '../../../../components/Icons/AppIcons';

// New MDF-e modal
// Modularized component following project rules
interface NewMDFeProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mdfeData: any) => void;
}

type TabType = 'documents' | 'transport' | 'drivers' | 'route' | 'freight' | 'insurance' | 'totalizers';

type MDFeType = 'rodoviario' | 'aereo' | 'aquaviario' | 'ferroviario';

export function NewMDFe({ isOpen, onClose, onSave }: NewMDFeProps): JSX.Element | null {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('documents');
  const [mdfeType, setMdfeType] = useState<MDFeType>('rodoviario');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showValidationResult, setShowValidationResult] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [validationDialogType, setValidationDialogType] = useState<'success' | 'error'>('error');
  const [validationMessage, setValidationMessage] = useState('');
  const [validationHint, setValidationHint] = useState('');
  const [formData, setFormData] = useState({
    // Documents data
    notasFiscais: [],
    documentosAnexos: [],
    observacoes: '',
    
    // Transport data
    veiculoSelecionado: '',
    placa: '',
    renavam: '',
    chassi: '',
    marca: '',
    modelo: '',
    anoFabricacao: '',
    anoModelo: '',
    cor: '',
    combustivel: '',
    capacidade: '',
    proprietario: '',
    cpfCnpjProprietario: '',
    enderecoProprietario: '',
    cidadeProprietario: '',
    ufProprietario: '',
    cepProprietario: '',
    proprietarioNaoEmitente: false,
    // Campos adicionais do proprietário quando não é emitente
    rntrc: '',
    tipoProprietario: '',
    ie: '',
    ufProprietarioCompleto: '',
    
    // Condutores data
    condutoresSelecionados: [],
    condutorSelecionado: '',
    nomeCondutor: '',
    cpfCondutor: '',
    cnhCondutor: '',
    categoriaCnh: '',
    validadeCnh: '',
    telefoneCondutor: '',
    emailCondutor: '',
    enderecoCondutor: '',
    cidadeCondutor: '',
    ufCondutor: '',
    cepCondutor: '',
    
    // Route data
    municipioCarregamento: '',
    ufCarregamento: '',
    ufsPercurso: [],
    municipioDescarregamento: '',
    ufDescarregamento: '',
    
    // Freight data
    valePedagioList: [],
    categoriaVeicular: '',
    
    // Payment data
    nomeResponsavel: '',
    cpfCnpjResponsavel: '',
    valorTotalContrato: '',
    formaPagamento: '',
    numeroBanco: '',
    numeroAgencia: '',
    pix: '',
    cnpjIpef: '',
    
    // CIOT data
    ciotList: [],
    
    // Insurance data
    responsavelSeguro: '',
    cpfCnpjResponsavelSeguro: '',
    nomeSeguradora: '',
    cnpjSeguradora: '',
    numeroApolice: '',
    averbacaoList: [],
    exibirDadosSeguro: false,
    
    // Totalizers data
    qntTotalNFe: '',
    valorTotalCarga: '',
    codUnidadeMedidaCarga: '',
    pesoTotalCarga: '',
    lacreList: [],
    autorizadoList: [],
    notasSemPesoBruto: [],
    
    // Product data
    tipoCarga: '',
    descricaoProduto: '',
    gtin: '',
    codigoNCM: '',
    cepLocalCarregamento: '',
    cepLocalDescarregamento: '',
    
    // MDF-e basic data
    tipoMDFe: 'rodoviario',
    numero: '',
    serie: '001',
    chave: '',
    emitente: '',
    destinatario: '',
    valor: 0,
    status: 'pendente',
    dataEmissao: new Date().toISOString().split('T')[0]
  });

  // Function to close modal
  const handleClose = () => {
    setFormData({
      notasFiscais: [],
      documentosAnexos: [],
      observacoes: '',
      veiculoSelecionado: '',
      placa: '',
      renavam: '',
      chassi: '',
      marca: '',
      modelo: '',
      anoFabricacao: '',
      anoModelo: '',
      cor: '',
      combustivel: '',
      capacidade: '',
      proprietario: '',
      cpfCnpjProprietario: '',
      enderecoProprietario: '',
      cidadeProprietario: '',
      ufProprietario: '',
      cepProprietario: '',
      proprietarioNaoEmitente: false,
      rntrc: '',
      tipoProprietario: '',
      ie: '',
      ufProprietarioCompleto: '',
      condutoresSelecionados: [],
      condutorSelecionado: '',
      nomeCondutor: '',
      cpfCondutor: '',
      cnhCondutor: '',
      categoriaCnh: '',
      validadeCnh: '',
      telefoneCondutor: '',
      emailCondutor: '',
      enderecoCondutor: '',
      cidadeCondutor: '',
      ufCondutor: '',
      cepCondutor: '',
      municipioCarregamento: '',
      ufCarregamento: '',
      ufsPercurso: [],
      municipioDescarregamento: '',
      ufDescarregamento: '',
      valePedagioList: [],
      categoriaVeicular: '',
      nomeResponsavel: '',
      cpfCnpjResponsavel: '',
      valorTotalContrato: '',
      formaPagamento: '',
      numeroBanco: '',
      numeroAgencia: '',
      pix: '',
      cnpjIpef: '',
      ciotList: [],
      responsavelSeguro: '',
      cpfCnpjResponsavelSeguro: '',
      nomeSeguradora: '',
      cnpjSeguradora: '',
      numeroApolice: '',
      averbacaoList: [],
      exibirDadosSeguro: false,
      qntTotalNFe: '',
      valorTotalCarga: '',
      codUnidadeMedidaCarga: '',
      pesoTotalCarga: '',
      lacreList: [],
      autorizadoList: [],
      notasSemPesoBruto: [],
      tipoCarga: '',
      descricaoProduto: '',
      gtin: '',
      codigoNCM: '',
      cepLocalCarregamento: '',
      cepLocalDescarregamento: '',
      tipoMDFe: 'rodoviario',
      numero: '',
      serie: '001',
      chave: '',
      emitente: '',
      destinatario: '',
      valor: 0,
      status: 'pendente',
      dataEmissao: new Date().toISOString().split('T')[0]
    });
    setMdfeType('rodoviario');
    setActiveTab('documents');
    onClose();
  };

  // Function to validate MDF-e
  const handleValidate = () => {
    playClickSound();
    const errors = validateMDFe(formData);
    setValidationErrors(errors);
    setShowValidationResult(true);

    if (errors.length === 0) {
      setValidationDialogType('success');
      setValidationMessage('MDF-e validado com sucesso!');
      setValidationHint('Todos os campos obrigatórios estão preenchidos corretamente.');
      setShowValidationDialog(true);
    } else {
      setValidationDialogType('error');
      setValidationMessage(`MDF-e contém ${errors.length} erro(s) de validação.`);
      setValidationHint(`Verifique os campos obrigatórios:\n\n${errors.map(e => `• ${e.tab}: ${e.message}`).join('\n')}`);
      setShowValidationDialog(true);
      
      // Navegar para a primeira aba com erro
      if (errors.length > 0) {
        const errorTab = errors[0].tab;
        const tabMap: Record<string, TabType> = {
          'Documentos': 'documents',
          'Transporte': 'transport',
          'Condutores': 'drivers',
          'Rota': 'route',
          'Frete': 'freight',
          'Seguro': 'insurance',
          'Totalizadores': 'totalizers'
        };
        setActiveTab(tabMap[errorTab] || 'documents');
      }
    }
  };

  // Function to save MDF-e and generate JSON for API
  const handleSave = () => {
    playClickSound();
    
    // Validar antes de gerar
    const errors = validateMDFe(formData);
    
    if (errors.length > 0) {
      setValidationDialogType('error');
      setValidationMessage('Não é possível criar o MDF-e.');
      setValidationHint(`Por favor, corrija os erros primeiro:\n\n${errors.map(e => `• ${e.tab}: ${e.message}`).join('\n')}`);
      setShowValidationDialog(true);
      return;
    }

    // Gerar JSON estruturado no padrão SEFAZ
    const mdfeJSON = generateMDFeJSON(formData);
    
    console.log('MDF-e JSON gerado para envio à API:', JSON.stringify(mdfeJSON, null, 2));
    
    // Dados que serão salvos localmente e enviados para a API
    const mdfeData = {
      ...formData,
      mdfeJSON: mdfeJSON, // JSON estruturado no padrão SEFAZ para enviar à API
      status: 'gerado',
      dataGeracao: new Date().toISOString()
    };

    // TODO: Aqui a API receberá o mdfeJSON e fará:
    // 1. Converter o JSON para XML conforme schema da SEFAZ
    // 2. Assinar digitalmente o XML
    // 3. Enviar para a SEFAZ
    // 4. Retornar a resposta (autorizado, rejeitado, etc)

    onSave(mdfeData);
    handleClose();
  };

  // Function to update form data
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Function to change MDF-e type
  const handleMDFeTypeChange = (newType: MDFeType) => {
    setMdfeType(newType);
    setFormData(prev => ({ ...prev, tipoMDFe: newType }));
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    container: {
      ...systemStyles.window,
      width: '90vw',
      maxWidth: '1200px',
      height: '90vh',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden'
    },
    titleBar: {
      ...systemStyles.titleBar,
      position: 'relative' as const
    },
    title: {
      ...systemStyles.titleBarTitle
    },
    typeSelector: {
      padding: '16px 20px',
      background: systemColors.background.primary,
      borderBottom: `1px solid ${systemColors.border.light}`
    },
    typeLabel: {
      ...systemStyles.input.label,
      marginBottom: '8px'
    },
    checkboxGroup: {
      display: 'flex',
      gap: '16px'
    },
    checkboxItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      cursor: 'pointer'
    },
    tabsContainer: {
      ...systemStyles.tabs.container
    },
    tab: {
      ...systemStyles.tabs.tab
    },
    tabActive: {
      ...systemStyles.tabs.tabActive
    },
    tabContent: {
      flex: 1,
      padding: '20px',
      background: systemColors.background.content,
      overflow: 'auto'
    },
    footer: {
      padding: '12px 16px',
      background: systemColors.background.primary,
      borderTop: `1px solid ${systemColors.border.light}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  };

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.container} onClick={(e) => e.stopPropagation()}>
        <WindowHeader title="Nova MDF-e" onClose={handleClose} />

        {/* Seletor de tipo de MDF-e */}
        <div style={styles.typeSelector}>
          <label style={styles.typeLabel}>Tipo de MDF-e</label>
          <div style={styles.checkboxGroup}>
            <div 
              style={styles.checkboxItem}
              onClick={() => handleMDFeTypeChange('rodoviario')}
            >
              <div style={{
                ...systemStyles.checkbox.box,
                ...(mdfeType === 'rodoviario' ? systemStyles.checkbox.boxChecked : {})
              }}>
                {mdfeType === 'rodoviario' && (
                  <svg viewBox="0 0 10 10" style={systemStyles.checkbox.checkmark}>
                    <path d="M2 5 L4 7 L8 2" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span style={systemStyles.checkbox.label}>Rodoviário</span>
            </div>
            <div 
              style={styles.checkboxItem}
              onClick={() => handleMDFeTypeChange('aereo')}
            >
              <div style={{
                ...systemStyles.checkbox.box,
                ...(mdfeType === 'aereo' ? systemStyles.checkbox.boxChecked : {})
              }}>
                {mdfeType === 'aereo' && (
                  <svg viewBox="0 0 10 10" style={systemStyles.checkbox.checkmark}>
                    <path d="M2 5 L4 7 L8 2" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span style={systemStyles.checkbox.label}>Aéreo</span>
            </div>
            <div 
              style={styles.checkboxItem}
              onClick={() => handleMDFeTypeChange('aquaviario')}
            >
              <div style={{
                ...systemStyles.checkbox.box,
                ...(mdfeType === 'aquaviario' ? systemStyles.checkbox.boxChecked : {})
              }}>
                {mdfeType === 'aquaviario' && (
                  <svg viewBox="0 0 10 10" style={systemStyles.checkbox.checkmark}>
                    <path d="M2 5 L4 7 L8 2" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span style={systemStyles.checkbox.label}>Aquaviário</span>
            </div>
            <div 
              style={styles.checkboxItem}
              onClick={() => handleMDFeTypeChange('ferroviario')}
            >
              <div style={{
                ...systemStyles.checkbox.box,
                ...(mdfeType === 'ferroviario' ? systemStyles.checkbox.boxChecked : {})
              }}>
                {mdfeType === 'ferroviario' && (
                  <svg viewBox="0 0 10 10" style={systemStyles.checkbox.checkmark}>
                    <path d="M2 5 L4 7 L8 2" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span style={systemStyles.checkbox.label}>Ferroviário</span>
            </div>
          </div>
        </div>

        {/* Tab system */}
        <div style={styles.tabsContainer}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'documents' ? styles.tabActive : {})
            }}
            onClick={() => {
              playClickSound();
              setActiveTab('documents');
            }}
          >
            Documentos
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'transport' ? styles.tabActive : {})
            }}
            onClick={() => {
              playClickSound();
              setActiveTab('transport');
            }}
          >
            Transporte
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'drivers' ? styles.tabActive : {})
            }}
            onClick={() => {
              playClickSound();
              setActiveTab('drivers');
            }}
          >
            Condutores
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'route' ? styles.tabActive : {})
            }}
            onClick={() => {
              playClickSound();
              setActiveTab('route');
            }}
          >
            Rota
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'freight' ? styles.tabActive : {})
            }}
            onClick={() => {
              playClickSound();
              setActiveTab('freight');
            }}
          >
            Frete
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'insurance' ? styles.tabActive : {})
            }}
            onClick={() => {
              playClickSound();
              setActiveTab('insurance');
            }}
          >
            Seguro
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'totalizers' ? styles.tabActive : {})
            }}
            onClick={() => {
              playClickSound();
              setActiveTab('totalizers');
            }}
          >
            Totalizadores
          </button>
        </div>

        {/* Tab content */}
        <div style={styles.tabContent}>
          {activeTab === 'documents' && (
            <DocumentsTab
              formData={formData}
              onUpdateFormData={updateFormData}
            />
          )}

          {activeTab === 'transport' && (
            <TransportTab
              formData={formData}
              onUpdateFormData={updateFormData}
            />
          )}

          {activeTab === 'drivers' && (
            <DriversTab
              formData={formData}
              onUpdateFormData={updateFormData}
            />
          )}

          {activeTab === 'route' && (
            <RouteTab
              formData={formData}
              onUpdateFormData={updateFormData}
            />
          )}

          {activeTab === 'freight' && (
            <FreightTab
              formData={formData}
              onUpdateFormData={updateFormData}
            />
          )}

          {activeTab === 'insurance' && (
            <InsuranceTab
              formData={formData}
              onUpdateFormData={updateFormData}
            />
          )}

          {activeTab === 'totalizers' && (
            <TotalizersTab
              formData={formData}
              onUpdateFormData={updateFormData}
            />
          )}
        </div>

        {/* Modal footer */}
        <div style={styles.footer}>
          <button
            style={systemStyles.button.default}
            onClick={handleClose}
          >
            Cancelar
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={systemStyles.button.default}
              onClick={handleValidate}
            >
              Validar
            </button>
            <button
              style={systemStyles.button.primary}
              onClick={handleSave}
            >
              Criar MDF-e
            </button>
          </div>
        </div>
      </div>

      {/* Dialog de validação */}
      <Dialog
        isOpen={showValidationDialog}
        onClose={() => setShowValidationDialog(false)}
        onConfirm={() => setShowValidationDialog(false)}
        icon={
          validationDialogType === 'success' 
            ? <AppIcons.CheckCircle size={60} color="#28CA42" />
            : <AppIcons.Alert size={60} color="#ff5f57" />
        }
        warning={validationMessage}
        hint={validationHint}
        confirmLabel="OK"
        showCancel={false}
        width="500px"
      />
    </div>
  );
}
