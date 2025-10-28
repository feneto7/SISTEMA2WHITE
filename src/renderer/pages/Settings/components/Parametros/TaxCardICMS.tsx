//--------------------------------------------------------------------
// CARD DE CONFIGURAÇÃO TRIBUTÁRIA ICMS
// Exibe configurações de ICMS específicas
//--------------------------------------------------------------------
import React from 'react';
import { systemStyles, systemColors } from '../../../../styles/systemStyle';
import { AppIcons } from '../../../../components/Icons/AppIcons';
import { useClickSound } from '../../../../hooks/useClickSound';

interface TaxCardICMSProps {
  tipo: string;
  cst: string;
  aliquota: string;
  baseCalculo: string;
  reducao: string;
  aliquotaFinal: string;
  onDelete: () => void;
}

export function TaxCardICMS({
  tipo,
  cst,
  aliquota,
  baseCalculo,
  reducao,
  aliquotaFinal,
  onDelete
}: TaxCardICMSProps): JSX.Element {
  const [isHovered, setIsHovered] = React.useState(false);
  const playClickSound = useClickSound();

  const styles = {
    container: {
      background: systemColors.background.content,
      border: `1px solid ${systemColors.border.light}`,
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '12px',
      position: 'relative' as const,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.15s ease'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
      paddingBottom: '12px',
      borderBottom: `1px solid ${systemColors.border.divider}`
    },
    title: {
      fontSize: '13px',
      fontWeight: '600',
      color: systemColors.text.primary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    deleteButton: {
      width: '24px',
      height: '24px',
      borderRadius: '4px',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.15s ease',
      color: systemColors.text.tertiary
    },
    fieldsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '12px'
    },
    fieldGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px'
    },
    fieldLabel: {
      fontSize: '10px',
      fontWeight: '600',
      color: systemColors.text.secondary,
      textTransform: 'uppercase' as const,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    fieldValue: {
      fontSize: '12px',
      fontWeight: '500',
      color: systemColors.text.primary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }
  };

  const handleDelete = () => {
    playClickSound();
    onDelete();
  };

  return (
    <div
      style={styles.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.header}>
        <h3 style={styles.title}>{tipo}</h3>
        <button
          style={{
            ...styles.deleteButton,
            color: isHovered ? '#FF3B30' : systemColors.text.tertiary
          }}
          onClick={handleDelete}
          title="Remover configuração"
        >
          <AppIcons.Delete size={16} />
        </button>
      </div>

      <div style={styles.fieldsRow}>
        <div style={styles.fieldGroup}>
          <span style={styles.fieldLabel}>CST</span>
          <span style={styles.fieldValue}>{cst}</span>
        </div>
        <div style={styles.fieldGroup}>
          <span style={styles.fieldLabel}>Alíquota (%)</span>
          <span style={styles.fieldValue}>{aliquota}%</span>
        </div>
        <div style={styles.fieldGroup}>
          <span style={styles.fieldLabel}>Base Cálculo (%)</span>
          <span style={styles.fieldValue}>{baseCalculo}%</span>
        </div>
        <div style={styles.fieldGroup}>
          <span style={styles.fieldLabel}>Redução (%)</span>
          <span style={styles.fieldValue}>{reducao}%</span>
        </div>
        <div style={styles.fieldGroup}>
          <span style={styles.fieldLabel}>Final (%)</span>
          <span style={styles.fieldValue}>{aliquotaFinal}%</span>
        </div>
      </div>
    </div>
  );
}

