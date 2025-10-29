//--------------------------------------------------------------------
// FORMULÁRIO ESPECÍFICO PARA IPI
// Campos específicos do Imposto sobre Produtos Industrializados
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { useTheme } from '../../../../styles/ThemeProvider';
import { AddButton } from '../../../../components/AddButton/AddButton';
import { formatPercentageInput } from '../../../../utils/percentageFormatter';

interface TaxFormIPIProps {
  onSubmit: (data: {
    nomeDepartamento: string;
    st: string;
    aliquota: string;
    aliquotaPorUnidade?: string;
  }) => void;
}

// Opções de Situação Tributária para IPI
const ST_OPTIONS = [
  { value: '01', label: '01 - Entrada tributada com alíquota zero' },
  { value: '02', label: '02 - Entrada isenta' },
  { value: '03', label: '03 - Entrada não-tributada' },
  { value: '04', label: '04 - Entrada imune' },
  { value: '05', label: '05 - Entrada com suspensão' },
  { value: '51', label: '51 - Saída tributada com alíquota zero' },
  { value: '52', label: '52 - Saída isenta' },
  { value: '53', label: '53 - Saída não-tributada' },
  { value: '54', label: '54 - Saída imune' },
  { value: '55', label: '55 - Saída com suspensão' },
  { value: '99', label: '99 - Outras entradas' }
];

export function TaxFormIPI({ onSubmit }: TaxFormIPIProps): JSX.Element {
  const [formData, setFormData] = useState({
    nomeDepartamento: '',
    st: '',
    aliquota: '',
    aliquotaPorUnidade: ''
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
            placeholder="Ex: IPI Normal"
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

