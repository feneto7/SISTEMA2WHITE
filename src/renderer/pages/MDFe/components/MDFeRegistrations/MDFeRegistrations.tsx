import React, { useState } from 'react';
import { modalStyles } from '../../../../styles/modalStyles';
import { useClickSound } from '../../../../hooks/useClickSound';
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
  const [activeTab, setActiveTab] = useState<TabType>('vehicle');
  const [formData, setFormData] = useState({
    // Vehicle data
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
    cepProprietario: '',
    
    // Driver data
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
    nomeMae: '',
    
    // Routes data
    nomeRota: '',
    origem: '',
    destino: '',
    distancia: '',
    tempoEstimado: '',
    combustivelEstimado: '',
    pedagio: '',
    observacoes: '',
    pontosParada: '',
    horarioSaida: '',
    horarioChegada: '',
    diasSemana: '',
    ativo: true,
    
    // Settings
    ambiente: 'homologacao',
    serie: '001',
    numeroInicial: '1',
    certificadoDigital: '',
    senhaCertificado: '',
    validadeCertificado: '',
    emitente: '',
    cnpjEmitente: '',
    enderecoEmitente: '',
    cidadeEmitente: '',
    ufEmitente: '',
    cepEmitente: '',
    telefoneEmitente: '',
    emailEmitente: '',
    backupAutomatico: true,
    notificacoesEmail: true,
    logDetalhado: false,
    timeout: '30',
    tentativasReenvio: '3'
  });

  // Function to close modal
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
      cepProprietario: '',
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
      nomeMae: '',
      nomeRota: '',
      origem: '',
      destino: '',
      distancia: '',
      tempoEstimado: '',
      combustivelEstimado: '',
      pedagio: '',
      observacoes: '',
      pontosParada: '',
      horarioSaida: '',
      horarioChegada: '',
      diasSemana: '',
      ativo: true,
      ambiente: 'homologacao',
      serie: '001',
      numeroInicial: '1',
      certificadoDigital: '',
      senhaCertificado: '',
      validadeCertificado: '',
      emitente: '',
      cnpjEmitente: '',
      enderecoEmitente: '',
      cidadeEmitente: '',
      ufEmitente: '',
      cepEmitente: '',
      telefoneEmitente: '',
      emailEmitente: '',
      backupAutomatico: true,
      notificacoesEmail: true,
      logDetalhado: false,
      timeout: '30',
      tentativasReenvio: '3'
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
    <div style={modalStyles.overlay} onClick={handleClose}>
      <div style={modalStyles.container} onClick={(e) => e.stopPropagation()}>
        {/* Modal header */}
        <div style={modalStyles.header}>
          <div style={modalStyles.trafficLights}>
            <div style={{...modalStyles.trafficLight, ...modalStyles.trafficLightRed}} onClick={handleClose}></div>
            <div style={{...modalStyles.trafficLight, ...modalStyles.trafficLightYellow}}></div>
            <div style={{...modalStyles.trafficLight, ...modalStyles.trafficLightGreen}}></div>
          </div>
          <div style={modalStyles.title}>Cadastros MDF-e</div>
          <div style={{ width: '60px' }}></div>
        </div>

        {/* Tab system */}
        <div style={modalStyles.tabsContainer}>
          <button
            style={{
              ...modalStyles.tab,
              ...(activeTab === 'vehicle' ? modalStyles.tabActive : {})
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
              ...modalStyles.tab,
              ...(activeTab === 'driver' ? modalStyles.tabActive : {})
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
              ...modalStyles.tab,
              ...(activeTab === 'routes' ? modalStyles.tabActive : {})
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
              ...modalStyles.tab,
              ...(activeTab === 'settings' ? modalStyles.tabActive : {})
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
        <div style={modalStyles.tabContent}>
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
            Salvar Cadastros
          </button>
        </div>
      </div>
    </div>
  );
}
