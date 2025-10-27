import React, { useState } from 'react';
import { systemStyles, systemColors } from '../../styles/systemStyle';
import { useClickSound } from '../../hooks/useClickSound';
import { MainTab, AddressTab, AdditionalTab } from './components';

// Interface para dados do cliente
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  type: 'individual' | 'company';
  status: 'active' | 'inactive';
  registrationDate: string;
}

// Props do modal
interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (client: Omit<Client, 'id' | 'registrationDate'>) => void;
}

// Modal de Novo Cliente seguindo o design macOS
// Utiliza os estilos do systemStyles.ts para consistência visual
export function NewClientModal({ isOpen, onClose, onSave }: NewClientModalProps): JSX.Element | null {
  const playClickSound = useClickSound();
  const [activeTab, setActiveTab] = useState<'main' | 'address' | 'additional'>('main');
  const [clientType, setClientType] = useState<'individual' | 'company'>('individual');
  const [isCancelHovered, setIsCancelHovered] = useState(false);
  const [isSaveHovered, setIsSaveHovered] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: '',
    // Campos específicos para pessoa jurídica
    fantasyName: '',
    stateRegistration: '',
    municipalRegistration: '',
    // Campos de endereço adicionais
    addressNumber: '',
    neighborhood: ''
  });

  // Função para fechar o modal
  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      document: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      notes: '',
      // Campos específicos para pessoa jurídica
      fantasyName: '',
      stateRegistration: '',
      municipalRegistration: '',
      // Campos de endereço adicionais
      addressNumber: '',
      neighborhood: ''
    });
    setClientType('individual');
    setActiveTab('main');
    onClose();
  };

  // Função para salvar o cliente
  const handleSave = () => {
    if (!formData.name || !formData.email) {
      alert('Nome e email são obrigatórios');
      return;
    }

    const newClient = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      document: formData.document,
      type: clientType,
      status: 'active' as const
    };

    onSave?.(newClient);
    handleClose();
  };

  // Função para atualizar dados do formulário
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Função para mudar tipo de cliente e limpar documento se necessário
  const handleClientTypeChange = (newType: 'individual' | 'company') => {
    // Se há um documento e ele não corresponde ao novo tipo, limpa
    if (formData.document) {
      const documentNumbers = formData.document.replace(/\D/g, '');
      const isCPF = documentNumbers.length <= 11;
      const isCNPJ = documentNumbers.length > 11;
      
      if ((newType === 'individual' && isCNPJ) || (newType === 'company' && isCPF)) {
        setFormData(prev => ({ ...prev, document: '' }));
      }
    }
    
    setClientType(newType);
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)'
    }
  };

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={{
        ...systemStyles.window,
        width: '800px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column' as const,
        overflow: 'hidden'
      }} onClick={(e) => e.stopPropagation()}>
        {/* Header do modal */}
        <div style={{
          ...systemStyles.titleBar,
          position: 'relative' as const
        }}>
          <div style={systemStyles.trafficLights.container}>
            <div 
              style={{
                ...systemStyles.trafficLights.button,
                ...systemStyles.trafficLights.red
              }} 
              onClick={handleClose}
            />
            <div 
              style={{
                ...systemStyles.trafficLights.button,
                ...systemStyles.trafficLights.yellow
              }} 
            />
            <div 
              style={{
                ...systemStyles.trafficLights.button,
                ...systemStyles.trafficLights.green
              }} 
            />
          </div>
          <h2 style={systemStyles.titleBarTitle}>Novo Cliente</h2>
          <div style={{ width: '60px' }}></div>
        </div>

        {/* Seletor de tipo de cliente */}
        <div style={{
          padding: '16px 20px',
          background: systemColors.background.primary,
          borderBottom: `1px solid ${systemColors.border.light}`,
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <label style={{
            fontSize: '13px',
            fontWeight: '500',
            color: systemColors.text.label,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
          }}>
            Tipo de Cliente
          </label>
          <div style={{
            display: 'flex',
            gap: '16px'
          }}>
            <div 
              style={systemStyles.radio.container}
              onClick={() => handleClientTypeChange('individual')}
            >
              <div style={{
                ...systemStyles.radio.circle,
                ...(clientType === 'individual' ? systemStyles.radio.circleChecked : {})
              }}>
                {clientType === 'individual' && <div style={systemStyles.radio.dot} />}
              </div>
              <span style={systemStyles.radio.label}>Pessoa Física</span>
            </div>
            <div 
              style={systemStyles.radio.container}
              onClick={() => handleClientTypeChange('company')}
            >
              <div style={{
                ...systemStyles.radio.circle,
                ...(clientType === 'company' ? systemStyles.radio.circleChecked : {})
              }}>
                {clientType === 'company' && <div style={systemStyles.radio.dot} />}
              </div>
              <span style={systemStyles.radio.label}>Pessoa Jurídica</span>
            </div>
          </div>
        </div>

        {/* Sistema de abas */}
        <div style={systemStyles.tabs.container}>
          <button
            style={{
              ...systemStyles.tabs.tab,
              ...(activeTab === 'main' ? systemStyles.tabs.tabActive : {})
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'main') {
                Object.assign(e.currentTarget.style, systemStyles.tabs.tabHover);
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'main') {
                Object.assign(e.currentTarget.style, systemStyles.tabs.tab);
              }
            }}
            onClick={() => {
              playClickSound();
              setActiveTab('main');
            }}
          >
            Principal
          </button>
          <button
            style={{
              ...systemStyles.tabs.tab,
              ...(activeTab === 'address' ? systemStyles.tabs.tabActive : {})
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'address') {
                Object.assign(e.currentTarget.style, systemStyles.tabs.tabHover);
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'address') {
                Object.assign(e.currentTarget.style, systemStyles.tabs.tab);
              }
            }}
            onClick={() => {
              playClickSound();
              setActiveTab('address');
            }}
          >
            Endereço
          </button>
          <button
            style={{
              ...systemStyles.tabs.tab,
              ...(activeTab === 'additional' ? systemStyles.tabs.tabActive : {})
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'additional') {
                Object.assign(e.currentTarget.style, systemStyles.tabs.tabHover);
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'additional') {
                Object.assign(e.currentTarget.style, systemStyles.tabs.tab);
              }
            }}
            onClick={() => {
              playClickSound();
              setActiveTab('additional');
            }}
          >
            Adicional
          </button>
        </div>

        {/* Conteúdo das abas */}
        <div style={{
          background: systemColors.background.content,
          flex: 1,
          overflow: 'auto',
          padding: '20px'
        }}>
          {activeTab === 'main' && (
            <MainTab
              clientType={clientType}
              formData={formData}
              onUpdateFormData={updateFormData}
            />
          )}

          {activeTab === 'address' && (
            <AddressTab
              formData={formData}
              onUpdateFormData={updateFormData}
            />
          )}

          {activeTab === 'additional' && (
            <AdditionalTab
              formData={formData}
              onUpdateFormData={updateFormData}
            />
          )}
        </div>

        {/* Footer do modal */}
        <div style={{
          padding: '16px 20px',
          background: systemColors.background.primary,
          borderTop: `1px solid ${systemColors.border.light}`,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            style={{
              ...systemStyles.button.default,
              ...(isCancelHovered ? systemStyles.button.defaultHover : {})
            }}
            onMouseEnter={() => setIsCancelHovered(true)}
            onMouseLeave={() => setIsCancelHovered(false)}
            onClick={handleClose}
          >
            Cancelar
          </button>
          <button
            style={{
              ...systemStyles.button.primary,
              ...(isSaveHovered ? systemStyles.button.primaryHover : {})
            }}
            onMouseEnter={() => setIsSaveHovered(true)}
            onMouseLeave={() => setIsSaveHovered(false)}
            onClick={handleSave}
          >
            Salvar Cliente
          </button>
        </div>
      </div>
    </div>
  );
}
