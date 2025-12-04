//--------------------------------------------------------------------
// CERTIFICATE READER
// Lê e extrai informações de certificados digitais .pfx
// Usado em: Settings > Fiscal > Certificado Digital
//--------------------------------------------------------------------

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const execPromise = promisify(exec);

export interface CertificateInfo {
  validFrom: string;
  validTo: string;
  cnpj: string | null;
  companyName: string | null;
  subject: string;
  issuer: string;
}

/**
 * Lê um arquivo .pfx e extrai informações do certificado
 */
export async function readCertificateInfo(
  filePath: string,
  password: string
): Promise<CertificateInfo> {
  let tempScriptPath: string | null = null;
  
  try {
    console.log('[CertificateReader] Iniciando leitura do certificado:', filePath);
    
    // Criar script PowerShell temporário para evitar problemas de escape
    const psScript = `
$ErrorActionPreference = "Stop"
try {
  $certPath = @'
${filePath.replace(/'/g, "''")}
'@
  $certPassword = @'
${password.replace(/'/g, "''")}
'@
  
  $cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($certPath, $certPassword)
  
  $result = @{
    Subject = $cert.Subject
    Issuer = $cert.Issuer
    NotBefore = $cert.NotBefore.ToString('yyyy-MM-ddTHH:mm:ss')
    NotAfter = $cert.NotAfter.ToString('yyyy-MM-ddTHH:mm:ss')
  }
  
  $result | ConvertTo-Json -Compress
} catch {
  Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}
    `.trim();
    
    // Criar arquivo temporário para o script
    tempScriptPath = path.join(os.tmpdir(), `cert-reader-${Date.now()}.ps1`);
    fs.writeFileSync(tempScriptPath, psScript, 'utf8');
    
    console.log('[CertificateReader] Script temporário criado:', tempScriptPath);
    
    // Executar script PowerShell
    const command = `powershell -NoProfile -ExecutionPolicy Bypass -File "${tempScriptPath}"`;
    
    console.log('[CertificateReader] Executando comando PowerShell...');
    
    const { stdout, stderr } = await execPromise(command, {
      encoding: 'utf8',
      maxBuffer: 1024 * 1024,
      timeout: 30000
    });
    
    // Limpar arquivo temporário
    if (tempScriptPath && fs.existsSync(tempScriptPath)) {
      try {
        fs.unlinkSync(tempScriptPath);
      } catch (e) {
        console.warn('[CertificateReader] Erro ao remover script temporário:', e);
      }
    }
    
    // Verificar se há erro no stderr ou se stdout contém ERROR
    if (stderr || stdout.includes('ERROR:')) {
      const errorMsg = stderr || stdout.match(/ERROR: (.+)/)?.[1] || 'Erro desconhecido';
      console.error('[CertificateReader] Erro no PowerShell:', errorMsg);
      
      if (errorMsg.includes('password') || errorMsg.includes('senha') || errorMsg.includes('incorrect')) {
        throw new Error('Senha incorreta. Verifique a senha do certificado.');
      }
      
      throw new Error(`Erro ao ler certificado: ${errorMsg}`);
    }
    
    console.log('[CertificateReader] Resposta do PowerShell:', stdout);
    
    // Parse do JSON
    const jsonOutput = stdout.trim();
    if (!jsonOutput || jsonOutput.startsWith('ERROR:')) {
      throw new Error('Resposta inválida do PowerShell');
    }
    
    const certData = JSON.parse(jsonOutput);
    
    // Extrair CNPJ do Subject
    const cnpj = extractCNPJ(certData.Subject);
    
    // Extrair nome da empresa do Subject
    const companyName = extractCompanyName(certData.Subject);
    
    console.log('[CertificateReader] Dados extraídos:', {
      cnpj,
      companyName,
      validTo: certData.NotAfter
    });
    
    return {
      validFrom: certData.NotBefore,
      validTo: certData.NotAfter,
      cnpj,
      companyName,
      subject: certData.Subject,
      issuer: certData.Issuer
    };
  } catch (error: any) {
    // Limpar arquivo temporário em caso de erro
    if (tempScriptPath && fs.existsSync(tempScriptPath)) {
      try {
        fs.unlinkSync(tempScriptPath);
      } catch (e) {
        console.warn('[CertificateReader] Erro ao remover script temporário:', e);
      }
    }
    
    console.error('[CertificateReader] Erro ao ler certificado:', error);
    
    if (error.message?.includes('Senha incorreta')) {
      throw new Error('Senha incorreta. Verifique a senha do certificado.');
    }
    
    if (error.message?.includes('Erro ao ler certificado:')) {
      throw error;
    }
    
    throw new Error('Não foi possível ler o certificado. Verifique o arquivo e a senha.');
  }
}

/**
 * Extrai CNPJ do Subject do certificado
 * Subject exemplo: "CN=EMPRESA LTDA:12345678000190, OU=Certificado PJ A1, O=ICP-Brasil, C=BR"
 */
function extractCNPJ(subject: string): string | null {
  console.log('[CertificateReader] Extraindo CNPJ do subject:', subject);
  
  // Padrão 1: Buscar no CN após dois pontos (CN=NOME:12345678000190)
  const cnpjInCN = subject.match(/CN=[^:]+:(\d{14})/i);
  if (cnpjInCN) {
    const cnpj = cnpjInCN[1];
    console.log('[CertificateReader] CNPJ encontrado no CN:', cnpj);
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  // Padrão 2: Buscar qualquer sequência de 14 dígitos
  const cnpjMatch = subject.match(/(\d{14})/);
  if (cnpjMatch) {
    const cnpj = cnpjMatch[1];
    console.log('[CertificateReader] CNPJ encontrado (14 dígitos):', cnpj);
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  // Padrão 3: Buscar no campo serialNumber
  const serialMatch = subject.match(/serialNumber=(\d+)/i);
  if (serialMatch && serialMatch[1].length === 14) {
    const cnpj = serialMatch[1];
    console.log('[CertificateReader] CNPJ encontrado no serialNumber:', cnpj);
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  console.log('[CertificateReader] CNPJ não encontrado');
  return null;
}

/**
 * Extrai nome da empresa do Subject do certificado
 */
function extractCompanyName(subject: string): string | null {
  console.log('[CertificateReader] Extraindo nome da empresa do subject:', subject);
  
  // Padrão 1: CN com CNPJ (CN=NOME:12345678000190)
  const cnWithCNPJ = subject.match(/CN=([^:,]+):\d{14}/i);
  if (cnWithCNPJ) {
    const name = cnWithCNPJ[1].trim();
    console.log('[CertificateReader] Nome encontrado no CN (com CNPJ):', name);
    return name;
  }
  
  // Padrão 2: CN sem CNPJ
  const cnMatch = subject.match(/CN=([^,]+)/i);
  if (cnMatch) {
    let name = cnMatch[1].trim();
    // Remover CNPJ se vier junto de outra forma
    name = name.replace(/:\d{14}/, '').trim();
    console.log('[CertificateReader] Nome encontrado no CN:', name);
    return name;
  }
  
  // Padrão 3: Campo O (Organization)
  const orgMatch = subject.match(/O=([^,]+)/i);
  if (orgMatch) {
    const name = orgMatch[1].trim();
    console.log('[CertificateReader] Nome encontrado no O:', name);
    return name;
  }
  
  console.log('[CertificateReader] Nome da empresa não encontrado');
  return null;
}

