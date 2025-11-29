import React, { useState, useRef } from 'react';
import { systemStyles, systemColors } from '../../../../../styles/systemStyle';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { AddButton } from '../../../../../components/AddButton/AddButton';
import { WindowHeader } from '../../../../../components/WindowHeader/WindowHeader';
import { formatCpfOrCnpj } from '../../../../../utils/documentFormatter';

// Modal para gerar CIOT
// Componente separado para formulário completo de geração de CIOT
interface GenerateCIOTModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ciotData: any) => void;
}

interface Vehicle {
  id: string;
  licensePlate: string;
  rntrcCode: string;
}

export function GenerateCIOTModal({ isOpen, onClose, onSave }: GenerateCIOTModalProps): JSX.Element | null {
  const playClickSound = useClickSound();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle>({
    id: '',
    licensePlate: '',
    rntrcCode: ''
  });
  const formContainerRef = useRef<HTMLDivElement>(null);


  const [formData, setFormData] = useState({
    travelType: 'Padrão',
    contractorDocument: '',
    hiredDocument: '',
    hiredRntrc: '000000000',
    recipientDocument: '',
    originCity: 'Conceição do Almeida',
    destinationCity: 'Conceição do Almeida',
    cargoNatureCode: '',
    cargoWeight: '0.00',
    tripStartDate: '',
    tripEndDate: '',
    feesQuantity: '0',
    feesValue: '0,00',
    grossValue: '0,00',
    amountToPay: '0,00',
    advanceValue: '0,00',
    paidValue: '0,00',
    sestValue: '0,00',
    inssValue: '0,00',
    tollVoucherValue: '0,00',
    fuelVoucherValue: '0,00',
    irrfVoucherValue: '0,00'
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
    // Estilos de foco são aplicados globalmente via CSS
    const focusStyle = {};
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
    if (currentVehicle.licensePlate && currentVehicle.rntrcCode) {
      const newVehicle: Vehicle = {
        ...currentVehicle,
        id: Date.now().toString()
      };
      setVehicles(prev => [...prev, newVehicle]);
      setCurrentVehicle({
        id: '',
        licensePlate: '',
        rntrcCode: ''
      });
    }
  };

  const handleRemoveVehicle = (id: string) => {
    playClickSound();
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
  };

  const handleClose = () => {
    setFormData({
      travelType: 'Padrão',
      contractorDocument: '',
      hiredDocument: '',
      hiredRntrc: '000000000',
      recipientDocument: '',
      originCity: 'Conceição do Almeida',
      destinationCity: 'Conceição do Almeida',
      cargoNatureCode: '',
      cargoWeight: '0.00',
      tripStartDate: '',
      tripEndDate: '',
      feesQuantity: '0',
      feesValue: '0,00',
      grossValue: '0,00',
      amountToPay: '0,00',
      advanceValue: '0,00',
      paidValue: '0,00',
      sestValue: '0,00',
      inssValue: '0,00',
      tollVoucherValue: '0,00',
      fuelVoucherValue: '0,00',
      irrfVoucherValue: '0,00'
    });
    setVehicles([]);
    setCurrentVehicle({ id: '', licensePlate: '', rntrcCode: '' });
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
        <WindowHeader title="Gerar CIOT" onClose={handleClose} />

        {/* Modal content */}
        <div ref={formContainerRef} className="scrollbar-modal" style={{
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
                  style={getInputStyle('travelType')}
                  value={formData.travelType}
                  onChange={(e) => handleInputChange('travelType', e.target.value)}
                  onFocus={() => handleInputFocus('travelType')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>CPF/CNPJ do Contratante</label>
                <input
                  type="text"
                  style={getInputStyle('contractorDocument')}
                  value={formData.contractorDocument}
                  onChange={(e) => handleInputChange('contractorDocument', formatCpfOrCnpj(e.target.value))}
                  onFocus={() => handleInputFocus('contractorDocument')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                  placeholder="000.000.000-00"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>CPF/CNPJ do Contratado</label>
                <input
                  type="text"
                  style={getInputStyle('hiredDocument')}
                  value={formData.hiredDocument}
                  onChange={(e) => handleInputChange('hiredDocument', formatCpfOrCnpj(e.target.value))}
                  onFocus={() => handleInputFocus('hiredDocument')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                  placeholder="000.000.000-00"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>RNTRC do Contratado</label>
                <input
                  type="text"
                  style={getInputStyle('hiredRntrc')}
                  value={formData.hiredRntrc}
                  onChange={(e) => handleInputChange('hiredRntrc', e.target.value)}
                  onFocus={() => handleInputFocus('hiredRntrc')}
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
                  style={getInputStyle('licensePlate')}
                  value={currentVehicle.licensePlate}
                  onChange={(e) => handleVehicleChange('licensePlate', e.target.value)}
                  onFocus={() => handleInputFocus('licensePlate')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                  placeholder="ABC-1234"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>RNTRC</label>
                <input
                  type="text"
                  style={getInputStyle('rntrcCode')}
                  value={currentVehicle.rntrcCode}
                  onChange={(e) => handleVehicleChange('rntrcCode', e.target.value)}
                  onFocus={() => handleInputFocus('rntrcCode')}
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
                      <strong>PLACA:</strong> {vehicle.licensePlate} | 
                      <strong> RNTRC:</strong> {vehicle.rntrcCode}
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
                  style={getInputStyle('recipientDocument')}
                  value={formData.recipientDocument}
                  onChange={(e) => handleInputChange('recipientDocument', formatCpfOrCnpj(e.target.value))}
                  onFocus={() => handleInputFocus('recipientDocument')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                  placeholder="000.000.000-00"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Município de Origem</label>
                <input
                  type="text"
                  style={getInputStyle('originCity')}
                  value={formData.originCity}
                  onChange={(e) => handleInputChange('originCity', e.target.value)}
                  onFocus={() => handleInputFocus('originCity')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Município de Destino</label>
                <input
                  type="text"
                  style={getInputStyle('destinationCity')}
                  value={formData.destinationCity}
                  onChange={(e) => handleInputChange('destinationCity', e.target.value)}
                  onFocus={() => handleInputFocus('destinationCity')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Código da Natureza da Carga</label>
                <input
                  type="text"
                  style={getInputStyle('cargoNatureCode')}
                  value={formData.cargoNatureCode}
                  onChange={(e) => handleInputChange('cargoNatureCode', e.target.value)}
                  onFocus={() => handleInputFocus('cargoNatureCode')}
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
                  style={getInputStyle('cargoWeight')}
                  value={formData.cargoWeight}
                  onChange={(e) => handleInputChange('cargoWeight', e.target.value)}
                  onFocus={() => handleInputFocus('cargoWeight')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Data Início da Viagem</label>
                <input
                  type="date"
                  style={getInputStyle('tripStartDate')}
                  value={formData.tripStartDate}
                  onChange={(e) => handleInputChange('tripStartDate', e.target.value)}
                  onFocus={() => handleInputFocus('tripStartDate')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Data Fim da Viagem</label>
                <input
                  type="date"
                  style={getInputStyle('tripEndDate')}
                  value={formData.tripEndDate}
                  onChange={(e) => handleInputChange('tripEndDate', e.target.value)}
                  onFocus={() => handleInputFocus('tripEndDate')}
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
                  style={getInputStyle('feesQuantity')}
                  value={formData.feesQuantity}
                  onChange={(e) => handleInputChange('feesQuantity', e.target.value)}
                  onFocus={() => handleInputFocus('feesQuantity')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Valor das Tarifas</label>
                <input
                  type="text"
                  style={getInputStyle('feesValue')}
                  value={formData.feesValue}
                  onChange={(e) => handleInputChange('feesValue', e.target.value)}
                  onFocus={() => handleInputFocus('feesValue')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Valor Bruto</label>
                <input
                  type="text"
                  style={getInputStyle('grossValue')}
                  value={formData.grossValue}
                  onChange={(e) => handleInputChange('grossValue', e.target.value)}
                  onFocus={() => handleInputFocus('grossValue')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Valor à Pagar</label>
                <input
                  type="text"
                  style={getInputStyle('amountToPay')}
                  value={formData.amountToPay}
                  onChange={(e) => handleInputChange('amountToPay', e.target.value)}
                  onFocus={() => handleInputFocus('amountToPay')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Valor do Adiantamento</label>
                <input
                  type="text"
                  style={getInputStyle('advanceValue')}
                  value={formData.advanceValue}
                  onChange={(e) => handleInputChange('advanceValue', e.target.value)}
                  onFocus={() => handleInputFocus('advanceValue')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Valor do Pago</label>
                <input
                  type="text"
                  style={getInputStyle('paidValue')}
                  value={formData.paidValue}
                  onChange={(e) => handleInputChange('paidValue', e.target.value)}
                  onFocus={() => handleInputFocus('paidValue')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Valor SEST</label>
                <input
                  type="text"
                  style={getInputStyle('sestValue')}
                  value={formData.sestValue}
                  onChange={(e) => handleInputChange('sestValue', e.target.value)}
                  onFocus={() => handleInputFocus('sestValue')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Valor do INSS</label>
                <input
                  type="text"
                  style={getInputStyle('inssValue')}
                  value={formData.inssValue}
                  onChange={(e) => handleInputChange('inssValue', e.target.value)}
                  onFocus={() => handleInputFocus('inssValue')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Vale Pedágio</label>
                <input
                  type="text"
                  style={getInputStyle('tollVoucherValue')}
                  value={formData.tollVoucherValue}
                  onChange={(e) => handleInputChange('tollVoucherValue', e.target.value)}
                  onFocus={() => handleInputFocus('tollVoucherValue')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Vale Combustível</label>
                <input
                  type="text"
                  style={getInputStyle('fuelVoucherValue')}
                  value={formData.fuelVoucherValue}
                  onChange={(e) => handleInputChange('fuelVoucherValue', e.target.value)}
                  onFocus={() => handleInputFocus('fuelVoucherValue')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Vale do IRRF</label>
                <input
                  type="text"
                  style={getInputStyle('irrfVoucherValue')}
                  value={formData.irrfVoucherValue}
                  onChange={(e) => handleInputChange('irrfVoucherValue', e.target.value)}
                  onFocus={() => handleInputFocus('irrfVoucherValue')}
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
