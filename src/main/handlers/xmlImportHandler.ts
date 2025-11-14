// Handler para importação de XMLs de notas fiscais
// Processa arquivos XML e extrai dados da NF-e

import { promises as fs } from 'fs';
import path from 'path';
import { DOMParser } from '@xmldom/xmldom';

export interface NFEData {
  tipo: string;
  numero: string;
  serie: string;
  chave: string;
  emitente: string;
  destinatario: string;
  valor: number;
  pesoBruto: number;
  dataEmissao: string;
  lacres?: string[];
  // Dados do emitente
  emitenteUF?: string;
  emitenteMunicipioNome?: string;
  emitenteCodigoMunicipio?: string;
  // Dados do destinatário
  destinatarioUF?: string;
  destinatarioMunicipioNome?: string;
  destinatarioCodigoMunicipio?: string;
  // Dados do produto predominante
  descricaoProduto?: string;
  codigoNCM?: string;
  gtin?: string;
}

/**
 * Lê e processa arquivos XML de notas fiscais de uma pasta
 */
export async function importNFEXMLs(folderPath: string): Promise<NFEData[]> {
  const xmlFiles: NFEData[] = [];

  try {
    // Lê todos os arquivos da pasta
    const files = await fs.readdir(folderPath);

    // Filtra apenas arquivos XML
    const xmlFilesList = files.filter((file: string) => file.toLowerCase().endsWith('.xml'));

    for (const file of xmlFilesList) {
      try {
        const filePath = path.join(folderPath, file);
        const xmlContent = await fs.readFile(filePath, 'utf-8');
        const nfeData = extractNFEDataFromString(xmlContent);
        
        if (nfeData) {
          xmlFiles.push(nfeData);
        }
      } catch (error) {
        console.error(`Erro ao processar arquivo ${file}:`, error);
        // Continua processando outros arquivos
      }
    }

    return xmlFiles;
  } catch (error) {
    console.error('Erro ao importar XMLs:', error);
    throw error;
  }
}

/**
 * Extrai dados relevantes do XML da NF-e a partir de uma string XML
 */
function extractNFEDataFromString(xmlContent: string): NFEData | null {
  try {
    // Parse do XML
    const xmlDoc = new DOMParser().parseFromString(xmlContent, 'text/xml');
    
    // Extrai dados básicos da NF-e
    const infNFe = xmlDoc.getElementsByTagName('infNFe')[0];
    
    if (!infNFe) {
      return null;
    }

    const ide = infNFe.getElementsByTagName('ide')[0];
    const emit = infNFe.getElementsByTagName('emit')[0];
    const dest = infNFe.getElementsByTagName('dest')[0];
    const total = infNFe.getElementsByTagName('total')[0];

    // Extrai número e série
    const numero = ide?.getElementsByTagName('nNF')[0]?.textContent || '';
    const serie = ide?.getElementsByTagName('serie')[0]?.textContent || '';

    // Extrai chave de acesso
    let chaveAcesso =
      infNFe?.getAttribute('Id')?.replace('NFe', '') ||
      xmlDoc.getElementsByTagName('chNFe')[0]?.textContent ||
      '';

    if (!chaveAcesso.trim()) {
      const chaveRegex = /<infNFe[^>]*Id=["']NFe(\d{44})["']/i;
      const match = chaveRegex.exec(xmlContent);
      if (match && match[1]) {
        chaveAcesso = match[1];
      }
    }

    if (chaveAcesso.trim().length !== 44) {
      const matchChNFeTag = /<chNFe>(\d{44})<\/chNFe>/i.exec(xmlContent);
      if (matchChNFeTag && matchChNFeTag[1]) {
        chaveAcesso = matchChNFeTag[1];
      }
    }

    if (chaveAcesso.trim().length !== 44) {
      const genericMatch = xmlContent.match(/\d{44}/);
      if (genericMatch && genericMatch[0]) {
        chaveAcesso = genericMatch[0];
      }
    }

    chaveAcesso = chaveAcesso.trim();

    // Extrai dados do emitente
    const emitenteNome = emit?.getElementsByTagName('xNome')[0]?.textContent || '';
    const emitenteCNPJ = emit?.getElementsByTagName('CNPJ')[0]?.textContent || '';
    const emitenteRazao = emitenteCNPJ || emitenteNome;

    // Extrai dados do destinatário
    const destinatarioNome = dest?.getElementsByTagName('xNome')[0]?.textContent || '';
    const destinatarioCNPJ = dest?.getElementsByTagName('CNPJ')[0]?.textContent || '';
    const destinatarioRazao = destinatarioCNPJ || destinatarioNome;

    // Extrai valor total
    const valorTotal = total?.getElementsByTagName('vNF')[0]?.textContent || '0';
    const valor = parseFloat(valorTotal) || 0;

    // Extrai peso bruto
    const pesoBrutoText = total?.getElementsByTagName('pBruto')[0]?.textContent || 
                          infNFe?.getElementsByTagName('pBruto')[0]?.textContent || '0';
    const pesoBruto = parseFloat(pesoBrutoText) || 0;

    // Extrai data de emissão
    const dhEmi = ide?.getElementsByTagName('dhEmi')[0]?.textContent || '';
    const dataEmissao = dhEmi ? dhEmi.split('T')[0] : new Date().toISOString().split('T')[0];

    // Extrai lacres (se houver)
    const transp = infNFe?.getElementsByTagName('transp')[0];
    const lacresElements = transp?.getElementsByTagName('lacres');
    const lacres: string[] = [];
    if (lacresElements && lacresElements.length > 0) {
      for (let i = 0; i < lacresElements.length; i++) {
        const nLacre = lacresElements[i]?.getElementsByTagName('nLacre')[0]?.textContent;
        if (nLacre) lacres.push(nLacre);
      }
    }

    // Extrai endereço do emitente
    const enderEmit = emit?.getElementsByTagName('enderEmit')[0];
    const emitenteUF = enderEmit?.getElementsByTagName('UF')[0]?.textContent || '';
    const emitenteMunicipioNome = enderEmit?.getElementsByTagName('xMun')[0]?.textContent || '';
    const emitenteCodigoMunicipio = enderEmit?.getElementsByTagName('cMun')[0]?.textContent || '';

    // Extrai endereço do destinatário
    const enderDest = dest?.getElementsByTagName('enderDest')[0];
    const destinatarioUF = enderDest?.getElementsByTagName('UF')[0]?.textContent || '';
    const destinatarioMunicipioNome = enderDest?.getElementsByTagName('xMun')[0]?.textContent || '';
    const destinatarioCodigoMunicipio = enderDest?.getElementsByTagName('cMun')[0]?.textContent || '';

    // Extrai dados do produto predominante (primeiro produto da lista)
    const det = infNFe?.getElementsByTagName('det')[0];
    const prod = det?.getElementsByTagName('prod')[0];
    const descricaoProduto = prod?.getElementsByTagName('xProd')[0]?.textContent || '';
    const codigoNCM = prod?.getElementsByTagName('NCM')[0]?.textContent || '';
    const gtin = prod?.getElementsByTagName('cEAN')[0]?.textContent || 
                 prod?.getElementsByTagName('cEANTrib')[0]?.textContent || '';

    return {
      tipo: 'NF-e',
      numero: numero,
      serie: serie,
      chave: chaveAcesso,
      emitente: emitenteRazao,
      destinatario: destinatarioRazao,
      valor: valor,
      pesoBruto: pesoBruto,
      dataEmissao: dataEmissao,
      lacres: lacres.length > 0 ? lacres : undefined,
      // Dados do emitente
      emitenteUF: emitenteUF,
      emitenteMunicipioNome: emitenteMunicipioNome,
      emitenteCodigoMunicipio: emitenteCodigoMunicipio,
      // Dados do destinatário
      destinatarioUF: destinatarioUF,
      destinatarioMunicipioNome: destinatarioMunicipioNome,
      destinatarioCodigoMunicipio: destinatarioCodigoMunicipio,
      // Dados do produto predominante
      descricaoProduto: descricaoProduto,
      codigoNCM: codigoNCM,
      gtin: gtin !== 'SEM GTIN' ? gtin : undefined
    };
  } catch (error) {
    console.error('Erro ao extrair dados da NF-e:', error);
    return null;
  }
}

/**
 * Processa múltiplos arquivos XML selecionados pelo usuário
 */
export async function importNFEXMLsFromFiles(filePaths: string[]): Promise<NFEData[]> {
  const nfeDataList: NFEData[] = [];

  for (const filePath of filePaths) {
    try {
      const xmlContent = await fs.readFile(filePath, 'utf-8');
      const nfeData = extractNFEDataFromString(xmlContent);
      
      if (nfeData) {
        nfeDataList.push(nfeData);
      }
    } catch (error) {
      console.error(`Erro ao processar arquivo ${filePath}:`, error);
    }
  }

  return nfeDataList;
}

