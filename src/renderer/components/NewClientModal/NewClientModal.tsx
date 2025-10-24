import React, { useState } from 'react';
import { modalStyles } from '../../styles/modalStyles';
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
// Utiliza os estilos do modalStyles.ts para consistência visual
export function NewClientModal({ isOpen, onClose, onSave }: NewClientModalProps): JSX.Element | null {
  const playClickSound = useClickSound();
  const [activeTab, setActiveTab] = useState<'main' | 'address' | 'additional'>('main');
  const [clientType, setClientType] = useState<'individual' | 'company'>('individual');
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

  return (
    <div style={modalStyles.overlay} onClick={handleClose}>
      <div style={modalStyles.container} onClick={(e) => e.stopPropagation()}>
        {/* Header do modal */}
        <div style={modalStyles.header}>
          <div style={modalStyles.trafficLights}>
            <div style={{...modalStyles.trafficLight, ...modalStyles.trafficLightRed}} onClick={handleClose}></div>
            <div style={{...modalStyles.trafficLight, ...modalStyles.trafficLightYellow}}></div>
            <div style={{...modalStyles.trafficLight, ...modalStyles.trafficLightGreen}}></div>
          </div>
          <div style={modalStyles.title}>Novo Cliente</div>
          <div style={{ width: '60px' }}></div>
        </div>

        {/* Seletor de tipo de cliente */}
        <div style={modalStyles.typeSelector}>
          <label style={modalStyles.typeLabel}>Tipo de Cliente</label>
          <div style={modalStyles.checkboxGroup}>
            <div 
              style={modalStyles.checkboxItem}
              onClick={() => handleClientTypeChange('individual')}
            >
              <div style={{
                ...modalStyles.checkbox,
                ...(clientType === 'individual' ? modalStyles.checkboxChecked : {})
              }}>
                {clientType === 'individual' && <div style={modalStyles.checkboxDot}></div>}
              </div>
              <span style={modalStyles.checkboxLabel}>Pessoa Física</span>
            </div>
            <div 
              style={modalStyles.checkboxItem}
              onClick={() => handleClientTypeChange('company')}
            >
              <div style={{
                ...modalStyles.checkbox,
                ...(clientType === 'company' ? modalStyles.checkboxChecked : {})
              }}>
                {clientType === 'company' && <div style={modalStyles.checkboxDot}></div>}
              </div>
              <span style={modalStyles.checkboxLabel}>Pessoa Jurídica</span>
            </div>
          </div>
        </div>

        {/* Sistema de abas */}
        <div style={modalStyles.tabsContainer}>
          <button
            style={{
              ...modalStyles.tab,
              ...(activeTab === 'main' ? modalStyles.tabActive : {})
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
              ...modalStyles.tab,
              ...(activeTab === 'address' ? modalStyles.tabActive : {})
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
              ...modalStyles.tab,
              ...(activeTab === 'additional' ? modalStyles.tabActive : {})
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
        <div style={modalStyles.tabContent}>
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
        <div style={modalStyles.footer}>
          <button
            style={modalStyles.button}
            onClick={handleClose}
          >
            Cancelar
          </button>
          <button
            style={{
              ...modalStyles.button,
              ...modalStyles.buttonPrimary
            }}
            onClick={handleSave}
          >
            Salvar Cliente
          </button>
        </div>
      </div>
    </div>
  );
}
