import React, { useState, useRef, useEffect } from 'react';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { AddButton } from '../../../../../components/AddButton/AddButton';
import { GenerateCIOTModal } from './GenerateCIOTModal';
import { formatCpfOrCnpj } from '../../../../../utils/documentFormatter';

// Freight tab for NewMDFe modal
// Handles freight information and toll vouchers
interface FreightTabProps {
  formData: any;
  onUpdateFormData: (field: string, value: any) => void;
}

interface TollVoucher {
  id: string;
  cnpjFornecedor: string;
  numeroComprovante: string;
  valorVale: string;
  cpfCnpjResponsavel: string;
}

interface CIOT {
  id: string;
  ciot: string;
  cpfCnpjResponsavel: string;
}

export function FreightTab({ formData, onUpdateFormData }: FreightTabProps): JSX.Element {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [valePedagioList, setValePedagioList] = useState<TollVoucher[]>([]);
  const [currentValePedagio, setCurrentValePedagio] = useState<TollVoucher>({
    id: '',
    cnpjFornecedor: '',
    numeroComprovante: '',
    valorVale: '',
    cpfCnpjResponsavel: ''
  });
  const [ciotList, setCiotList] = useState<CIOT[]>([]);
  const [currentCiot, setCurrentCiot] = useState<CIOT>({
    id: '',
    ciot: '',
    cpfCnpjResponsavel: ''
  });
  const [isGenerateCIOTModalOpen, setIsGenerateCIOTModalOpen] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);


  // Sincroniza listas com formData quando o componente monta ou quando muda
  useEffect(() => {
    if (formData.valePedagioList && Array.isArray(formData.valePedagioList)) {
      setValePedagioList(formData.valePedagioList);
    }
    if (formData.ciotList && Array.isArray(formData.ciotList)) {
      setCiotList(formData.ciotList);
    }
  }, [formData.valePedagioList, formData.ciotList]);

  // Categorias de combinação veicular
  const categoriasVeiculares = [
    'Veículo Comercial 2 eixos',
    'Veículo Comercial 3 eixos',
    'Veículo Comercial 4 eixos',
    'Veículo Comercial 5 eixos',
    'Veículo Comercial 6 eixos',
    'Veículo Comercial 7 eixos',
    'Veículo Comercial 8 eixos',
    'Veículo Comercial 9 eixos',
    'Veículo Comercial 10 eixos',
    'Veículo Comercial Acima de 10 eixos'
  ];

  const handleInputChange = (field: string, value: string) => {
    onUpdateFormData(field, value);
  };

  const handleInputFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleInputBlur = () => {
    setFocusedField(null);
  };

  const getInputStyle = (field: string) => {
    const baseStyle = systemStyles.input.field;
    // Estilos de foco são aplicados globalmente via CSS
    const focusStyle = {};
    return { ...baseStyle, ...focusStyle };
  };

  // Funções para gerenciar vale pedágio
  const handleValePedagioChange = (field: keyof TollVoucher, value: string) => {
    setCurrentValePedagio(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddValePedagio = () => {
    playClickSound();
    if (currentValePedagio.cnpjFornecedor && currentValePedagio.numeroComprovante && 
        currentValePedagio.valorVale && currentValePedagio.cpfCnpjResponsavel) {
      const newVale: TollVoucher = {
        ...currentValePedagio,
        id: Date.now().toString()
      };
      setValePedagioList(prev => [...prev, newVale]);
      setCurrentValePedagio({
        id: '',
        cnpjFornecedor: '',
        numeroComprovante: '',
        valorVale: '',
        cpfCnpjResponsavel: ''
      });
      onUpdateFormData('valePedagioList', [...valePedagioList, newVale]);
    }
  };

  const handleRemoveValePedagio = (id: string) => {
    playClickSound();
    const updatedList = valePedagioList.filter(vale => vale.id !== id);
    setValePedagioList(updatedList);
    onUpdateFormData('valePedagioList', updatedList);
  };

  // Funções para gerenciar CIOT
  const handleCiotChange = (field: keyof CIOT, value: string) => {
    setCurrentCiot(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddCiot = () => {
    playClickSound();
    if (currentCiot.ciot && currentCiot.cpfCnpjResponsavel) {
      const newCiot: CIOT = {
        ...currentCiot,
        id: Date.now().toString()
      };
      setCiotList(prev => [...prev, newCiot]);
      setCurrentCiot({
        id: '',
        ciot: '',
        cpfCnpjResponsavel: ''
      });
      onUpdateFormData('ciotList', [...ciotList, newCiot]);
    }
  };

  const handleRemoveCiot = (id: string) => {
    playClickSound();
    const updatedList = ciotList.filter(ciot => ciot.id !== id);
    setCiotList(updatedList);
    onUpdateFormData('ciotList', updatedList);
  };

  // Funções para controlar o modal de geração de CIOT
  const handleOpenGenerateCIOTModal = () => {
    playClickSound();
    setIsGenerateCIOTModalOpen(true);
  };

  const handleCloseGenerateCIOTModal = () => {
    playClickSound();
    setIsGenerateCIOTModalOpen(false);
  };

  const handleSaveGeneratedCIOT = (ciotData: any) => {
    playClickSound();
    // Aqui você pode processar os dados do CIOT gerado
    console.log('CIOT gerado:', ciotData);
    // Por exemplo, adicionar à lista de CIOTs
    const newCiot: CIOT = {
      id: Date.now().toString(),
      ciot: ciotData.ciot || 'CIOT-' + Date.now(),
      cpfCnpjResponsavel: ciotData.cpfCnpjContratado || ''
    };
    setCiotList(prev => [...prev, newCiot]);
    onUpdateFormData('ciotList', [...ciotList, newCiot]);
  };

  const styles = {
    container: {
      height: '100%',
      overflow: 'auto' as const,
      padding: '20px'
    },
    section: {
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: systemColors.text.primary,
      margin: '0 0 16px 0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
      borderBottom: `1px solid ${systemColors.border.light}`,
      paddingBottom: '8px'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '16px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '6px'
    },
    formGroupFull: {
      gridColumn: '1 / -1'
    },
    valePedagioFormGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
      gap: '16px',
      marginBottom: '16px',
      alignItems: 'end'
    },
    ciotFormGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr auto',
      gap: '16px',
      marginBottom: '16px',
      alignItems: 'end'
    },
    valePedagioList: {
      marginTop: '16px',
      padding: '12px',
      background: systemColors.background.content,
      borderRadius: '6px',
      border: `1px solid ${systemColors.border.light}`
    },
    ciotList: {
      marginTop: '16px',
      padding: '12px',
      background: systemColors.background.content,
      borderRadius: '6px',
      border: `1px solid ${systemColors.border.light}`
    },
    valePedagioItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px',
      background: systemColors.background.primary,
      borderRadius: '4px',
      marginBottom: '8px',
      fontSize: '12px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    ciotItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px',
      background: systemColors.background.primary,
      borderRadius: '4px',
      marginBottom: '8px',
      fontSize: '12px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    removeButton: {
      width: '20px',
      height: '20px',
      borderRadius: '4px',
      border: `1px solid ${systemColors.border.light}`,
      background: systemColors.background.primary,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: systemColors.text.primary,
      fontSize: '10px',
      fontWeight: 'bold'
    },
    newCiotButton: {
      ...systemStyles.button.primary,
      padding: '8px 16px',
      textTransform: 'uppercase' as const
    },
    label: systemStyles.input.label
  };

  return (
    <div ref={formContainerRef} className="scrollbar-modal" style={styles.container}>
      {/* Seção de Vale Pedágio */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Vale Pedágio</h4>
        
        {/* Formulário para adicionar vale pedágio */}
        <div style={styles.valePedagioFormGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>CNPJ da Empresa Fornecedora do Vale Pedágio</label>
            <input
              type="text"
              style={getInputStyle('cnpjFornecedor')}
              value={currentValePedagio.cnpjFornecedor}
              onChange={(e) => handleValePedagioChange('cnpjFornecedor', formatCpfOrCnpj(e.target.value))}
              onFocus={() => handleInputFocus('cnpjFornecedor')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="00.000.000/0000-00"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Número do Comprovante de Compra</label>
            <input
              type="text"
              style={getInputStyle('numeroComprovante')}
              value={currentValePedagio.numeroComprovante}
              onChange={(e) => handleValePedagioChange('numeroComprovante', e.target.value)}
              onFocus={() => handleInputFocus('numeroComprovante')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="123456789"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Valor do Vale Pedágio</label>
            <input
              type="text"
              style={getInputStyle('valorVale')}
              value={currentValePedagio.valorVale}
              onChange={(e) => handleValePedagioChange('valorVale', e.target.value)}
              onFocus={() => handleInputFocus('valorVale')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="R$ 0,00"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>CPF/CNPJ Responsável pelo Pagamento</label>
            <input
              type="text"
              style={getInputStyle('cpfCnpjResponsavel')}
              value={currentValePedagio.cpfCnpjResponsavel}
              onChange={(e) => handleValePedagioChange('cpfCnpjResponsavel', formatCpfOrCnpj(e.target.value))}
              onFocus={() => handleInputFocus('cpfCnpjResponsavel')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="000.000.000-00"
            />
          </div>
          <div style={styles.formGroup}>
            <AddButton onClick={handleAddValePedagio} label="Adicionar Vale Pedágio" />
          </div>
        </div>

        {/* Lista de vales pedágio adicionados */}
        {valePedagioList.length > 0 && (
          <div style={styles.valePedagioList}>
            <div style={{fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)'}}>
              Vales Pedágio Adicionados:
            </div>
            {valePedagioList.map((vale) => (
              <div key={vale.id} style={styles.valePedagioItem}>
                <div>
                  <strong>CNPJ:</strong> {vale.cnpjFornecedor} | 
                  <strong> Comprovante:</strong> {vale.numeroComprovante} | 
                  <strong> Valor:</strong> {vale.valorVale} | 
                  <strong> Responsável:</strong> {vale.cpfCnpjResponsavel}
                </div>
                <button
                  style={styles.removeButton}
                  onClick={() => handleRemoveValePedagio(vale.id)}
                  title="Remover vale pedágio"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Campo de categoria de combinação veicular */}
        <div style={{marginTop: '16px'}}>
          <label style={styles.label}>Categoria de Combinação Veicular</label>
          <div style={{ position: 'relative' }}>
            <select
              style={{
                ...systemStyles.select.field,
                appearance: 'none' as const,
                WebkitAppearance: 'none' as const,
                MozAppearance: 'none' as const
              }}
              value={formData.categoriaVeicular || ''}
              onChange={(e) => {
                playClickSound();
                handleInputChange('categoriaVeicular', e.target.value);
              }}
              onFocus={() => handleInputFocus('categoriaVeicular')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
            >
              <option value="">Selecione a categoria</option>
              {categoriasVeiculares.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
            <div style={systemStyles.select.arrow}>
              <div style={systemStyles.select.arrowIcon}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Informações de Pagamento */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Informações de Pagamento</h4>
        
        {/* Dados básicos do responsável */}
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nome do Responsável</label>
            <input
              type="text"
              style={getInputStyle('nomeResponsavel')}
              value={formData.nomeResponsavel || ''}
              onChange={(e) => handleInputChange('nomeResponsavel', e.target.value)}
              onFocus={() => handleInputFocus('nomeResponsavel')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="Nome completo do responsável"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>CPF/CNPJ</label>
            <input
              type="text"
              style={getInputStyle('cpfCnpjResponsavel')}
              value={formData.cpfCnpjResponsavel || ''}
              onChange={(e) => handleInputChange('cpfCnpjResponsavel', formatCpfOrCnpj(e.target.value))}
              onFocus={() => handleInputFocus('cpfCnpjResponsavel')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="000.000.000-00"
            />
          </div>
        </div>

        {/* Componentes do Pagamento do Frete */}
        <div style={{marginTop: '20px'}}>
          <h5 style={{...styles.sectionTitle, fontSize: '13px', marginBottom: '12px'}}>
            Componentes do Pagamento do Frete
          </h5>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Valor Total do Contrato</label>
              <input
                type="text"
                style={getInputStyle('valorTotalContrato')}
                value={formData.valorTotalContrato || ''}
                onChange={(e) => handleInputChange('valorTotalContrato', e.target.value)}
                onFocus={() => handleInputFocus('valorTotalContrato')}
                onBlur={handleInputBlur}
                onClick={() => playClickSound()}
                placeholder="R$ 0,00"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Forma de Pagamento</label>
              <div style={{ position: 'relative' }}>
                <select
                  style={{
                    ...systemStyles.select.field,
                    appearance: 'none' as const,
                    WebkitAppearance: 'none' as const,
                    MozAppearance: 'none' as const
                  }}
                  value={formData.formaPagamento || ''}
                  onChange={(e) => {
                    playClickSound();
                    handleInputChange('formaPagamento', e.target.value);
                  }}
                  onFocus={() => handleInputFocus('formaPagamento')}
                  onBlur={handleInputBlur}
                  onClick={() => playClickSound()}
                >
                  <option value="">Selecione a forma de pagamento</option>
                  <option value="À Vista">À Vista</option>
                  <option value="À Prazo">À Prazo</option>
                </select>
                <div style={systemStyles.select.arrow}>
                  <div style={systemStyles.select.arrowIcon}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pagamento à Prazo */}
        <div style={{marginTop: '20px'}}>
          <h5 style={{...styles.sectionTitle, fontSize: '13px', marginBottom: '12px'}}>
            Pagamento à Prazo
          </h5>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Número do Banco</label>
              <input
                type="text"
                style={getInputStyle('numeroBanco')}
                value={formData.numeroBanco || ''}
                onChange={(e) => handleInputChange('numeroBanco', e.target.value)}
                onFocus={() => handleInputFocus('numeroBanco')}
                onBlur={handleInputBlur}
                onClick={() => playClickSound()}
                placeholder="001"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Número da Agência</label>
              <input
                type="text"
                style={getInputStyle('numeroAgencia')}
                value={formData.numeroAgencia || ''}
                onChange={(e) => handleInputChange('numeroAgencia', e.target.value)}
                onFocus={() => handleInputFocus('numeroAgencia')}
                onBlur={handleInputBlur}
                onClick={() => playClickSound()}
                placeholder="1234"
              />
            </div>
          </div>
        </div>

        {/* PIX */}
        <div style={{marginTop: '20px'}}>
          <div style={styles.formGroup}>
            <label style={styles.label}>PIX</label>
            <input
              type="text"
              style={getInputStyle('pix')}
              value={formData.pix || ''}
              onChange={(e) => handleInputChange('pix', e.target.value)}
              onFocus={() => handleInputFocus('pix')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="Chave PIX"
            />
            <div style={{
              fontSize: '11px',
              color: '#ff3b30',
              marginTop: '4px',
              fontStyle: 'italic',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
            }}>
              Pode ser email, CPF/CNPJ (somente números), Telefone com a seguinte formatação (+5599999999999) ou a chave aleatória gerada pela instituição.
            </div>
          </div>
        </div>

        {/* CNPJ da IPEF */}
        <div style={{marginTop: '20px'}}>
          <div style={styles.formGroup}>
            <label style={styles.label}>CNPJ da IPEF (Instituição de Pagamento Eletrônico do Frete)</label>
            <input
              type="text"
              style={getInputStyle('cnpjIpef')}
              value={formData.cnpjIpef || ''}
              onChange={(e) => handleInputChange('cnpjIpef', formatCpfOrCnpj(e.target.value))}
              onFocus={() => handleInputFocus('cnpjIpef')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="00.000.000/0000-00"
            />
            <div style={{
              fontSize: '11px',
              color: '#ff3b30',
              marginTop: '4px',
              fontStyle: 'italic',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
            }}>
              Informar CNPJ da Instituição de Pagamento Eletrônico do Frete somente na ausência dos campos Número do Banco, Agência ou PIX
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Código Identificador da Operação de Transporte (CIOT) */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Código Identificador da Operação de Transporte (CIOT)</h4>
        
        {/* Formulário para adicionar CIOT */}
        <div style={styles.ciotFormGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>CIOT</label>
            <input
              type="text"
              style={getInputStyle('ciot')}
              value={currentCiot.ciot}
              onChange={(e) => handleCiotChange('ciot', e.target.value)}
              onFocus={() => handleInputFocus('ciot')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="12345678901234567890"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>CPF/CNPJ Responsável pela geração do CIOT</label>
            <input
              type="text"
              style={getInputStyle('cpfCnpjResponsavelCiot')}
              value={currentCiot.cpfCnpjResponsavel}
              onChange={(e) => handleCiotChange('cpfCnpjResponsavel', formatCpfOrCnpj(e.target.value))}
              onFocus={() => handleInputFocus('cpfCnpjResponsavelCiot')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="000.000.000-00"
            />
          </div>
          <div style={styles.formGroup}>
            <AddButton onClick={handleAddCiot} label="Adicionar CIOT" />
          </div>
        </div>

        {/* Lista de CIOTs adicionados */}
        {ciotList.length > 0 && (
          <div style={styles.ciotList}>
            <div style={{fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)'}}>
              CIOTs Adicionados:
            </div>
            {ciotList.map((ciot) => (
              <div key={ciot.id} style={styles.ciotItem}>
                <div>
                  <strong>CIOT:</strong> {ciot.ciot} | 
                  <strong> CPF/CNPJ:</strong> {ciot.cpfCnpjResponsavel}
                </div>
                <button
                  style={styles.removeButton}
                  onClick={() => handleRemoveCiot(ciot.id)}
                  title="Remover CIOT"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Botão Novo CIOT */}
        <div style={{marginTop: '16px', display: 'flex', justifyContent: 'flex-start'}}>
          <button
            style={styles.newCiotButton}
            onClick={handleOpenGenerateCIOTModal}
            title="Gerar novo CIOT"
          >
            Novo CIOT
          </button>
        </div>
      </div>

      {/* Modal de Geração de CIOT */}
      <GenerateCIOTModal
        isOpen={isGenerateCIOTModalOpen}
        onClose={handleCloseGenerateCIOTModal}
        onSave={handleSaveGeneratedCIOT}
      />
    </div>
  );
}
