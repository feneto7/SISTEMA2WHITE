//--------------------------------------------------------------------
// UTILITÁRIOS DE FORMATAÇÃO DE QUANTIDADE
// Funções para formatação e conversão de valores de quantidade
// Usado em todo o sistema para campos que recebem valores de quantidade
//--------------------------------------------------------------------

/**
 * Formata quantidade baseada no tipo de unidade
 * - Para fracionado ('0'): aplica máscara com 3 casas decimais, movendo vírgula em tempo real
 *   Ex.: "50" -> "0,050"; "500" -> "0,500"; "5000" -> "5,000"
 * - Para inteiro ('1'): mantém apenas dígitos inteiros
 * Obs.: Usa vírgula como separador decimal.
 */
export const formatQuantityByUnitType = (value: string, unitType: string): string => {
  if (unitType === '0') {
    const precision = 3;
    const digits = String(value).replace(/\D/g, '');
    if (digits.length === 0) return '';

    const padded = digits.padStart(precision + 1, '0'); // garante pelo menos 0,000
    const integerRaw = padded.slice(0, padded.length - precision);
    const decimalPart = padded.slice(-precision);

    // remove zeros à esquerda do inteiro, mantendo pelo menos "0"
    const integerPart = String(parseInt(integerRaw, 10));
    const safeInteger = integerPart === 'NaN' ? '0' : integerPart;

    return `${safeInteger},${decimalPart}`;
  } else {
    return String(value).replace(/[^\d]/g, '');
  }
};

/**
 * Obtém quantidade inicial baseada no tipo de unidade
 * @param unitType - Tipo da unidade ('0' = fracionado, '1' = inteiro)
 * @returns Valor inicial padrão
 */
export const getInitialQuantityByUnitType = (unitType: string): string => {
  return unitType === '0' ? '0,000' : '1';
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
