import React, { useState, useRef, useEffect } from 'react';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { AddButton } from '../../../../../components/AddButton/AddButton';
import { formatCpfOrCnpj } from '../../../../../utils/documentFormatter';
import {
  formatQuantityByUnitType,
  getQuantityPlaceholderByUnitType,
  normalizeUnitType
} from '../../../../../utils/quantityFormater';

// Totalizers tab for NewMDFe modal
// Handles totals, seals and authorized downloads
interface TotalizersTabProps {
  formData: any;
  onUpdateFormData: (field: string, value: any) => void;
}

interface Seal {
  id: string;
  sealNumber: string;
}

interface AuthorizedDownload {
  id: string;
  document: string;
}

export function TotalizersTab({ formData, onUpdateFormData }: TotalizersTabProps): JSX.Element {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [sealList, setSealList] = useState<Seal[]>([]);
  const [currentSeal, setCurrentSeal] = useState<Seal>({
    id: '',
    sealNumber: ''
  });
  const [authorizedList, setAuthorizedList] = useState<AuthorizedDownload[]>([]);
  const [currentAuthorized, setCurrentAuthorized] = useState<AuthorizedDownload>({
    id: '',
    document: ''
  });
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Mapeia código SEFAZ -> tipo de unidade ('0' fracionado, '1' inteiro)
  const getUnitTypeFromCode = (code?: string): string => {
    const fractional = new Set(['01', '02', '04', '05', '06']); // KG, TON, M3, LTR, MMBTU
    if (!code) return '1';
    return fractional.has(code) ? '0' : '1'; // '03' (UN) é inteiro
  };

  const currentUnitType = normalizeUnitType(getUnitTypeFromCode(formData.cargoUnitCode));

  // Sincroniza listas com formData quando o componente monta ou quando muda
  useEffect(() => {
    if (formData.sealList && Array.isArray(formData.sealList)) {
      setSealList(formData.sealList);
    }
    if (formData.authorizedList && Array.isArray(formData.authorizedList)) {
      setAuthorizedList(formData.authorizedList);
    }
  }, [formData.sealList, formData.authorizedList]);

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

  // Funções para gerenciar lacres
  const handleSealChange = (field: keyof Seal, value: string) => {
    setCurrentSeal(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSeal = () => {
    playClickSound();
    if (currentSeal.sealNumber) {
      const newSeal: Seal = {
        ...currentSeal,
        id: Date.now().toString()
      };
      setSealList(prev => [...prev, newSeal]);
      onUpdateFormData('sealList', [...sealList, newSeal]);
      setCurrentSeal({
        id: '',
        sealNumber: ''
      });
    }
  };

  const handleRemoveSeal = (id: string) => {
    playClickSound();
    const updatedList = sealList.filter(seal => seal.id !== id);
    setSealList(updatedList);
    onUpdateFormData('sealList', updatedList);
  };

  // Funções para gerenciar autorizados para download
  const handleAuthorizedChange = (field: keyof AuthorizedDownload, value: string) => {
    setCurrentAuthorized(prev => ({
      ...prev,
      [field]: field === 'document' ? formatCpfOrCnpj(value) : value
    }));
  };

  const handleAddAuthorized = () => {
    playClickSound();
    if (currentAuthorized.document) {
      const newAuthorized: AuthorizedDownload = {
        ...currentAuthorized,
        id: Date.now().toString()
      };
      setAuthorizedList(prev => [...prev, newAuthorized]);
      onUpdateFormData('authorizedList', [...authorizedList, newAuthorized]);
      setCurrentAuthorized({
        id: '',
        document: ''
      });
    }
  };

  const handleRemoveAuthorized = (id: string) => {
    playClickSound();
    const updatedList = authorizedList.filter(authorized => authorized.id !== id);
    setAuthorizedList(updatedList);
    onUpdateFormData('authorizedList', updatedList);
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
    lacreFormGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: '16px',
      marginBottom: '16px',
      alignItems: 'end'
    },
    autorizadoFormGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: '16px',
      marginBottom: '16px',
      alignItems: 'end'
    },
    lacreList: {
      marginTop: '16px',
      padding: '12px',
      background: systemColors.background.content,
      borderRadius: '6px',
      border: `1px solid ${systemColors.border.light}`,
      minHeight: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '600',
      color: systemColors.text.secondary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const
    },
    autorizadoList: {
      marginTop: '16px',
      padding: '12px',
      background: systemColors.background.content,
      borderRadius: '6px',
      border: `1px solid ${systemColors.border.light}`,
      minHeight: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '600',
      color: systemColors.text.secondary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const
    },
    lacreItem: {
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
    autorizadoItem: {
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
    warningMessage: {
      fontSize: '12px',
      color: '#ff3b30',
      fontWeight: '500',
      marginTop: '8px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      fontStyle: 'italic'
    },
    searchIcon: {
      width: '16px',
      height: '16px',
      cursor: 'pointer',
      color: systemColors.text.secondary,
      marginLeft: '8px'
    },
    textarea: {
      ...systemStyles.input.field,
      height: 'auto',
      minHeight: '60px',
      resize: 'vertical' as const
    },
    select: {
      ...systemStyles.select.field,
      cursor: 'pointer'
    },
    label: systemStyles.input.label
  };

  return (
    <div ref={formContainerRef} className="scrollbar-modal" style={styles.container}>
      {/* Seção de Totais de Fornecimento */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Totais de Fornecimento</h4>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Qnt. total de NF-e relacionadas</label>
            <input
              type="text"
              style={getInputStyle('totalInvoicesCount')}
              value={formData.totalInvoicesCount || ''}
              onChange={(e) => handleInputChange('totalInvoicesCount', e.target.value)}
              onFocus={() => handleInputFocus('totalInvoicesCount')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="1"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Valor Total da Carga</label>
            <input
              type="text"
              style={getInputStyle('totalCargoValue')}
              value={formData.totalCargoValue || ''}
              onChange={(e) => handleInputChange('totalCargoValue', e.target.value)}
              onFocus={() => handleInputFocus('totalCargoValue')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="0,00"
            />
            {/* Mensagem de aviso sobre peso bruto - só aparece após importar nota sem peso */}
            {formData.invoicesWithoutGrossWeight && formData.invoicesWithoutGrossWeight.length > 0 && (
              <div style={styles.warningMessage}>
                A(s) nota(s) {formData.invoicesWithoutGrossWeight.join(',')}, não contém peso bruto informado, o Peso Total da Carga será divergente!
              </div>
            )}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Cod. Unidade de Medida da Carga</label>
            <div style={{ position: 'relative' as const }}>
              <select
                style={{
                  ...styles.select,
                  appearance: 'none' as const,
                  WebkitAppearance: 'none' as const,
                  MozAppearance: 'none' as const
                }}
                value={(() => {
                  const mapInv: Record<string, string> = {
                    '01': 'KG',
                    '02': 'TON',
                    '03': 'UN',
                    '04': 'M3',
                    '05': 'LTR',
                    '06': 'MMBTU'
                  };
                  return mapInv[formData.cargoUnitCode] || '';
                })()}
                onChange={(e) => {
                  playClickSound();
                  const map: Record<string, string> = {
                    'KG': '01',
                    'TON': '02',
                    'UN': '03',
                    'M3': '04',
                    'LTR': '05',
                    'MMBTU': '06'
                  };
                  const sigla = e.target.value;
                  const codigo = map[sigla] || '';
                  // Atualiza código e limpa o campo de peso para evitar formatos inconsistentes ao trocar unidade
                  handleInputChange('cargoUnitCode', codigo);
                  handleInputChange('totalCargoWeight', '');
                }}
                onFocus={() => handleInputFocus('codUnidadeMedidaCarga')}
                onBlur={handleInputBlur}
                onClick={() => playClickSound()}
              >
                <option value="">Selecione</option>
                <option value="KG">KG</option>
                <option value="TON">TON</option>
                <option value="UN">UN</option>
                <option value="M3">M3</option>
                <option value="LTR">LTR</option>
                <option value="MMBTU">MMBTU</option>
              </select>
              <div style={systemStyles.select.arrow}>
                <div style={systemStyles.select.arrowIcon}></div>
              </div>
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Peso Total da Carga</label>
            <input
              type="text"
              style={getInputStyle('totalCargoWeight')}
              value={formData.totalCargoWeight || ''}
              onChange={(e) => {
                const formatted = formatQuantityByUnitType(e.target.value, currentUnitType);
                handleInputChange('totalCargoWeight', formatted);
              }}
              onFocus={() => handleInputFocus('pesoTotalCarga')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder={getQuantityPlaceholderByUnitType(currentUnitType)}
            />
          </div>
        </div>
      </div>

      {/* Seção de Lacres */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Lacres</h4>
        
        {/* Formulário para adicionar lacre */}
        <div style={styles.lacreFormGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nº Lacre</label>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <input
                type="text"
                style={getInputStyle('sealNumber')}
                value={currentSeal.sealNumber}
                onChange={(e) => handleSealChange('sealNumber', e.target.value)}
                onFocus={() => handleInputFocus('sealNumber')}
                onBlur={handleInputBlur}
                onClick={() => playClickSound()}
                placeholder="Número do lacre"
              />
              <div style={styles.searchIcon} title="Buscar lacre">
                📄
              </div>
            </div>
          </div>
          <div style={styles.formGroup}>
            <AddButton onClick={handleAddSeal} label="Adicionar Lacre" />
          </div>
        </div>

        {/* Lista de lacres */}
        <div style={styles.lacreList}>
          {sealList.length > 0 ? (
            <div style={{width: '100%'}}>
                              <div style={{fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: systemColors.text.secondary}}>
                Lacres Adicionados:
              </div>
              {sealList.map((seal) => (
                <div key={seal.id} style={styles.lacreItem}>
                  <div>
                    <strong>Nº Lacre:</strong> {seal.sealNumber}
                  </div>
                  <button
                    style={styles.removeButton}
                    onClick={() => handleRemoveSeal(seal.id)}
                    title="Remover lacre"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div>LACRE</div>
          )}
        </div>
      </div>

      {/* Seção de Autorizados para Download do XML do MDF-e */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Autorizados para Download do XML do MDF-e</h4>
        
        {/* Formulário para adicionar autorizado */}
        <div style={styles.autorizadoFormGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>CPF/CNPJ</label>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <input
                type="text"
                style={getInputStyle('authorizedDocument')}
                value={currentAuthorized.document}
                onChange={(e) => handleAuthorizedChange('document', e.target.value)}
                onFocus={() => handleInputFocus('authorizedDocument')}
                onBlur={handleInputBlur}
                onClick={() => playClickSound()}
                placeholder="000.000.000-00"
              />
              <div style={styles.searchIcon} title="Buscar documento">
                📄
              </div>
            </div>
          </div>
          <div style={styles.formGroup}>
            <AddButton onClick={handleAddAuthorized} label="Adicionar Autorizado" />
          </div>
        </div>

        {/* Lista de autorizados */}
        <div style={styles.autorizadoList}>
          {authorizedList.length > 0 ? (
            <div style={{width: '100%'}}>
                            <div style={{fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: systemColors.text.secondary}}>
              Autorizados Adicionados:
            </div>
              {authorizedList.map((authorized) => (
                <div key={authorized.id} style={styles.autorizadoItem}>
                  <div>
                  </div>
                  <button
                    style={styles.removeButton}
                    onClick={() => handleRemoveAuthorized(authorized.id)}
                    title="Remover autorizado"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div>N° DOCUMENTO</div>
          )}
        </div>
      </div>

      {/* Seção de Produto Predominante */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Produto Predominante</h4>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tipo da Carga</label>
            <div style={{ position: 'relative' }}>
              <select
                style={{
                  ...styles.select,
                  appearance: 'none' as const,
                  WebkitAppearance: 'none' as const,
                  MozAppearance: 'none' as const
                }}
              value={formData.cargoType || ''}
              onChange={(e) => {
                playClickSound();
                handleInputChange('cargoType', e.target.value);
              }}
              onFocus={() => handleInputFocus('tipoCarga')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
            >
              <option value="">Selecione o tipo da carga</option>
              <option value="Granel sólido">Granel sólido</option>
              <option value="Granel líquido">Granel líquido</option>
              <option value="Frigorificada">Frigorificada</option>
              <option value="Conteinerizada">Conteinerizada</option>
              <option value="Carga Geral">Carga Geral</option>
              <option value="Neogranel">Neogranel</option>
              <option value="Perigosa (granel sólido)">Perigosa (granel sólido)</option>
              <option value="Perigosa (granel líquido)">Perigosa (granel líquido)</option>
              <option value="Perigosa (carga frigorificada)">Perigosa (carga frigorificada)</option>
              <option value="Perigosa (conteinerizada)">Perigosa (conteinerizada)</option>
              <option value="Perigosa (carga geral)">Perigosa (carga geral)</option>
              </select>
              <div style={systemStyles.select.arrow}>
                <div style={systemStyles.select.arrowIcon}></div>
              </div>
            </div>
          </div>
          <div style={{...styles.formGroup, ...styles.formGroupFull}}>
            <label style={styles.label}>Descrição do Produto</label>
            <textarea
              style={{
                ...styles.textarea
              }}
              value={formData.productDescription || ''}
              onChange={(e) => handleInputChange('productDescription', e.target.value)}
              onFocus={() => handleInputFocus('productDescription')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="Descrição detalhada do produto"
              rows={3}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={{...styles.label, height: '32px', display: 'flex', alignItems: 'center'}}>GTIN (Global Trade Item Number)</label>
            <input
              type="text"
              style={getInputStyle('gtin')}
              value={formData.gtin || ''}
              onChange={(e) => handleInputChange('gtin', e.target.value)}
              onFocus={() => handleInputFocus('gtin')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="Código GTIN"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={{...styles.label, height: '32px', display: 'flex', alignItems: 'center'}}>Código NCM</label>
            <input
              type="text"
              style={getInputStyle('ncmCode')}
              value={formData.ncmCode || ''}
              onChange={(e) => handleInputChange('ncmCode', e.target.value)}
              onFocus={() => handleInputFocus('ncmCode')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="Código NCM"
            />
          </div>
        </div>
      </div>

      {/* Seção de Inf. Lotação */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Inf. Lotação</h4>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>CEP Local de Carregamento</label>
            <input
              type="text"
              style={getInputStyle('loadingZipCode')}
              value={formData.loadingZipCode || ''}
              onChange={(e) => handleInputChange('loadingZipCode', e.target.value)}
              onFocus={() => handleInputFocus('loadingZipCode')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="00000-000"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>CEP Local de Descarregamento</label>
            <input
              type="text"
              style={getInputStyle('unloadingZipCode')}
              value={formData.unloadingZipCode || ''}
              onChange={(e) => handleInputChange('unloadingZipCode', e.target.value)}
              onFocus={() => handleInputFocus('unloadingZipCode')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="00000-000"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
