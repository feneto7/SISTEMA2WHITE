//--------------------------------------------------------------------
// CERTIFICATE UTILITIES
// Utilitários para trabalhar com certificados digitais
// Usado em: Settings > Fiscal > Certificado Digital
//--------------------------------------------------------------------

interface CertificateMetadata {
  fileName: string;
  filePath: string;
  uploadDate: string;
  validFrom?: string;
  validTo?: string;
  cnpj?: string;
  companyName?: string;
}

/**
 * Extrai metadados básicos do certificado
 * Por enquanto retorna apenas dados do arquivo
 * No futuro pode ser expandido para ler dados reais do .pfx
 */
export function extractCertificateMetadata(
  fileName: string,
  filePath: string
): CertificateMetadata {
  return {
    fileName,
    filePath,
    uploadDate: new Date().toISOString()
  };
}

/**
 * Valida se o certificado está válido (não expirado)
 */
export function isCertificateValid(metadata: CertificateMetadata): boolean {
  if (!metadata.validTo) {
    return true; // Se não tiver data de validade, considera válido
  }

  const validTo = new Date(metadata.validTo);
  const now = new Date();
  
  return validTo > now;
}

/**
 * Retorna quantos dias faltam para o certificado expirar
 */
export function getDaysUntilExpiration(metadata: CertificateMetadata): number | null {
  if (!metadata.validTo) {
    return null;
  }

  const validTo = new Date(metadata.validTo);
  const now = new Date();
  
  const diffTime = validTo.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Formata CNPJ com máscara
 */
export function formatCNPJ(cnpj: string): string {
  const numbers = cnpj.replace(/\D/g, '');
  
  if (numbers.length !== 14) {
    return cnpj;
  }
  
  return numbers.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    '$1.$2.$3/$4-$5'
  );
}

