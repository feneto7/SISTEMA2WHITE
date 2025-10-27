//--------------------------------------------------------------------
// CERTIFICATE HANDLER
// Gerencia busca e formatação de certificados digitais instalados no Windows
// Utiliza PowerShell para acessar o Windows Certificate Store
//--------------------------------------------------------------------

import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Interface para o certificado retornado pelo PowerShell
interface CertificateData {
  Subject: string;
  Issuer: string;
  Thumbprint: string;
  NotBefore: {
    value: string;
    DateTime: string;
  };
  NotAfter: {
    value: string;
    DateTime: string;
  };
}

// Interface para o certificado formatado
export interface FormattedCertificate {
  subject: string;
  issuer: string;
  thumbprint: string;
  validFrom: string;
  validTo: string;
  displayName: string;
}

/**
 * Formata certificado para exibição
 * Extrai informações importantes como CNPJ/CPF e nome
 */
function formatCertificate(cert: CertificateData): string {
  const subject = cert.Subject || '';
  
  // Extrair CPF/CNPJ do subject (CNPJ geralmente está no final do subject)
  const cnpjMatch = subject.match(/(\d{14})/);
  const cnpj = cnpjMatch ? cnpjMatch[1] : '';
  
  // Extrair nome do certificado
  const nameMatch = subject.match(/CN=(.+?)(?:,|$)/i);
  const name = nameMatch ? nameMatch[1].trim() : subject;
  
  // Formatar CNPJ se existir
  let formattedCnpj = '';
  if (cnpj.length === 14) {
    formattedCnpj = `CNPJ: ${cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')}`;
  }
  
  return formattedCnpj ? `${name} - ${formattedCnpj}` : name;
}

/**
 * Busca certificados digitais instalados no Windows
 * Utiliza PowerShell para acessar o Windows Certificate Store
 * Retorna array de strings formatadas para exibição
 */
export async function getInstalledCertificates(): Promise<string[]> {
  try {
    console.log('[CertificateHandler] Buscando certificados...');
    
    // Comando PowerShell para listar certificados do Windows
    // Filtra apenas certificados que possuem chave privada (A1 ou A3)
    const command = `powershell -Command "Get-ChildItem -Path Cert:\\CurrentUser\\My | Where-Object { $_.HasPrivateKey -eq $true } | Select-Object @{Name='Subject';Expression={$_.Subject}}, @{Name='Issuer';Expression={$_.Issuer}}, @{Name='Thumbprint';Expression={$_.Thumbprint}}, @{Name='NotBefore';Expression={$_.NotBefore}}, @{Name='NotAfter';Expression={$_.NotAfter}} | ConvertTo-Json"`;

    console.log('[CertificateHandler] Executando comando PowerShell...');
    const { stdout } = await execPromise(command);
    console.log('[CertificateHandler] Saída do PowerShell:', stdout);
    
    if (!stdout || stdout.trim() === '') {
      console.log('[CertificateHandler] Nenhum certificado encontrado');
      return [];
    }
    
    // Parse do JSON retornado pelo PowerShell
    const certificates = JSON.parse(stdout);
    console.log('[CertificateHandler] Certificados parseados:', certificates);
    
    // Formatando os certificados para exibição
    const formattedCertificates = Array.isArray(certificates) 
      ? certificates.map((cert: CertificateData) => formatCertificate(cert))
      : [formatCertificate(certificates)];

    console.log('[CertificateHandler] Certificados formatados:', formattedCertificates);
    return formattedCertificates;
  } catch (error) {
    console.error('[CertificateHandler] Erro ao buscar certificados:', error);
    // Retornar lista vazia em caso de erro
    return [];
  }
}
