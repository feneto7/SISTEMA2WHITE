//--------------------------------------------------------------------
// UTILITÁRIOS DE FORMATAÇÃO MONETÁRIA
// Funções para conversão e formatação de valores monetários
// Usado em todo o sistema para campos que recebem valores em reais
//--------------------------------------------------------------------

/**
 * Converte reais para centavos
 * @param value - Valor em reais (string ou number)
 * @returns Valor em centavos (number)
 */
export const convertReaisToCents = (value: string | number): number => {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
  return Math.round(numValue * 100);
};

/**
 * Converte centavos para reais formatados
 * @param cents - Valor em centavos (number)
 * @returns Valor formatado em reais (string) ex: "15,00"
 */
export const convertCentsToReais = (cents: number): string => {
  return (cents / 100).toFixed(2).replace('.', ',');
};

/**
 * Formata entrada de moeda em tempo real
 * Remove caracteres inválidos e formata para padrão brasileiro
 * @param value - Valor digitado pelo usuário
 * @returns Valor formatado para exibição
 */
export const formatMoneyInput = (value: string): string => {
  let cleanValue = value.replace(/[^\d,.-]/g, '');
  cleanValue = cleanValue.replace('.', ',');
  const parts = cleanValue.split(',');
  if (parts.length > 2) {
    cleanValue = parts[0] + ',' + parts.slice(1).join('');
  }
  return cleanValue;
};

/**
 * Formata valor monetário em tempo real durante digitação
 * Remove tudo exceto números, converte para centavos e formata como moeda brasileira
 * @param value - Valor digitado pelo usuário
 * @returns Valor formatado como moeda (ex: "R$ 20,00")
 */
export const formatCurrency = (value: string): string => {
  // Remover tudo exceto números
  const numericValue = value.replace(/[^\d]/g, '');
  if (!numericValue) return '';
  
  // Converter para centavos e depois para reais
  const amount = parseFloat(numericValue) / 100;
  
  // Formatar para moeda brasileira
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

