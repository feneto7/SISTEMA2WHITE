//--------------------------------------------------------------------
// UTILITÁRIOS DE FORMATAÇÃO DE PORCENTAGEM
// Funções para conversão e formatação de valores de porcentagem
// Usado em todo o sistema para campos que recebem valores em porcentagem
//--------------------------------------------------------------------

/**
 * Converte valor numérico para porcentagem formatada
 * @param value - Valor numérico (ex: 18.5)
 * @returns Valor formatado com símbolo de porcentagem (ex: "18,50%")
 */
export const formatPercentage = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
  if (isNaN(numValue)) return '0,00%';
  return numValue.toFixed(2).replace('.', ',') + '%';
};

/**
 
 * @param value - Valor digitado pelo usuário
 * @returns Valor formatado para exibição (ex: "18,50")
 */
export const formatPercentageInput = (value: string): string => {
  // Remove tudo exceto dígitos
  let digits = value.replace(/[^\d]/g, '');
  
  // Se não há dígitos, retorna vazio
  if (!digits) return '';
  
  // Remove todos os zeros à esquerda
  digits = digits.replace(/^0+/, '');
  
  // Se após remover zeros à esquerda não sobrou nada, retorna vazio
  if (!digits) return '';
  
  // Divide em inteiros e decimais (2 últimos dígitos são decimais)
  const decimalPart = digits.slice(-2).padStart(2, '0');
  const integerPart = digits.slice(0, -2);
  
  // Se não há parte inteira, usa "0"
  const integerPartFormatted = integerPart || '0';
  
  // Combina e retorna
  return `${integerPartFormatted},${decimalPart}`;
};

/**
 * @param value - Valor com porcentagem (ex: "18,50%")
 * @returns Valor sem o símbolo (ex: "18,50")
 */
export const removePercentageSymbol = (value: string): string => {
  return value.replace('%', '').trim();
};

/**
 * Converte string de porcentagem formatada para número
 * @param value - Valor formatado (ex: "18,50%" ou "18,50")
 * @returns Valor numérico (ex: 18.5)
 */
export const parsePercentage = (value: string): number => {
  const cleanValue = removePercentageSymbol(value).replace(',', '.');
  return parseFloat(cleanValue) || 0;
};

/**
 * Adiciona símbolo de porcentagem ao valor
 * @param value - Valor sem símbolo (ex: "18,50")
 * @returns Valor com símbolo (ex: "18,50%")
 */
export const addPercentageSymbol = (value: string): string => {
  if (!value) return '0,00%';
  if (value.includes('%')) return value;
  return value + '%';
};

/**
 * Formata valor para exibição com 2 casas decimais e símbolo
 * @param value - Valor a formatar
 * @returns Valor formatado (ex: "18,50%")
 */
export const formatPercentageDisplay = (value: string): string => {
  const cleanValue = removePercentageSymbol(value);
  const parts = cleanValue.split(',');
  
  // Garante 2 casas decimais
  if (parts.length === 1) {
    return parts[0] + ',00%';
  }
  
  if (parts[1].length === 1) {
    return cleanValue + '0%';
  }
  
  return cleanValue + '%';
};

