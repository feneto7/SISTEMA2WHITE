import React, { useState } from 'react';
import { modalStyles } from '../../../../styles/modalStyles';
import { useClickSound } from '../../../../hooks/useClickSound';
import { DocumentsTab, TransportTab, DriversTab, RouteTab, FreightTab, InsuranceTab, TotalizersTab } from './components';

// New MDF-e modal
// Modularized component following project rules
interface NewMDFeProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mdfeData: any) => void;
}

type TabType = 'documents' | 'transport' | 'drivers' | 'route' | 'freight' | 'insurance' | 'totalizers';

type MDFeType = 'rodoviario' | 'aereo' | 'aquaviario' | 'ferroviario';

export function NewMDFe({ isOpen, onClose, onSave }: NewMDFeProps): JSX.Element | null {
  const playClickSound = useClickSound();
  const [activeTab, setActiveTab] = useState<TabType>('documents');
  const [mdfeType, setMdfeType] = useState<MDFeType>('rodoviario');
  const [formData, setFormData] = useState({
    // Documents data
    notasFiscais: [],
    documentosAnexos: [],
    observacoes: '',
    
    // Transport data
    veiculoSelecionado: '',
    placa: '',
    renavam: '',
    chassi: '',
    marca: '',
    modelo: '',
    anoFabricacao: '',
    anoModelo: '',
    cor: '',
    combustivel: '',
    capacidade: '',
    proprietario: '',
    cpfCnpjProprietario: '',
    enderecoProprietario: '',
    cidadeProprietario: '',
    ufProprietario: '',
    cepProprietario: '',
    // Campos adicionais do proprietário quando não é emitente
    rntrc: '',
    tipoProprietario: '',
    ie: '',
    ufProprietarioCompleto: '',
    
    // Condutores data
    condutoresSelecionados: [],
    condutorSelecionado: '',
    nomeCondutor: '',
    cpfCondutor: '',
    cnhCondutor: '',
    categoriaCnh: '',
    validadeCnh: '',
    telefoneCondutor: '',
    emailCondutor: '',
    enderecoCondutor: '',
    cidadeCondutor: '',
    ufCondutor: '',
    cepCondutor: '',
    
    // Route data
    municipioCarregamento: '',
    ufCarregamento: '',
    ufsPercurso: [],
    municipioDescarregamento: '',
    ufDescarregamento: '',
    
    // Freight data
    valePedagioList: [],
    categoriaVeicular: '',
    
    // Payment data
    nomeResponsavel: '',
    cpfCnpjResponsavel: '',
    valorTotalContrato: '',
    formaPagamento: '',
    numeroBanco: '',
    numeroAgencia: '',
    pix: '',
    cnpjIpef: '',
    
    // CIOT data
    ciotList: [],
    
    // Insurance data
    responsavelSeguro: '',
    cpfCnpjResponsavelSeguro: '',
    nomeSeguradora: '',
    cnpjSeguradora: '',
    numeroApolice: '',
    averbacaoList: [],
    exibirDadosSeguro: false,
    
    // Totalizers data
    qntTotalNFe: '',
    valorTotalCarga: '',
    codUnidadeMedidaCarga: '',
    pesoTotalCarga: '',
    lacreList: [],
    autorizadoList: [],
    notasSemPesoBruto: [],
    
    // Product data
    tipoCarga: '',
    descricaoProduto: '',
    gtin: '',
    codigoNCM: '',
    cepLocalCarregamento: '',
    cepLocalDescarregamento: '',
    
    // MDF-e basic data
    tipoMDFe: 'rodoviario',
    numero: '',
    serie: '001',
    chave: '',
    emitente: '',
    destinatario: '',
    valor: 0,
    status: 'pendente',
    dataEmissao: new Date().toISOString().split('T')[0]
  });

  // Function to close modal
  const handleClose = () => {
    setFormData({
      notasFiscais: [],
      documentosAnexos: [],
      observacoes: '',
      veiculoSelecionado: '',
      placa: '',
      renavam: '',
      chassi: '',
      marca: '',
      modelo: '',
      anoFabricacao: '',
      anoModelo: '',
      cor: '',
      combustivel: '',
      capacidade: '',
      proprietario: '',
      cpfCnpjProprietario: '',
      enderecoProprietario: '',
      cidadeProprietario: '',
      ufProprietario: '',
      cepProprietario: '',
      rntrc: '',
      tipoProprietario: '',
      ie: '',
      ufProprietarioCompleto: '',
      condutoresSelecionados: [],
      condutorSelecionado: '',
      nomeCondutor: '',
      cpfCondutor: '',
      cnhCondutor: '',
      categoriaCnh: '',
      validadeCnh: '',
      telefoneCondutor: '',
      emailCondutor: '',
      enderecoCondutor: '',
      cidadeCondutor: '',
      ufCondutor: '',
      cepCondutor: '',
      municipioCarregamento: '',
      ufCarregamento: '',
      ufsPercurso: [],
      municipioDescarregamento: '',
      ufDescarregamento: '',
      valePedagioList: [],
      categoriaVeicular: '',
      nomeResponsavel: '',
      cpfCnpjResponsavel: '',
      valorTotalContrato: '',
      formaPagamento: '',
      numeroBanco: '',
      numeroAgencia: '',
      pix: '',
      cnpjIpef: '',
      ciotList: [],
      responsavelSeguro: '',
      cpfCnpjResponsavelSeguro: '',
      nomeSeguradora: '',
      cnpjSeguradora: '',
      numeroApolice: '',
      averbacaoList: [],
      exibirDadosSeguro: false,
      qntTotalNFe: '',
      valorTotalCarga: '',
      codUnidadeMedidaCarga: '',
      pesoTotalCarga: '',
      lacreList: [],
      autorizadoList: [],
      notasSemPesoBruto: [],
      tipoCarga: '',
      descricaoProduto: '',
      gtin: '',
      codigoNCM: '',
      cepLocalCarregamento: '',
      cepLocalDescarregamento: '',
      tipoMDFe: 'rodoviario',
      numero: '',
      serie: '001',
      chave: '',
      emitente: '',
      destinatario: '',
      valor: 0,
      status: 'pendente',
      dataEmissao: new Date().toISOString().split('T')[0]
    });
    setMdfeType('rodoviario');
    setActiveTab('documents');
    onClose();
  };

  // Function to save MDF-e
  const handleSave = () => {
    // TODO: Implement validation and saving
    console.log('Saving new MDF-e:', formData);
    onSave(formData);
    handleClose();
  };

  // Function to update form data
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Function to change MDF-e type
  const handleMDFeTypeChange = (newType: MDFeType) => {
    setMdfeType(newType);
    setFormData(prev => ({ ...prev, tipoMDFe: newType }));
  };

  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay} onClick={handleClose}>
      <div style={modalStyles.container} onClick={(e) => e.stopPropagation()}>
        {/* Modal header */}
        <div style={modalStyles.header}>
          <div style={modalStyles.trafficLights}>
            <div style={{...modalStyles.trafficLight, ...modalStyles.trafficLightRed}} onClick={handleClose}></div>
            <div style={{...modalStyles.trafficLight, ...modalStyles.trafficLightYellow}}></div>
            <div style={{...modalStyles.trafficLight, ...modalStyles.trafficLightGreen}}></div>
          </div>
          <div style={modalStyles.title}>Nova MDF-e</div>
          <div style={{ width: '60px' }}></div>
        </div>

        {/* Seletor de tipo de MDF-e */}
        <div style={modalStyles.typeSelector}>
          <label style={modalStyles.typeLabel}>Tipo de MDF-e</label>
          <div style={modalStyles.checkboxGroup}>
            <div 
              style={modalStyles.checkboxItem}
              onClick={() => handleMDFeTypeChange('rodoviario')}
            >
              <div style={{
                ...modalStyles.checkbox,
                ...(mdfeType === 'rodoviario' ? modalStyles.checkboxChecked : {})
              }}>
                {mdfeType === 'rodoviario' && <div style={modalStyles.checkboxDot}></div>}
              </div>
              <span style={modalStyles.checkboxLabel}>Rodoviário</span>
            </div>
            <div 
              style={modalStyles.checkboxItem}
              onClick={() => handleMDFeTypeChange('aereo')}
            >
              <div style={{
                ...modalStyles.checkbox,
                ...(mdfeType === 'aereo' ? modalStyles.checkboxChecked : {})
              }}>
                {mdfeType === 'aereo' && <div style={modalStyles.checkboxDot}></div>}
              </div>
              <span style={modalStyles.checkboxLabel}>Aéreo</span>
            </div>
            <div 
              style={modalStyles.checkboxItem}
              onClick={() => handleMDFeTypeChange('aquaviario')}
            >
              <div style={{
                ...modalStyles.checkbox,
                ...(mdfeType === 'aquaviario' ? modalStyles.checkboxChecked : {})
              }}>
                {mdfeType === 'aquaviario' && <div style={modalStyles.checkboxDot}></div>}
              </div>
              <span style={modalStyles.checkboxLabel}>Aquaviário</span>
            </div>
            <div 
              style={modalStyles.checkboxItem}
              onClick={() => handleMDFeTypeChange('ferroviario')}
            >
              <div style={{
                ...modalStyles.checkbox,
                ...(mdfeType === 'ferroviario' ? modalStyles.checkboxChecked : {})
              }}>
                {mdfeType === 'ferroviario' && <div style={modalStyles.checkboxDot}></div>}
              </div>
              <span style={modalStyles.checkboxLabel}>Ferroviário</span>
            </div>
          </div>
        </div>

        {/* Tab system */}
        <div style={modalStyles.tabsContainer}>
          <button
            style={{
              ...modalStyles.tab,
              ...(activeTab === 'documents' ? modalStyles.tabActive : {})
            }}
            onClick={() => {
              playClickSound();
              setActiveTab('documents');
            }}
          >
            Documentos
          </button>
          <button
            style={{
              ...modalStyles.tab,
              ...(activeTab === 'transport' ? modalStyles.tabActive : {})
            }}
            onClick={() => {
              playClickSound();
              setActiveTab('transport');
            }}
          >
            Transporte
          </button>
          <button
            style={{
              ...modalStyles.tab,
              ...(activeTab === 'drivers' ? modalStyles.tabActive : {})
            }}
            onClick={() => {
              playClickSound();
              setActiveTab('drivers');
            }}
          >
            Condutores
          </button>
          <button
            style={{
              ...modalStyles.tab,
              ...(activeTab === 'route' ? modalStyles.tabActive : {})
            }}
            onClick={() => {
              playClickSound();
              setActiveTab('route');
            }}
          >
            Rota
          </button>
          <button
            style={{
              ...modalStyles.tab,
              ...(activeTab === 'freight' ? modalStyles.tabActive : {})
            }}
            onClick={() => {
              playClickSound();
              setActiveTab('freight');
            }}
          >
            Frete
          </button>
          <button
            style={{
              ...modalStyles.tab,
              ...(activeTab === 'insurance' ? modalStyles.tabActive : {})
            }}
            onClick={() => {
              playClickSound();
              setActiveTab('insurance');
            }}
          >
            Seguro
          </button>
          <button
            style={{
              ...modalStyles.tab,
              ...(activeTab === 'totalizers' ? modalStyles.tabActive : {})
            }}
            onClick={() => {
              playClickSound();
              setActiveTab('totalizers');
            }}
          >
            Totalizadores
          </button>
        </div>

        {/* Tab content */}
        <div style={modalStyles.tabContent}>
          {activeTab === 'documents' && (
            <DocumentsTab
              formData={formData}
              onUpdateFormData={updateFormData}
            />
          )}

          {activeTab === 'transport' && (
            <TransportTab
              formData={formData}
              onUpdateFormData={updateFormData}
            />
          )}

          {activeTab === 'drivers' && (
            <DriversTab
              formData={formData}
              onUpdateFormData={updateFormData}
            />
          )}

          {activeTab === 'route' && (
            <RouteTab
              formData={formData}
              onUpdateFormData={updateFormData}
            />
          )}

          {activeTab === 'freight' && (
            <FreightTab
              formData={formData}
              onUpdateFormData={updateFormData}
            />
          )}

          {activeTab === 'insurance' && (
            <InsuranceTab
              formData={formData}
              onUpdateFormData={updateFormData}
            />
          )}

          {activeTab === 'totalizers' && (
            <TotalizersTab
              formData={formData}
              onUpdateFormData={updateFormData}
            />
          )}
        </div>

        {/* Modal footer */}
        <div style={modalStyles.footer}>
          <button
            style={modalStyles.button}
            onClick={handleClose}
          >
            Cancelar
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={{
                ...modalStyles.button,
                background: 'linear-gradient(to bottom, #34C759, #28A745)',
                color: 'white',
                border: '1px solid #34C759',
                boxShadow: '0 1px 2px rgba(52, 199, 89, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
              onClick={() => {
                playClickSound();
                // TODO: Implementar validação do MDF-e
                console.log('Validando MDF-e:', formData);
              }}
            >
              Validar
            </button>
            <button
              style={{
                ...modalStyles.button,
                ...modalStyles.buttonPrimary
              }}
              onClick={() => {
                playClickSound();
                handleSave();
              }}
            >
              Criar MDF-e
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
