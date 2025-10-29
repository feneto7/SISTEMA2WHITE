import React, { useState } from 'react';
import { useClickSound } from '../../../hooks/useClickSound';
import { useTheme } from '../../../styles/ThemeProvider';

// Interface para dados do formulário
interface FormData {
  name: string;
  email: string;
  phone: string;
  document: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  notes: string;
  // Campos específicos para pessoa jurídica
  fantasyName: string;
  stateRegistration: string;
  municipalRegistration: string;
  // Campos de endereço adicionais
  addressNumber: string;
  neighborhood: string;
}

// Props do componente AddressTab
interface AddressTabProps {
  formData: FormData;
  onUpdateFormData: (field: string, value: string) => void;
}

// Aba de endereço do modal de cliente
// Contém os campos de endereço completo do cliente
export function AddressTab({ formData, onUpdateFormData }: AddressTabProps): JSX.Element {
  const playClickSound = useClickSound();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { systemStyles, systemColors } = useTheme();
  
  // Lista completa de UFs brasileiras
  const ufsBrasileiras = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];
  
  // Função para formatar CEP
  const formatCEP = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara do CEP: 00000-000
    if (numbers.length <= 5) {
      return numbers;
    } else {
      return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
    }
  };

  // Função para lidar com mudança no campo de CEP
  const handleCEPChange = (value: string) => {
    const formatted = formatCEP(value);
    onUpdateFormData('zipCode', formatted);
  };
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          fontSize: '13px',
          fontWeight: '600',
          color: systemColors.text.secondary,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.5px',
          marginBottom: '12px'
        }}>Endereço</h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr'
        }}>
        <div style={systemStyles.input.container}>
          <label style={systemStyles.input.label}>
            Endereço
          </label>
          <input
            type="text"
            style={{
              ...systemStyles.input.field
            }}
            value={formData.address}
            onChange={(e) => onUpdateFormData('address', e.target.value)}
            onFocus={() => setFocusedField('address')}
            onBlur={() => setFocusedField(null)}
            onClick={playClickSound}
            placeholder="Rua, número, complemento"
          />
        </div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginTop: '16px'
        }}>
        <div style={systemStyles.select.container}>
          <label style={systemStyles.input.label}>
            Cidade
          </label>
          <input
            type="text"
            style={{
              ...systemStyles.input.field
            }}
            value={formData.city}
            onChange={(e) => onUpdateFormData('city', e.target.value)}
            onFocus={() => setFocusedField('city')}
            onBlur={() => setFocusedField(null)}
            onClick={playClickSound}
            placeholder="Digite a cidade"
          />
        </div>
        <div style={systemStyles.select.container}>
          <label style={systemStyles.input.label}>
            Estado
          </label>
          <div style={{ position: 'relative' }}>
            <select
              style={{
                ...systemStyles.select.field
              }}
              value={formData.state}
              onChange={(e) => {
                playClickSound();
                onUpdateFormData('state', e.target.value);
              }}
              onFocus={() => setFocusedField('state')}
              onBlur={() => setFocusedField(null)}
              onClick={playClickSound}
            >
              <option value="">Selecione o estado</option>
              {ufsBrasileiras.map(uf => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
            <div style={systemStyles.select.arrow}>
              <div style={systemStyles.select.arrowIcon}></div>
            </div>
          </div>
        </div>
        <div style={systemStyles.input.container}>
          <label style={systemStyles.input.label}>
            CEP
          </label>
          <input
            type="text"
            style={{
              ...systemStyles.input.field
            }}
            value={formData.zipCode}
            onChange={(e) => handleCEPChange(e.target.value)}
            onFocus={() => setFocusedField('zipCode')}
            onBlur={() => setFocusedField(null)}
            onClick={playClickSound}
            placeholder="00000-000"
            maxLength={9}
          />
        </div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          marginTop: '16px'
        }}>
        <div style={systemStyles.input.container}>
          <label style={systemStyles.input.label}>
            Número
          </label>
          <input
            type="text"
            style={{
              ...systemStyles.input.field
            }}
            value={formData.addressNumber || ''}
            onChange={(e) => onUpdateFormData('addressNumber', e.target.value)}
            onFocus={() => setFocusedField('addressNumber')}
            onBlur={() => setFocusedField(null)}
            onClick={playClickSound}
            placeholder="Digite o número"
          />
        </div>
        <div style={systemStyles.input.container}>
          <label style={systemStyles.input.label}>
            Bairro
          </label>
          <input
            type="text"
            style={{
              ...systemStyles.input.field
            }}
            value={formData.neighborhood || ''}
            onChange={(e) => onUpdateFormData('neighborhood', e.target.value)}
            onFocus={() => setFocusedField('neighborhood')}
            onBlur={() => setFocusedField(null)}
            onClick={playClickSound}
            placeholder="Digite o bairro"
          />
        </div>
        </div>
      </div>
    </div>
  );
}
