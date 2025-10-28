import React, { useState, useCallback } from 'react';
import { systemStyles } from '../styles/systemStyle';

// Hook para inputs com estilos automáticos de focus
// Aplica automaticamente os estilos de focus quando o input recebe foco
export const useInputStyles = () => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Combinar estilos base + focus
  const inputStyle = {
    ...systemStyles.input.field,
    ...(isFocused ? systemStyles.input.fieldFocus : {})
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
    ...systemStyles.input.field,
    ...(isFocused ? systemStyles.input.fieldFocus : {}),
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

// Componente MacInput removido - hooks não devem exportar componentes React
// Use os hooks useInputStyles ou useValidatedInput diretamente nos seus componentes
