// Validação de campos obrigatórios do MDF-e conforme manual da Receita Federal
// Funções para validar e gerar XML do MDF-e

export interface ValidationError {
  field: string;
  message: string;
  tab: string;
}

export interface MDFeFormData {
  // Documents data
  notasFiscais: any[];
  documentosAnexos: any[];
  observacoes: string;
  
  // Transport data
  veiculoSelecionado: string;
  placa: string;
  renavam: string;
  chassi: string;
  marca: string;
  modelo: string;
  anoFabricacao: string;
  anoModelo: string;
  cor: string;
  combustivel: string;
  capacidade: string;
  proprietario: string;
  cpfCnpjProprietario: string;
  enderecoProprietario: string;
  cidadeProprietario: string;
  ufProprietario: string;
  cepProprietario: string;
  proprietarioNaoEmitente: boolean;
  rntrc: string;
  tipoProprietario: string;
  ie: string;
  ufProprietarioCompleto: string;
  
  // Condutores data
  condutoresSelecionados: any[];
  condutorSelecionado: string;
  nomeCondutor: string;
  cpfCondutor: string;
  cnhCondutor: string;
  categoriaCnh: string;
  validadeCnh: string;
  telefoneCondutor: string;
  emailCondutor: string;
  enderecoCondutor: string;
  cidadeCondutor: string;
  ufCondutor: string;
  cepCondutor: string;
  
  // Route data
  municipioCarregamento: string;
  ufCarregamento: string;
  ufsPercurso: string[];
  municipioDescarregamento: string;
  ufDescarregamento: string;
  
  // Freight data
  valePedagioList: any[];
  categoriaVeicular: string;
  
  // Payment data
  nomeResponsavel: string;
  cpfCnpjResponsavel: string;
  valorTotalContrato: string;
  formaPagamento: string;
  numeroBanco: string;
  numeroAgencia: string;
  pix: string;
  cnpjIpef: string;
  
  // CIOT data
  ciotList: any[];
  
  // Insurance data
  responsavelSeguro: string;
  cpfCnpjResponsavelSeguro: string;
  nomeSeguradora: string;
  cnpjSeguradora: string;
  numeroApolice: string;
  averbacaoList: any[];
  exibirDadosSeguro: boolean;
  
  // Totalizers data
  qntTotalNFe: string;
  valorTotalCarga: string;
  codUnidadeMedidaCarga: string;
  pesoTotalCarga: string;
  lacreList: any[];
  autorizadoList: any[];
  notasSemPesoBruto: any[];
  
  // Product data
  tipoCarga: string;
  descricaoProduto: string;
  gtin: string;
  codigoNCM: string;
  cepLocalCarregamento: string;
  cepLocalDescarregamento: string;
  
  // MDF-e basic data
  tipoMDFe: string;
  numero: string;
  serie: string;
  chave: string;
  emitente: string;
  destinatario: string;
  valor: number;
  status: string;
  dataEmissao: string;
}

/**
 * Valida todos os campos obrigatórios do MDF-e
 * conforme manual da Receita Federal
 */
export function validateMDFe(formData: MDFeFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validação da aba Documentos
  if (!formData.notasFiscais || formData.notasFiscais.length === 0) {
    errors.push({
      field: 'notasFiscais',
      message: 'Pelo menos uma nota fiscal deve ser adicionada',
      tab: 'Documentos'
    });
  }

  // Validação da aba Transporte
  if (!formData.veiculoSelecionado) {
    errors.push({
      field: 'veiculoSelecionado',
      message: 'Vehículo deve ser selecionado',
      tab: 'Transporte'
    });
  }

  // Normaliza a placa removendo caracteres não alfanuméricos e aplicando maiúsculas
  const normalizedPlate = (formData.placa || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const isOldPattern = /^[A-Z]{3}[0-9]{4}$/.test(normalizedPlate); // ABC1234
  const isMercosulPattern = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(normalizedPlate); // ABC1D23

  if (!normalizedPlate || normalizedPlate.length !== 7 || !(isOldPattern || isMercosulPattern)) {
    errors.push({
      field: 'placa',
      message: 'Placa do veículo é obrigatória e deve ter 7 caracteres (formato ABC1234 ou ABC1D23)',
      tab: 'Transporte'
    });
  }

  if (!formData.renavam || formData.renavam.length !== 11) {
    errors.push({
      field: 'renavam',
      message: 'RENAVAM é obrigatório e deve ter 11 dígitos',
      tab: 'Transporte'
    });
  }

  // Dados do proprietário só são obrigatórios quando o proprietário NÃO é o emitente
  if (formData.proprietarioNaoEmitente) {
    if (!formData.tipoProprietario || !formData.proprietario) {
      errors.push({
        field: 'proprietario',
        message: 'Proprietário do veículo é obrigatório',
        tab: 'Transporte'
      });
    }

    if (!formData.cpfCnpjProprietario) {
      errors.push({
        field: 'cpfCnpjProprietario',
        message: 'CPF/CNPJ do proprietário é obrigatório',
        tab: 'Transporte'
      });
    }

    if (!formData.ufProprietario) {
      errors.push({
        field: 'ufProprietario',
        message: 'UF do proprietário é obrigatório',
        tab: 'Transporte'
      });
    }
  }

  // Validação da aba Condutores
  if (!formData.condutoresSelecionados || formData.condutoresSelecionados.length === 0) {
    errors.push({
      field: 'condutoresSelecionados',
      message: 'Pelo menos um condutor deve ser adicionado',
      tab: 'Condutores'
    });
  }

  // Validação da aba Rota
  if (!formData.municipioCarregamento) {
    errors.push({
      field: 'municipioCarregamento',
      message: 'Município de carregamento é obrigatório',
      tab: 'Rota'
    });
  }

  if (!formData.ufCarregamento) {
    errors.push({
      field: 'ufCarregamento',
      message: 'UF de carregamento é obrigatória',
      tab: 'Rota'
    });
  }

  if (!formData.municipioDescarregamento) {
    errors.push({
      field: 'municipioDescarregamento',
      message: 'Município de descarregamento é obrigatório',
      tab: 'Rota'
    });
  }

  if (!formData.ufDescarregamento) {
    errors.push({
      field: 'ufDescarregamento',
      message: 'UF de descarregamento é obrigatória',
      tab: 'Rota'
    });
  }

  // Validação da aba Totalizadores
  if (!formData.qntTotalNFe || parseFloat(formData.qntTotalNFe) <= 0) {
    errors.push({
      field: 'qntTotalNFe',
      message: 'Quantidade total de NF-es é obrigatória e deve ser maior que zero',
      tab: 'Totalizadores'
    });
  }

  if (!formData.valorTotalCarga || parseFloat(formData.valorTotalCarga) <= 0) {
    errors.push({
      field: 'valorTotalCarga',
      message: 'Valor total da carga é obrigatório e deve ser maior que zero',
      tab: 'Totalizadores'
    });
  }

  if (!formData.codUnidadeMedidaCarga) {
    errors.push({
      field: 'codUnidadeMedidaCarga',
      message: 'Código da unidade de medida é obrigatório (01-KG, 02-TON)',
      tab: 'Totalizadores'
    });
  }

  if (!formData.pesoTotalCarga || parseFloat(formData.pesoTotalCarga) <= 0) {
    errors.push({
      field: 'pesoTotalCarga',
      message: 'Peso total da carga é obrigatório e deve ser maior que zero',
      tab: 'Totalizadores'
    });
  }

  // Validação da categoria do veículo (obrigatória para rodoviário)
  if (formData.tipoMDFe === 'rodoviario' && !formData.categoriaVeicular) {
    errors.push({
      field: 'categoriaVeicular',
      message: 'Categoria veicular é obrigatória para transporte rodoviário',
      tab: 'Frete'
    });
  }

  return errors;
}

/**
 * Gera o XML do MDF-e seguindo o schema da Receita Federal
 */
export function generateMDFeXML(formData: MDFeFormData): string {
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<MDFe xmlns="http://www.portalfiscal.inf.br/mdfe">
  <infMDFe Id="MDFe${formData.numero}">
    <ide>
      <cUF>${getCUFCode(formData.ufCarregamento)}</cUF>
      <tpAmb>1</tpAmb>
      <tpEmit>1</tpEmit>
      <modelo>58</modelo>
      <serie>${formData.serie}</serie>
      <nMDF>${formData.numero}</nMDF>
      <cMDF>${generateCMDF(formData)}</cMDF>
      <cDV>${calculateCheckDigit(formData)}</cDV>
      <modal>01</modal>
      <dhEmi>${timestamp}</dhEmi>
      <tpEmit>1</tpEmit>
      <tpTransp>0</tpTransp>
      <modTransp>01</modTransp>
    </ide>
    <emit>
      <CNPJ>${formatCNPJ(formData.cpfCnpjProprietario)}</CNPJ>
      <IE>${formData.ie}</IE>
      <IEST></IEST>
      <xNome>${formData.proprietario}</xNome>
      <xFant>${formData.proprietario}</xFant>
      <enderEmit>
        <xLgr>${formData.enderecoProprietario}</xLgr>
        <nro>000</nro>
        <xBairro>Centro</xBairro>
        <cMun>${getMunicipioCode(formData.cidadeProprietario, formData.ufProprietario)}</cMun>
        <xMun>${formData.cidadeProprietario}</xMun>
        <CEP>${formatCEP(formData.cepProprietario)}</CEP>
        <UF>${formData.ufProprietario}</UF>
        <fone></fone>
        <email></email>
      </enderEmit>
    </emit>
    ${generateInfModal(formData)}
    ${generateInfDoc(formData)}
    ${generateTotal(formData)}
    <autXML>
      <CNPJ>${formatCNPJ(formData.cpfCnpjProprietario)}</CNPJ>
    </autXML>
    <infAdic>
      <infCpl></infCpl>
    </infAdic>
    <infRespTec>
      <CNPJ></CNPJ>
    </infRespTec>
    <infSolicNFF>
      <xSolic>${formData.observacoes}</xSolic>
    </infSolicNFF>
  </infMDFe>
</MDFe>`;

  return xml;
}

// Funções auxiliares para gerar o XML
function getCUFCode(uf: string): string {
  const ufMap: Record<string, string> = {
    'AC': '12', 'AL': '27', 'AP': '16', 'AM': '13', 'BA': '29',
    'CE': '23', 'DF': '53', 'ES': '32', 'GO': '52', 'MA': '21',
    'MT': '51', 'MS': '50', 'MG': '31', 'PA': '15', 'PB': '25',
    'PR': '41', 'PE': '26', 'PI': '22', 'RJ': '33', 'RN': '24',
    'RS': '43', 'RO': '11', 'RR': '14', 'SC': '42', 'SP': '35',
    'SE': '28', 'TO': '17'
  };
  return ufMap[uf] || '31';
}

function generateCMDF(formData: MDFeFormData): string {
  // Gera o código de controle do MDF-e
  return '00000000';
}

function calculateCheckDigit(formData: MDFeFormData): string {
  // Calcula o dígito verificador
  return '0';
}

function formatCNPJ(cnpj: string): string {
  return cnpj.replace(/\D/g, '');
}

function formatCEP(cep: string): string {
  return cep.replace(/\D/g, '');
}

function getMunicipioCode(cidade: string, uf: string): string {
  // TODO: Implementar busca de código do município
  return '3106200'; // Código de exemplo (Belo Horizonte)
}

function generateInfModal(formData: MDFeFormData): string {
  if (formData.tipoMDFe === 'rodoviario') {
    return `<infModal>
      <rodo>
        <lacRodo>
          ${formData.lacreList.map(lacre => 
            `<lacres><nLacre>${lacre.numero}</nLacre></lacres>`
          ).join('')}
        </lacRodo>
      </rodo>
    </infModal>`;
  }
  return '';
}

function generateInfDoc(formData: MDFeFormData): string {
  return `<infDoc>
    ${formData.notasFiscais.map(nf => 
      `<infMunDescarga>
        <cMunDescarga>${getMunicipioCode(formData.municipioDescarregamento, formData.ufDescarregamento)}</cMunDescarga>
        <xMunDescarga>${formData.municipioDescarregamento}</xMunDescarga>
      </infMunDescarga>`
    ).join('')}
  </infDoc>`;
}

function generateTotal(formData: MDFeFormData): string {
  return `<total>
    <ICMSTot>
      <vNF>${formData.valorTotalCarga || '0.00'}</vNF>
      <vServ>${formData.valorTotalContrato || '0.00'}</vServ>
    </ICMSTot>
  </total>`;
}

