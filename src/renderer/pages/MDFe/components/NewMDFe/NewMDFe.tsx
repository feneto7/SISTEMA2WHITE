import React, { useState } from 'react';
import { useTheme } from '../../../../styles/ThemeProvider';
import { useClickSound } from '../../../../hooks/useClickSound';
import { DocumentsTab, TransportTab, DriversTab, RouteTab, FreightTab, InsuranceTab, TotalizersTab } from './components';
import { validateMDFe, generateMDFeJSON, ValidationError, CompanyData } from '../../../../utils/mdfeValidator';
import { WindowHeader } from '../../../../components/WindowHeader/WindowHeader';
import { Dialog } from '../../../../components/Dialog';
import { AppIcons } from '../../../../components/Icons/AppIcons';
import { convertReaisToCents } from '../../../../utils/money';
import { apiGet } from '../../../../utils/apiService';

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
    invoices: [],
    attachedDocuments: [],
    notes: '',
    
    // Transport data
    selectedVehicle: '',
    licensePlate: '',
    renavam: '',
    chassis: '',
    brand: '',
    model: '',
    manufacturingYear: '',
    modelYear: '',
    color: '',
    fuelType: '',
    capacityKg: '',
    capacityM3: '',
    bodyType: '',
    wheelType: '',
    tareWeight: '',
    vehicleState: '',
    ownerName: '',
    ownerDocument: '',
    ownerAddress: '',
    ownerCity: '',
    ownerState: '',
    ownerZipCode: '',
    isOwnerNotIssuer: false,
    // Additional owner fields when owner is not issuer
    rntrcCode: '',
    ownerType: '',
    ownerStateRegistration: '',
    ownerFullState: '',
    
    // Drivers data
    selectedDrivers: [],
    selectedDriverId: '',
    driverName: '',
    driverCpf: '',
    driverCnh: '',
    driverCnhCategory: '',
    driverCnhValidity: '',
    driverPhone: '',
    driverEmail: '',
    driverAddress: '',
    driverCity: '',
    driverState: '',
    driverZipCode: '',
    
    // Route data
    loadingCity: '',
    loadingState: '',
    routeStates: [],
    unloadingCity: '',
    unloadingState: '',
    
    // Freight data
    tollVoucherList: [],
    vehicleCategory: '',
    
    // Payment data
    paymentResponsibleName: '',
    paymentResponsibleDocument: '',
    contractTotalValue: '',
    paymentMethod: '',
    bankNumber: '',
    agencyNumber: '',
    pixKey: '',
    ipefCnpj: '',
    
    // CIOT data
    ciotList: [],
    
    // Insurance data
    insuranceResponsible: '',
    insuranceResponsibleDocument: '',
    insuranceCompanyName: '',
    insuranceCompanyCnpj: '',
    policyNumber: '',
    endorsementList: [],
    showInsuranceData: false,
    
    // Totalizers data
    totalInvoicesCount: '',
    totalCargoValue: '',
    cargoUnitCode: '',
    totalCargoWeight: '',
    sealList: [],
    authorizedList: [],
    invoicesWithoutGrossWeight: [],
    
    // Product data
    cargoType: '',
    productDescription: '',
    gtin: '',
    ncmCode: '',
    loadingZipCode: '',
    unloadingZipCode: '',
    
    // MDF-e basic data
    mdfeType: 'rodoviario',
    mdfeNumber: '',
    mdfeSeries: '001',
    accessKey: '',
    issuer: '',
    recipient: '',
    mdfeValue: 0,
    status: 'pendente',
    issueDate: new Date().toISOString().split('T')[0],
    
    // Issuer type (from Settings)
    issuerType: localStorage.getItem('mdfe_tipo_emitente') || 'prestador'
  });

  // Function to close modal
  const handleClose = () => {
    setFormData({
      invoices: [],
      attachedDocuments: [],
      notes: '',
      selectedVehicle: '',
      licensePlate: '',
      renavam: '',
      chassis: '',
      brand: '',
      model: '',
      manufacturingYear: '',
      modelYear: '',
      color: '',
      fuelType: '',
      capacityKg: '',
      capacityM3: '',
      bodyType: '',
      wheelType: '',
      tareWeight: '',
      vehicleState: '',
      ownerName: '',
      ownerDocument: '',
      ownerAddress: '',
      ownerCity: '',
      ownerState: '',
      ownerZipCode: '',
      isOwnerNotIssuer: false,
      rntrcCode: '',
      ownerType: '',
      ownerStateRegistration: '',
      ownerFullState: '',
      selectedDrivers: [],
      selectedDriverId: '',
      driverName: '',
      driverCpf: '',
      driverCnh: '',
      driverCnhCategory: '',
      driverCnhValidity: '',
      driverPhone: '',
      driverEmail: '',
      driverAddress: '',
      driverCity: '',
      driverState: '',
      driverZipCode: '',
      loadingCity: '',
      loadingState: '',
      routeStates: [],
      unloadingCity: '',
      unloadingState: '',
      tollVoucherList: [],
      vehicleCategory: '',
      paymentResponsibleName: '',
      paymentResponsibleDocument: '',
      contractTotalValue: '',
      paymentMethod: '',
      bankNumber: '',
      agencyNumber: '',
      pixKey: '',
      ipefCnpj: '',
      ciotList: [],
      insuranceResponsible: '',
      insuranceResponsibleDocument: '',
      insuranceCompanyName: '',
      insuranceCompanyCnpj: '',
      policyNumber: '',
      endorsementList: [],
      showInsuranceData: false,
      totalInvoicesCount: '',
      totalCargoValue: '',
      cargoUnitCode: '',
      totalCargoWeight: '',
      sealList: [],
      authorizedList: [],
      invoicesWithoutGrossWeight: [],
      cargoType: '',
      productDescription: '',
      gtin: '',
      ncmCode: '',
      loadingZipCode: '',
      unloadingZipCode: '',
      mdfeType: 'rodoviario',
      mdfeNumber: '',
      mdfeSeries: '001',
      accessKey: '',
      issuer: '',
      recipient: '',
      mdfeValue: 0,
      status: 'pendente',
      issueDate: new Date().toISOString().split('T')[0],
      issuerType: localStorage.getItem('mdfe_tipo_emitente') || 'prestador'
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
  const handleSave = async () => {
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

    // Busca dados da empresa da API antes de gerar o JSON
    let companyData: CompanyData | undefined = undefined;
    try {
      console.log('[NewMDFe] Buscando dados da empresa...');
      const response = await apiGet('/api/companies', { requireAuth: true });
      
      if (response.ok) {
        // Verifica diferentes estruturas possíveis da resposta
        let companies = null;
        
        if (response.data?.data) {
          if (Array.isArray(response.data.data)) {
            companies = response.data.data;
          } else {
            companies = [response.data.data];
          }
        } else if (Array.isArray(response.data)) {
          companies = response.data;
        }
        
        if (companies && companies.length > 0) {
          const company = companies[0];
          console.log('[NewMDFe] Empresa encontrada:', company);
          companyData = company as CompanyData;
        } else {
          console.warn('[NewMDFe] Nenhuma empresa encontrada na API, usando dados do formulário como fallback');
        }
      } else {
        console.warn('[NewMDFe] Erro ao buscar empresa:', response.status, 'Usando dados do formulário como fallback');
      }
    } catch (error) {
      console.error('[NewMDFe] Erro ao buscar dados da empresa:', error);
      console.warn('[NewMDFe] Usando dados do formulário como fallback');
    }

    // Gerar JSON estruturado no padrão SEFAZ (passa dados da empresa se disponível)
    let mdfeJSON = generateMDFeJSON(formData, companyData);

    // Normalizações críticas antes do envio à API/SEFAZ
    mdfeJSON = normalizeMdfeForApi(mdfeJSON);
    
    console.log('MDF-e JSON gerado para envio à API:', JSON.stringify(mdfeJSON, null, 2));
    
    // Dados que serão salvos localmente e enviados para a API
    const mdfeData = {
      ...formData,
      mdfeJSON: mdfeJSON, // JSON estruturado no padrão SEFAZ para enviar à API
      status: 'gerado',
      dataGeracao: new Date().toISOString()
    };

    // Envia os dados para o componente pai que fará a chamada à API
    // O componente pai controla quando fechar o modal após a resposta da API
    onSave(mdfeData);
    // Não fecha o modal aqui - deixa o componente pai controlar
  };

  // Function to update form data
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Function to change MDF-e type
  const handleMDFeTypeChange = (newType: MDFeType) => {
    setMdfeType(newType);
    setFormData(prev => ({ ...prev, mdfeType: newType }));
  };

  if (!isOpen) return null;

  // ------------------------
  // Helpers de normalização
  // ------------------------
  const PAYMENT_IN_CENTS = false; // SEFAZ exige strings com ponto decimal (ex: "10000.00")

  function formatMoneyString(value: string | number): string {
    const num = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
    if (Number.isNaN(num)) return '0.00';
    return num.toFixed(2);
  }

  function sanitizeQuantity(value: string | number, precision = 3): string {
    const cleaned = String(value).replace(/\./g, '').replace(',', '.');
    const num = parseFloat(cleaned);
    if (Number.isNaN(num)) return (0).toFixed(precision);
    return num.toFixed(precision);
  }

  function normalizeMdfeForApi(json: any): any {
    const out = { ...json };

    // 1) Totais: qCarga sem separador de milhar e precisão coerente
    if (out?.tot?.qCarga !== undefined) {
      out.tot.qCarga = sanitizeQuantity(out.tot.qCarga, 3);
    }

    // 2) Pagamento (infPag): valores monetários consistentes
    const pags = out?.infModal?.rodo?.infPag;
    if (Array.isArray(pags)) {
      out.infModal.rodo.infPag = pags.map((p: any) => {
        const cloned = { ...p };
        // Componentes do pagamento
        if (Array.isArray(cloned.comp)) {
          cloned.comp = cloned.comp.map((c: any) => {
            const cc = { ...c };
            if (cc.vComp !== undefined) {
              cc.vComp = PAYMENT_IN_CENTS
                ? convertReaisToCents(String(cc.vComp).replace(',', '.'))
                : formatMoneyString(cc.vComp);
            }
            return cc;
          });
        }
        // vContrato e vPrest
        if (cloned.vContrato !== undefined) {
          cloned.vContrato = PAYMENT_IN_CENTS
            ? convertReaisToCents(String(cloned.vContrato).replace(',', '.'))
            : formatMoneyString(cloned.vContrato);
        }
        if (cloned.vPrest !== undefined) {
          cloned.vPrest = PAYMENT_IN_CENTS
            ? convertReaisToCents(String(cloned.vPrest).replace(',', '.'))
            : formatMoneyString(cloned.vPrest);
        }
        return cloned;
      });
    }

    // 3) CIOT (quando houver): inclui em rodo.infANTT.infCIOT
    // Espera-se formData.ciotList: [{ ciot: string, cpfCnpj?: string, cnpjIpef?: string }]
    if (Array.isArray((formData as any).ciotList) && (formData as any).ciotList.length > 0) {
      const ciotList = (formData as any).ciotList
        .filter((c: any) => c?.ciot)
        .map((c: any) => ({
          CIOT: c.ciot,
          CPF: c.cpfCnpj && c.cpfCnpj.length === 11 ? c.cpfCnpj : undefined,
          CNPJ: c.cpfCnpj && c.cpfCnpj.length === 14 ? c.cpfCnpj : undefined,
          CNPJIPEF: c.cnpjIpef || undefined
        }));

      if (ciotList.length > 0) {
        out.infModal = out.infModal || {};
        out.infModal.rodo = out.infModal.rodo || {};
        out.infModal.rodo.infANTT = out.infModal.rodo.infANTT || {};
        out.infModal.rodo.infANTT.infCIOT = ciotList;
      }
    }

    return out;
  }

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
        width="640px"
      />
    </div>
  );
}
