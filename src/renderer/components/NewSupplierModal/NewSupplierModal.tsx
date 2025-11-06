import { WindowHeader } from '../WindowHeader/WindowHeader';
import React, { useState } from 'react';
import { useTheme } from '../../styles/ThemeProvider';
import { useClickSound } from '../../hooks/useClickSound';

// Interface para dados do fornecedor
interface Supplier {
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
interface NewSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (supplier: Omit<Supplier, 'id' | 'registrationDate'>) => void;
}

// Modal de Novo Fornecedor seguindo o design do sistema
// Utiliza os estilos do systemStyles.ts para consistência visual
export function NewSupplierModal({ isOpen, onClose, onSave }: NewSupplierModalProps): JSX.Element | null {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  const [activeTab, setActiveTab] = useState<'main' | 'address' | 'additional'>('main');
  const [supplierType, setSupplierType] = useState<'individual' | 'company'>('company');
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
      fantasyName: '',
      stateRegistration: '',
      municipalRegistration: '',
      addressNumber: '',
      neighborhood: ''
    });
    setSupplierType('company');
    setActiveTab('main');
    onClose();
  };

  // Função para salvar o fornecedor
  const handleSave = () => {
    if (!formData.name || !formData.email) {
      alert('Nome e email são obrigatórios');
      return;
    }

    const newSupplier = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      document: formData.document,
      type: supplierType,
      status: 'active' as const
    };

    onSave?.(newSupplier);
    handleClose();
  };

  // Função para atualizar dados do formulário
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Função para mudar tipo de fornecedor e limpar documento se necessário
  const handleSupplierTypeChange = (newType: 'individual' | 'company') => {
    if (formData.document) {
      const documentNumbers = formData.document.replace(/\D/g, '');
      const isCPF = documentNumbers.length <= 11;
      const isCNPJ = documentNumbers.length > 11;
      
      if ((newType === 'individual' && isCNPJ) || (newType === 'company' && isCPF)) {
        setFormData(prev => ({ ...prev, document: '' }));
      }
    }
    
    setSupplierType(newType);
  };

  if (!isOpen) return null;

  return (
    <div style={systemStyles.modal.overlay}>
      <div style={{
        ...systemStyles.modal.container,
        width: '800px',
        height: '600px',
        maxWidth: '90vw',
        maxHeight: '90vh'
      }}>
        <WindowHeader title="Novo Fornecedor" onClose={handleClose} />

        {/* Seletor de tipo de fornecedor */}
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
            Tipo de Fornecedor
          </label>
          <div style={{
            display: 'flex',
            gap: '16px'
          }}>
            <div 
              style={systemStyles.radio.container}
              onClick={() => handleSupplierTypeChange('individual')}
            >
              <div style={{
                ...systemStyles.radio.circle,
                ...(supplierType === 'individual' ? systemStyles.radio.circleChecked : {})
              }}>
                {supplierType === 'individual' && <div style={systemStyles.radio.dot} />}
              </div>
              <span style={systemStyles.radio.label}>Pessoa Física</span>
            </div>
            <div 
              style={systemStyles.radio.container}
              onClick={() => handleSupplierTypeChange('company')}
            >
              <div style={{
                ...systemStyles.radio.circle,
                ...(supplierType === 'company' ? systemStyles.radio.circleChecked : {})
              }}>
                {supplierType === 'company' && <div style={systemStyles.radio.dot} />}
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
        <div style={systemStyles.modal.content}>
          {activeTab === 'main' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '700px' }}>
              <div style={systemStyles.input.container}>
                <label style={systemStyles.input.label}>
                  {supplierType === 'individual' ? 'Nome Completo' : 'Razão Social'} *
                </label>
                <input
                  type="text"
                  style={systemStyles.input.field}
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder={supplierType === 'individual' ? 'Nome completo' : 'Razão social'}
                />
              </div>
              {supplierType === 'company' && (
                <div style={systemStyles.input.container}>
                  <label style={systemStyles.input.label}>Nome Fantasia</label>
                  <input
                    type="text"
                    style={systemStyles.input.field}
                    value={formData.fantasyName}
                    onChange={(e) => updateFormData('fantasyName', e.target.value)}
                    placeholder="Nome fantasia"
                  />
                </div>
              )}
              <div style={systemStyles.input.container}>
                <label style={systemStyles.input.label}>
                  {supplierType === 'individual' ? 'CPF' : 'CNPJ'}
                </label>
                <input
                  type="text"
                  style={systemStyles.input.field}
                  value={formData.document}
                  onChange={(e) => updateFormData('document', e.target.value)}
                  placeholder={supplierType === 'individual' ? '000.000.000-00' : '00.000.000/0000-00'}
                />
              </div>
              <div style={systemStyles.input.container}>
                <label style={systemStyles.input.label}>Email *</label>
                <input
                  type="email"
                  style={systemStyles.input.field}
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div style={systemStyles.input.container}>
                <label style={systemStyles.input.label}>Telefone</label>
                <input
                  type="tel"
                  style={systemStyles.input.field}
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>
              {supplierType === 'company' && (
                <>
                  <div style={systemStyles.input.container}>
                    <label style={systemStyles.input.label}>Inscrição Estadual</label>
                    <input
                      type="text"
                      style={systemStyles.input.field}
                      value={formData.stateRegistration}
                      onChange={(e) => updateFormData('stateRegistration', e.target.value)}
                      placeholder="Inscrição estadual"
                    />
                  </div>
                  <div style={systemStyles.input.container}>
                    <label style={systemStyles.input.label}>Inscrição Municipal</label>
                    <input
                      type="text"
                      style={systemStyles.input.field}
                      value={formData.municipalRegistration}
                      onChange={(e) => updateFormData('municipalRegistration', e.target.value)}
                      placeholder="Inscrição municipal"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'address' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', maxWidth: '700px' }}>
              <div style={systemStyles.input.container}>
                <label style={systemStyles.input.label}>Endereço</label>
                <input
                  type="text"
                  style={systemStyles.input.field}
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  placeholder="Rua, Avenida, etc."
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={systemStyles.input.container}>
                  <label style={systemStyles.input.label}>Número</label>
                  <input
                    type="text"
                    style={systemStyles.input.field}
                    value={formData.addressNumber}
                    onChange={(e) => updateFormData('addressNumber', e.target.value)}
                    placeholder="123"
                  />
                </div>
                <div style={systemStyles.input.container}>
                  <label style={systemStyles.input.label}>Bairro</label>
                  <input
                    type="text"
                    style={systemStyles.input.field}
                    value={formData.neighborhood}
                    onChange={(e) => updateFormData('neighborhood', e.target.value)}
                    placeholder="Bairro"
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div style={systemStyles.input.container}>
                  <label style={systemStyles.input.label}>Cidade</label>
                  <input
                    type="text"
                    style={systemStyles.input.field}
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    placeholder="Cidade"
                  />
                </div>
                <div style={systemStyles.input.container}>
                  <label style={systemStyles.input.label}>Estado</label>
                  <input
                    type="text"
                    style={systemStyles.input.field}
                    value={formData.state}
                    onChange={(e) => updateFormData('state', e.target.value)}
                    placeholder="UF"
                    maxLength={2}
                  />
                </div>
                <div style={systemStyles.input.container}>
                  <label style={systemStyles.input.label}>CEP</label>
                  <input
                    type="text"
                    style={systemStyles.input.field}
                    value={formData.zipCode}
                    onChange={(e) => updateFormData('zipCode', e.target.value)}
                    placeholder="00000-000"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'additional' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', maxWidth: '700px' }}>
              <div style={systemStyles.input.container}>
                <label style={systemStyles.input.label}>Observações</label>
                <textarea
                  style={{
                    ...systemStyles.input.field,
                    minHeight: '120px',
                    resize: 'vertical',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                  }}
                  value={formData.notes}
                  onChange={(e) => updateFormData('notes', e.target.value)}
                  placeholder="Observações adicionais sobre o fornecedor..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer do modal */}
        <div style={systemStyles.modal.footer}>
          <button
            style={{
              ...systemStyles.button.default
            }}
            onClick={handleClose}
          >
            Cancelar
          </button>
          <button
            style={{
              ...systemStyles.button.primary
            }}
            onClick={handleSave}
          >
            Salvar Fornecedor
          </button>
        </div>
      </div>
    </div>
  );
}

