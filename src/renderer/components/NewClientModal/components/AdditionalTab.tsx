import React from 'react';
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

// Props do componente AdditionalTab
interface AdditionalTabProps {
  formData: FormData;
  onUpdateFormData: (field: string, value: string) => void;
}

// Aba adicional do modal de cliente
// Contém campos opcionais como observações e informações extras
export function AdditionalTab({ formData, onUpdateFormData }: AdditionalTabProps): JSX.Element {
  return (
    <div>
      <div style={modalStyles.formSection}>
        <h4 style={modalStyles.formSectionTitle}>Informações Adicionais</h4>
        <div style={modalStyles.formGroup}>
          <label style={modalStyles.formLabel}>
            Observações
          </label>
          <textarea
            style={modalStyles.formTextarea}
            value={formData.notes}
            onChange={(e) => onUpdateFormData('notes', e.target.value)}
            placeholder="Digite observações sobre o cliente..."
          />
        </div>
      </div>
    </div>
  );
}
