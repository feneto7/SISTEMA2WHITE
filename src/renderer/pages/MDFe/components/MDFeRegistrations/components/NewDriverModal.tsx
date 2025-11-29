import React, { useState } from 'react';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { WindowHeader } from '../../../../../components/WindowHeader/WindowHeader';

interface Driver {
  id: string;
  name: string;
  cpf: string;
  rg: string;
  cnh: string;
  cnhCategory: string;
  cnhExpiration: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  birthDate: string;
  maritalStatus: string;
  fatherName: string;
  motherName: string;
}

interface NewDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (driver: Driver) => void;
  editingDriver?: Driver | null;
}

export function NewDriverModal({ isOpen, onClose, onSave, editingDriver }: NewDriverModalProps): JSX.Element | null {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Driver>>({
    name: '',
    cpf: '',
    rg: '',
    cnh: '',
    cnhCategory: '',
    cnhExpiration: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    birthDate: '',
    maritalStatus: '',
    fatherName: '',
    motherName: ''
  });

  // Initialize data when modal opens or when editingDriver changes
  React.useEffect(() => {
    if (isOpen) {
      if (editingDriver) {
        setFormData(editingDriver);
      } else {
        setFormData({
          name: '',
          cpf: '',
          rg: '',
          cnh: '',
          cnhCategory: '',
          cnhExpiration: '',
          phone: '',
          email: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          birthDate: '',
          maritalStatus: '',
          fatherName: '',
          motherName: ''
        });
      }
    }
  }, [isOpen, editingDriver]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInputFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleInputBlur = () => {
    setFocusedField(null);
  };

  const getInputStyle = (field: string) => {
    const baseStyle = systemStyles.input.field;
    // Estilos de foco são aplicados globalmente via CSS
    const focusStyle = {};
    return { ...baseStyle, ...focusStyle };
  };

  const getInputProps = (field: string, placeholder: string, type: string = 'text') => ({
    type,
    style: getInputStyle(field),
    value: formData[field as keyof Driver] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => handleInputChange(field, e.target.value),
    onFocus: () => handleInputFocus(field),
    onBlur: handleInputBlur,
    onClick: () => playClickSound(),
    placeholder
  });

  const handleSave = () => {
    if (!formData.name || !formData.cpf || !formData.cnh) {
      alert('Nome, CPF e CNH são obrigatórios');
      return;
    }

    const driverData: Driver = {
      id: editingDriver?.id || Date.now().toString(),
      name: formData.name || '',
      cpf: formData.cpf || '',
      rg: formData.rg || '',
      cnh: formData.cnh || '',
      cnhCategory: formData.cnhCategory || '',
      cnhExpiration: formData.cnhExpiration || '',
      phone: formData.phone || '',
      email: formData.email || '',
      address: formData.address || '',
      city: formData.city || '',
      state: formData.state || '',
      zipCode: formData.zipCode || '',
      birthDate: formData.birthDate || '',
      maritalStatus: formData.maritalStatus || '',
      fatherName: formData.fatherName || '',
      motherName: formData.motherName || ''
    };

    onSave(driverData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      cpf: '',
      rg: '',
      cnh: '',
      cnhCategory: '',
      cnhExpiration: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      birthDate: '',
      maritalStatus: '',
      fatherName: '',
      motherName: ''
    });
    onClose();
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
      backgroundColor: systemColors.background.window,
      borderRadius: '10px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.1)',
      width: '600px',
      height: '85vh',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      boxSizing: 'border-box' as const
    },
    titleBar: {
      ...systemStyles.titleBar,
      flexShrink: 0
    },
    title: {
      ...systemStyles.titleBarTitle
    },
    content: {
      flex: 1,
      padding: '16px',
      background: systemColors.background.content,
      overflow: 'auto',
      minHeight: 0
    },
    section: {
      marginBottom: '16px'
    },
    sectionTitle: {
      fontSize: '13px',
      fontWeight: '600',
      color: systemColors.text.primary,
      marginBottom: '12px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px'
    },
    group: {
      marginBottom: '8px'
    },
    label: {
      ...systemStyles.input.label
    },
    input: {
      ...systemStyles.input.field
    },
    fullWidth: {
      gridColumn: '1 / -1'
    },
    footer: {
      padding: '12px 16px',
      background: systemColors.background.primary,
      borderTop: `1px solid ${systemColors.border.light}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexShrink: 0
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <WindowHeader title={editingDriver ? 'Editar Motorista' : 'Novo Motorista'} onClose={handleClose} />

        {/* Form content */}
        <div style={styles.content}>
          {/* Personal Information */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Informações Pessoais</h4>
            <div style={styles.grid}>
              <div style={styles.group}>
                <label style={styles.label}>Nome Completo *</label>
                <input {...getInputProps('name', 'João da Silva')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>CPF *</label>
                <input {...getInputProps('cpf', '123.456.789-00')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>RG</label>
                <input {...getInputProps('rg', '12.345.678-9')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Data de Nascimento</label>
                <input {...getInputProps('dataNascimento', '', 'date')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Estado Civil</label>
                <div style={{ position: 'relative' as const }}>
                  <select {...getInputProps('maritalStatus', 'Selecione')}>
                    <option value="">Selecione</option>
                    <option value="solteiro">Solteiro</option>
                    <option value="casado">Casado</option>
                    <option value="divorciado">Divorciado</option>
                    <option value="viuvo">Viúvo</option>
                  </select>
                  <div style={systemStyles.select.arrow}>
                    <div style={systemStyles.select.arrowIcon}></div>
                  </div>
                </div>
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Nome do Pai</label>
                <input {...getInputProps('fatherName', 'José da Silva')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Nome da Mãe</label>
                <input {...getInputProps('motherName', 'Maria da Silva')} />
              </div>
            </div>
          </div>

          {/* CNH Information */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Dados da CNH</h4>
            <div style={styles.grid}>
              <div style={styles.group}>
                <label style={styles.label}>Número da CNH *</label>
                <input {...getInputProps('cnh', '12345678901')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Categoria</label>
                <div style={{ position: 'relative' as const }}>
                  <select {...getInputProps('cnhCategory', 'Selecione')}>
                    <option value="">Selecione</option>
                    <option value="A">A - Motocicleta</option>
                    <option value="B">B - Carro</option>
                    <option value="C">C - Caminhão</option>
                    <option value="D">D - Ônibus</option>
                    <option value="E">E - Carreta</option>
                  </select>
                  <div style={systemStyles.select.arrow}>
                    <div style={systemStyles.select.arrowIcon}></div>
                  </div>
                </div>
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Validade da CNH</label>
                <input {...getInputProps('cnhExpiration', '', 'date')} />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Dados de Contato</h4>
            <div style={styles.grid}>
              <div style={styles.group}>
                <label style={styles.label}>Telefone</label>
                <input {...getInputProps('phone', '(11) 99999-9999')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>E-mail</label>
                <input {...getInputProps('email', 'joao@email.com', 'email')} />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Endereço</h4>
            <div style={styles.grid}>
              <div style={{...styles.group, ...styles.fullWidth}}>
                <label style={styles.label}>Endereço Completo</label>
                <input {...getInputProps('address', 'Rua das Flores, 123, Bairro Centro')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Cidade</label>
                <input {...getInputProps('city', 'São Paulo')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>UF</label>
                <input {...getInputProps('state', 'SP')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>CEP</label>
                <input {...getInputProps('zipCode', '01234-567')} />
              </div>
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div style={styles.footer}>
          <div style={systemStyles.modal.footerLeft}>
            <button
              style={systemStyles.button.default}
              onClick={() => {
                playClickSound();
                handleClose();
              }}
            >
              Cancelar
            </button>
          </div>
          <div style={systemStyles.modal.footerRight}>
            <button
              style={systemStyles.button.primary}
              onClick={() => {
                playClickSound();
                handleSave();
              }}
            >
              {editingDriver ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
