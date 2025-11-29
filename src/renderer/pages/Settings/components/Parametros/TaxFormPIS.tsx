//--------------------------------------------------------------------
// FORMULÁRIO ESPECÍFICO PARA PIS
// Campos específicos do Programa de Integração Social
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { useTheme } from '../../../../styles/ThemeProvider';
import { AddButton } from '../../../../components/AddButton/AddButton';
import { formatPercentageInput } from '../../../../utils/percentageFormatter';

interface TaxFormPISProps {
  onSubmit: (data: {
    nomeDepartamento: string; // Mantém em português para compatibilidade com estrutura de dados
    st: string;
    aliquota: string; // Mantém em português para compatibilidade com estrutura de dados
    aliquotaPorUnidade?: string; // Mantém em português para compatibilidade com estrutura de dados
  }) => void;
}

// Opções de Situação Tributária para PIS
const ST_OPTIONS = [
  { value: '01', label: '01 - Operação tributável - Base de cálculo = valor da operação alíquota normal' },
  { value: '02', label: '02 - Operação tributável - Base de cálculo = valor da operação (alíquota diferenciada)' },
  { value: '03', label: '03 - Operação tributável - Base de cálculo = quantidade vendida x alíquota por unidade de produto' },
  { value: '04', label: '04 - Operação tributável - Tributação monofásica (alíquota zero)' },
  { value: '05', label: '05 - Operação tributável (ST)' },
  { value: '06', label: '06 - Operação tributável - Alíquota zero' },
  { value: '07', label: '07 - Operação isenta da contribuição' },
  { value: '08', label: '08 - Operação sem incidência da contribuição' },
  { value: '09', label: '09 - Operação com suspensão da contribuição' },
  { value: '49', label: '49 - Outras operações de saída' },
  { value: '50', label: '50 - Operação com direito a crédito - Vinculada exclusivamente a receita tributada no mercado interno' },
  { value: '51', label: '51 - Operação com direito a crédito - Vinculada exclusivamente a receita não-tributada no mercado interno' },
  { value: '52', label: '52 - Operação com direito a crédito - Vinculada exclusivamente a receita de exportação' },
  { value: '53', label: '53 - Operação com direito a crédito - Vinculada a receitas tributadas e não-tributadas no mercado interno' },
  { value: '54', label: '54 - Operação com direito a crédito - Vinculada a receitas tributadas no mercado interno e de exportação' },
  { value: '55', label: '55 - Operação com direito a crédito - Vinculada a receitas não-tributadas no mercado interno e de exportação' },
  { value: '56', label: '56 - Operação com direito a crédito - Vinculada a receitas tributadas e não-tributadas no mercado interno e de exportação' },
  { value: '60', label: '60 - Crédito presunto - Operação de aquisição vinculada exclusivamente a receita tributada no mercado interno' },
  { value: '61', label: '61 - Crédito presunto - Operação de aquisição vinculada exclusivamente a receita não-tributada no mercado interno' },
  { value: '62', label: '62 - Crédito presunto - Operação de aquisição vinculada exclusivamente a receita de exportação' },
  { value: '63', label: '63 - Crédito presunto - Operação de aquisição vinculada a receitas tributadas e não-tributadas no mercado interno' },
  { value: '64', label: '64 - Crédito presunto - Operação de aquisição vinculada a receitas tributadas no mercado interno e de exportação' },
  { value: '65', label: '65 - Crédito presunto - Operação de aquisição vinculada a receitas não-tributadas no mercado interno e de exportação' },
  { value: '66', label: '66 - Crédito presunto - Operação de aquisição vinculada a receitas tributadas e não-tributadas no mercado interno e de exportação' },
  { value: '67', label: '67 - Crédito presunto - Outras operações' },
  { value: '70', label: '70 - Operação de aquisição sem direito a crédito' },
  { value: '71', label: '71 - Operação de aquisição com isenção' },
  { value: '72', label: '72 - Operação de aquisição com suspensão' },
  { value: '73', label: '73 - Operação de aquisição a alíquota zero' },
  { value: '74', label: '74 - Operação de aquisição sem incidência da contribuição' },
  { value: '75', label: '75 - Operação de aquisição por substituição tributária' },
  { value: '98', label: '98 - Outras operações de entrada' },
  { value: '99', label: '99 - Outras operações' }
];

export function TaxFormPIS({ onSubmit }: TaxFormPISProps): JSX.Element {
  const [formData, setFormData] = useState({
    nomeDepartamento: '', // Mantém em português para compatibilidade com estrutura de dados
    st: '',
    aliquota: '', // Mantém em português para compatibilidade com estrutura de dados
    aliquotaPorUnidade: '' // Mantém em português para compatibilidade com estrutura de dados
  });
  const { systemStyles, systemColors } = useTheme();

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
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      alignItems: 'end'
    },
    lastFieldWithButton: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
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
    if (!formData.nomeDepartamento || !formData.st || !formData.aliquota) {
      alert('Preencha todos os campos obrigatórios (*)');
      return;
    }

    onSubmit({
      nomeDepartamento: formData.nomeDepartamento,
      st: formData.st,
      aliquota: formData.aliquota,
      aliquotaPorUnidade: formData.aliquotaPorUnidade
    });

    // Reset form
    setFormData({
      nomeDepartamento: '',
      st: '',
      aliquota: '',
      aliquotaPorUnidade: ''
    });
  };

  return (
    <div style={styles.formContainer}>
      <h3 style={styles.title}>Nova Configuração</h3>

      {/* Grid de 2 colunas: Nome do Departamento e ST */}
      <div style={styles.formGrid}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Nome do Departamento *</label>
          <input
            type="text"
            style={styles.input}
            value={formData.nomeDepartamento}
            onChange={(e) => setFormData({ ...formData, nomeDepartamento: e.target.value })}
            placeholder="Ex: PIS Normal"
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>ST *</label>
          <div style={styles.select.container}>
            <select
              style={styles.select.field}
              value={formData.st}
              onChange={(e) => setFormData({ ...formData, st: e.target.value })}
            >
              <option value="">Selecione...</option>
              {ST_OPTIONS.map((option) => (
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

      {/* Grid de 2 colunas: Alíquota, e Alíquota por Unidade com Botão */}
      <div style={styles.formGrid}>
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

        <div style={styles.lastFieldWithButton}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Alíquota por Unidade (opcional)</label>
            <input
              type="text"
              style={styles.input}
              value={formData.aliquotaPorUnidade}
              onChange={(e) => setFormData({ ...formData, aliquotaPorUnidade: e.target.value })}
              placeholder="Ex: 0.0000"
            />
          </div>

          <div style={styles.buttonContainer}>
            <AddButton onClick={handleSubmit} label="Adicionar Configuração" />
          </div>
        </div>
      </div>
    </div>
  );
}

