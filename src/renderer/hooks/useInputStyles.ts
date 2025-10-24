import { useState, useCallback } from 'react';
import { sharedStyles } from '../styles/shared';

// Hook para inputs com estilos automáticos de focus
// Aplica automaticamente os estilos de focus quando o input recebe foco
export const useInputStyles = (variant: 'base' | 'compact' | 'large' = 'base') => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Combinar estilos base + variante + focus
  const inputStyle = {
    ...sharedStyles.input.base,
    ...sharedStyles.input[variant],
    ...(isFocused ? sharedStyles.input.focus : {})
  };

  return {
    inputStyle,
    handleFocus,
    handleBlur,
    isFocused
  };
};

// Hook para inputs com validação e estilos
export const useValidatedInput = (
  initialValue: string = '',
  validator?: (value: string) => boolean
) => {
  const [value, setValue] = useState(initialValue);
  const [isValid, setIsValid] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
    if (validator) {
      setIsValid(validator(newValue));
    }
  }, [validator]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Estilos baseados no estado de validação
  const inputStyle = {
    ...sharedStyles.input.base,
    ...(isFocused ? sharedStyles.input.focus : {}),
    ...(value && !isValid ? {
      borderColor: '#FF3B30',
      boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(255, 59, 48, 0.2)'
    } : {})
  };

  return {
    value,
    setValue,
    isValid,
    isFocused,
    inputStyle,
    handleChange,
    handleFocus,
    handleBlur
  };
};

// Componente de Input reutilizável com estilos automáticos
interface MacInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: 'base' | 'compact' | 'large';
  onClick?: () => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const MacInput: React.FC<MacInputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  variant = 'base',
  onClick,
  required = false,
  disabled = false,
  className
}) => {
  const { inputStyle, handleFocus, handleBlur } = useInputStyles(variant);

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={onClick}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={className}
      style={inputStyle}
    />
  );
};
