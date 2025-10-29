import React, { useState } from 'react';
import { useTheme } from '../../../styles/ThemeProvider';
import { useClickSound } from '../../../hooks/useClickSound';

// Componente da aba Fiscal - Campos fiscais do produto
// Seguindo o estilo macOS e modularização do projeto
interface TaxTabProps {
  onFormDataChange?: (data: any) => void;
}

export function TaxTab({ onFormDataChange }: TaxTabProps): JSX.Element {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  
  // Estados dos campos do formulário fiscal
  const [formData, setFormData] = useState({
    ncm: '',
    cest: ''
  });

  // Estados de foco dos campos
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Função para atualizar dados do formulário
  const handleInputChange = (field: string, value: string) => {
    const newData = {
      ...formData,
      [field]: value
    };
    setFormData(newData);
    
    // Notificar componente pai sobre mudanças
    if (onFormDataChange) {
      onFormDataChange(newData);
    }
  };

  return (
    <div>
      <h3 style={{
        fontSize: '15px',
        fontWeight: '600',
        color: systemColors.text.primary,
        marginBottom: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}>
        Informações Fiscais
      </h3>
      
      {/* Seção de Códigos Fiscais */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          fontSize: '13px',
          fontWeight: '600',
          color: systemColors.text.secondary,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.5px',
          marginBottom: '12px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>Códigos Fiscais</h4>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px'
        }}>
          {/* NCM */}
          <div>
            <label style={systemStyles.input.label}>NCM:</label>
            <input
              type="text"
              style={{
                ...systemStyles.input.field
              }}
              value={formData.ncm}
              onChange={(e) => {
                playClickSound();
                // Permitir apenas números para NCM
                const numericValue = e.target.value.replace(/\D/g, '');
                handleInputChange('ncm', numericValue);
              }}
              onFocus={() => setFocusedField('ncm')}
              onBlur={() => setFocusedField(null)}
              placeholder="Ex: 12345678"
              maxLength={8}
            />
          </div>

          {/* CEST */}
          <div>
            <label style={systemStyles.input.label}>CEST:</label>
            <input
              type="text"
              style={{
                ...systemStyles.input.field
              }}
              value={formData.cest}
              onChange={(e) => {
                playClickSound();
                // Permitir apenas números para CEST
                const numericValue = e.target.value.replace(/\D/g, '');
                handleInputChange('cest', numericValue);
              }}
              onFocus={() => setFocusedField('cest')}
              onBlur={() => setFocusedField(null)}
              placeholder="Ex: 1234567"
              maxLength={7}
            />
          </div>
        </div>
      </div>

      {/* Informações sobre os códigos */}
      <div style={{
        marginBottom: '24px',
        backgroundColor: '#f0f8ff',
        borderColor: '#b0d4f1',
        padding: '16px',
        borderRadius: '6px',
        border: '1px solid #b0d4f1'
      }}>
        <h4 style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#0066cc',
          textTransform: 'uppercase' as const,
          letterSpacing: '0.5px',
          marginBottom: '12px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
          Informações sobre os Códigos
        </h4>
        
        <div style={{
          fontSize: '12px',
          color: '#666',
          lineHeight: '1.5',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>NCM (Nomenclatura Comum do Mercosul):</strong> Código de 8 dígitos que identifica a classificação fiscal do produto para fins de importação e exportação.
          </p>
          <p style={{ margin: '0' }}>
            <strong>CEST (Código Especificador da Substituição Tributária):</strong> Código de 7 dígitos utilizado para identificar produtos sujeitos à substituição tributária.
          </p>
        </div>
      </div>
    </div>
  );
}
