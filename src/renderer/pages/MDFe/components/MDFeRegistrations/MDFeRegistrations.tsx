import React, { useState } from 'react';
import { systemStyles, systemColors } from '../../../../styles/systemStyle';
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
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const [isCancelHovered, setIsCancelHovered] = useState(false);
  const [isSaveHovered, setIsSaveHovered] = useState(false);
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
        {/* Modal header */}
        <div style={{
          ...systemStyles.titleBar,
          position: 'relative',
          flexShrink: 0
        }}>
          <div style={systemStyles.trafficLights.container}>
            <button
              style={{
                ...systemStyles.trafficLights.button,
                ...systemStyles.trafficLights.red
              }}
              onClick={() => {
                playClickSound();
                handleClose();
              }}
              onMouseEnter={() => setIsCloseHovered(true)}
              onMouseLeave={() => setIsCloseHovered(false)}
              title="Fechar"
            />
            <button
              style={{
                ...systemStyles.trafficLights.button,
                ...systemStyles.trafficLights.yellow
              }}
              onClick={() => {
                playClickSound();
                // Minimizar modal (implementar depois)
              }}
              title="Minimizar"
            />
            <button
              style={{
                ...systemStyles.trafficLights.button,
                ...systemStyles.trafficLights.green
              }}
              onClick={() => {
                playClickSound();
                // Maximizar modal (implementar depois)
              }}
              title="Maximizar"
            />
          </div>
          <h2 style={systemStyles.titleBarTitle}>Cadastros MDF-e</h2>
          <div style={{ width: '60px' }}></div>
        </div>

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
