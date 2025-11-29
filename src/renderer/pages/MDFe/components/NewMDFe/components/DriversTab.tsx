import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { AddButton } from '../../../../../components/AddButton';
import { formatCpfOrCnpj } from '../../../../../utils/documentFormatter';

// Drivers tab for NewMDFe modal
// Handles driver selection and management
interface DriversTabProps {
  formData: any;
  onUpdateFormData: (field: string, value: any) => void;
}

interface Driver {
  id: string;
  name: string;
  cpf: string;
  cnh: string;
  cnhCategory: string;
  cnhExpiration: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export function DriversTab({ formData, onUpdateFormData }: DriversTabProps): JSX.Element {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [newDriver, setNewDriver] = useState({
    name: '',
    cpf: '',
    cnh: ''
  });
  
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Mocked registered drivers for selection
  const [registeredDrivers] = useState<Driver[]>([
    {
      id: '1',
      name: 'João Silva',
      cpf: '123.456.789-00',
      cnh: '12345678901',
      cnhCategory: 'C',
      cnhExpiration: '2025-12-31',
      phone: '(11) 99999-9999',
      email: 'joao@email.com',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    {
      id: '2',
      name: 'Maria Santos',
      cpf: '987.654.321-00',
      cnh: '98765432109',
      cnhCategory: 'D',
      cnhExpiration: '2026-06-15',
      phone: '(11) 88888-8888',
      email: 'maria@email.com',
      address: 'Av. Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100'
    },
    {
      id: '3',
      name: 'Pedro Costa',
      cpf: '111.222.333-44',
      cnh: '11223344556',
      cnhCategory: 'E',
      cnhExpiration: '2027-03-20',
      phone: '(11) 77777-7777',
      email: 'pedro@email.com',
      address: 'Rua Augusta, 500',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01305-000'
    }
  ]);

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

  const getInputProps = (field: string, placeholder: string = '', type: string = 'text') => ({
    type,
    value: newDriver[field as keyof typeof newDriver] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const formatted = /cpf/i.test(field) ? formatCpfOrCnpj(raw) : raw;
      setNewDriver(prev => ({
        ...prev,
        [field]: formatted
      }));
    },
    style: getInputStyle(field),
    onFocus: () => handleInputFocus(field),
    onBlur: handleInputBlur,
    onClick: () => playClickSound(),
    placeholder
  });

  const handleDriverSelect = (driverId: string) => {
    playClickSound();
    setSelectedDriver(driverId);
  };

  const handleAddRegisteredDriver = () => {
    playClickSound();
    if (selectedDriver) {
      const driver = registeredDrivers.find(c => c.id === selectedDriver);
      if (driver) {
        const currentDrivers = formData.selectedDrivers || [];
        const driverAlreadyExists = currentDrivers.some((c: Driver) => c.id === driver.id);
        
        if (!driverAlreadyExists) {
          onUpdateFormData('selectedDrivers', [...currentDrivers, driver]);
          setSelectedDriver('');
        }
      }
    }
  };

  const handleAddNewDriver = () => {
    playClickSound();
    if (newDriver.name && newDriver.cpf && newDriver.cnh) {
      const newDriverComplete: Driver = {
        id: Date.now().toString(),
        ...newDriver,
        cnhCategory: '',
        cnhExpiration: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
      };
      
      const currentDrivers = formData.selectedDrivers || [];
      onUpdateFormData('selectedDrivers', [...currentDrivers, newDriverComplete]);
      
      setNewDriver({
        name: '',
        cpf: '',
        cnh: ''
      });
    }
  };

  const handleRemoveDriver = (driverId: string) => {
    playClickSound();
    const currentDrivers = formData.selectedDrivers || [];
    const filteredDrivers = currentDrivers.filter((c: Driver) => c.id !== driverId);
    onUpdateFormData('selectedDrivers', filteredDrivers);
  };

  const styles = {
    container: {
      height: '100%',
      overflow: 'auto' as const,
      padding: '20px'
    },
    section: {
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: systemColors.text.primary,
      margin: '0 0 16px 0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
      borderBottom: `1px solid ${systemColors.border.light}`,
      paddingBottom: '8px'
    },
    selectContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
      marginBottom: '20px',
      padding: '16px',
      background: systemColors.background.content,
      borderRadius: '8px',
      border: `1px solid ${systemColors.border.light}`
    },
    selectLabel: {
      fontSize: '11px',
      fontWeight: '600',
      color: systemColors.text.secondary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.3px'
    },
    select: {
      ...systemStyles.select.field,
      cursor: 'pointer'
    },
    selectRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px'
    },
    formRow: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: '12px'
    },
    infoText: {
      fontSize: '11px',
      color: systemColors.text.secondary,
      fontStyle: 'italic',
      marginTop: '4px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr auto',
      gap: '16px',
      marginBottom: '16px',
      alignItems: 'end'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '6px'
    },
    condutoresList: {
      background: systemColors.background.content,
      borderRadius: '8px',
      border: `1px solid ${systemColors.border.light}`,
      maxHeight: '200px',
      overflowY: 'auto' as const
    },
    condutorItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
      borderBottom: `1px solid ${systemColors.border.divider}`,
      transition: 'background 0.15s ease'
    },
    condutorItemLast: {
      borderBottom: 'none'
    },
    condutorInfo: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px'
    },
    condutorName: {
      fontSize: '14px',
      fontWeight: '500',
      color: systemColors.text.primary
    },
    condutorDetails: {
      fontSize: '12px',
      color: systemColors.text.secondary
    },
    removeButton: {
      padding: '6px 12px',
      borderRadius: '6px',
      border: 'none',
      background: 'rgba(255, 59, 48, 0.1)',
      color: '#FF3B30',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.15s ease'
    },
    emptyState: {
      padding: '20px',
      textAlign: 'center' as const,
      color: systemColors.text.secondary,
      fontSize: '14px',
      fontStyle: 'italic'
    },
    label: systemStyles.input.label
  };

  return (
    <div ref={formContainerRef} className="scrollbar-modal" style={styles.container}>
      {/* Seção de Condutores Cadastrados */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Condutores Cadastrados</h4>
        <div style={{marginBottom: '16px'}}>
          <label style={styles.selectLabel}>Selecionar Condutor</label>
          <div style={styles.selectRow}>
            <div style={{ position: 'relative', flex: 1 }}>
              <select
                style={{
                  ...styles.select,
                  paddingRight: '24px',
                  appearance: 'none' as const,
                  WebkitAppearance: 'none' as const,
                  MozAppearance: 'none' as const
                }}
                value={selectedDriver}
                onChange={(e) => handleDriverSelect(e.target.value)}
                onFocus={() => handleInputFocus('condutorSelecionado')}
                onBlur={handleInputBlur}
                onClick={() => playClickSound()}
              >
                <option value="">Selecione um condutor cadastrado</option>
                {registeredDrivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name} - {driver.cpf} ({driver.cnhCategory})
                  </option>
                ))}
              </select>
              <div style={systemStyles.select.arrow}>
                <div style={systemStyles.select.arrowIcon}></div>
              </div>
            </div>
            <AddButton
              onClick={handleAddRegisteredDriver}
              disabled={!selectedDriver}
              label="Adicionar Condutor"
            />
          </div>
          <div style={styles.infoText}>
            Selecione um condutor cadastrado para adicionar à lista de condutores da MDF-e.
          </div>
        </div>
      </div>

      {/* Seção de Novo Condutor */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Novo Condutor</h4>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nome Completo *</label>
            <input {...getInputProps('name', 'João Silva')} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>CPF *</label>
            <input {...getInputProps('cpf', '123.456.789-00')} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>CNH *</label>
            <input {...getInputProps('cnh', '12345678901')} />
          </div>
          <div style={styles.formGroup}>
            <AddButton
              onClick={handleAddNewDriver}
              disabled={!newDriver.name || !newDriver.cpf || !newDriver.cnh}
              label="Adicionar Novo Condutor"
            />
          </div>
        </div>
      </div>

      {/* Lista de Condutores Selecionados */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Condutores Selecionados</h4>
        <div style={styles.condutoresList}>
          {formData.selectedDrivers && formData.selectedDrivers.length > 0 ? (
            formData.selectedDrivers.map((driver: Driver, index: number) => (
              <div
                key={driver.id}
                style={{
                  ...styles.condutorItem,
                  ...(index === formData.selectedDrivers.length - 1 ? styles.condutorItemLast : {})
                }}
              >
                <div style={styles.condutorInfo}>
                  <div style={styles.condutorName}>{driver.name}</div>
                  <div style={styles.condutorDetails}>
                    CPF: {driver.cpf} | CNH: {driver.cnh}
                  </div>
                </div>
                <button
                  style={styles.removeButton}
                  onClick={() => handleRemoveDriver(driver.id)}
                >
                  Remover
                </button>
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>
              Nenhum condutor selecionado
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
