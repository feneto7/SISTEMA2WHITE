import React, { useState, useRef } from 'react';
import { systemStyles, systemColors } from '../../../../../styles/systemStyle';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { useElementScrollbarStyles } from '../../../../../hooks/useScrollbarStyles';
import { AddButton } from '../../../../../components/AddButton/AddButton';

// Modal para gerar CIOT
// Componente separado para formulário completo de geração de CIOT
interface GenerateCIOTModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ciotData: any) => void;
}

interface Vehicle {
  id: string;
  placa: string;
  rntrc: string;
}

export function GenerateCIOTModal({ isOpen, onClose, onSave }: GenerateCIOTModalProps): JSX.Element | null {
  const playClickSound = useClickSound();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle>({
    id: '',
    placa: '',
    rntrc: ''
  });
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Aplicar estilos de scrollbar específicos para formulários
  useElementScrollbarStyles(formContainerRef, 'modal');

  const [formData, setFormData] = useState({
    tipoViagem: 'Padrão',
    cpfCnpjContratante: '',
    cpfCnpjContratado: '',
    rntrcContratado: '000000000',
    cpfCnpjDestinatario: '',
    municipioOrigem: 'Conceição do Almeida',
    municipioDestino: 'Conceição do Almeida',
    codigoNaturezaCarga: '',
    pesoCarga: '0.00',
    dataInicioViagem: '',
    dataFimViagem: '',
    qntdTarifas: '0',
    valorTarifas: '0,00',
    valorBruto: '0,00',
    valorPagar: '0,00',
    valorAdiantamento: '0,00',
    valorPago: '0,00',
    valorSEST: '0,00',
    valorINSS: '0,00',
    valePedagio: '0,00',
    valeCombustivel: '0,00',
    valeIRRF: '0,00'
  });

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

  // Funções para gerenciar veículos
  const handleVehicleChange = (field: keyof Vehicle, value: string) => {
    setCurrentVehicle(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddVehicle = () => {
    playClickSound();
    if (currentVehicle.placa && currentVehicle.rntrc) {
      const newVehicle: Vehicle = {
        ...currentVehicle,
        id: Date.now().toString()
      };
      setVehicles(prev => [...prev, newVehicle]);
      setCurrentVehicle({
        id: '',
        placa: '',
        rntrc: ''
      });
    }
  };

  const handleRemoveVehicle = (id: string) => {
    playClickSound();
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
  };

  const handleClose = () => {
    setFormData({
      tipoViagem: 'Padrão',
      cpfCnpjContratante: '',
      cpfCnpjContratado: '',
      rntrcContratado: '000000000',
      cpfCnpjDestinatario: '',
      municipioOrigem: 'Conceição do Almeida',
      municipioDestino: 'Conceição do Almeida',
      codigoNaturezaCarga: '',
      pesoCarga: '0.00',
      dataInicioViagem: '',
      dataFimViagem: '',
      qntdTarifas: '0',
      valorTarifas: '0,00',
      valorBruto: '0,00',
      valorPagar: '0,00',
      valorAdiantamento: '0,00',
      valorPago: '0,00',
      valorSEST: '0,00',
      valorINSS: '0,00',
      valePedagio: '0,00',
      valeCombustivel: '0,00',
      valeIRRF: '0,00'
    });
    setVehicles([]);
    setCurrentVehicle({ id: '', placa: '', rntrc: '' });
    onClose();
  };

  const handleSave = () => {
    playClickSound();
    const ciotData = {
      ...formData,
      vehicles
    };
    onSave(ciotData);
    handleClose();
  };

  const styles = {
    container: {
      height: '100%',
      overflow: 'auto' as const,
      padding: '0'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '16px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '6px'
    },
    formGroupFull: {
      gridColumn: '1 / -1'
    },
    vehicleFormGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr auto',
      gap: '16px',
      marginBottom: '16px',
      alignItems: 'end'
    },
    vehicleList: {
      marginTop: '16px',
      padding: '12px',
      background: systemColors.background.content,
      borderRadius: '6px',
      border: `1px solid ${systemColors.border.light}`
    },
    vehicleItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px',
      background: systemColors.background.white,
      borderRadius: '4px',
      marginBottom: '8px',
      fontSize: '12px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    removeButton: {
      width: '20px',
      height: '20px',
      borderRadius: '4px',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      background: 'linear-gradient(to bottom, #ff5f57, #ff3b30)',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '10px',
      fontWeight: 'bold'
    },
    newCiotButton: {
      borderRadius: '6px',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      background: 'linear-gradient(to bottom, #f5f5f5, #e8e8e8)',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgba(0, 0, 0, 0.7)',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      fontSize: '13px',
      fontWeight: '500',
      padding: '8px 16px',
      textTransform: 'uppercase' as const
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
    label: systemStyles.input.label
  };

  if (!isOpen) return null;

  return (
    <div style={{
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
    }}>
      <div style={{
        ...systemStyles.window,
        width: '90vw',
        maxWidth: '800px',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column' as const,
        overflow: 'hidden'
      }}>
        {/* Modal header */}
        <div style={{
          ...systemStyles.titleBar,
          position: 'relative' as const
        }}>
          <div style={systemStyles.trafficLights.container}>
            <button style={{...systemStyles.trafficLights.button, ...systemStyles.trafficLights.red}} onClick={handleClose}></button>
            <button style={{...systemStyles.trafficLights.button, ...systemStyles.trafficLights.yellow}}></button>
            <button style={{...systemStyles.trafficLights.button, ...systemStyles.trafficLights.green}}></button>
          </div>
          <div style={systemStyles.titleBarTitle}>Gerar CIOT</div>
          <div style={{ width: '60px' }}></div>
        </div>

        {/* Modal content */}
        <div ref={formContainerRef} style={{
          flex: 1,
          padding: '24px',
          backgroundColor: systemColors.background.content,
          overflow: 'auto'
        }}>
          {/* Seção Gerar CIOT */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Gerar CIOT</h4>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tipo de Viagem</label>
                <input
                  type="text"
                  style={getInputStyle('tipoViagem')}
                  value={formData.tipoViagem}
                  onChange={(e) => handleInputChange('tipoViagem', e.target.value)}
                  onFocus={() => handleInputFocus('tipoViagem')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>CPF/CNPJ do Contratante</label>
                <input
                  type="text"
                  style={getInputStyle('cpfCnpjContratante')}
                  value={formData.cpfCnpjContratante}
                  onChange={(e) => handleInputChange('cpfCnpjContratante', e.target.value)}
                  onFocus={() => handleInputFocus('cpfCnpjContratante')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                  placeholder="000.000.000-00"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>CPF/CNPJ do Contratado</label>
                <input
                  type="text"
                  style={getInputStyle('cpfCnpjContratado')}
                  value={formData.cpfCnpjContratado}
                  onChange={(e) => handleInputChange('cpfCnpjContratado', e.target.value)}
                  onFocus={() => handleInputFocus('cpfCnpjContratado')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                  placeholder="000.000.000-00"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>RNTRC do Contratado</label>
                <input
                  type="text"
                  style={getInputStyle('rntrcContratado')}
                  value={formData.rntrcContratado}
                  onChange={(e) => handleInputChange('rntrcContratado', e.target.value)}
                  onFocus={() => handleInputFocus('rntrcContratado')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
            </div>
          </div>

          {/* Seção Veículos */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Veículos (máximo 5)</h4>
            <div style={styles.vehicleFormGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Placa</label>
                <input
                  type="text"
                  style={getInputStyle('placa')}
                  value={currentVehicle.placa}
                  onChange={(e) => handleVehicleChange('placa', e.target.value)}
                  onFocus={() => handleInputFocus('placa')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                  placeholder="ABC-1234"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>RNTRC</label>
                <input
                  type="text"
                  style={getInputStyle('rntrc')}
                  value={currentVehicle.rntrc}
                  onChange={(e) => handleVehicleChange('rntrc', e.target.value)}
                  onFocus={() => handleInputFocus('rntrc')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                  placeholder="123456789"
                />
              </div>
              <div style={styles.formGroup}>
                <AddButton onClick={handleAddVehicle} label="Adicionar Veículo" />
              </div>
            </div>

            {/* Lista de veículos */}
            {vehicles.length > 0 && (
              <div style={styles.vehicleList}>
                <div style={{fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: systemColors.text.secondary}}>
                  Veículos Adicionados:
                </div>
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} style={styles.vehicleItem}>
                    <div>
                      <strong>PLACA:</strong> {vehicle.placa} | 
                      <strong> RNTRC:</strong> {vehicle.rntrc}
                    </div>
                    <button
                      style={styles.removeButton}
                      onClick={() => handleRemoveVehicle(vehicle.id)}
                      title="Remover veículo"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Seção Destinatário e Carga */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Destinatário e Carga</h4>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>CPF/CNPJ do Destinatário</label>
                <input
                  type="text"
                  style={getInputStyle('cpfCnpjDestinatario')}
                  value={formData.cpfCnpjDestinatario}
                  onChange={(e) => handleInputChange('cpfCnpjDestinatario', e.target.value)}
                  onFocus={() => handleInputFocus('cpfCnpjDestinatario')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                  placeholder="000.000.000-00"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Município de Origem</label>
                <input
                  type="text"
                  style={getInputStyle('municipioOrigem')}
                  value={formData.municipioOrigem}
                  onChange={(e) => handleInputChange('municipioOrigem', e.target.value)}
                  onFocus={() => handleInputFocus('municipioOrigem')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Município de Destino</label>
                <input
                  type="text"
                  style={getInputStyle('municipioDestino')}
                  value={formData.municipioDestino}
                  onChange={(e) => handleInputChange('municipioDestino', e.target.value)}
                  onFocus={() => handleInputFocus('municipioDestino')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Código da Natureza da Carga</label>
                <input
                  type="text"
                  style={getInputStyle('codigoNaturezaCarga')}
                  value={formData.codigoNaturezaCarga}
                  onChange={(e) => handleInputChange('codigoNaturezaCarga', e.target.value)}
                  onFocus={() => handleInputFocus('codigoNaturezaCarga')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                  placeholder="Código da carga"
                />
              </div>
            </div>
          </div>

          {/* Seção Peso e Datas */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Peso e Datas</h4>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Peso da Carga</label>
                <input
                  type="text"
                  style={getInputStyle('pesoCarga')}
                  value={formData.pesoCarga}
                  onChange={(e) => handleInputChange('pesoCarga', e.target.value)}
                  onFocus={() => handleInputFocus('pesoCarga')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Data Início da Viagem</label>
                <input
                  type="date"
                  style={getInputStyle('dataInicioViagem')}
                  value={formData.dataInicioViagem}
                  onChange={(e) => handleInputChange('dataInicioViagem', e.target.value)}
                  onFocus={() => handleInputFocus('dataInicioViagem')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Data Fim da Viagem</label>
                <input
                  type="date"
                  style={getInputStyle('dataFimViagem')}
                  value={formData.dataFimViagem}
                  onChange={(e) => handleInputChange('dataFimViagem', e.target.value)}
                  onFocus={() => handleInputFocus('dataFimViagem')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
            </div>
          </div>

          {/* Seção Tarifas */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Tarifas</h4>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Qntd. de Tarifas</label>
                <input
                  type="text"
                  style={getInputStyle('qntdTarifas')}
                  value={formData.qntdTarifas}
                  onChange={(e) => handleInputChange('qntdTarifas', e.target.value)}
                  onFocus={() => handleInputFocus('qntdTarifas')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Valor das Tarifas</label>
                <input
                  type="text"
                  style={getInputStyle('valorTarifas')}
                  value={formData.valorTarifas}
                  onChange={(e) => handleInputChange('valorTarifas', e.target.value)}
                  onFocus={() => handleInputFocus('valorTarifas')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Valor Bruto</label>
                <input
                  type="text"
                  style={getInputStyle('valorBruto')}
                  value={formData.valorBruto}
                  onChange={(e) => handleInputChange('valorBruto', e.target.value)}
                  onFocus={() => handleInputFocus('valorBruto')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Valor à Pagar</label>
                <input
                  type="text"
                  style={getInputStyle('valorPagar')}
                  value={formData.valorPagar}
                  onChange={(e) => handleInputChange('valorPagar', e.target.value)}
                  onFocus={() => handleInputFocus('valorPagar')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Valor do Adiantamento</label>
                <input
                  type="text"
                  style={getInputStyle('valorAdiantamento')}
                  value={formData.valorAdiantamento}
                  onChange={(e) => handleInputChange('valorAdiantamento', e.target.value)}
                  onFocus={() => handleInputFocus('valorAdiantamento')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Valor do Pago</label>
                <input
                  type="text"
                  style={getInputStyle('valorPago')}
                  value={formData.valorPago}
                  onChange={(e) => handleInputChange('valorPago', e.target.value)}
                  onFocus={() => handleInputFocus('valorPago')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Valor SEST</label>
                <input
                  type="text"
                  style={getInputStyle('valorSEST')}
                  value={formData.valorSEST}
                  onChange={(e) => handleInputChange('valorSEST', e.target.value)}
                  onFocus={() => handleInputFocus('valorSEST')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Valor do INSS</label>
                <input
                  type="text"
                  style={getInputStyle('valorINSS')}
                  value={formData.valorINSS}
                  onChange={(e) => handleInputChange('valorINSS', e.target.value)}
                  onFocus={() => handleInputFocus('valorINSS')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Vale Pedágio</label>
                <input
                  type="text"
                  style={getInputStyle('valePedagio')}
                  value={formData.valePedagio}
                  onChange={(e) => handleInputChange('valePedagio', e.target.value)}
                  onFocus={() => handleInputFocus('valePedagio')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Vale Combustível</label>
                <input
                  type="text"
                  style={getInputStyle('valeCombustivel')}
                  value={formData.valeCombustivel}
                  onChange={(e) => handleInputChange('valeCombustivel', e.target.value)}
                  onFocus={() => handleInputFocus('valeCombustivel')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Vale do IRRF</label>
                <input
                  type="text"
                  style={getInputStyle('valeIRRF')}
                  value={formData.valeIRRF}
                  onChange={(e) => handleInputChange('valeIRRF', e.target.value)}
                  onFocus={() => handleInputFocus('valeIRRF')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div style={{
          padding: '12px 16px',
          background: systemColors.background.primary,
          borderTop: `1px solid ${systemColors.border.light}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            style={systemStyles.button.default}
            onClick={handleClose}
          >
            Cancelar
          </button>
          <button
            style={systemStyles.button.primary}
            onClick={handleSave}
          >
            Gerar CIOT
          </button>
        </div>
      </div>
    </div>
  );
}
