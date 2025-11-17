//--------------------------------------------------------------------
// FORMATAÇÃO DE DOCUMENTOS: CPF / CNPJ
// Utilitário central para mascarar/formatar campos de CPF e CNPJ
// Usado em formulários do sistema (digitação em tempo real)
//--------------------------------------------------------------------

// Mantém apenas dígitos
export const onlyDigits = (value: string): string => {
  return (value || '').replace(/\D/g, '');
};

// Verifica tamanho típico
export const isCpfLength = (digits: string): boolean => digits.length <= 11;
export const isCnpjLength = (digits: string): boolean => digits.length > 11;

// Aplica máscara incremental baseado em um pattern
// Ex.: applyMask('12345678901', '###.###.###-##') -> '123.456.789-01'
const applyMask = (digits: string, pattern: string): string => {
  let out = '';
  let di = 0;
  for (let i = 0; i < pattern.length && di < digits.length; i++) {
    const ch = pattern[i];
    if (ch === '#') {
      out += digits[di];
      di++;
    } else {
      out += ch;
    }
  }
  return out;
};

// Máscaras completas (usadas também de forma parcial)
const CPF_PATTERN = '###.###.###-##';
const CNPJ_PATTERN = '##.###.###/####-##';

// Formata CPF (parcial durante digitação)
export const formatCPF = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 11);
  return applyMask(digits, CPF_PATTERN);
};

// Formata CNPJ (parcial durante digitação)
export const formatCNPJ = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 14);
  return applyMask(digits, CNPJ_PATTERN);
};

// Auto detecta pelo tamanho e aplica a máscara adequada
// - Até 11 dígitos: CPF
// - 12-14 dígitos: CNPJ
export const formatCpfOrCnpj = (value: string): string => {
  const digits = onlyDigits(value);
  if (digits.length <= 11) return formatCPF(digits);
  return formatCNPJ(digits);
};

// Remove máscara
export const unformatDocument = (value: string): string => onlyDigits(value);

// Validação básica de tamanho (checksum pode ser adicionado depois se necessário)
export const isValidCpfLength = (value: string): boolean => onlyDigits(value).length === 11;
export const isValidCnpjLength = (value: string): boolean => onlyDigits(value).length === 14;

// Tipo do documento inferido pelo tamanho
export type DocumentType = 'CPF' | 'CNPJ' | 'UNKNOWN';
export const detectDocumentType = (value: string): DocumentType => {
  const len = onlyDigits(value).length;
  if (len === 11) return 'CPF';
  if (len === 14) return 'CNPJ';
  return 'UNKNOWN';
};

// Função auxiliar para inputs controlados:
// - Recebe o valor digitado e retorna o valor já mascarado
export const handleCpfCnpjInput = (raw: string): string => formatCpfOrCnpj(raw);


