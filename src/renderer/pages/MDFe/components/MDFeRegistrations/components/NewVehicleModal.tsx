import React, { useState } from 'react';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { modalStyles } from '../../../../../styles/modalStyles';

interface Vehicle {
  id: string;
  placa: string;
  renavam: string;
  chassi: string;
  marca: string;
  modelo: string;
  anoFabricacao: string;
  anoModelo: string;
  cor: string;
  combustivel: string;
  capacidade: string;
  proprietario: string;
  cpfCnpjProprietario: string;
  enderecoProprietario: string;
  cidadeProprietario: string;
  ufProprietario: string;
  cepProprietario: string;
}

interface NewVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicle: Vehicle) => void;
  editingVehicle?: Vehicle | null;
}

export function NewVehicleModal({ isOpen, onClose, onSave, editingVehicle }: NewVehicleModalProps): JSX.Element | null {
  const playClickSound = useClickSound();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Vehicle>>({
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
    cepProprietario: ''
  });

  // Initialize data when modal opens or when editingVehicle changes
  React.useEffect(() => {
    if (isOpen) {
      if (editingVehicle) {
        setFormData(editingVehicle);
      } else {
        setFormData({
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
          cepProprietario: ''
        });
      }
    }
  }, [isOpen, editingVehicle]);

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

  const getInputProps = (field: string, placeholder: string) => ({
    type: 'text' as const,
    style: getInputStyle(field),
    value: formData[field as keyof Vehicle] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(field, e.target.value),
    onFocus: () => handleInputFocus(field),
    onBlur: handleInputBlur,
    onClick: () => playClickSound(),
    placeholder
  });

  const handleSave = () => {
    if (!formData.placa || !formData.marca || !formData.modelo) {
      alert('Placa, marca e modelo são obrigatórios');
      return;
    }

    const vehicleData: Vehicle = {
      id: editingVehicle?.id || Date.now().toString(),
      placa: formData.placa || '',
      renavam: formData.renavam || '',
      chassi: formData.chassi || '',
      marca: formData.marca || '',
      modelo: formData.modelo || '',
      anoFabricacao: formData.anoFabricacao || '',
      anoModelo: formData.anoModelo || '',
      cor: formData.cor || '',
      combustivel: formData.combustivel || '',
      capacidade: formData.capacidade || '',
      proprietario: formData.proprietario || '',
      cpfCnpjProprietario: formData.cpfCnpjProprietario || '',
      enderecoProprietario: formData.enderecoProprietario || '',
      cidadeProprietario: formData.cidadeProprietario || '',
      ufProprietario: formData.ufProprietario || '',
      cepProprietario: formData.cepProprietario || ''
    };

    onSave(vehicleData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
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
      cepProprietario: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  // Custom styles for NewVehicleModal - narrower width, taller height
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
            {editingVehicle ? 'Editar Veículo' : 'Novo Veículo'}
          </div>
          <div style={{ width: '60px' }}></div>
        </div>

        {/* Form content */}
        <div style={{...modalStyles.tabContent, padding: '16px'}}>
          {/* Vehicle Information */}
          <div style={{...modalStyles.formSection, marginBottom: '16px'}}>
            <h4 style={{...modalStyles.formSectionTitle, marginBottom: '12px'}}>Informações do Veículo</h4>
            <div style={{...modalStyles.formGrid, gap: '12px'}}>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>Placa *</label>
                <input {...getInputProps('placa', 'ABC-1234')} />
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>RENAVAM</label>
                <input {...getInputProps('renavam', '12345678901')} />
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>Chassi</label>
                <input {...getInputProps('chassi', '9BWZZZZ377VT00426')} />
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>Marca *</label>
                <input {...getInputProps('marca', 'Volkswagen')} />
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>Modelo *</label>
                <input {...getInputProps('modelo', 'Gol')} />
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>Ano Fabricação</label>
                <input {...getInputProps('anoFabricacao', '2023')} />
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>Ano Modelo</label>
                <input {...getInputProps('anoModelo', '2024')} />
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>Cor</label>
                <input {...getInputProps('cor', 'Branco')} />
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>Combustível</label>
                <input {...getInputProps('combustivel', 'Flex')} />
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>Capacidade (kg)</label>
                <input {...getInputProps('capacidade', '1500')} />
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div style={{...modalStyles.formSection, marginBottom: '16px'}}>
            <h4 style={{...modalStyles.formSectionTitle, marginBottom: '12px'}}>Dados do Proprietário</h4>
            <div style={{...modalStyles.formGrid, gap: '12px'}}>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>Nome/Razão Social</label>
                <input {...getInputProps('proprietario', 'João Silva')} />
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>CPF/CNPJ</label>
                <input {...getInputProps('cpfCnpjProprietario', '123.456.789-00')} />
              </div>
              <div style={{...modalStyles.formGroup, ...modalStyles.formGridFull}}>
                <label style={modalStyles.formLabel}>Endereço</label>
                <input {...getInputProps('enderecoProprietario', 'Rua das Flores, 123')} />
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>Cidade</label>
                <input {...getInputProps('cidadeProprietario', 'São Paulo')} />
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>UF</label>
                <input {...getInputProps('ufProprietario', 'SP')} />
              </div>
              <div style={compactFormGroupStyle}>
                <label style={modalStyles.formLabel}>CEP</label>
                <input {...getInputProps('cepProprietario', '01234-567')} />
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
            {editingVehicle ? 'Atualizar' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}
