import React, { useState } from 'react';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { modalStyles } from '../../../../../styles/modalStyles';

interface Driver {
  id: string;
  nomeMotorista: string;
  cpfMotorista: string;
  rgMotorista: string;
  cnhMotorista: string;
  categoriaCnh: string;
  validadeCnh: string;
  telefoneMotorista: string;
  emailMotorista: string;
  enderecoMotorista: string;
  cidadeMotorista: string;
  ufMotorista: string;
  cepMotorista: string;
  dataNascimento: string;
  estadoCivil: string;
  nomePai: string;
  nomeMae: string;
}

interface NewDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (driver: Driver) => void;
  editingDriver?: Driver | null;
}

export function NewDriverModal({ isOpen, onClose, onSave, editingDriver }: NewDriverModalProps): JSX.Element | null {
  const playClickSound = useClickSound();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Driver>>({
    nomeMotorista: '',
    cpfMotorista: '',
    rgMotorista: '',
    cnhMotorista: '',
    categoriaCnh: '',
    validadeCnh: '',
    telefoneMotorista: '',
    emailMotorista: '',
    enderecoMotorista: '',
    cidadeMotorista: '',
    ufMotorista: '',
    cepMotorista: '',
    dataNascimento: '',
    estadoCivil: '',
    nomePai: '',
    nomeMae: ''
  });

  // Initialize data when modal opens or when editingDriver changes
  React.useEffect(() => {
    if (isOpen) {
      if (editingDriver) {
        setFormData(editingDriver);
      } else {
        setFormData({
          nomeMotorista: '',
          cpfMotorista: '',
          rgMotorista: '',
          cnhMotorista: '',
          categoriaCnh: '',
          validadeCnh: '',
          telefoneMotorista: '',
          emailMotorista: '',
          enderecoMotorista: '',
          cidadeMotorista: '',
          ufMotorista: '',
          cepMotorista: '',
          dataNascimento: '',
          estadoCivil: '',
          nomePai: '',
          nomeMae: ''
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
    const baseStyle = modalStyles.formInput;
    const focusStyle = focusedField === field ? modalStyles.formInputFocus : {};
    return { ...baseStyle, ...focusStyle };
  };

  const getInputProps = (field: string, placeholder: string, type: string = 'text') => ({
    type: type as const,
    style: getInputStyle(field),
    value: formData[field as keyof Driver] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => handleInputChange(field, e.target.value),
    onFocus: () => handleInputFocus(field),
    onBlur: handleInputBlur,
    onClick: () => playClickSound(),
    placeholder
  });

  const handleSave = () => {
    if (!formData.nomeMotorista || !formData.cpfMotorista || !formData.cnhMotorista) {
      alert('Nome, CPF e CNH são obrigatórios');
      return;
    }

    const driverData: Driver = {
      id: editingDriver?.id || Date.now().toString(),
      nomeMotorista: formData.nomeMotorista || '',
      cpfMotorista: formData.cpfMotorista || '',
      rgMotorista: formData.rgMotorista || '',
      cnhMotorista: formData.cnhMotorista || '',
      categoriaCnh: formData.categoriaCnh || '',
      validadeCnh: formData.validadeCnh || '',
      telefoneMotorista: formData.telefoneMotorista || '',
      emailMotorista: formData.emailMotorista || '',
      enderecoMotorista: formData.enderecoMotorista || '',
      cidadeMotorista: formData.cidadeMotorista || '',
      ufMotorista: formData.ufMotorista || '',
      cepMotorista: formData.cepMotorista || '',
      dataNascimento: formData.dataNascimento || '',
      estadoCivil: formData.estadoCivil || '',
      nomePai: formData.nomePai || '',
      nomeMae: formData.nomeMae || ''
    };

    onSave(driverData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      nomeMotorista: '',
      cpfMotorista: '',
      rgMotorista: '',
      cnhMotorista: '',
      categoriaCnh: '',
      validadeCnh: '',
      telefoneMotorista: '',
      emailMotorista: '',
      enderecoMotorista: '',
      cidadeMotorista: '',
      ufMotorista: '',
      cepMotorista: '',
      dataNascimento: '',
      estadoCivil: '',
      nomePai: '',
      nomeMae: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  // Custom styles for NewDriverModal - narrower width, taller height
  const customModalStyles = {
    ...modalStyles,
    container: {
      ...modalStyles.container,
      width: '600px',
      height: '85vh',
      maxWidth: '90vw',
      maxHeight: '90vh',
      minWidth: '500px',
      minHeight: '500px'
    }
  };

  // Compact form group style for better vertical compression
  const compactFormGroupStyle = {
    ...modalStyles.formGroup,
    gap: '4px'
  };

  return (
    <div style={modalStyles.overlay} onClick={handleClose}>
      <div style={customModalStyles.container} onClick={(e) => e.stopPropagation()}>
        {/* Modal header */}
        <div style={modalStyles.header}>
          <div style={modalStyles.trafficLights}>
            <div style={{...modalStyles.trafficLight, ...modalStyles.trafficLightRed}} onClick={handleClose}></div>
            <div style={{...modalStyles.trafficLight, ...modalStyles.trafficLightYellow}}></div>
            <div style={{...modalStyles.trafficLight, ...modalStyles.trafficLightGreen}}></div>
          </div>
          <div style={modalStyles.title}>
            {editingDriver ? 'Editar Motorista' : 'Novo Motorista'}
          </div>
          <div style={{ width: '60px' }}></div>
        </div>

        {/* Form content */}
        <div style={{...modalStyles.tabContent, padding: '16px'}}>
          {/* Personal Information */}
          <div style={{...modalStyles.formSection, marginBottom: '16px'}}>
            <h4 style={{...modalStyles.formSectionTitle, marginBottom: '12px'}}>Informações Pessoais</h4>
            <div style={{...modalStyles.formGrid, gap: '12px'}}>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>Nome Completo *</label>
                <input {...getInputProps('nomeMotorista', 'João da Silva')} />
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>CPF *</label>
                <input {...getInputProps('cpfMotorista', '123.456.789-00')} />
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>RG</label>
                <input {...getInputProps('rgMotorista', '12.345.678-9')} />
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>Data de Nascimento</label>
                <input {...getInputProps('dataNascimento', '', 'date')} />
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>Estado Civil</label>
                <select {...getInputProps('estadoCivil', 'Selecione')}>
                  <option value="">Selecione</option>
                  <option value="solteiro">Solteiro</option>
                  <option value="casado">Casado</option>
                  <option value="divorciado">Divorciado</option>
                  <option value="viuvo">Viúvo</option>
                </select>
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>Nome do Pai</label>
                <input {...getInputProps('nomePai', 'José da Silva')} />
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>Nome da Mãe</label>
                <input {...getInputProps('nomeMae', 'Maria da Silva')} />
              </div>
            </div>
          </div>

          {/* CNH Information */}
          <div style={{...modalStyles.formSection, marginBottom: '16px'}}>
            <h4 style={{...modalStyles.formSectionTitle, marginBottom: '12px'}}>Dados da CNH</h4>
            <div style={{...modalStyles.formGrid, gap: '12px'}}>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>Número da CNH *</label>
                <input {...getInputProps('cnhMotorista', '12345678901')} />
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>Categoria</label>
                <select {...getInputProps('categoriaCnh', 'Selecione')}>
                  <option value="">Selecione</option>
                  <option value="A">A - Motocicleta</option>
                  <option value="B">B - Carro</option>
                  <option value="C">C - Caminhão</option>
                  <option value="D">D - Ônibus</option>
                  <option value="E">E - Carreta</option>
                </select>
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>Validade da CNH</label>
                <input {...getInputProps('validadeCnh', '', 'date')} />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div style={{...modalStyles.formSection, marginBottom: '16px'}}>
            <h4 style={{...modalStyles.formSectionTitle, marginBottom: '12px'}}>Dados de Contato</h4>
            <div style={{...modalStyles.formGrid, gap: '12px'}}>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>Telefone</label>
                <input {...getInputProps('telefoneMotorista', '(11) 99999-9999')} />
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>E-mail</label>
                <input {...getInputProps('emailMotorista', 'joao@email.com', 'email')} />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div style={{...modalStyles.formSection, marginBottom: '16px'}}>
            <h4 style={{...modalStyles.formSectionTitle, marginBottom: '12px'}}>Endereço</h4>
            <div style={{...modalStyles.formGrid, gap: '12px'}}>
              <div style={{...modalStyles.formGroup, ...modalStyles.formGridFull}}>
                <label style={modalStyles.formLabel}>Endereço Completo</label>
                <input {...getInputProps('enderecoMotorista', 'Rua das Flores, 123, Bairro Centro')} />
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>Cidade</label>
                <input {...getInputProps('cidadeMotorista', 'São Paulo')} />
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>UF</label>
                <input {...getInputProps('ufMotorista', 'SP')} />
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>CEP</label>
                <input {...getInputProps('cepMotorista', '01234-567')} />
              </div>
            </div>
          </div>
        </div>

        {/* Modal footer */}
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
  );
}
