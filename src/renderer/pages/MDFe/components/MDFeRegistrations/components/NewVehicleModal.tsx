import React, { useState } from 'react';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { WindowHeader } from '../../../../../components/WindowHeader/WindowHeader';

interface Vehicle {
  id: string;
  licensePlate: string;
  renavamCode: string;
  chassis: string;
  brand: string;
  model: string;
  manufacturingYear: string;
  modelYear: string;
  color: string;
  fuelType: string;
  capacityKg: string;
  ownerName: string;
  ownerDocument: string;
  ownerAddress: string;
  ownerCity: string;
  ownerState: string;
  ownerZipCode: string;
}

interface NewVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicle: Vehicle) => void;
  editingVehicle?: Vehicle | null;
}

export function NewVehicleModal({ isOpen, onClose, onSave, editingVehicle }: NewVehicleModalProps): JSX.Element | null {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    licensePlate: '',
    renavamCode: '',
    chassis: '',
    brand: '',
    model: '',
    manufacturingYear: '',
    modelYear: '',
    color: '',
    fuelType: '',
    capacityKg: '',
    ownerName: '',
    ownerDocument: '',
    ownerAddress: '',
    ownerCity: '',
    ownerState: '',
    ownerZipCode: ''
  });

  // Initialize data when modal opens or when editingVehicle changes
  React.useEffect(() => {
    if (isOpen) {
      if (editingVehicle) {
        setFormData(editingVehicle);
      } else {
        setFormData({
          licensePlate: '',
          renavamCode: '',
          chassis: '',
          brand: '',
          model: '',
          manufacturingYear: '',
          modelYear: '',
          color: '',
          fuelType: '',
          capacityKg: '',
          ownerName: '',
          ownerDocument: '',
          ownerAddress: '',
          ownerCity: '',
          ownerState: '',
          ownerZipCode: ''
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
    // Estilos de foco são aplicados globalmente via CSS
    const focusStyle = {};
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
    if (!formData.licensePlate || !formData.brand || !formData.model) {
      alert('Placa, marca e modelo são obrigatórios');
      return;
    }

    const vehicleData: Vehicle = {
      id: editingVehicle?.id || Date.now().toString(),
      licensePlate: formData.licensePlate || '',
      renavamCode: formData.renavamCode || '',
      chassis: formData.chassis || '',
      brand: formData.brand || '',
      model: formData.model || '',
      manufacturingYear: formData.manufacturingYear || '',
      modelYear: formData.modelYear || '',
      color: formData.color || '',
      fuelType: formData.fuelType || '',
      capacityKg: formData.capacityKg || '',
      ownerName: formData.ownerName || '',
      ownerDocument: formData.ownerDocument || '',
      ownerAddress: formData.ownerAddress || '',
      ownerCity: formData.ownerCity || '',
      ownerState: formData.ownerState || '',
      ownerZipCode: formData.ownerZipCode || ''
    };

    onSave(vehicleData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      licensePlate: '',
      renavamCode: '',
      chassis: '',
      brand: '',
      model: '',
      manufacturingYear: '',
      modelYear: '',
      color: '',
      fuelType: '',
      capacityKg: '',
      ownerName: '',
      ownerDocument: '',
      ownerAddress: '',
      ownerCity: '',
      ownerState: '',
      ownerZipCode: ''
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
        <WindowHeader title={editingVehicle ? 'Editar Veículo' : 'Novo Veículo'} onClose={handleClose} />

        {/* Form content */}
        <div style={styles.content}>
          {/* Vehicle Information */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Informações do Veículo</h4>
            <div style={styles.grid}>
              {/* Vehicle fields with proper styling */}
              <div style={styles.group}>
                <label style={styles.label}>Placa *</label>
                <input {...getInputProps('licensePlate', 'ABC-1234')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>RENAVAM</label>
                <input {...getInputProps('renavamCode', '12345678901')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Chassi</label>
                <input {...getInputProps('chassis', '9BWZZZZ377VT00426')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Marca *</label>
                <input {...getInputProps('brand', 'Volkswagen')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Modelo *</label>
                <input {...getInputProps('model', 'Gol')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Ano Fabricação</label>
                <input {...getInputProps('manufacturingYear', '2023')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Ano Modelo</label>
                <input {...getInputProps('modelYear', '2024')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Cor</label>
                <input {...getInputProps('color', 'Branco')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Combustível</label>
                <input {...getInputProps('fuelType', 'Flex')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Capacidade (kg)</label>
                <input {...getInputProps('capacityKg', '1500')} />
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Dados do Proprietário</h4>
            <div style={styles.grid}>
              <div style={styles.group}>
                <label style={styles.label}>Nome/Razão Social</label>
                <input {...getInputProps('ownerName', 'João Silva')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>CPF/CNPJ</label>
                <input {...getInputProps('ownerDocument', '123.456.789-00')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Endereço</label>
                <input {...getInputProps('ownerAddress', 'Rua das Flores, 123')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>Cidade</label>
                <input {...getInputProps('ownerCity', 'São Paulo')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>UF</label>
                <input {...getInputProps('ownerState', 'SP')} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>CEP</label>
                <input {...getInputProps('ownerZipCode', '01234-567')} />
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
              {editingVehicle ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
