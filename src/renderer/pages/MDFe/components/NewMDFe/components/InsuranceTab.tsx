import React, { useState, useRef } from 'react';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { modalStyles } from '../../../../../styles/modalStyles';
import { useElementScrollbarStyles } from '../../../../../hooks/useScrollbarStyles';
import { AddButton } from '../../../../../components/AddButton/AddButton';

// Insurance tab for NewMDFe modal
// Handles cargo insurance information
interface InsuranceTabProps {
  formData: any;
  onUpdateFormData: (field: string, value: any) => void;
}

interface Averbacao {
  id: string;
  numeroAverbacao: string;
}

export function InsuranceTab({ formData, onUpdateFormData }: InsuranceTabProps): JSX.Element {
  const playClickSound = useClickSound();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [averbacaoList, setAverbacaoList] = useState<Averbacao[]>([]);
  const [currentAverbacao, setCurrentAverbacao] = useState<Averbacao>({
    id: '',
    numeroAverbacao: ''
  });
  const [exibirDadosSeguro, setExibirDadosSeguro] = useState(false);
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

  // Funções para gerenciar averbações
  const handleAverbacaoChange = (field: keyof Averbacao, value: string) => {
    setCurrentAverbacao(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddAverbacao = () => {
    playClickSound();
    if (currentAverbacao.numeroAverbacao) {
      const newAverbacao: Averbacao = {
        ...currentAverbacao,
        id: Date.now().toString()
      };
      setAverbacaoList(prev => [...prev, newAverbacao]);
      onUpdateFormData('averbacaoList', [...averbacaoList, newAverbacao]);
      setCurrentAverbacao({
        id: '',
        numeroAverbacao: ''
      });
    }
  };

  const handleRemoveAverbacao = (id: string) => {
    playClickSound();
    const updatedList = averbacaoList.filter(averbacao => averbacao.id !== id);
    setAverbacaoList(updatedList);
    onUpdateFormData('averbacaoList', updatedList);
  };

  const handleCheckboxChange = () => {
    playClickSound();
    const newValue = !exibirDadosSeguro;
    setExibirDadosSeguro(newValue);
    onUpdateFormData('exibirDadosSeguro', newValue);
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
      background: 'rgba(255, 255, 255, 0.4)',
      borderRadius: '6px',
      border: '1px solid rgba(0, 0, 0, 0.1)'
    },
    averbacaoItem: {
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
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '24px',
      padding: '12px',
      background: 'rgba(255, 255, 255, 0.4)',
      borderRadius: '6px',
      border: '1px solid rgba(0, 0, 0, 0.1)'
    },
    checkboxItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer'
    },
    checkbox: {
      ...modalStyles.checkbox,
      width: '16px',
      height: '16px'
    },
    checkboxChecked: {
      ...modalStyles.checkboxChecked
    },
    checkboxDot: {
      ...modalStyles.checkboxDot
    },
    checkboxLabel: {
      ...modalStyles.checkboxLabel,
      fontSize: '12px'
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
      {/* Seção de Informações do Responsável pelo Seguro */}
      <div style={modalStyles.formSection}>
        <h4 style={modalStyles.formSectionTitle}>Informações do Responsável pelo Seguro</h4>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={modalStyles.formLabel}>Responsável pelo Seguro</label>
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
            <label style={modalStyles.formLabel}>CPF/CNPJ do Responsável pelo Seguro</label>
            <input
              type="text"
              style={getInputStyle('cpfCnpjResponsavelSeguro')}
              value={formData.cpfCnpjResponsavelSeguro || ''}
              onChange={(e) => handleInputChange('cpfCnpjResponsavelSeguro', e.target.value)}
              onFocus={() => handleInputFocus('cpfCnpjResponsavelSeguro')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="000.000.000-00"
            />
          </div>
        </div>
      </div>

      {/* Seção de Informações da Seguradora */}
      <div style={modalStyles.formSection}>
        <h4 style={modalStyles.formSectionTitle}>Informações da Seguradora</h4>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={modalStyles.formLabel}>Nome Seguradora</label>
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
            <label style={modalStyles.formLabel}>CNPJ da Seguradora</label>
            <input
              type="text"
              style={getInputStyle('cnpjSeguradora')}
              value={formData.cnpjSeguradora || ''}
              onChange={(e) => handleInputChange('cnpjSeguradora', e.target.value)}
              onFocus={() => handleInputFocus('cnpjSeguradora')}
              onBlur={handleInputBlur}
              onClick={() => playClickSound()}
              placeholder="00.000.000/0000-00"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={modalStyles.formLabel}>Número da Apólice</label>
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
      <div style={modalStyles.formSection}>
        <h4 style={modalStyles.formSectionTitle}>Lista de Números de Averbação</h4>
        
        {/* Formulário para adicionar averbação */}
        <div style={styles.averbacaoFormGrid}>
          <div style={styles.formGroup}>
            <label style={modalStyles.formLabel}>Número da Averbação</label>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <input
                type="text"
                style={getInputStyle('numeroAverbacao')}
                value={currentAverbacao.numeroAverbacao}
                onChange={(e) => handleAverbacaoChange('numeroAverbacao', e.target.value)}
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
            <AddButton onClick={handleAddAverbacao} label="Número da Averbação" />
          </div>
        </div>

        {/* Lista de averbações adicionadas */}
        {averbacaoList.length > 0 && (
          <div style={styles.averbacaoList}>
            <div style={{fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)'}}>
              Averbações Adicionadas:
            </div>
            {averbacaoList.map((averbacao) => (
              <div key={averbacao.id} style={styles.averbacaoItem}>
                <div>
                  <strong>Número:</strong> {averbacao.numeroAverbacao}
                </div>
                <button
                  style={styles.removeButton}
                  onClick={() => handleRemoveAverbacao(averbacao.id)}
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
              ...styles.checkbox,
              ...(exibirDadosSeguro ? styles.checkboxChecked : {})
            }}
          >
            {exibirDadosSeguro && <div style={styles.checkboxDot}></div>}
          </div>
          <span style={styles.checkboxLabel}>
            Exibir dados do Seguro no campo Informações Complementares?
          </span>
        </div>
      </div>
    </div>
  );
}
