import React, { useState, useRef } from 'react';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { formatCpfOrCnpj } from '../../../../../utils/documentFormatter';

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
  rntrc?: string;
}

interface TransportTabProps {
  formData: any;
  onUpdateFormData: (field: string, value: any) => void;
}

export function TransportTab({ formData, onUpdateFormData }: TransportTabProps): JSX.Element {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [proprietarioNaoEmitente, setProprietarioNaoEmitente] = useState(!!formData.isOwnerNotIssuer);
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Adicionar animação CSS para o formulário adicional
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);


  // Lista de UFs brasileiras
  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  // Opções de Tipo de Carroceria
  const bodyTypes = [
    { value: '00', label: 'não aplicável' },
    { value: '01', label: 'Aberta' },
    { value: '02', label: 'Fechada/Baú' },
    { value: '03', label: 'Granelera' },
    { value: '04', label: 'Porta Container' },
    { value: '05', label: 'Sider' }
  ];

  // Opções de Tipo de Rodado
  const wheelTypes = [
    { value: '01', label: 'Truck' },
    { value: '02', label: 'Toco' },
    { value: '03', label: 'Cavalo Mecânico' },
    { value: '04', label: 'VAN' },
    { value: '05', label: 'Utilitário' },
    { value: '06', label: 'Outros' }
  ];

  // Dados mockados de veículos cadastrados
  const [veiculosCadastrados] = useState<Vehicle[]>([
    {
      id: '1',
      placa: 'ABC-1234',
      renavam: '12345678901',
      chassi: '9BWZZZZ377VT00426',
      marca: 'Volkswagen',
      modelo: 'Gol',
      anoFabricacao: '2023',
      anoModelo: '2024',
      cor: 'Branco',
      combustivel: 'Flex',
      capacidade: '1500',
      proprietario: 'João Silva',
      cpfCnpjProprietario: '123.456.789-00',
      enderecoProprietario: 'Rua das Flores, 123',
      cidadeProprietario: 'São Paulo',
      ufProprietario: 'SP',
      cepProprietario: '01234-567',
      rntrc: '12345678'
    },
    {
      id: '2',
      placa: 'DEF-5678',
      renavam: '98765432109',
      chassi: '9BWZZZZ377VT00427',
      marca: 'Ford',
      modelo: 'Ka',
      anoFabricacao: '2022',
      anoModelo: '2023',
      cor: 'Prata',
      combustivel: 'Flex',
      capacidade: '1200',
      proprietario: 'Maria Santos',
      cpfCnpjProprietario: '987.654.321-00',
      enderecoProprietario: 'Av. Paulista, 1000',
      cidadeProprietario: 'São Paulo',
      ufProprietario: 'SP',
      cepProprietario: '01310-100',
      rntrc: '87654321'
    },
    {
      id: '3',
      placa: 'GHI-9012',
      renavam: '11223344556',
      chassi: '9BWZZZZ377VT00428',
      marca: 'Chevrolet',
      modelo: 'Onix',
      anoFabricacao: '2024',
      anoModelo: '2024',
      cor: 'Azul',
      combustivel: 'Flex',
      capacidade: '1300',
      proprietario: 'Pedro Costa',
      cpfCnpjProprietario: '111.222.333-44',
      enderecoProprietario: 'Rua Augusta, 500',
      cidadeProprietario: 'São Paulo',
      ufProprietario: 'SP',
      cepProprietario: '01305-000',
      rntrc: '99887766'
    }
  ]);

  const handleInputChange = (field: string, value: string) => {
    onUpdateFormData(field, value);
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

  const getInputProps = (field: string, placeholder: string, type: string = 'text') => ({
    type: type,
    style: getInputStyle(field),
    value: formData[field] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const raw = e.target.value;
      const isDocField = /cpf|cnpj/i.test(field);
      const formatted = isDocField ? formatCpfOrCnpj(raw) : raw;
      handleInputChange(field, formatted);
    },
    onFocus: () => handleInputFocus(field),
    onBlur: handleInputBlur,
    onClick: () => playClickSound(),
    placeholder
  });

  const handleVehicleSelect = (vehicleId: string) => {
    playClickSound();
    const vehicle = veiculosCadastrados.find(v => v.id === vehicleId);
    if (vehicle) {
      // Mapear campos do veículo (português) para campos do formData (inglês)
      onUpdateFormData('selectedVehicle', vehicleId);
      onUpdateFormData('licensePlate', vehicle.placa);
      onUpdateFormData('renavam', vehicle.renavam);
      onUpdateFormData('chassis', vehicle.chassi);
      onUpdateFormData('brand', vehicle.marca);
      onUpdateFormData('model', vehicle.modelo);
      onUpdateFormData('manufacturingYear', vehicle.anoFabricacao);
      onUpdateFormData('modelYear', vehicle.anoModelo);
      onUpdateFormData('color', vehicle.cor);
      onUpdateFormData('fuelType', vehicle.combustivel);
      onUpdateFormData('capacityKg', vehicle.capacidade);
      onUpdateFormData('ownerName', vehicle.proprietario);
      onUpdateFormData('ownerDocument', vehicle.cpfCnpjProprietario);
      onUpdateFormData('ownerAddress', vehicle.enderecoProprietario);
      onUpdateFormData('ownerCity', vehicle.cidadeProprietario);
      onUpdateFormData('ownerState', vehicle.ufProprietario);
      onUpdateFormData('ownerZipCode', vehicle.cepProprietario);
      if (vehicle.rntrc) {
        onUpdateFormData('rntrcCode', vehicle.rntrc);
      }
    }
  };

  const handleCheckboxChange = () => {
    playClickSound();
    const newValue = !proprietarioNaoEmitente;
    setProprietarioNaoEmitente(newValue);
    onUpdateFormData('isOwnerNotIssuer', newValue);
  };

  const styles = {
    container: {
      height: '100%',
      overflow: 'auto' as const,
      padding: '0'
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
      ...systemStyles.input.label
    },
    select: {
      ...systemStyles.input.field,
      cursor: 'pointer'
    },
    infoText: {
      fontSize: '11px',
      color: systemColors.text.secondary,
      fontStyle: 'italic',
      marginTop: '4px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '16px',
      padding: '12px',
      background: systemColors.background.content,
      borderRadius: '6px',
      border: `1px solid ${systemColors.border.light}`
    },
    checkboxItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer'
    },
    checkbox: {
      ...systemStyles.checkbox.box,
      width: '16px',
      height: '16px'
    },
    checkboxChecked: {
      ...systemStyles.checkbox.boxChecked
    },
    checkboxLabel: {
      ...systemStyles.checkbox.label,
      fontSize: '12px'
    },
    additionalForm: {
      marginTop: '16px',
      padding: '16px',
      background: systemColors.background.content,
      borderRadius: '8px',
      border: `1px solid ${systemColors.border.light}`,
      animation: 'slideDown 0.3s ease-out'
    },
    additionalFormGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '12px'
    },
    label: {
      ...systemStyles.input.label
    }
  };

  return (
    <div ref={formContainerRef} className="scrollbar-modal" style={styles.container}>
      {/* Seção de Seleção de Veículo */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Veículo Cadastrado</h4>
        <div style={{marginBottom: '16px'}}>
          <label style={styles.selectLabel}>Selecionar Veículo Cadastrado</label>
          <div style={{ position: 'relative' as const }}>
            <select
              style={{
                ...systemStyles.select.field,
                paddingRight: '24px'
              }}
              value={formData.selectedVehicle || ''}
              onChange={(e) => handleVehicleSelect(e.target.value)}
              onFocus={() => handleInputFocus('selectedVehicle')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
            >
              <option value="">Selecione um veículo cadastrado</option>
              {veiculosCadastrados.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.placa} - {vehicle.marca} {vehicle.modelo} ({vehicle.proprietario})
                </option>
              ))}
            </select>
            <div style={systemStyles.select.arrow}>
              <div style={systemStyles.select.arrowIcon}></div>
            </div>
          </div>
          <div style={styles.infoText}>
            Selecione um veículo cadastrado para preencher automaticamente os campos abaixo, ou preencha manualmente.
          </div>
        </div>
      </div>

      {/* Seção de Dados do Veículo */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Dados do Veículo</h4>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Placa *</label>
            <input {...getInputProps('licensePlate', 'ABC1234')} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>RENAVAM</label>
            <input {...getInputProps('renavam', '12345678901')} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tipo de Carroceria</label>
            <div style={{ position: 'relative' }}>
              <select
                style={{
                  ...systemStyles.select.field,
                  appearance: 'none' as const,
                  WebkitAppearance: 'none' as const,
                  MozAppearance: 'none' as const
                }}
                value={formData.bodyType || ''}
                onChange={(e) => {
                  playClickSound();
                  handleInputChange('bodyType', e.target.value);
                }}
                onFocus={() => handleInputFocus('bodyType')}
                onBlur={handleInputBlur}
                onClick={() => playClickSound()}
              >
                <option value="">Selecione o tipo de carroceria</option>
                {bodyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <div style={systemStyles.select.arrow}>
                <div style={systemStyles.select.arrowIcon}></div>
              </div>
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tipo de Rodado</label>
            <div style={{ position: 'relative' }}>
              <select
                style={{
                  ...systemStyles.select.field,
                  appearance: 'none' as const,
                  WebkitAppearance: 'none' as const,
                  MozAppearance: 'none' as const
                }}
                value={formData.wheelType || ''}
                onChange={(e) => {
                  playClickSound();
                  handleInputChange('wheelType', e.target.value);
                }}
                onFocus={() => handleInputFocus('wheelType')}
                onBlur={handleInputBlur}
                onClick={() => playClickSound()}
              >
                <option value="">Selecione o tipo de rodado</option>
                {wheelTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <div style={systemStyles.select.arrow}>
                <div style={systemStyles.select.arrowIcon}></div>
              </div>
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tara (KG)</label>
            <input {...getInputProps('tareWeight', '2372')} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>UF</label>
            <div style={{ position: 'relative' }}>
              <select
                style={{
                  ...systemStyles.select.field,
                  appearance: 'none' as const,
                  WebkitAppearance: 'none' as const,
                  MozAppearance: 'none' as const
                }}
                value={formData.vehicleState || ''}
                onChange={(e) => {
                  playClickSound();
                  handleInputChange('vehicleState', e.target.value);
                }}
                onFocus={() => handleInputFocus('vehicleState')}
                onBlur={handleInputBlur}
                onClick={() => playClickSound()}
              >
                <option value="">Selecione a UF</option>
                {brazilianStates.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
              <div style={systemStyles.select.arrow}>
                <div style={systemStyles.select.arrowIcon}></div>
              </div>
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Capacidade (KG)</label>
            <input {...getInputProps('capacityKg', '1500')} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Capacidade (M3)</label>
            <input {...getInputProps('capacityM3', '')} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Chassi</label>
            <input {...getInputProps('chassis', '9BWZZZZ377VT00426')} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Marca *</label>
            <input {...getInputProps('brand', 'Volkswagen')} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Modelo *</label>
            <input {...getInputProps('model', 'Gol')} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Ano Fabricação</label>
            <input {...getInputProps('manufacturingYear', '2023')} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Ano Modelo</label>
            <input {...getInputProps('modelYear', '2024')} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Cor</label>
            <input {...getInputProps('color', 'Branco')} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Combustível</label>
            <input {...getInputProps('fuelType', 'Flex')} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>RNTRC</label>
            <input {...getInputProps('rntrc', '00000000')} />
          </div>
        </div>
      </div>

      {/* Seção de Dados do Proprietário */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Dados do Proprietário</h4>
        
        {/* Checkbox para proprietário não emitente */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
          padding: '12px',
          background: 'rgba(255, 255, 255, 0.4)',
          borderRadius: '6px',
          border: '1px solid rgba(0, 0, 0, 0.1)'
        }}>
          <div 
            style={styles.checkboxItem}
            onClick={handleCheckboxChange}
          >
            <div 
              style={{
                ...styles.checkbox,
                ...(proprietarioNaoEmitente ? styles.checkboxChecked : {})
              }}
            >
              {proprietarioNaoEmitente && (
                <svg viewBox="0 0 10 10" style={systemStyles.checkbox.checkmark}>
                  <path d="M2 5 L4 7 L8 2" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span style={styles.checkboxLabel}>
              O proprietário NÃO é o emitente
            </span>
          </div>
        </div>

        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nome/Razão Social</label>
            <input {...getInputProps('ownerName', 'João Silva')} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>CPF/CNPJ</label>
            <input {...getInputProps('ownerDocument', '123.456.789-00')} />
          </div>
          <div style={{...styles.formGroup, ...styles.formGroupFull}}>
            <label style={styles.label}>Endereço</label>
            <input {...getInputProps('ownerAddress', 'Rua das Flores, 123')} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Cidade</label>
            <input {...getInputProps('ownerCity', 'São Paulo')} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>UF</label>
            <select
              style={{
                ...systemStyles.select.field
              }}
              value={formData.ownerState || ''}
              onChange={(e) => {
                playClickSound();
                handleInputChange('ownerState', e.target.value);
              }}
              onFocus={() => handleInputFocus('ownerState')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
            >
              <option value="">Selecione a UF</option>
              {brazilianStates.map(uf => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>CEP</label>
            <input {...getInputProps('ownerZipCode', '01234-567')} />
          </div>
        </div>

        {/* Formulário adicional quando proprietário não é emitente */}
        {proprietarioNaoEmitente && (
          <div style={styles.additionalForm}>
            <div style={styles.additionalFormGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tipo de Proprietário</label>
                <input {...getInputProps('ownerType', 'Pessoa Física')} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>CPF/CNPJ</label>
                <input {...getInputProps('ownerDocument', '123.456.789-00')} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nome</label>
                <input {...getInputProps('ownerName', 'João Silva')} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>IE</label>
                <input {...getInputProps('ownerStateRegistration', '123456789')} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>UF</label>
                <select
                  style={{
                    ...systemStyles.select.field
                  }}
                  value={formData.ownerFullState || ''}
                  onChange={(e) => {
                    playClickSound();
                    handleInputChange('ownerFullState', e.target.value);
                  }}
                  onFocus={() => handleInputFocus('ownerFullState')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                >
                  <option value="">Selecione a UF</option>
                  {brazilianStates.map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
