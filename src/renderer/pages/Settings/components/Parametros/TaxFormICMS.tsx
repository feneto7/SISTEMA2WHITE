//--------------------------------------------------------------------
// FORMULÁRIO DE CONFIGURAÇÃO TRIBUTÁRIA ICMS
// Formulário para cadastrar novos cards de configuração de ICMS
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { systemStyles, systemColors } from '../../../../styles/systemStyle';
import { AddButton } from '../../../../components/AddButton/AddButton';
import { formatPercentageInput, removePercentageSymbol } from '../../../../utils/percentageFormatter';

interface TaxFormICMSProps {
  tipos: string[];
  cstLabel: string;
  onSubmit: (data: {
    tipo: string;
    cst: string;
    aliquota: string;
    baseCalculo: string;
    reducao: string;
    aliquotaFinal: string;
  }) => void;
}

// Opções padrão de CST/CSOSN
const CST_OPTIONS = [
  { value: '00', label: '00 - Tributada integralmente' },
  { value: '10', label: '10 - Tributada e com cobrança do ICMS por substituição tributária' },
  { value: '20', label: '20 - Com redução de base de cálculo' },
  { value: '30', label: '30 - Isenta ou não tributada e com cobrança do ICMS por substituição tributária' },
  { value: '40', label: '40 - Isenta' },
  { value: '41', label: '41 - Não tributada' },
  { value: '50', label: '50 - Suspensão' },
  { value: '51', label: '51 - Diferimento' },
  { value: '60', label: '60 - ICMS cobrado anteriormente por substituição tributária' },
  { value: '70', label: '70 - Com redução de base de cálculo e cobrança do ICMS por substituição tributária' },
  { value: '90', label: '90 - Outras' }
];

const CSOSN_OPTIONS = [
  { value: '101', label: '101 - Tributada pelo Simples Nacional sem permissão de crédito' },
  { value: '102', label: '102 - Tributada pelo Simples Nacional com permissão de crédito' },
  { value: '201', label: '201 - Tributada pelo Simples Nacional sem permissão de crédito e com cobrança do ICMS por substituição tributária' },
  { value: '202', label: '202 - Tributada pelo Simples Nacional com permissão de crédito e com cobrança do ICMS por substituição tributária' },
  { value: '500', label: '500 - ICMS cobrado anteriormente por substituição tributária (substituído) ou por antecipação' },
  { value: '900', label: '900 - Outros' }
];

export function TaxFormICMS({ tipos, cstLabel, onSubmit }: TaxFormICMSProps): JSX.Element {
  const [formData, setFormData] = useState({
    tipo: '',
    cst: '',
    aliquota: '',
    baseCalculo: '100,00',
    reducao: '0,00',
    aliquotaFinal: ''
  });

  // Seleciona opções de CST ou CSOSN baseado no label
  const cstOptions = cstLabel.includes('CSOSN') ? CSOSN_OPTIONS : CST_OPTIONS;

  const styles = {
    formContainer: {
      background: systemColors.background.primary,
      border: `1px solid ${systemColors.border.light}`,
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '20px'
    },
    title: {
      fontSize: '13px',
      fontWeight: '600',
      color: systemColors.text.primary,
      marginBottom: '16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    firstRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: '12px',
      alignItems: 'end',
      marginBottom: '12px'
    },
    secondRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
      gap: '12px',
      alignItems: 'end'
    },
    fieldGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '6px'
    },
    label: {
      ...systemStyles.input.label
    },
    input: {
      ...systemStyles.input.field
    },
    select: {
      container: {
        ...systemStyles.select.container
      },
      field: {
        ...systemStyles.select.field
      }
    },
    buttonContainer: {
      display: 'flex',
      alignItems: 'flex-end'
    }
  };

  const handleSubmit = () => {
    if (!formData.tipo || !formData.cst || !formData.aliquota) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    onSubmit({
      ...formData,
      aliquotaFinal: formData.aliquotaFinal || formData.aliquota
    });

    // Reset form
    setFormData({
      tipo: '',
      cst: '',
      aliquota: '',
      baseCalculo: '100,00',
      reducao: '0,00',
      aliquotaFinal: ''
    });
  };

  return (
    <div style={styles.formContainer}>
      <h3 style={styles.title}>Nova Configuração</h3>

      {/* Primeira linha: Tipo de Departamento e CST/CSOSN */}
      <div style={styles.firstRow}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Tipo de Departamento</label>
          <div style={styles.select.container}>
            <select
              style={styles.select.field}
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
            >
              <option value="">Selecione...</option>
              {tipos.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
            <div style={systemStyles.select.arrow}>
              <div style={systemStyles.select.arrowIcon}></div>
            </div>
          </div>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>{cstLabel}</label>
          <div style={styles.select.container}>
            <select
              style={styles.select.field}
              value={formData.cst}
              onChange={(e) => setFormData({ ...formData, cst: e.target.value })}
            >
              <option value="">Selecione...</option>
              {cstOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div style={systemStyles.select.arrow}>
              <div style={systemStyles.select.arrowIcon}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Segunda linha: Alíquota, Base Cálculo, Redução, Alíquota Final e Botão */}
      <div style={styles.secondRow}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Alíquota (%)</label>
          <input
            type="text"
            style={styles.input}
            value={formData.aliquota}
            onChange={(e) => {
              const formatted = formatPercentageInput(e.target.value);
              setFormData({ ...formData, aliquota: formatted });
            }}
            placeholder="0"
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>% Base Cálculo</label>
          <input
            type="text"
            style={styles.input}
            value={formData.baseCalculo}
            onChange={(e) => {
              const formatted = formatPercentageInput(e.target.value);
              setFormData({ ...formData, baseCalculo: formatted });
            }}
            placeholder="100"
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Redução (%)</label>
          <input
            type="text"
            style={styles.input}
            value={formData.reducao}
            onChange={(e) => {
              const formatted = formatPercentageInput(e.target.value);
              setFormData({ ...formData, reducao: formatted });
            }}
            placeholder="0"
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Alíquota Final (%)</label>
          <input
            type="text"
            style={styles.input}
            value={formData.aliquotaFinal}
            onChange={(e) => {
              const formatted = formatPercentageInput(e.target.value);
              setFormData({ ...formData, aliquotaFinal: formatted });
            }}
            placeholder="0"
          />
        </div>

        <div style={styles.buttonContainer}>
          <AddButton onClick={handleSubmit} label="Adicionar Configuração" />
        </div>
      </div>
    </div>
  );
}

