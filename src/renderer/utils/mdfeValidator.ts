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
  capacidadeM3: string;
  tipoCarroceria: string;
  tipoRodado: string;
  tara: string;
  ufVeiculo: string;
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
  
  // Tipo de emitente (do Settings)
  tipoEmitente?: string; // 'prestador' | 'nao_prestador'
}

/**
 * Valida todos os campos obrigatórios do MDF-e
 * conforme manual da Receita Federal
 */
export function validateMDFe(formData: MDFeFormData): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Busca tipo de emitente do localStorage (configurado em Settings > Fiscal > MDF-e)
  const tipoEmitente = formData.tipoEmitente || localStorage.getItem('mdfe_tipo_emitente') || 'prestador';
  const isPrestador = tipoEmitente !== 'nao_prestador';

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

  // Validação Tipo de Carroceria (obrigatório)
  if (!formData.tipoCarroceria || formData.tipoCarroceria.trim() === '') {
    errors.push({
      field: 'tipoCarroceria',
      message: 'Tipo de Carroceria é obrigatório',
      tab: 'Transporte'
    });
  }

  // Validação Tipo de Rodado (obrigatório)
  if (!formData.tipoRodado || formData.tipoRodado.trim() === '') {
    errors.push({
      field: 'tipoRodado',
      message: 'Tipo de Rodado é obrigatório',
      tab: 'Transporte'
    });
  }

  // Validação Tara (obrigatório)
  if (!formData.tara || formData.tara.trim() === '' || parseFloat(formData.tara) <= 0) {
    errors.push({
      field: 'tara',
      message: 'Tara (KG) é obrigatória e deve ser maior que zero',
      tab: 'Transporte'
    });
  }

  // Validação UF do Veículo (obrigatório)
  if (!formData.ufVeiculo || formData.ufVeiculo.trim() === '') {
    errors.push({
      field: 'ufVeiculo',
      message: 'UF do veículo é obrigatória',
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

  // RNTRC só é obrigatório para prestador de serviço de transporte
  if (isPrestador && (!formData.rntrc || formData.rntrc.replace(/\D/g, '').length === 0)) {
    errors.push({
      field: 'rntrc',
      message: 'RNTRC é obrigatório para prestador de serviço de transporte',
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
  // Condutores são obrigatórios independente do tipo de emitente
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

  // Validação Tipo da Carga (obrigatório)
  if (!formData.tipoCarga || formData.tipoCarga.trim() === '') {
    errors.push({
      field: 'tipoCarga',
      message: 'Tipo da Carga é obrigatório',
      tab: 'Totalizadores'
    });
  }

  // Validação Descrição do Produto (obrigatório)
  if (!formData.descricaoProduto || formData.descricaoProduto.trim() === '') {
    errors.push({
      field: 'descricaoProduto',
      message: 'Descrição do Produto é obrigatória',
      tab: 'Totalizadores'
    });
  }

  // Validação CEP Local de Carregamento (obrigatório)
  if (!formData.cepLocalCarregamento || formData.cepLocalCarregamento.trim() === '') {
    errors.push({
      field: 'cepLocalCarregamento',
      message: 'CEP Local de Carregamento é obrigatório',
      tab: 'Totalizadores'
    });
  }

  // Validação CEP Local de Descarregamento (obrigatório)
  if (!formData.cepLocalDescarregamento || formData.cepLocalDescarregamento.trim() === '') {
    errors.push({
      field: 'cepLocalDescarregamento',
      message: 'CEP Local de Descarregamento é obrigatório',
      tab: 'Totalizadores'
    });
  }

  // Categoria veicular não é obrigatória (removida conforme solicitação)

  // Validação do seguro e pagamento (obrigatórios apenas para prestador de serviço de transporte)
  if (formData.tipoMDFe === 'rodoviario' && isPrestador) {
    const camposSeguroObrigatorios = [
      { field: 'responsavelSeguro', label: 'Responsável pelo seguro', value: formData.responsavelSeguro },
      { field: 'cpfCnpjResponsavelSeguro', label: 'CPF/CNPJ do responsável pelo seguro', value: formData.cpfCnpjResponsavelSeguro },
      { field: 'nomeSeguradora', label: 'Nome da seguradora', value: formData.nomeSeguradora },
      { field: 'cnpjSeguradora', label: 'CNPJ da seguradora', value: formData.cnpjSeguradora },
      { field: 'numeroApolice', label: 'Número da apólice', value: formData.numeroApolice }
    ];

    camposSeguroObrigatorios.forEach(({ field, label, value }) => {
      if (!value || String(value).trim() === '') {
        errors.push({
          field,
          message: `Campo obrigatório não informado (${label})`,
          tab: 'Seguro'
        });
      }
    });

    const camposPagamentoObrigatorios = [
      { field: 'nomeResponsavel', label: 'Nome do responsável (pagamento)', value: formData.nomeResponsavel },
      { field: 'cpfCnpjResponsavel', label: 'CPF/CNPJ do responsável (pagamento)', value: formData.cpfCnpjResponsavel },
      { field: 'valorTotalContrato', label: 'Valor total do contrato', value: formData.valorTotalContrato },
      { field: 'formaPagamento', label: 'Forma de pagamento', value: formData.formaPagamento }
    ];

    camposPagamentoObrigatorios.forEach(({ field, label, value }) => {
      if (!value || String(value).trim() === '') {
        errors.push({
          field,
          message: `Campo obrigatório não informado (${label})`,
          tab: 'Frete'
        });
      }
    });

    if (parseCurrency(formData.valorTotalContrato) <= 0) {
      errors.push({
        field: 'valorTotalContrato',
        message: 'Valor total do contrato deve ser maior que zero',
        tab: 'Frete'
      });
    }
  }

  return errors;
}

/**
 * Interface para dados da empresa vindos da API
 */
export interface CompanyData {
  id?: number;
  name: string;
  legal_name?: string;
  cnpj: string;
  ie?: string;
  im?: string;
  addresses?: Array<{
    street?: string;
    number?: string;
    complement?: string;
    district?: string;
    city_id?: number;
    state_id?: number;
    zipcode?: string;
  }>;
  contacts?: Array<{
    type: string;
    value: string;
  }>;
}

/**
 * Gera o JSON estruturado do MDF-e seguindo o padrão da SEFAZ
 * Este JSON será enviado para a API que irá comunicar com a SEFAZ
 * IMPORTANTE: Apenas campos preenchidos são incluídos no JSON
 * @param formData - Dados do formulário MDF-e
 * @param companyData - Dados da empresa vindos da API (opcional, se não fornecido usa dados do proprietário)
 */
export function generateMDFeJSON(formData: MDFeFormData, companyData?: CompanyData): any {
  // Formato de data ISO para Laravel (aceita ISO string)
  const timestamp = new Date().toISOString();
  const modal = getModalCode(formData.tipoMDFe);
  
  // Busca ambiente fiscal configurado (Settings > Fiscal > Certificado Digital)
  const ambienteFiscal = localStorage.getItem('fiscal_environment') || 'homologacao';
  const tpAmb = ambienteFiscal === 'producao' ? '1' : '2';
  
  // Busca código do município de carregamento das notas importadas (primeira nota)
  const primeiraNotaFiscal = Array.isArray(formData.notasFiscais) && formData.notasFiscais.length > 0 
    ? formData.notasFiscais[0] 
    : null;
  const codigoMunCarrega = primeiraNotaFiscal?.emitenteCodigoMunicipio || 
    getMunicipioCode(formData.municipioCarregamento, formData.ufCarregamento);

  // Gera número do MDF-e se não estiver preenchido (formato: 000000001)
  const numeroMDF = formData.numero || generateNextMDFeNumber();

  // Busca tipo de emitente do localStorage (configurado em Settings > Fiscal > MDF-e)
  const tipoEmitente = formData.tipoEmitente || localStorage.getItem('mdfe_tipo_emitente') || 'prestador';
  const tpEmit = tipoEmitente === 'nao_prestador' ? "2" : "1"; // 1-Prestador, 2-Não prestador

  // Monta a seção ide (identificação) - campos obrigatórios
  const ide: any = {
    cUF: getCUFCode(formData.ufCarregamento),
    tpAmb: tpAmb, // 1-Produção, 2-Homologação (vem das configurações)
    tpEmit: tpEmit, // 1-Prestador de serviço de transporte, 2-Não prestador
    tpTransp: "0", // 0-Não se aplica (quando for ETC ou CTC)
    mod: "58", // Modelo do MDF-e (API espera "mod", não "modelo")
    serie: formData.serie || "001",
    nMDF: numeroMDF,
    cMDF: generateCMDF(formData),
    cDV: calculateCheckDigit(formData),
    modal: modal, // 1-Rodoviário, 2-Aéreo, 3-Aquaviário, 4-Ferroviário
    dhEmi: timestamp,
    tpEmis: "1", // 1-Normal, 2-Contingência
    procEmi: "0", // 0-Emissão com aplicativo do contribuinte
    verProc: "1.0.0",
    UFIni: formData.ufCarregamento,
    UFFim: formData.ufDescarregamento,
    infMunCarrega: [{
      cMunCarrega: codigoMunCarrega,
      xMunCarrega: formData.municipioCarregamento
    }],
    dhIniViagem: timestamp
  };

  // Adiciona percurso (obrigatório pela API, mesmo que vazio)
  // Se não houver UFs de percurso, adiciona pelo menos a UF inicial
  if (formData.ufsPercurso && formData.ufsPercurso.length > 0) {
    ide.infPercurso = formData.ufsPercurso
      .filter((uf: any) => typeof uf === 'string' ? uf : uf.uf) // Aceita string ou objeto com propriedade 'uf'
      .map((uf: any) => ({
        UFPer: typeof uf === 'string' ? uf : uf.uf // Extrai apenas a sigla da UF
      }));
  } else {
    // Se não houver percurso definido, adiciona pelo menos a UF inicial
    ide.infPercurso = [{
      UFPer: formData.ufCarregamento
    }];
  }

  // Monta a seção emit (emitente) - campos obrigatórios
  // Usa dados da empresa da API se disponível, senão usa dados do proprietário do formulário
  let emit: any;
  
  if (companyData) {
    // Usa dados da empresa da API
    const address = companyData.addresses && companyData.addresses.length > 0 ? companyData.addresses[0] : null;
    
    // Lista de UFs brasileiras para mapear state_id para sigla
    const ufsBrasileiras = [
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
      'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
      'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];
    
    // Determina UF a partir do state_id se disponível
    let ufValue = '';
    if (address?.state_id && address.state_id > 0 && address.state_id <= ufsBrasileiras.length) {
      ufValue = ufsBrasileiras[address.state_id - 1];
    }
    
    emit = {
      CNPJ: formatCNPJ(companyData.cnpj),
      xNome: companyData.name,
      xFant: companyData.legal_name || companyData.name,
      enderEmit: {
        xLgr: address?.street || '',
        nro: address?.number || 'S/N',
        xBairro: address?.district || '',
        cMun: address?.city_id ? address.city_id.toString() : '9999999',
        xMun: '', // Será preenchido pela API se necessário
        CEP: formatCEP(address?.zipcode || ''),
        UF: ufValue // Preenche UF se tiver state_id
      }
    };
    
    // Adiciona IE apenas se preenchido
    if (companyData.ie) {
      emit.IE = companyData.ie;
    }
  } else {
    // Fallback: usa dados do proprietário do formulário (comportamento antigo)
    emit = {
      CNPJ: formatCNPJ(formData.cpfCnpjProprietario),
      xNome: formData.proprietario,
      xFant: formData.proprietario,
      enderEmit: {
        xLgr: formData.enderecoProprietario,
        nro: "S/N",
        xBairro: "Centro",
        cMun: getMunicipioCode(formData.cidadeProprietario, formData.ufProprietario),
        xMun: formData.cidadeProprietario,
        CEP: formatCEP(formData.cepProprietario),
        UF: formData.ufProprietario
      }
    };
    
    // Adiciona IE apenas se preenchido
    if (formData.ie) {
      emit.IE = formData.ie;
    }
  }

  // Adiciona telefone apenas se preenchido
  if (formData.enderecoProprietario) {
    // Aqui você pode adicionar campos opcionais do endereço se existirem no formulário
  }

  // Monta o JSON completo
  const mdfeJSON: any = {
    ide,
    emit,
    infModal: generateInfModalJSON(formData),
    tot: {
      qNFe: formData.qntTotalNFe || "0",
      qCTe: "0",
      qMDFe: "0",
      vCarga: parseFloat(formData.valorTotalCarga || "0").toFixed(2),
      cUnid: formData.codUnidadeMedidaCarga || "01", // 01-KG, 02-TON
      qCarga: parseFloat(formData.pesoTotalCarga || "0").toFixed(3)
    }
  };

  const infDoc = generateInfDocJSON(formData);
  if (infDoc) {
    mdfeJSON.infDoc = infDoc;
  }

  // Adiciona autorizados apenas se houver
  if (formData.autorizadoList && formData.autorizadoList.length > 0) {
    mdfeJSON.autXML = formData.autorizadoList
      .filter((autorizado: any) => autorizado && autorizado.cpfCnpj)
      .map((autorizado: any) => ({
        CNPJ: formatCNPJ(autorizado.cpfCnpj)
      }));
  }

  // Adiciona informações adicionais apenas se houver observações
  if (formData.observacoes && formData.observacoes.trim() !== "") {
    mdfeJSON.infAdic = {
      infCpl: formData.observacoes
    };
  }

  return mdfeJSON;
}

// Funções auxiliares para gerar o JSON do MDF-e
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

function getModalCode(tipoMDFe: string): string {
  const modalMap: Record<string, string> = {
    'rodoviario': '1',
    'aereo': '2',
    'aquaviario': '3',
    'ferroviario': '4'
  };
  return modalMap[tipoMDFe] || '1';
}

function generateCMDF(formData: MDFeFormData): string {
  // Gera o código de controle do MDF-e (8 dígitos numéricos aleatórios)
  return Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
}

function generateNextMDFeNumber(): string {
  // Gera número sequencial do MDF-e (formato: 000000001)
  // TODO: Buscar último número da API ou usar contador local
  const lastNumber = parseInt(localStorage.getItem('lastMDFeNumber') || '0', 10);
  const nextNumber = lastNumber + 1;
  localStorage.setItem('lastMDFeNumber', nextNumber.toString());
  return nextNumber.toString().padStart(9, '0');
}

function calculateCheckDigit(formData: MDFeFormData): string {
  // Calcula o dígito verificador (simplificado - a API deve calcular o correto)
  return '0';
}

function parseCurrency(value: string): number {
  if (!value) {
    return 0;
  }
  const sanitized = value.replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  const parsed = Number(sanitized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeFormaPagamento(value: string): string {
  if (!value) {
    return '';
  }
  return value
    .normalize('NFD')
    .replace(/[^\w]/g, '')
    .toLowerCase();
}

function formatCNPJ(cnpj: string): string {
  if (!cnpj) return '';
  return cnpj.replace(/\D/g, '');
}

function formatCEP(cep: string): string {
  if (!cep) return '';
  return cep.replace(/\D/g, '');
}

function getMunicipioCode(cidade: string, uf: string): string {
  // TODO: A API deve ter uma tabela completa de códigos de municípios do IBGE
  // Por enquanto, retorna um código genérico
  return '9999999';
}

// Gera a seção infModal em JSON para transporte rodoviário
// Apenas campos preenchidos são incluídos
function generateInfModalJSON(formData: MDFeFormData): any {
  if (formData.tipoMDFe === 'rodoviario') {
    // Monta veículo de tração (campos obrigatórios)
    const veicTracao: any = {
      cInt: "001",
      placa: formData.placa.replace(/[^a-zA-Z0-9]/g, '').toUpperCase(),
      RENAVAM: formData.renavam,
      tpRod: formData.tipoRodado || "01", // 01-Truck, 02-Toco, 03-Cavalo Mecânico, etc
      tpCar: formData.tipoCarroceria || "00", // 00-Não aplicável, 01-Aberta, 02-Fechada/Baú, etc
      UF: formData.ufVeiculo || formData.ufProprietario
    };

    // Adiciona tara apenas se preenchido
    if (formData.tara && formData.tara !== "0") {
      veicTracao.tara = formData.tara;
    }

    // Adiciona capacidade em KG apenas se preenchido
    if (formData.capacidade && formData.capacidade !== "0") {
      veicTracao.capKG = formData.capacidade;
    }

    // Adiciona capacidade em M3 apenas se preenchido
    if (formData.capacidadeM3 && formData.capacidadeM3 !== "0") {
      veicTracao.capM3 = formData.capacidadeM3;
    }

    // Adiciona condutores apenas se houver
    if (formData.condutoresSelecionados && formData.condutoresSelecionados.length > 0) {
      const condutoresValidos = formData.condutoresSelecionados
        .filter((condutor: any) => {
          const nome = condutor?.nome || condutor?.nomeCondutor;
          const cpf = condutor?.cpf || condutor?.cpfCondutor;
          return nome && cpf;
        })
        .map((condutor: any) => {
          const nome = condutor.nome || condutor.nomeCondutor;
          const cpf = condutor.cpf || condutor.cpfCondutor;
          return {
            xNome: nome,
            CPF: formatCNPJ(cpf)
          };
        });
      
      // Só adiciona se houver condutores válidos
      if (condutoresValidos.length > 0) {
        veicTracao.condutor = condutoresValidos;
      }
    }

    // Adiciona proprietário apenas se não for o emitente
    if (formData.proprietarioNaoEmitente && formData.proprietario) {
      const prop: any = {
        RNTRC: formData.rntrc || "",
        xNome: formData.proprietario,
        UF: formData.ufProprietario,
        tpProp: formData.tipoProprietario || "0" // 0-TAC Agregado, 1-TAC Independente, 2-Outros
      };

      // Adiciona CPF ou CNPJ
      const cpfCnpjLimpo = formatCNPJ(formData.cpfCnpjProprietario);
      if (cpfCnpjLimpo.length === 11) {
        prop.CPF = cpfCnpjLimpo;
      } else if (cpfCnpjLimpo.length === 14) {
        prop.CNPJ = cpfCnpjLimpo;
      }

      // Adiciona IE apenas se preenchido
      if (formData.ie) {
        prop.IE = formData.ie;
      }

      veicTracao.prop = prop;
    }

    // Monta estrutura rodoviário
    const rodo: any = {
      veicTracao
    };

    // Adiciona RNTRC apenas se preenchido
    if (formData.rntrc) {
      rodo.infANTT = {
        RNTRC: formData.rntrc
      };
    }

    // Adiciona seguro dentro de rodo
    const seg = generateSegJSON(formData);
    if (seg.length > 0) {
      rodo.seg = seg;
    }

    // Adiciona lacres apenas se houver
    if (formData.lacreList && formData.lacreList.length > 0) {
      rodo.lacRodo = formData.lacreList
        .filter((lacre: any) => lacre && lacre.numeroLacre)
        .map((lacre: any) => ({
          nLacre: lacre.numeroLacre
        }));
    }

    // Informações de pagamento do frete (infPag)
    const infPag = generateInfPagJSON(formData);
    if (infPag.length > 0) {
      rodo.infPag = infPag;
    }

    // Adiciona vale pedágio apenas se houver
    if (formData.valePedagioList && formData.valePedagioList.length > 0) {
      rodo.infContratante = formData.valePedagioList
        .filter((vale: any) => vale && vale.cnpjFornecedor && vale.nomeResponsavel)
        .map((vale: any) => ({
          CNPJ: formatCNPJ(vale.cnpjFornecedor),
          infPag: [{
            xNome: vale.nomeResponsavel,
            CPF: formatCNPJ(vale.cpfResponsavel),
            vContrato: parseFloat(vale.valor || "0").toFixed(2),
            indPag: vale.formaPagamento === "credito" ? "0" : "1" // 0-Pagamento à Vista, 1-Pagamento à Prazo
          }]
        }));
    }

    // Adiciona CIOT apenas se houver
    if (formData.ciotList && formData.ciotList.length > 0) {
      rodo.infCIOT = formData.ciotList
        .filter((ciot: any) => ciot && ciot.numero)
        .map((ciot: any) => ({
          CIOT: ciot.numero,
          CPF: ciot.cpf ? formatCNPJ(ciot.cpf) : undefined,
          CNPJ: ciot.cnpj ? formatCNPJ(ciot.cnpj) : undefined
        }));
    }

    return { rodo };
  }

  // TODO: Implementar para outros modais (aéreo, aquaviário, ferroviário)
  return {};
}

// Gera a seção infDoc em JSON com as notas fiscais e municípios de descarga
function generateInfDocJSON(formData: MDFeFormData): any {
  const notas = Array.isArray(formData.notasFiscais) ? formData.notasFiscais : [];
  if (notas.length === 0) {
    return null;
  }

  const municipiosMap = new Map<
    string,
    {
      municipio: string;
      uf: string;
      codigoMunicipio?: string;
      nfes: Array<{ chNFe: string; indReentrega: string }>;
    }
  >();

  notas.forEach((nota: any) => {
    if (!nota || !nota.chave) {
      return;
    }

    const ufDestino =
      nota.destinatarioUF ||
      nota.ufDestino ||
      nota.ufDestinatario ||
      formData.ufDescarregamento;

    const municipioDestino =
      nota.destinatarioMunicipioNome ||
      nota.destinatarioMunicipio ||
      nota.cidadeDestinatario ||
      formData.municipioDescarregamento;

    const codigoMunicipioDestino =
      nota.destinatarioCodigoMunicipio ||
      '';

    if (!ufDestino || !municipioDestino) {
      return;
    }

    const key = `${ufDestino.toUpperCase()}-${municipioDestino.toUpperCase()}`;

    if (!municipiosMap.has(key)) {
      municipiosMap.set(key, {
        municipio: municipioDestino,
        uf: ufDestino,
        codigoMunicipio: codigoMunicipioDestino,
        nfes: []
      });
    }

    const indReentrega = nota.indReentrega || '0';

    municipiosMap.get(key)!.nfes.push({
      chNFe: nota.chave,
      indReentrega
    });
  });

  const municipiosDescarga = Array.from(municipiosMap.values())
    .filter((item) => item.nfes.length > 0)
    .map((item) => ({
      cMunDescarga:
        item.codigoMunicipio ||
        getMunicipioCode(item.municipio, item.uf),
      xMunDescarga: item.municipio,
      infNFe: item.nfes
    }));

  if (municipiosDescarga.length > 0) {
    return {
      infMunDescarga: municipiosDescarga
    };
  }

  // Fallback: usa município/UF configurados manualmente caso não existam dados nas notas
  if (formData.municipioDescarregamento && formData.ufDescarregamento) {
    const nfesValidas = notas
      .filter((nota: any) => nota && nota.chave)
      .map((nota: any) => ({
        chNFe: nota.chave,
        indReentrega: nota.indReentrega || '0'
      }));

    if (nfesValidas.length > 0) {
      return {
        infMunDescarga: [
          {
            cMunDescarga: getMunicipioCode(
              formData.municipioDescarregamento,
              formData.ufDescarregamento
            ),
            xMunDescarga: formData.municipioDescarregamento,
            infNFe: nfesValidas
          }
        ]
      };
    }
  }

  return null;
}

// Gera a seção de seguro em JSON
function generateSegJSON(formData: MDFeFormData): any[] {
  const responsavel = (formData.responsavelSeguro || '').toLowerCase();
  const documentoResponsavel = formatCNPJ(formData.cpfCnpjResponsavelSeguro);
  const documentoSeguradora = formatCNPJ(formData.cnpjSeguradora);

  const possuiDadosObrigatorios =
    formData.nomeSeguradora &&
    documentoSeguradora &&
    formData.numeroApolice &&
    documentoResponsavel;

  if (!possuiDadosObrigatorios) {
    return [];
  }

  const seg: any = {
    infResp: {
      respSeg: responsavel.includes('contrat') ? '2' : '1'
    },
    infSeg: {
      xSeg: formData.nomeSeguradora,
      CNPJ: documentoSeguradora
    },
    nApol: formData.numeroApolice
  };

  if (documentoResponsavel.length === 11) {
    seg.infResp.CPF = documentoResponsavel;
  } else if (documentoResponsavel.length === 14) {
    seg.infResp.CNPJ = documentoResponsavel;
  }

  // Adiciona averbações apenas se houver
  if (formData.averbacaoList && formData.averbacaoList.length > 0) {
    seg.nAver = formData.averbacaoList
      .filter((averb: any) => averb && averb.numeroAverbacao)
      .map((averb: any) => averb.numeroAverbacao);
  }

  return [seg];
}

// Gera a seção de informações de pagamento do frete
function generateInfPagJSON(formData: MDFeFormData): any[] {
  if (!formData.nomeResponsavel || !formData.cpfCnpjResponsavel) {
    return [];
  }

  const documentoResponsavel = formatCNPJ(formData.cpfCnpjResponsavel);
  const valorContrato = parseCurrency(formData.valorTotalContrato || '0');
  const formaNormalizada = normalizeFormaPagamento(formData.formaPagamento || '');

  const infPag: any = {
    xNome: formData.nomeResponsavel,
    comp: [
      {
        tpComp: '01',
        vComp: valorContrato.toFixed(2)
      }
    ],
    vContrato: valorContrato.toFixed(2),
    vPrest: valorContrato.toFixed(2),
    indPag: formaNormalizada === 'avista' ? '0' : '1',
    infPrazo: []
  };

  if (documentoResponsavel.length === 11) {
    infPag.CPF = documentoResponsavel;
  } else if (documentoResponsavel.length === 14) {
    infPag.CNPJ = documentoResponsavel;
  }

  if (formData.numeroBanco && formData.numeroAgencia) {
    infPag.infBanc = {
      codBanco: formData.numeroBanco,
      codAgencia: formData.numeroAgencia
    };
  } else if (formData.pix) {
    infPag.infBanc = {
      chavePIX: formData.pix
    };
  } else if (formData.cnpjIpef) {
    infPag.infBanc = {
      CNPJIPEF: formatCNPJ(formData.cnpjIpef)
    };
  }

  return [infPag];
}

