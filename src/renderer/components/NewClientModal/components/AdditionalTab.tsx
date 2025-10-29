import React, { useState } from 'react';
import { systemStyles, systemColors } from '../../../styles/systemStyle';

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

// Props do componente AdditionalTab
interface AdditionalTabProps {
  formData: FormData;
  onUpdateFormData: (field: string, value: string) => void;
}

// Aba adicional do modal de cliente
// Contém campos opcionais como observações e informações extras
export function AdditionalTab({ formData, onUpdateFormData }: AdditionalTabProps): JSX.Element {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
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
        }}>Informações Adicionais</h4>
        <div style={systemStyles.input.container}>
          <label style={systemStyles.input.label}>
            Observações
          </label>
          <textarea
            style={{
              ...systemStyles.input.field,
              minHeight: '120px',
              resize: 'vertical' as const
            }}
            value={formData.notes}
            onChange={(e) => onUpdateFormData('notes', e.target.value)}
            onFocus={() => setFocusedField('notes')}
            onBlur={() => setFocusedField(null)}
            placeholder="Digite observações sobre o cliente..."
          />
        </div>
      </div>
    </div>
  );
}
