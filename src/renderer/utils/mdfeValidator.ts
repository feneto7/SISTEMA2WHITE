// Validação de campos obrigatórios do MDF-e conforme manual da Receita Federal
// Funções para validar e gerar XML do MDF-e

export interface ValidationError {
  field: string;
  message: string;
  tab: string;
}

export interface MDFeFormData {
  // Documents data
  invoices: any[];
  attachedDocuments: any[];
  notes: string;
  
  // Transport data
  selectedVehicle: string;
  licensePlate: string;
  renavam: string;
  chassis: string;
  brand: string;
  model: string;
  manufacturingYear: string;
  modelYear: string;
  color: string;
  fuelType: string;
  capacityKg: string;
  capacityM3: string;
  bodyType: string;
  wheelType: string;
  tareWeight: string;
  vehicleState: string;
  ownerName: string;
  ownerDocument: string;
  ownerAddress: string;
  ownerCity: string;
  ownerState: string;
  ownerZipCode: string;
  isOwnerNotIssuer: boolean;
  rntrcCode: string;
  ownerType: string;
  ownerStateRegistration: string;
  ownerFullState: string;
  
  // Drivers data
  selectedDrivers: any[];
  selectedDriverId: string;
  driverName: string;
  driverCpf: string;
  driverCnh: string;
  driverCnhCategory: string;
  driverCnhValidity: string;
  driverPhone: string;
  driverEmail: string;
  driverAddress: string;
  driverCity: string;
  driverState: string;
  driverZipCode: string;
  
  // Route data
  loadingCity: string;
  loadingState: string;
  routeStates: string[];
  unloadingCity: string;
  unloadingState: string;
  
  // Freight data
  tollVoucherList: any[];
  vehicleCategory: string;
  
  // Payment data
  paymentResponsibleName: string;
  paymentResponsibleDocument: string;
  contractTotalValue: string;
  paymentMethod: string;
  bankNumber: string;
  agencyNumber: string;
  pixKey: string;
  ipefCnpj: string;
  
  // CIOT data
  ciotList: any[];
  
  // Insurance data
  insuranceResponsible: string;
  insuranceResponsibleDocument: string;
  insuranceCompanyName: string;
  insuranceCompanyCnpj: string;
  policyNumber: string;
  endorsementList: any[];
  showInsuranceData: boolean;
  
  // Totalizers data
  totalInvoicesCount: string;
  totalCargoValue: string;
  cargoUnitCode: string;
  totalCargoWeight: string;
  sealList: any[];
  authorizedList: any[];
  invoicesWithoutGrossWeight: any[];
  
  // Product data
  cargoType: string;
  productDescription: string;
  gtin: string;
  ncmCode: string;
  loadingZipCode: string;
  unloadingZipCode: string;
  
  // MDF-e basic data
  mdfeType: string;
  mdfeNumber: string;
  mdfeSeries: string;
  accessKey: string;
  issuer: string;
  recipient: string;
  mdfeValue: number;
  status: string;
  issueDate: string;
  
  // Issuer type (from Settings)
  issuerType?: string; // 'prestador' | 'nao_prestador'
}

/**
 * Valida todos os campos obrigatórios do MDF-e
 * conforme manual da Receita Federal
 */
export function validateMDFe(formData: MDFeFormData): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Busca tipo de emitente do localStorage (configurado em Settings > Fiscal > MDF-e)
  const issuerType = formData.issuerType || localStorage.getItem('mdfe_tipo_emitente') || 'prestador';
  const isServiceProvider = issuerType !== 'nao_prestador';

  // Validação da aba Documentos
  if (!formData.invoices || formData.invoices.length === 0) {
    errors.push({
      field: 'invoices',
      message: 'Pelo menos uma nota fiscal deve ser adicionada',
      tab: 'Documentos'
    });
  }

  // Validação da aba Transporte
  if (!formData.selectedVehicle) {
    errors.push({
      field: 'selectedVehicle',
      message: 'Vehículo deve ser selecionado',
      tab: 'Transporte'
    });
  }

  // Normaliza a placa removendo caracteres não alfanuméricos e aplicando maiúsculas
  const normalizedPlate = (formData.licensePlate || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const isOldPattern = /^[A-Z]{3}[0-9]{4}$/.test(normalizedPlate); // ABC1234
  const isMercosulPattern = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(normalizedPlate); // ABC1D23

  if (!normalizedPlate || normalizedPlate.length !== 7 || !(isOldPattern || isMercosulPattern)) {
    errors.push({
      field: 'licensePlate',
      message: 'Placa do veículo é obrigatória e deve ter 7 caracteres (formato ABC1234 ou ABC1D23)',
      tab: 'Transporte'
    });
  }

  // Validação Tipo de Carroceria (obrigatório)
  if (!formData.bodyType || formData.bodyType.trim() === '') {
    errors.push({
      field: 'bodyType',
      message: 'Tipo de Carroceria é obrigatório',
      tab: 'Transporte'
    });
  }

  // Validação Tipo de Rodado (obrigatório)
  if (!formData.wheelType || formData.wheelType.trim() === '') {
    errors.push({
      field: 'wheelType',
      message: 'Tipo de Rodado é obrigatório',
      tab: 'Transporte'
    });
  }

  // Validação Tara (obrigatório)
  if (!formData.tareWeight || formData.tareWeight.trim() === '' || parseFloat(formData.tareWeight) <= 0) {
    errors.push({
      field: 'tareWeight',
      message: 'Tara (KG) é obrigatória e deve ser maior que zero',
      tab: 'Transporte'
    });
  }

  // Validação UF do Veículo (obrigatório)
  if (!formData.vehicleState || formData.vehicleState.trim() === '') {
    errors.push({
      field: 'vehicleState',
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
  if (isServiceProvider && (!formData.rntrcCode || formData.rntrcCode.replace(/\D/g, '').length === 0)) {
    errors.push({
      field: 'rntrcCode',
      message: 'RNTRC é obrigatório para prestador de serviço de transporte',
      tab: 'Transporte'
    });
  }

  // Dados do proprietário só são obrigatórios quando o proprietário NÃO é o emitente
  if (formData.isOwnerNotIssuer) {
    if (!formData.ownerType || !formData.ownerName) {
      errors.push({
        field: 'ownerName',
        message: 'Proprietário do veículo é obrigatório',
        tab: 'Transporte'
      });
    }

    if (!formData.ownerDocument) {
      errors.push({
        field: 'ownerDocument',
        message: 'CPF/CNPJ do proprietário é obrigatório',
        tab: 'Transporte'
      });
    }

    if (!formData.ownerState) {
      errors.push({
        field: 'ownerState',
        message: 'UF do proprietário é obrigatório',
        tab: 'Transporte'
      });
    }
  }

  // Validação da aba Condutores
  // Condutores são obrigatórios independente do tipo de emitente
  if (!formData.selectedDrivers || formData.selectedDrivers.length === 0) {
    errors.push({
      field: 'selectedDrivers',
      message: 'Pelo menos um condutor deve ser adicionado',
      tab: 'Condutores'
    });
  }

  // Validação da aba Rota
  if (!formData.loadingCity) {
    errors.push({
      field: 'loadingCity',
      message: 'Município de carregamento é obrigatório',
      tab: 'Rota'
    });
  }

  if (!formData.loadingState) {
    errors.push({
      field: 'loadingState',
      message: 'UF de carregamento é obrigatória',
      tab: 'Rota'
    });
  }

  if (!formData.unloadingCity) {
    errors.push({
      field: 'unloadingCity',
      message: 'Município de descarregamento é obrigatório',
      tab: 'Rota'
    });
  }

  if (!formData.unloadingState) {
    errors.push({
      field: 'unloadingState',
      message: 'UF de descarregamento é obrigatória',
      tab: 'Rota'
    });
  }

  // Validação da aba Totalizadores
  if (!formData.totalInvoicesCount || parseFloat(formData.totalInvoicesCount) <= 0) {
    errors.push({
      field: 'totalInvoicesCount',
      message: 'Quantidade total de NF-es é obrigatória e deve ser maior que zero',
      tab: 'Totalizadores'
    });
  }

  if (!formData.totalCargoValue || parseFloat(formData.totalCargoValue) <= 0) {
    errors.push({
      field: 'totalCargoValue',
      message: 'Valor total da carga é obrigatório e deve ser maior que zero',
      tab: 'Totalizadores'
    });
  }

  if (!formData.cargoUnitCode) {
    errors.push({
      field: 'cargoUnitCode',
      message: 'Código da unidade de medida é obrigatório (01-KG, 02-TON)',
      tab: 'Totalizadores'
    });
  }

  if (!formData.totalCargoWeight || parseFloat(formData.totalCargoWeight) <= 0) {
    errors.push({
      field: 'totalCargoWeight',
      message: 'Peso total da carga é obrigatório e deve ser maior que zero',
      tab: 'Totalizadores'
    });
  }

  // Validação Tipo da Carga (obrigatório)
  if (!formData.cargoType || formData.cargoType.trim() === '') {
    errors.push({
      field: 'cargoType',
      message: 'Tipo da Carga é obrigatório',
      tab: 'Totalizadores'
    });
  }

  // Validação Descrição do Produto (obrigatório)
  if (!formData.productDescription || formData.productDescription.trim() === '') {
    errors.push({
      field: 'productDescription',
      message: 'Descrição do Produto é obrigatória',
      tab: 'Totalizadores'
    });
  }

  // Validação CEP Local de Carregamento (obrigatório)
  if (!formData.loadingZipCode || formData.loadingZipCode.trim() === '') {
    errors.push({
      field: 'loadingZipCode',
      message: 'CEP Local de Carregamento é obrigatório',
      tab: 'Totalizadores'
    });
  }

  // Validação CEP Local de Descarregamento (obrigatório)
  if (!formData.unloadingZipCode || formData.unloadingZipCode.trim() === '') {
    errors.push({
      field: 'unloadingZipCode',
      message: 'CEP Local de Descarregamento é obrigatório',
      tab: 'Totalizadores'
    });
  }

  // Categoria veicular não é obrigatória (removida conforme solicitação)

  // Validação do seguro e pagamento (obrigatórios apenas para prestador de serviço de transporte)
  if (formData.mdfeType === 'rodoviario' && isServiceProvider) {
    const requiredInsuranceFields = [
      { field: 'insuranceResponsible', label: 'Responsável pelo seguro', value: formData.insuranceResponsible },
      { field: 'insuranceResponsibleDocument', label: 'CPF/CNPJ do responsável pelo seguro', value: formData.insuranceResponsibleDocument },
      { field: 'insuranceCompanyName', label: 'Nome da seguradora', value: formData.insuranceCompanyName },
      { field: 'insuranceCompanyCnpj', label: 'CNPJ da seguradora', value: formData.insuranceCompanyCnpj },
      { field: 'policyNumber', label: 'Número da apólice', value: formData.policyNumber }
    ];

    requiredInsuranceFields.forEach(({ field, label, value }) => {
      if (!value || String(value).trim() === '') {
        errors.push({
          field,
          message: `Campo obrigatório não informado (${label})`,
          tab: 'Seguro'
        });
      }
    });

    const requiredPaymentFields = [
      { field: 'paymentResponsibleName', label: 'Nome do responsável (pagamento)', value: formData.paymentResponsibleName },
      { field: 'paymentResponsibleDocument', label: 'CPF/CNPJ do responsável (pagamento)', value: formData.paymentResponsibleDocument },
      { field: 'contractTotalValue', label: 'Valor total do contrato', value: formData.contractTotalValue },
      { field: 'paymentMethod', label: 'Forma de pagamento', value: formData.paymentMethod }
    ];

    requiredPaymentFields.forEach(({ field, label, value }) => {
      if (!value || String(value).trim() === '') {
        errors.push({
          field,
          message: `Campo obrigatório não informado (${label})`,
          tab: 'Frete'
        });
      }
    });

    if (parseCurrency(formData.contractTotalValue) <= 0) {
      errors.push({
      field: 'contractTotalValue',
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
    city?: {
      id?: number;
      name?: string;
      state_id?: number;
    };
    state?: {
      id?: number;
      name?: string;
      uf?: string;
    };
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
  const modal = getModalCode(formData.mdfeType);
  
  // Busca ambiente fiscal configurado (Settings > Fiscal > Certificado Digital)
  const fiscalEnvironment = localStorage.getItem('fiscal_environment') || 'homologacao';
  const tpAmb = fiscalEnvironment === 'producao' ? '1' : '2';
  
  // Busca código do município de carregamento das notas importadas (primeira nota)
  const firstInvoice = Array.isArray(formData.invoices) && formData.invoices.length > 0 
    ? formData.invoices[0] 
    : null;
  const loadingCityCode = firstInvoice?.emitenteCodigoMunicipio || 
    getCityCode(formData.loadingCity, formData.loadingState);

  // Gera número do MDF-e se não estiver preenchido (formato: 000000001)
  const mdfNumber = formData.mdfeNumber || generateNextMDFeNumber();

  // Busca tipo de emitente do localStorage (configurado em Settings > Fiscal > MDF-e)
  const issuerType = formData.issuerType || localStorage.getItem('mdfe_tipo_emitente') || 'prestador';
  const tpEmit = issuerType === 'nao_prestador' ? "2" : "1"; // 1-Prestador, 2-Não prestador

  // Monta a seção ide (identificação) - campos obrigatórios
  const ide: any = {
    cUF: getCUFCode(formData.loadingState),
    tpAmb: tpAmb, // 1-Produção, 2-Homologação (vem das configurações)
    tpEmit: tpEmit, // 1-Prestador de serviço de transporte, 2-Não prestador
    tpTransp: "0", // 0-Não se aplica (quando for ETC ou CTC)
    mod: "58", // Modelo do MDF-e (API espera "mod", não "modelo")
    serie: formData.mdfeSeries || "001",
    nMDF: mdfNumber,
    cMDF: generateCMDF(formData),
    cDV: calculateCheckDigit(formData),
    modal: modal, // 1-Rodoviário, 2-Aéreo, 3-Aquaviário, 4-Ferroviário
    dhEmi: timestamp,
    tpEmis: "1", // 1-Normal, 2-Contingência
    procEmi: "0", // 0-Emissão com aplicativo do contribuinte
    verProc: "1.0.0",
    UFIni: formData.loadingState,
    UFFim: formData.unloadingState,
    infMunCarrega: [{
      cMunCarrega: loadingCityCode,
      xMunCarrega: formData.loadingCity
    }],
    dhIniViagem: timestamp
  };

  // Adiciona percurso (obrigatório pela API, mesmo que vazio)
  // Se não houver UFs de percurso, adiciona pelo menos a UF inicial
  if (formData.routeStates && formData.routeStates.length > 0) {
    ide.infPercurso = formData.routeStates
      .filter((uf: any) => typeof uf === 'string' ? uf : uf.uf) // Aceita string ou objeto com propriedade 'uf'
      .map((uf: any) => ({
        UFPer: typeof uf === 'string' ? uf : uf.uf // Extrai apenas a sigla da UF
      }));
  } else {
    // Se não houver percurso definido, adiciona pelo menos a UF inicial
    ide.infPercurso = [{
      UFPer: formData.loadingState
    }];
  }

  // Monta a seção emit (emitente) - campos obrigatórios
  // Usa dados da empresa da API se disponível, senão usa dados do proprietário do formulário
  let emit: any;
  
  if (companyData) {
    // Usa dados da empresa da API
    const address = companyData.addresses && companyData.addresses.length > 0 ? companyData.addresses[0] : null;
    
    // Lista de UFs brasileiras para mapear state_id para sigla
    const brazilianStates = [
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
      'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
      'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];
    
    // Determina UF a partir do relacionamento state ou state_id
    let ufValue = '';
    if (address?.state?.uf) {
      // Se tiver relacionamento state com UF, usa diretamente
      ufValue = address.state.uf;
    } else if (address?.state_id && address.state_id > 0 && address.state_id <= brazilianStates.length) {
      // Fallback: mapeia state_id para UF usando array
      ufValue = brazilianStates[address.state_id - 1];
    }
    
    // Obtém nome da cidade do relacionamento city
    const cityName = address?.city?.name || '';
    
    emit = {
      CNPJ: formatCNPJ(companyData.cnpj),
      xNome: companyData.name,
      xFant: companyData.legal_name || companyData.name,
      enderEmit: {
        xLgr: address?.street || '',
        nro: address?.number ? String(address.number) : 'S/N',
        xBairro: address?.district || '',
        cMun: address?.city_id ? address.city_id.toString() : '9999999',
        xMun: cityName, // Nome da cidade do relacionamento
        CEP: formatCEP(address?.zipcode ? String(address.zipcode) : ''),
        UF: ufValue
      }
    };
    
    // Adiciona IE apenas se preenchido
    if (companyData.ie) {
      emit.IE = String(companyData.ie);
    }
  } else {
    // Fallback: usa dados do proprietário do formulário (comportamento antigo)
    emit = {
      CNPJ: formatCNPJ(formData.ownerDocument),
      xNome: formData.ownerName,
      xFant: formData.ownerName,
      enderEmit: {
        xLgr: formData.ownerAddress,
        nro: "S/N",
        xBairro: "Centro",
        cMun: getCityCode(formData.ownerCity, formData.ownerState),
        xMun: formData.ownerCity,
        CEP: formatCEP(formData.ownerZipCode),
        UF: formData.ownerState
      }
    };
    
    // Adiciona IE apenas se preenchido
    if (formData.ownerStateRegistration) {
      emit.IE = formData.ownerStateRegistration;
    }
  }

  // Adiciona telefone apenas se preenchido
  if (formData.ownerAddress) {
    // Aqui você pode adicionar campos opcionais do endereço se existirem no formulário
  }

  // Monta o JSON completo
  const mdfeJSON: any = {
    ide,
    emit,
    infModal: generateInfModalJSON(formData),
    tot: {
      qNFe: formData.totalInvoicesCount || "0",
      qCTe: "0",
      qMDFe: "0",
      vCarga: parseFloat(formData.totalCargoValue || "0").toFixed(2),
      cUnid: formData.cargoUnitCode || "01", // 01-KG, 02-TON
      qCarga: parseFloat(formData.totalCargoWeight || "0").toFixed(3)
    }
  };

  const infDoc = generateInfDocJSON(formData);
  if (infDoc) {
    mdfeJSON.infDoc = infDoc;
  }

  // Adiciona autorizados apenas se houver
  if (formData.authorizedList && formData.authorizedList.length > 0) {
    mdfeJSON.autXML = formData.authorizedList
      .filter((autorizado: any) => autorizado && autorizado.document)
      .map((autorizado: any) => ({
        CNPJ: formatCNPJ(autorizado.document)
      }));
  }

  // Adiciona informações adicionais apenas se houver observações
  if (formData.notes && formData.notes.trim() !== "") {
    mdfeJSON.infAdic = {
      infCpl: formData.notes
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

function getCityCode(city: string, uf: string): string {
  // TODO: A API deve ter uma tabela completa de códigos de municípios do IBGE
  // Por enquanto, retorna um código genérico
  return '9999999';
}

// Gera a seção infModal em JSON para transporte rodoviário
// Apenas campos preenchidos são incluídos
function generateInfModalJSON(formData: MDFeFormData): any {
  if (formData.mdfeType === 'rodoviario') {
    // Monta veículo de tração (campos obrigatórios)
    const veicTracao: any = {
      cInt: "001",
      placa: formData.licensePlate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase(),
      RENAVAM: formData.renavam,
      tpRod: formData.wheelType || "01", // 01-Truck, 02-Toco, 03-Cavalo Mecânico, etc
      tpCar: formData.bodyType || "00", // 00-Não aplicável, 01-Aberta, 02-Fechada/Baú, etc
      UF: formData.vehicleState || formData.ownerState
    };

    // Adiciona tara apenas se preenchido
    if (formData.tareWeight && formData.tareWeight !== "0") {
      veicTracao.tara = formData.tareWeight;
    }

    // Adiciona capacidade em KG apenas se preenchido
    if (formData.capacityKg && formData.capacityKg !== "0") {
      veicTracao.capKG = formData.capacityKg;
    }

    // Adiciona capacidade em M3 apenas se preenchido
    if (formData.capacityM3 && formData.capacityM3 !== "0") {
      veicTracao.capM3 = formData.capacityM3;
    }

    // Adiciona condutores apenas se houver
    if (formData.selectedDrivers && formData.selectedDrivers.length > 0) {
      const validDrivers = formData.selectedDrivers
        .filter((driver: any) => {
          const name = driver?.name || driver?.nome || driver?.nomeCondutor;
          const cpf = driver?.cpf || driver?.cpfCondutor;
          return name && cpf;
        })
        .map((driver: any) => {
          const name = driver.name || driver.nome || driver.nomeCondutor;
          const cpf = driver.cpf || driver.cpfCondutor;
          return {
            xNome: name,
            CPF: formatCNPJ(cpf)
          };
        });
      
      // Só adiciona se houver condutores válidos
      if (validDrivers.length > 0) {
        veicTracao.condutor = validDrivers;
      }
    }

    // Adiciona proprietário apenas se não for o emitente
    if (formData.isOwnerNotIssuer && formData.ownerName) {
      const prop: any = {
        RNTRC: formData.rntrcCode || "",
        xNome: formData.ownerName,
        UF: formData.ownerState,
        tpProp: formData.ownerType || "0" // 0-TAC Agregado, 1-TAC Independente, 2-Outros
      };

      // Adiciona CPF ou CNPJ
      const cleanCpfCnpj = formatCNPJ(formData.ownerDocument);
      if (cleanCpfCnpj.length === 11) {
        prop.CPF = cleanCpfCnpj;
      } else if (cleanCpfCnpj.length === 14) {
        prop.CNPJ = cleanCpfCnpj;
      }

      // Adiciona IE apenas se preenchido
      if (formData.ownerStateRegistration) {
        prop.IE = formData.ownerStateRegistration;
      }

      veicTracao.prop = prop;
    }

    // Monta estrutura rodoviário
    const rodo: any = {
      veicTracao
    };

    // Adiciona RNTRC apenas se preenchido
    if (formData.rntrcCode) {
      rodo.infANTT = {
        RNTRC: formData.rntrcCode
      };
    }

    // Adiciona seguro dentro de rodo
    const seg = generateSegJSON(formData);
    if (seg.length > 0) {
      rodo.seg = seg;
    }

    // Adiciona lacres apenas se houver
    if (formData.sealList && formData.sealList.length > 0) {
      rodo.lacRodo = formData.sealList
        .filter((seal: any) => seal && seal.sealNumber)
        .map((seal: any) => ({
          nLacre: seal.sealNumber
        }));
    }

    // Informações de pagamento do frete (infPag)
    const infPag = generateInfPagJSON(formData);
    if (infPag.length > 0) {
      rodo.infPag = infPag;
    }

    // Adiciona vale pedágio apenas se houver
    if (formData.tollVoucherList && formData.tollVoucherList.length > 0) {
      rodo.infContratante = formData.tollVoucherList
        .filter((toll: any) => toll && toll.supplierCnpj && toll.responsibleDocument)
        .map((toll: any) => ({
          CNPJ: formatCNPJ(toll.supplierCnpj),
          infPag: [{
            xNome: toll.responsibleName || '',
            CPF: formatCNPJ(toll.responsibleDocument),
            vContrato: parseFloat(toll.voucherValue || "0").toFixed(2),
            indPag: (formData.paymentMethod || '').toLowerCase() === "credito" ? "0" : "1" // 0-Pagamento à Vista, 1-Pagamento à Prazo
          }]
        }));
    }

    // Adiciona CIOT apenas se houver
    if (formData.ciotList && formData.ciotList.length > 0) {
      rodo.infCIOT = formData.ciotList
        .filter((ciotItem: any) => ciotItem && ciotItem.ciotCode)
        .map((ciotItem: any) => ({
          CIOT: ciotItem.ciotCode,
          CPF: formatCNPJ(ciotItem.responsibleDocument || ''),
          CNPJ: undefined
        }));
    }

    return { rodo };
  }

  // TODO: Implementar para outros modais (aéreo, aquaviário, ferroviário)
  return {};
}

// Gera a seção infDoc em JSON com as notas fiscais e municípios de descarga
function generateInfDocJSON(formData: MDFeFormData): any {
  const notas = Array.isArray(formData.invoices) ? formData.invoices : [];
  if (notas.length === 0) {
    return null;
  }

  const citiesMap = new Map<
    string,
    {
      city: string;
      uf: string;
      codigoMunicipio?: string;
      nfes: Array<{ chNFe: string; indReentrega: string }>;
    }
  >();

  notas.forEach((nota: any) => {
    if (!nota || !nota.accessKey) {
      return;
    }

    const destinationUF =
      nota.recipientState ||
      nota.ufDestino ||
      nota.ufDestinatario ||
      formData.unloadingState;

    const destinationCity =
      nota.recipientCityName ||
      nota.destinatarioMunicipio ||
      nota.cidadeDestinatario ||
      formData.unloadingCity;

    const destinationCityCode =
      nota.recipientCityCode ||
      '';

    if (!destinationUF || !destinationCity) {
      return;
    }

    const key = `${destinationUF.toUpperCase()}-${destinationCity.toUpperCase()}`;

    if (!citiesMap.has(key)) {
      citiesMap.set(key, {
        city: destinationCity,
        uf: destinationUF,
        codigoMunicipio: destinationCityCode,
        nfes: []
      });
    }

    const indReentrega = nota.reinvoicingIndicator || '0';

    citiesMap.get(key)!.nfes.push({
      chNFe: nota.accessKey,
      indReentrega
    });
  });

  const unloadingCities = Array.from(citiesMap.values())
    .filter((item) => item.nfes.length > 0)
    .map((item) => ({
      cMunDescarga:
        item.codigoMunicipio ||
        getCityCode(item.city, item.uf),
      xMunDescarga: item.city,
      infNFe: item.nfes
    }));

  if (unloadingCities.length > 0) {
    return {
      infMunDescarga: unloadingCities
    };
  }

  // Fallback: usa município/UF configurados manualmente caso não existam dados nas notas
  if (formData.unloadingCity && formData.unloadingState) {
    const validInvoices = notas
      .filter((nota: any) => nota && nota.accessKey)
      .map((nota: any) => ({
        chNFe: nota.accessKey,
        indReentrega: nota.reinvoicingIndicator || '0'
      }));

    if (validInvoices.length > 0) {
      return {
        infMunDescarga: [
          {
            cMunDescarga: getCityCode(
              formData.unloadingCity,
              formData.unloadingState
            ),
            xMunDescarga: formData.unloadingCity,
            infNFe: validInvoices
          }
        ]
      };
    }
  }

  return null;
}

// Gera a seção de seguro em JSON
function generateSegJSON(formData: MDFeFormData): any[] {
  const responsible = (formData.insuranceResponsible || '').toLowerCase();
  const responsibleDocument = formatCNPJ(formData.insuranceResponsibleDocument);
  const insuranceCompanyDocument = formatCNPJ(formData.insuranceCompanyCnpj);

  const hasRequiredData =
    formData.insuranceCompanyName &&
    insuranceCompanyDocument &&
    formData.policyNumber &&
    responsibleDocument;

  if (!hasRequiredData) {
    return [];
  }

  const seg: any = {
    infResp: {
      respSeg: responsible.includes('contrat') ? '2' : '1'
    },
    infSeg: {
      xSeg: formData.insuranceCompanyName,
      CNPJ: insuranceCompanyDocument
    },
    nApol: formData.policyNumber
  };

  if (responsibleDocument.length === 11) {
    seg.infResp.CPF = responsibleDocument;
  } else if (responsibleDocument.length === 14) {
    seg.infResp.CNPJ = responsibleDocument;
  }

  // Adiciona averbações apenas se houver
  if (formData.endorsementList && formData.endorsementList.length > 0) {
    seg.nAver = formData.endorsementList
      .filter((endorsement: any) => endorsement && endorsement.numeroAverbacao)
      .map((endorsement: any) => endorsement.numeroAverbacao);
  }

  return [seg];
}

// Gera a seção de informações de pagamento do frete
function generateInfPagJSON(formData: MDFeFormData): any[] {
  if (!formData.paymentResponsibleName || !formData.paymentResponsibleDocument) {
    return [];
  }

  const responsibleDocument = formatCNPJ(formData.paymentResponsibleDocument);
  const contractValue = parseCurrency(formData.contractTotalValue || '0');
  const normalizedPaymentMethod = normalizeFormaPagamento(formData.paymentMethod || '');

  const infPag: any = {
    xNome: formData.paymentResponsibleName,
    comp: [
      {
        tpComp: '01',
        vComp: contractValue.toFixed(2)
      }
    ],
    vContrato: contractValue.toFixed(2),
    vPrest: contractValue.toFixed(2),
    indPag: normalizedPaymentMethod === 'avista' ? '0' : '1',
    infPrazo: []
  };

  if (responsibleDocument.length === 11) {
    infPag.CPF = responsibleDocument;
  } else if (responsibleDocument.length === 14) {
    infPag.CNPJ = responsibleDocument;
  }

  if (formData.bankNumber && formData.agencyNumber) {
    infPag.infBanc = {
      codBanco: formData.bankNumber,
      codAgencia: formData.agencyNumber
    };
  } else if (formData.pixKey) {
    infPag.infBanc = {
      chavePIX: formData.pixKey
    };
  } else if (formData.ipefCnpj) {
    infPag.infBanc = {
      CNPJIPEF: formatCNPJ(formData.ipefCnpj)
    };
  }

  return [infPag];
}

