import React from 'react';
import { useClickSound } from '../../../hooks/useClickSound';
import { modalStyles } from '../../../styles/modalStyles';

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
      <div style={modalStyles.formSection}>
        <h4 style={modalStyles.formSectionTitle}>Endereço</h4>
        <div style={modalStyles.formGrid}>
        <div style={{ ...modalStyles.formGroup, ...modalStyles.formGridFull }}>
          <label style={modalStyles.formLabel}>
            Endereço
          </label>
          <input
            type="text"
            style={modalStyles.formInput}
            value={formData.address}
            onChange={(e) => onUpdateFormData('address', e.target.value)}
            onClick={playClickSound}
            placeholder="Rua, número, complemento"
          />
        </div>
        <div style={modalStyles.formGroup}>
          <label style={modalStyles.formLabel}>
            Cidade
          </label>
          <input
            type="text"
            style={modalStyles.formInput}
            value={formData.city}
            onChange={(e) => onUpdateFormData('city', e.target.value)}
            onClick={playClickSound}
            placeholder="Digite a cidade"
          />
        </div>
        <div style={modalStyles.formGroup}>
          <label style={modalStyles.formLabel}>
            Estado
          </label>
          <select
            style={modalStyles.formSelect}
            value={formData.state}
            onChange={(e) => {
              playClickSound();
              onUpdateFormData('state', e.target.value);
            }}
            onClick={playClickSound}
          >
            <option value="">Selecione o estado</option>
            {ufsBrasileiras.map(uf => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>
        <div style={modalStyles.formGroup}>
          <label style={modalStyles.formLabel}>
            CEP
          </label>
          <input
            type="text"
            style={modalStyles.formInput}
            value={formData.zipCode}
            onChange={(e) => handleCEPChange(e.target.value)}
            onClick={playClickSound}
            placeholder="00000-000"
            maxLength={9}
          />
        </div>
        <div style={modalStyles.formGroup}>
          <label style={modalStyles.formLabel}>
            Número
          </label>
          <input
            type="text"
            style={modalStyles.formInput}
            value={formData.addressNumber || ''}
            onChange={(e) => onUpdateFormData('addressNumber', e.target.value)}
            onClick={playClickSound}
            placeholder="Digite o número"
          />
        </div>
        <div style={modalStyles.formGroup}>
          <label style={modalStyles.formLabel}>
            Bairro
          </label>
          <input
            type="text"
            style={modalStyles.formInput}
            value={formData.neighborhood || ''}
            onChange={(e) => onUpdateFormData('neighborhood', e.target.value)}
            onClick={playClickSound}
            placeholder="Digite o bairro"
          />
        </div>
        </div>
      </div>
    </div>
  );
}
