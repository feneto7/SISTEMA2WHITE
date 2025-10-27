//--------------------------------------------------------------------
// COMPONENTE DE CAMPO DE BUSCA
// Campo de busca estilo macOS reutilizável
// Usado em sidebars, menus e outras partes do sistema
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { AppIcons } from '../Icons/AppIcons';
import { systemStyles, systemColors } from '../../styles/systemStyle';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SearchField({ value, onChange, placeholder = 'Buscar', disabled = false }: SearchFieldProps): JSX.Element {
  const [isFocused, setIsFocused] = useState(false);

  const styles = {
    container: {
      ...systemStyles.searchField.container
    },
    field: {
      ...systemStyles.searchField.field,
      ...(isFocused ? systemStyles.searchField.fieldFocus : {}),
      ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {})
    } as React.CSSProperties,
    icon: {
      ...systemStyles.searchField.icon
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.icon}>
        <AppIcons.Search size={14} color={systemColors.text.tertiary} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        style={styles.field}
      />
    </div>
  );
}

