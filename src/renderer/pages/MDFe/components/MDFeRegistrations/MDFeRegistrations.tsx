import React, { useState } from 'react';
import { useTheme } from '../../../../styles/ThemeProvider';
import { useClickSound } from '../../../../hooks/useClickSound';
import { WindowHeader } from '../../../../components/WindowHeader/WindowHeader';
import { VehicleTab, DriverTab, RoutesTab, SettingsTab } from './components';

// MDF-e registrations modal
// Modularized component following project rules
interface MDFeRegistrationsProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'vehicle' | 'driver' | 'routes' | 'settings';

export function MDFeRegistrations({ isOpen, onClose }: MDFeRegistrationsProps): JSX.Element | null {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('vehicle');
  const [isCancelHovered, setIsCancelHovered] = useState(false);
  const [isSaveHovered, setIsSaveHovered] = useState(false);
  const [formData, setFormData] = useState({
    // Vehicle data
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
    ownerZipCode: '',
    
    // Driver data
    driverName: '',
    driverCpf: '',
    driverRg: '',
    driverCnh: '',
    driverCnhCategory: '',
    driverCnhExpiration: '',
    driverPhone: '',
    driverEmail: '',
    driverAddress: '',
    driverCity: '',
    driverState: '',
    driverZipCode: '',
    birthDate: '',
    maritalStatus: '',
    fatherName: '',
    motherName: '',
    
    // Routes data
    routeName: '',
    origin: '',
    destination: '',
    distanceKm: '',
    estimatedTime: '',
    estimatedFuel: '',
    tollValue: '',
    notes: '',
    stopPoints: '',
    departureTime: '',
    arrivalTime: '',
    weekDays: '',
    active: true,
    
    // Settings
    environment: 'homologacao',
    series: '001',
    initialNumber: '1',
    digitalCertificatePath: '',
    digitalCertificatePassword: '',
    digitalCertificateExpiration: '',
    issuerName: '',
    issuerCnpj: '',
    issuerAddress: '',
    issuerCity: '',
    issuerState: '',
    issuerZipCode: '',
    issuerPhone: '',
    issuerEmail: '',
    automaticBackup: true,
    emailNotifications: true,
    detailedLog: false,
    timeout: '30',
    resendAttempts: '3'
  });

  // Function to close modal
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
      ownerZipCode: '',
      driverName: '',
      driverCpf: '',
      driverRg: '',
      driverCnh: '',
      driverCnhCategory: '',
      driverCnhExpiration: '',
      driverPhone: '',
      driverEmail: '',
      driverAddress: '',
      driverCity: '',
      driverState: '',
      driverZipCode: '',
      birthDate: '',
      maritalStatus: '',
      fatherName: '',
      motherName: '',
      routeName: '',
      origin: '',
      destination: '',
      distanceKm: '',
      estimatedTime: '',
      estimatedFuel: '',
      tollValue: '',
      notes: '',
      stopPoints: '',
      departureTime: '',
      arrivalTime: '',
      weekDays: '',
      active: true,
      environment: 'homologacao',
      series: '001',
      initialNumber: '1',
      digitalCertificatePath: '',
      digitalCertificatePassword: '',
      digitalCertificateExpiration: '',
      issuerName: '',
      issuerCnpj: '',
      issuerAddress: '',
      issuerCity: '',
      issuerState: '',
      issuerZipCode: '',
      issuerPhone: '',
      issuerEmail: '',
      automaticBackup: true,
      emailNotifications: true,
      detailedLog: false,
      timeout: '30',
      resendAttempts: '3'
    });
    setActiveTab('vehicle');
    onClose();
  };

  // Function to save registrations
  const handleSave = () => {
    // TODO: Implement validation and saving
    console.log('Saving MDF-e registrations:', formData);
    handleClose();
  };

  // Function to update form data
  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div style={systemStyles.modal.overlay}>
      <div style={{
        ...systemStyles.window,
        background: systemColors.background.window,
        width: '900px',
        maxWidth: '90vw',
        height: '85vh',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column' as const,
        overflow: 'hidden',
        boxSizing: 'border-box' as const
      }}>
        {/* Modal header - componente padrão da aplicação */}
        <WindowHeader title="Cadastros MDF-e" onClose={handleClose} />

        {/* Tab system */}
        <div style={{...systemStyles.tabs.container, flexShrink: 0}}>
          <button
            style={{
              ...systemStyles.tabs.tab,
              ...(activeTab === 'vehicle' ? systemStyles.tabs.tabActive : {})
            }}
            onClick={() => {
              playClickSound();
              setActiveTab('vehicle');
            }}
          >
            Veículo
          </button>
          <button
            style={{
              ...systemStyles.tabs.tab,
              ...(activeTab === 'driver' ? systemStyles.tabs.tabActive : {})
            }}
            onClick={() => {
              playClickSound();
              setActiveTab('driver');
            }}
          >
            Motorista
          </button>
          <button
            style={{
              ...systemStyles.tabs.tab,
              ...(activeTab === 'routes' ? systemStyles.tabs.tabActive : {})
            }}
            onClick={() => {
              playClickSound();
              setActiveTab('routes');
            }}
          >
            Rotas
          </button>
          <button
            style={{
              ...systemStyles.tabs.tab,
              ...(activeTab === 'settings' ? systemStyles.tabs.tabActive : {})
            }}
            onClick={() => {
              playClickSound();
              setActiveTab('settings');
            }}
          >
            Configurações
          </button>
        </div>

        {/* Tab content */}
        <div style={{
          background: systemColors.background.content,
          flex: 1,
          overflow: 'auto',
          minHeight: 0
        }}>
          {activeTab === 'vehicle' && (
            <VehicleTab
              formData={formData}
              onUpdateFormData={updateFormData}
            />
          )}

          {activeTab === 'driver' && (
            <DriverTab
              formData={formData}
              onUpdateFormData={updateFormData}
            />
          )}

          {activeTab === 'routes' && (
            <RoutesTab
              formData={formData}
              onUpdateFormData={updateFormData}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              formData={formData}
              onUpdateFormData={updateFormData}
            />
          )}
        </div>

        {/* Modal footer */}
        <div style={{
          padding: '16px 20px',
          background: systemColors.background.primary,
          borderTop: `1px solid ${systemColors.border.light}`,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          flexShrink: 0
        }}>
          <button
            style={{
              ...systemStyles.button.default,
              ...(isCancelHovered ? systemStyles.button.defaultHover : {})
            }}
            onMouseEnter={() => setIsCancelHovered(true)}
            onMouseLeave={() => setIsCancelHovered(false)}
            onClick={() => {
              playClickSound();
              handleClose();
            }}
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
            onClick={() => {
              playClickSound();
              handleSave();
            }}
          >
            Salvar Cadastros
          </button>
        </div>
      </div>
    </div>
  );
}
