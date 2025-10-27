//--------------------------------------------------------------------
// COMPONENTE DE INPUT DE MOEDA
// Campo de entrada para valores monetários com formatação automática
// Reutilizável em todo o sistema onde valores monetários são necessários
//--------------------------------------------------------------------
import React from 'react';
import { formatMoneyInput } from '../../../utils/money';
import { systemStyles, systemColors } from '../../../styles/systemStyle';

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  ref?: React.RefObject<HTMLInputElement>;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, placeholder = '0,00', label, disabled = false, onKeyPress }, ref) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatMoneyInput(e.target.value);
      onChange(formatted);
    };

    const styles = {
      container: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '6px',
        width: '100%'
      },
      label: {
        ...systemStyles.input.label,
        display: label ? 'block' as const : 'none'
      },
      input: {
        ...systemStyles.input.field,
        height: '28px',
        padding: '0 12px',
        fontSize: '14px',
        fontWeight: '500'
      } as React.CSSProperties,
      inputDisabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
        backgroundColor: systemColors.control.disabled
      }
    };

    return (
      <div style={styles.container}>
        {label && <label style={styles.label}>{label}</label>}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyPress={onKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            ...styles.input,
            ...(disabled ? styles.inputDisabled : {})
          }}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';

