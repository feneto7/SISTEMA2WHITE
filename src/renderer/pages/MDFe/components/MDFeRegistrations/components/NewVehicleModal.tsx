import React, { useState } from 'react';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { systemStyles, systemColors } from '../../../../../styles/systemStyle';

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
    const baseStyle = systemStyles.input.field;
    const focusStyle = focusedField === field ? systemStyles.input.fieldFocus : {};
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
      overflow: 'hidden'
    },
    titleBar: {
      ...systemStyles.titleBar
    },
    title: {
      ...systemStyles.titleBarTitle
    },
    content: {
      flex: 1,
      padding: '16px',
      background: systemColors.background.content,
      overflow: 'auto'
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
      justifyContent: 'flex-end',
      gap: '8px'
    }
  };

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.container} onClick={(e) => e.stopPropagation()}>
        {/* Modal header */}
        <div style={styles.titleBar}>
          <div style={systemStyles.trafficLights.container}>
            <button style={{...systemStyles.trafficLights.button, ...systemStyles.trafficLights.red}} onClick={handleClose}></button>
            <button style={{...systemStyles.trafficLights.button, ...systemStyles.trafficLights.yellow}}></button>
            <button style={{...systemStyles.trafficLights.button, ...systemStyles.trafficLights.green}}></button>
          </div>
          <div style={styles.title}>
            {editingVehicle ? 'Editar Veículo' : 'Novo Veículo'}
          </div>
          <div style={{ width: '60px' }}></div>
        </div>

        {/* Form content */}
        <div style={styles.content}>
          {/* Vehicle Information */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Informações do Veículo</h4>
            <div style={styles.grid}>
              {/* Vehicle fields with proper styling */}
              <div style={styles.group}>
                <label style={styles.label}>Placa *</label>
                <input {...getInputProps('placa', 'ABC-1234')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>RENAVAM</label>
                <input {...getInputProps('renavam', '12345678901')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Chassi</label>
                <input {...getInputProps('chassi', '9BWZZZZ377VT00426')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Marca *</label>
                <input {...getInputProps('marca', 'Volkswagen')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Modelo *</label>
                <input {...getInputProps('modelo', 'Gol')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Ano Fabricação</label>
                <input {...getInputProps('anoFabricacao', '2023')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Ano Modelo</label>
                <input {...getInputProps('anoModelo', '2024')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Cor</label>
                <input {...getInputProps('cor', 'Branco')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Combustível</label>
                <input {...getInputProps('combustivel', 'Flex')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Capacidade (kg)</label>
                <input {...getInputProps('capacidade', '1500')} />
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Dados do Proprietário</h4>
            <div style={styles.grid}>
              <div style={styles.group}>
                <label style={styles.label}>Nome/Razão Social</label>
                <input {...getInputProps('proprietario', 'João Silva')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>CPF/CNPJ</label>
                <input {...getInputProps('cpfCnpjProprietario', '123.456.789-00')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Endereço</label>
                <input {...getInputProps('enderecoProprietario', 'Rua das Flores, 123')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Cidade</label>
                <input {...getInputProps('cidadeProprietario', 'São Paulo')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>UF</label>
                <input {...getInputProps('ufProprietario', 'SP')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>CEP</label>
                <input {...getInputProps('cepProprietario', '01234-567')} />
              </div>
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div style={styles.footer}>
          <button style={systemStyles.button.default} onClick={handleClose}>
            Cancelar
          </button>
          <button
            style={systemStyles.button.primary}
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
