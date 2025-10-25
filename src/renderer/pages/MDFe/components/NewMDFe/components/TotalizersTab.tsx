import React, { useState, useRef } from 'react';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { modalStyles } from '../../../../../styles/modalStyles';
import { useElementScrollbarStyles } from '../../../../../hooks/useScrollbarStyles';
import { AddButton } from '../../../../../components/AddButton/AddButton';

// Totalizers tab for NewMDFe modal
// Handles totals, seals and authorized downloads
interface TotalizersTabProps {
  formData: any;
  onUpdateFormData: (field: string, value: any) => void;
}

interface Lacre {
  id: string;
  numeroLacre: string;
}

interface AutorizadoDownload {
  id: string;
  cpfCnpj: string;
}

export function TotalizersTab({ formData, onUpdateFormData }: TotalizersTabProps): JSX.Element {
  const playClickSound = useClickSound();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [lacreList, setLacreList] = useState<Lacre[]>([]);
  const [currentLacre, setCurrentLacre] = useState<Lacre>({
    id: '',
    numeroLacre: ''
  });
  const [autorizadoList, setAutorizadoList] = useState<AutorizadoDownload[]>([]);
  const [currentAutorizado, setCurrentAutorizado] = useState<AutorizadoDownload>({
    id: '',
    cpfCnpj: ''
  });
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Aplicar estilos de scrollbar específicos para formulários
  useElementScrollbarStyles(formContainerRef, 'modal');

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
    const baseStyle = modalStyles.formInput;
    const focusStyle = focusedField === field ? modalStyles.formInputFocus : {};
    return { ...baseStyle, ...focusStyle };
  };

  // Funções para gerenciar lacres
  const handleLacreChange = (field: keyof Lacre, value: string) => {
    setCurrentLacre(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddLacre = () => {
    playClickSound();
    if (currentLacre.numeroLacre) {
      const newLacre: Lacre = {
        ...currentLacre,
        id: Date.now().toString()
      };
      setLacreList(prev => [...prev, newLacre]);
      onUpdateFormData('lacreList', [...lacreList, newLacre]);
      setCurrentLacre({
        id: '',
        numeroLacre: ''
      });
    }
  };

  const handleRemoveLacre = (id: string) => {
    playClickSound();
    const updatedList = lacreList.filter(lacre => lacre.id !== id);
    setLacreList(updatedList);
    onUpdateFormData('lacreList', updatedList);
  };

  // Funções para gerenciar autorizados para download
  const handleAutorizadoChange = (field: keyof AutorizadoDownload, value: string) => {
    setCurrentAutorizado(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddAutorizado = () => {
    playClickSound();
    if (currentAutorizado.cpfCnpj) {
      const newAutorizado: AutorizadoDownload = {
        ...currentAutorizado,
        id: Date.now().toString()
      };
      setAutorizadoList(prev => [...prev, newAutorizado]);
      onUpdateFormData('autorizadoList', [...autorizadoList, newAutorizado]);
      setCurrentAutorizado({
        id: '',
        cpfCnpj: ''
      });
    }
  };

  const handleRemoveAutorizado = (id: string) => {
    playClickSound();
    const updatedList = autorizadoList.filter(autorizado => autorizado.id !== id);
    setAutorizadoList(updatedList);
    onUpdateFormData('autorizadoList', updatedList);
  };

  const styles = {
    container: {
      height: '100%',
      overflow: 'auto' as const,
      padding: '0'
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
      background: 'rgba(255, 255, 255, 0.4)',
      borderRadius: '6px',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      minHeight: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '600',
      color: 'var(--text-secondary)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const
    },
    autorizadoList: {
      marginTop: '16px',
      padding: '12px',
      background: 'rgba(255, 255, 255, 0.4)',
      borderRadius: '6px',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      minHeight: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '600',
      color: 'var(--text-secondary)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const
    },
    lacreItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px',
      background: 'rgba(255, 255, 255, 0.6)',
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
      background: 'rgba(255, 255, 255, 0.6)',
      borderRadius: '4px',
      marginBottom: '8px',
      fontSize: '12px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    removeButton: {
      width: '20px',
      height: '20px',
      borderRadius: '4px',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      background: 'linear-gradient(to bottom, #ff5f57, #ff3b30)',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
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
      color: 'var(--text-secondary)',
      marginLeft: '8px'
    }
  };

  return (
    <div ref={formContainerRef} style={styles.container}>
      {/* Seção de Totais de Fornecimento */}
      <div style={modalStyles.formSection}>
        <h4 style={modalStyles.formSectionTitle}>Totais de Fornecimento</h4>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={modalStyles.formLabel}>Qnt. total de NF-e relacionadas</label>
            <input
              type="text"
              style={getInputStyle('qntTotalNFe')}
              value={formData.qntTotalNFe || ''}
              onChange={(e) => handleInputChange('qntTotalNFe', e.target.value)}
              onFocus={() => handleInputFocus('qntTotalNFe')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="1"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={modalStyles.formLabel}>Valor Total da Carga</label>
            <input
              type="text"
              style={getInputStyle('valorTotalCarga')}
              value={formData.valorTotalCarga || ''}
              onChange={(e) => handleInputChange('valorTotalCarga', e.target.value)}
              onFocus={() => handleInputFocus('valorTotalCarga')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="0,00"
            />
            {/* Mensagem de aviso sobre peso bruto - só aparece após importar nota sem peso */}
            {formData.notasSemPesoBruto && formData.notasSemPesoBruto.length > 0 && (
              <div style={styles.warningMessage}>
                A(s) nota(s) {formData.notasSemPesoBruto.join(',')}, não contém peso bruto informado, o Peso Total da Carga será divergente!
              </div>
            )}
          </div>
          <div style={styles.formGroup}>
            <label style={modalStyles.formLabel}>Cod. Unidade de Medida da Carga</label>
            <input
              type="text"
              style={getInputStyle('codUnidadeMedidaCarga')}
              value={formData.codUnidadeMedidaCarga || ''}
              onChange={(e) => handleInputChange('codUnidadeMedidaCarga', e.target.value)}
              onFocus={() => handleInputFocus('codUnidadeMedidaCarga')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder=""
            />
          </div>
          <div style={styles.formGroup}>
            <label style={modalStyles.formLabel}>Peso Total da Carga</label>
            <input
              type="text"
              style={getInputStyle('pesoTotalCarga')}
              value={formData.pesoTotalCarga || ''}
              onChange={(e) => handleInputChange('pesoTotalCarga', e.target.value)}
              onFocus={() => handleInputFocus('pesoTotalCarga')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="0.0000"
            />
          </div>
        </div>
      </div>

      {/* Seção de Lacres */}
      <div style={modalStyles.formSection}>
        <h4 style={modalStyles.formSectionTitle}>Lacres</h4>
        
        {/* Formulário para adicionar lacre */}
        <div style={styles.lacreFormGrid}>
          <div style={styles.formGroup}>
            <label style={modalStyles.formLabel}>Nº Lacre</label>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <input
                type="text"
                style={getInputStyle('numeroLacre')}
                value={currentLacre.numeroLacre}
                onChange={(e) => handleLacreChange('numeroLacre', e.target.value)}
                onFocus={() => handleInputFocus('numeroLacre')}
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
            <AddButton onClick={handleAddLacre} label="Adicionar Lacre" />
          </div>
        </div>

        {/* Lista de lacres */}
        <div style={styles.lacreList}>
          {lacreList.length > 0 ? (
            <div style={{width: '100%'}}>
              <div style={{fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)'}}>
                Lacres Adicionados:
              </div>
              {lacreList.map((lacre) => (
                <div key={lacre.id} style={styles.lacreItem}>
                  <div>
                    <strong>Nº Lacre:</strong> {lacre.numeroLacre}
                  </div>
                  <button
                    style={styles.removeButton}
                    onClick={() => handleRemoveLacre(lacre.id)}
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
      <div style={modalStyles.formSection}>
        <h4 style={modalStyles.formSectionTitle}>Autorizados para Download do XML do MDF-e</h4>
        
        {/* Formulário para adicionar autorizado */}
        <div style={styles.autorizadoFormGrid}>
          <div style={styles.formGroup}>
            <label style={modalStyles.formLabel}>CPF/CNPJ</label>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <input
                type="text"
                style={getInputStyle('cpfCnpjAutorizado')}
                value={currentAutorizado.cpfCnpj}
                onChange={(e) => handleAutorizadoChange('cpfCnpj', e.target.value)}
                onFocus={() => handleInputFocus('cpfCnpjAutorizado')}
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
            <AddButton onClick={handleAddAutorizado} label="Adicionar Autorizado" />
          </div>
        </div>

        {/* Lista de autorizados */}
        <div style={styles.autorizadoList}>
          {autorizadoList.length > 0 ? (
            <div style={{width: '100%'}}>
              <div style={{fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)'}}>
                Autorizados Adicionados:
              </div>
              {autorizadoList.map((autorizado) => (
                <div key={autorizado.id} style={styles.autorizadoItem}>
                  <div>
                    <strong>CPF/CNPJ:</strong> {autorizado.cpfCnpj}
                  </div>
                  <button
                    style={styles.removeButton}
                    onClick={() => handleRemoveAutorizado(autorizado.id)}
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
      <div style={modalStyles.formSection}>
        <h4 style={modalStyles.formSectionTitle}>Produto Predominante</h4>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={modalStyles.formLabel}>Tipo da Carga</label>
            <select
              style={{
                ...modalStyles.formSelect,
                ...(focusedField === 'tipoCarga' ? modalStyles.formInputFocus : {})
              }}
              value={formData.tipoCarga || ''}
              onChange={(e) => {
                playClickSound();
                handleInputChange('tipoCarga', e.target.value);
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
          </div>
          <div style={{...styles.formGroup, ...styles.formGroupFull}}>
            <label style={modalStyles.formLabel}>Descrição do Produto</label>
            <textarea
              style={{
                ...modalStyles.formTextarea,
                ...(focusedField === 'descricaoProduto' ? modalStyles.formInputFocus : {})
              }}
              value={formData.descricaoProduto || ''}
              onChange={(e) => handleInputChange('descricaoProduto', e.target.value)}
              onFocus={() => handleInputFocus('descricaoProduto')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="Descrição detalhada do produto"
              rows={3}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={{...modalStyles.formLabel, height: '32px', display: 'flex', alignItems: 'center'}}>GTIN (Global Trade Item Number)</label>
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
            <label style={{...modalStyles.formLabel, height: '32px', display: 'flex', alignItems: 'center'}}>Código NCM</label>
            <input
              type="text"
              style={getInputStyle('codigoNCM')}
              value={formData.codigoNCM || ''}
              onChange={(e) => handleInputChange('codigoNCM', e.target.value)}
              onFocus={() => handleInputFocus('codigoNCM')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="Código NCM"
            />
          </div>
        </div>
      </div>

      {/* Seção de Inf. Lotação */}
      <div style={modalStyles.formSection}>
        <h4 style={modalStyles.formSectionTitle}>Inf. Lotação</h4>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={modalStyles.formLabel}>CEP Local de Carregamento</label>
            <input
              type="text"
              style={getInputStyle('cepLocalCarregamento')}
              value={formData.cepLocalCarregamento || ''}
              onChange={(e) => handleInputChange('cepLocalCarregamento', e.target.value)}
              onFocus={() => handleInputFocus('cepLocalCarregamento')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="00000-000"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={modalStyles.formLabel}>CEP Local de Descarregamento</label>
            <input
              type="text"
              style={getInputStyle('cepLocalDescarregamento')}
              value={formData.cepLocalDescarregamento || ''}
              onChange={(e) => handleInputChange('cepLocalDescarregamento', e.target.value)}
              onFocus={() => handleInputFocus('cepLocalDescarregamento')}
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
