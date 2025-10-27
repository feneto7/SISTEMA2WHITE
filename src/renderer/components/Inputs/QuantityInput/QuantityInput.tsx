//--------------------------------------------------------------------
// COMPONENTE DE INPUT DE QUANTIDADE
// Campo de entrada para valores de quantidade com formatação automática
// Reutilizável em todo o sistema onde valores de quantidade são necessários
//--------------------------------------------------------------------
import React from 'react';
import { formatQuantityByUnitType } from '../../../utils/quantityFormater';
import { systemStyles, systemColors } from '../../../styles/systemStyle';

interface QuantityInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  unitType?: '0' | '1'; // '0' = fracionado, '1' = inteiro
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  ref?: React.RefObject<HTMLInputElement>;
}

export const QuantityInput = React.forwardRef<HTMLInputElement, QuantityInputProps>(
  ({ value, onChange, placeholder = '1,000', label, disabled = false, unitType = '0', onKeyPress }, ref) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatQuantityByUnitType(e.target.value, unitType);
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

QuantityInput.displayName = 'QuantityInput';

