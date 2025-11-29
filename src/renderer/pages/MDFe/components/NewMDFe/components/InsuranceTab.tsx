import React, { useState, useRef, useEffect } from 'react';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { AddButton } from '../../../../../components/AddButton/AddButton';
import { formatCpfOrCnpj } from '../../../../../utils/documentFormatter';

// Insurance tab for NewMDFe modal
// Handles cargo insurance information
interface InsuranceTabProps {
  formData: any;
  onUpdateFormData: (field: string, value: any) => void;
}

interface Endorsement {
  id: string;
  endorsementNumber: string;
}

export function InsuranceTab({ formData, onUpdateFormData }: InsuranceTabProps): JSX.Element {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [endorsementList, setEndorsementList] = useState<Endorsement[]>([]);
  const [currentEndorsement, setCurrentEndorsement] = useState<Endorsement>({
    id: '',
    endorsementNumber: ''
  });
  const [showInsuranceData, setShowInsuranceData] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);


  // Sincroniza lista com formData quando o componente monta ou quando muda
  useEffect(() => {
    if (formData.endorsementList && Array.isArray(formData.endorsementList)) {
      setEndorsementList(formData.endorsementList);
    }
    if (formData.showInsuranceData !== undefined) {
      setShowInsuranceData(formData.showInsuranceData);
    }
  }, [formData.endorsementList, formData.showInsuranceData]);

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

  // Funções para gerenciar averbações
  const handleEndorsementChange = (field: keyof Endorsement, value: string) => {
    setCurrentEndorsement(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddEndorsement = () => {
    playClickSound();
    if (currentEndorsement.endorsementNumber) {
      const newEndorsement: Endorsement = {
        ...currentEndorsement,
        id: Date.now().toString()
      };
      setEndorsementList(prev => [...prev, newEndorsement]);
      onUpdateFormData('endorsementList', [...endorsementList, newEndorsement]);
      setCurrentEndorsement({
        id: '',
        endorsementNumber: ''
      });
    }
  };

  const handleRemoveEndorsement = (id: string) => {
    playClickSound();
    const updatedList = endorsementList.filter(endorsement => endorsement.id !== id);
    setEndorsementList(updatedList);
    onUpdateFormData('endorsementList', updatedList);
  };

  const handleCheckboxChange = () => {
    playClickSound();
    const newValue = !showInsuranceData;
    setShowInsuranceData(newValue);
    onUpdateFormData('showInsuranceData', newValue);
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
    averbacaoFormGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: '16px',
      marginBottom: '16px',
      alignItems: 'end'
    },
    averbacaoList: {
      marginTop: '16px',
      padding: '12px',
      background: systemColors.background.content,
      borderRadius: '6px',
      border: `1px solid ${systemColors.border.light}`
    },
    averbacaoItem: {
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
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '24px',
      padding: '12px',
      background: systemColors.background.content,
      borderRadius: '6px',
      border: `1px solid ${systemColors.border.light}`
    },
    checkboxItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer'
    },
    searchIcon: {
      width: '16px',
      height: '16px',
      cursor: 'pointer',
      color: systemColors.text.secondary,
      marginLeft: '8px'
    },
    label: systemStyles.input.label
  };

  return (
    <div ref={formContainerRef} className="scrollbar-modal" style={styles.container}>
      {/* Seção de Informações do Responsável pelo Seguro */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Informações do Responsável pelo Seguro</h4>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Responsável pelo Seguro</label>
            <input
              type="text"
              style={getInputStyle('responsavelSeguro')}
              value={formData.responsavelSeguro || ''}
              onChange={(e) => handleInputChange('responsavelSeguro', e.target.value)}
              onFocus={() => handleInputFocus('responsavelSeguro')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="Nome do responsável"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>CPF/CNPJ do Responsável pelo Seguro</label>
            <input
              type="text"
              style={getInputStyle('cpfCnpjResponsavelSeguro')}
              value={formData.cpfCnpjResponsavelSeguro || ''}
              onChange={(e) => handleInputChange('cpfCnpjResponsavelSeguro', formatCpfOrCnpj(e.target.value))}
              onFocus={() => handleInputFocus('cpfCnpjResponsavelSeguro')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="000.000.000-00"
            />
          </div>
        </div>
      </div>

      {/* Seção de Informações da Seguradora */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Informações da Seguradora</h4>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nome Seguradora</label>
            <input
              type="text"
              style={getInputStyle('nomeSeguradora')}
              value={formData.nomeSeguradora || ''}
              onChange={(e) => handleInputChange('nomeSeguradora', e.target.value)}
              onFocus={() => handleInputFocus('nomeSeguradora')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="Nome da seguradora"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>CNPJ da Seguradora</label>
            <input
              type="text"
              style={getInputStyle('cnpjSeguradora')}
              value={formData.cnpjSeguradora || ''}
              onChange={(e) => handleInputChange('cnpjSeguradora', formatCpfOrCnpj(e.target.value))}
              onFocus={() => handleInputFocus('cnpjSeguradora')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="00.000.000/0000-00"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Número da Apólice</label>
            <input
              type="text"
              style={getInputStyle('numeroApolice')}
              value={formData.numeroApolice || ''}
              onChange={(e) => handleInputChange('numeroApolice', e.target.value)}
              onFocus={() => handleInputFocus('numeroApolice')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="Número da apólice"
            />
          </div>
        </div>
      </div>

      {/* Seção de Lista de Números de Averbação */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Lista de Números de Averbação</h4>
        
        {/* Formulário para adicionar averbação */}
        <div style={styles.averbacaoFormGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Número da Averbação</label>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <input
              type="text"
              style={getInputStyle('endorsementNumber')}
              value={currentEndorsement.endorsementNumber}
              onChange={(e) => handleEndorsementChange('endorsementNumber', e.target.value)}
                onFocus={() => handleInputFocus('numeroAverbacao')}
                onBlur={handleInputBlur}
                onClick={() => playClickSound()}
                placeholder="Número da averbação"
              />
              <div style={styles.searchIcon} title="Buscar averbação">
                🔍
              </div>
            </div>
          </div>
          <div style={styles.formGroup}>
            <AddButton onClick={handleAddEndorsement} label="Número da Averbação" />
          </div>
        </div>

        {/* Lista de averbações adicionadas */}
        {endorsementList.length > 0 && (
          <div style={styles.averbacaoList}>
            <div style={{fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: systemColors.text.secondary}}>
              Averbações Adicionadas:
            </div>
            {endorsementList.map((endorsement) => (
              <div key={endorsement.id} style={styles.averbacaoItem}>
                <div>
                  <strong>Número:</strong> {endorsement.endorsementNumber}
                </div>
                <button
                  style={styles.removeButton}
                  onClick={() => handleRemoveEndorsement(endorsement.id)}
                  title="Remover averbação"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Checkbox para exibir dados do seguro */}
      <div style={styles.checkboxContainer}>
        <div 
          style={styles.checkboxItem}
          onClick={handleCheckboxChange}
        >
          <div 
            style={{
              ...systemStyles.checkbox.box,
              ...(showInsuranceData ? systemStyles.checkbox.boxChecked : {})
            }}
          >
            {showInsuranceData && (
              <svg 
                viewBox="0 0 14 14" 
                style={systemStyles.checkbox.checkmark}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M2 7 L5.5 10.5 L12 3.5" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span style={systemStyles.checkbox.label}>
            Exibir dados do Seguro no campo Informações Complementares?
          </span>
        </div>
      </div>
    </div>
  );
}
