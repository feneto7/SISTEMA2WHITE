//--------------------------------------------------------------------
// UTILITÁRIOS DE FORMATAÇÃO DE QUANTIDADE
// Funções para formatação e conversão de valores de quantidade
// Usado em todo o sistema para campos que recebem valores de quantidade
//--------------------------------------------------------------------

/**
 * Formata quantidade baseada no tipo de unidade
 * @param value - Valor digitado pelo usuário
 * @param unitType - Tipo da unidade ('0' = fracionado, '1' = inteiro)
 * @returns Valor formatado conforme o tipo de unidade
 */
export const formatQuantityByUnitType = (value: string, unitType: string): string => {
  if (unitType === '0') {
    return value.replace(/[^\d,.-]/g, '').replace('.', ',');
  } else {
    return value.replace(/[^\d]/g, '');
  }
};

/**
 * Obtém quantidade inicial baseada no tipo de unidade
 * @param unitType - Tipo da unidade ('0' = fracionado, '1' = inteiro)
 * @returns Valor inicial padrão
 */
export const getInitialQuantityByUnitType = (unitType: string): string => {
  return unitType === '0' ? '1,000' : '1';
};

/**
 * Converte quantidade para número
 * @param value - Valor formatado
 * @param unitType - Tipo da unidade
 * @returns Valor numérico
 */
export const convertQuantityToNumber = (value: string, unitType: string): number => {
  const cleanValue = value.replace(',', '.');
  return parseFloat(cleanValue) || 0;
};

/**
 * Normaliza tipo de unidade
 * @param unitType - Tipo da unidade (pode ser undefined)
 * @returns Tipo normalizado ('0' ou '1')
 */
export const normalizeUnitType = (unitType?: string): string => {
  return unitType || '1';
};

/**
 * Obtém placeholder baseado no tipo de unidade
 * @param unitType - Tipo da unidade
 * @returns Placeholder para o campo
 */
export const getQuantityPlaceholderByUnitType = (unitType: string): string => {
  return unitType === '0' ? '1,000' : '1';
};
