import React, { useState, useRef, useEffect } from 'react';
import { systemStyles, systemColors } from '../../../../../styles/systemStyle';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { useElementScrollbarStyles } from '../../../../../hooks/useScrollbarStyles';
import { AddButton } from '../../../../../components/AddButton';

// Drivers tab for NewMDFe modal
// Handles driver selection and management
interface DriversTabProps {
  formData: any;
  onUpdateFormData: (field: string, value: any) => void;
}

interface Driver {
  id: string;
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
}

export function DriversTab({ formData, onUpdateFormData }: DriversTabProps): JSX.Element {
  const playClickSound = useClickSound();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [condutorSelecionado, setCondutorSelecionado] = useState<string>('');
  const [novoCondutor, setNovoCondutor] = useState({
    nomeCondutor: '',
    cpfCondutor: '',
    cnhCondutor: ''
  });
  
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Aplicar estilos de scrollbar específicos para formulários
  useElementScrollbarStyles(formContainerRef, 'modal');

  // Dados mockados de condutores cadastrados
  const [condutoresCadastrados] = useState<Driver[]>([
    {
      id: '1',
      nomeCondutor: 'João Silva',
      cpfCondutor: '123.456.789-00',
      cnhCondutor: '12345678901',
      categoriaCnh: 'C',
      validadeCnh: '2025-12-31',
      telefoneCondutor: '(11) 99999-9999',
      emailCondutor: 'joao@email.com',
      enderecoCondutor: 'Rua das Flores, 123',
      cidadeCondutor: 'São Paulo',
      ufCondutor: 'SP',
      cepCondutor: '01234-567'
    },
    {
      id: '2',
      nomeCondutor: 'Maria Santos',
      cpfCondutor: '987.654.321-00',
      cnhCondutor: '98765432109',
      categoriaCnh: 'D',
      validadeCnh: '2026-06-15',
      telefoneCondutor: '(11) 88888-8888',
      emailCondutor: 'maria@email.com',
      enderecoCondutor: 'Av. Paulista, 1000',
      cidadeCondutor: 'São Paulo',
      ufCondutor: 'SP',
      cepCondutor: '01310-100'
    },
    {
      id: '3',
      nomeCondutor: 'Pedro Costa',
      cpfCondutor: '111.222.333-44',
      cnhCondutor: '11223344556',
      categoriaCnh: 'E',
      validadeCnh: '2027-03-20',
      telefoneCondutor: '(11) 77777-7777',
      emailCondutor: 'pedro@email.com',
      enderecoCondutor: 'Rua Augusta, 500',
      cidadeCondutor: 'São Paulo',
      ufCondutor: 'SP',
      cepCondutor: '01305-000'
    }
  ]);

  const handleInputFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleInputBlur = () => {
    setFocusedField(null);
  };

  const getInputStyle = (field: string) => {
    const baseStyle = systemStyles.input.field;
    const focusStyle = focusedField === field ? systemStyles.input.fieldFocus : {};
    return { ...baseStyle, ...focusStyle };
  };

  const getInputProps = (field: string, placeholder: string = '', type: string = 'text') => ({
    type,
    value: novoCondutor[field as keyof typeof novoCondutor] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setNovoCondutor(prev => ({
        ...prev,
        [field]: e.target.value
      }));
    },
    style: getInputStyle(field),
    onFocus: () => handleInputFocus(field),
    onBlur: handleInputBlur,
    onClick: () => playClickSound(),
    placeholder
  });

  const handleCondutorSelect = (condutorId: string) => {
    playClickSound();
    setCondutorSelecionado(condutorId);
  };

  const handleAdicionarCondutorCadastrado = () => {
    playClickSound();
    if (condutorSelecionado) {
      const condutor = condutoresCadastrados.find(c => c.id === condutorSelecionado);
      if (condutor) {
        const condutoresAtuais = formData.condutoresSelecionados || [];
        const condutorJaExiste = condutoresAtuais.some((c: Driver) => c.id === condutor.id);
        
        if (!condutorJaExiste) {
          onUpdateFormData('condutoresSelecionados', [...condutoresAtuais, condutor]);
          setCondutorSelecionado('');
        }
      }
    }
  };

  const handleAdicionarNovoCondutor = () => {
    playClickSound();
    if (novoCondutor.nomeCondutor && novoCondutor.cpfCondutor && novoCondutor.cnhCondutor) {
      const novoCondutorCompleto: Driver = {
        id: Date.now().toString(),
        ...novoCondutor,
        categoriaCnh: '',
        validadeCnh: '',
        telefoneCondutor: '',
        emailCondutor: '',
        enderecoCondutor: '',
        cidadeCondutor: '',
        ufCondutor: '',
        cepCondutor: ''
      };
      
      const condutoresAtuais = formData.condutoresSelecionados || [];
      onUpdateFormData('condutoresSelecionados', [...condutoresAtuais, novoCondutorCompleto]);
      
      setNovoCondutor({
        nomeCondutor: '',
        cpfCondutor: '',
        cnhCondutor: ''
      });
    }
  };

  const handleRemoverCondutor = (condutorId: string) => {
    playClickSound();
    const condutoresAtuais = formData.condutoresSelecionados || [];
    const condutoresFiltrados = condutoresAtuais.filter((c: Driver) => c.id !== condutorId);
    onUpdateFormData('condutoresSelecionados', condutoresFiltrados);
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
    selectContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
      marginBottom: '20px',
      padding: '16px',
      background: systemColors.background.content,
      borderRadius: '8px',
      border: `1px solid ${systemColors.border.light}`
    },
    selectLabel: {
      fontSize: '11px',
      fontWeight: '600',
      color: systemColors.text.secondary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.3px'
    },
    select: {
      ...systemStyles.select.field,
      cursor: 'pointer'
    },
    selectFocus: {
      ...systemStyles.select.fieldFocus
    },
    selectRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px'
    },
    formRow: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: '12px'
    },
    infoText: {
      fontSize: '11px',
      color: systemColors.text.secondary,
      fontStyle: 'italic',
      marginTop: '4px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr auto',
      gap: '16px',
      marginBottom: '16px',
      alignItems: 'end'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '6px'
    },
    condutoresList: {
      background: systemColors.background.content,
      borderRadius: '8px',
      border: `1px solid ${systemColors.border.light}`,
      maxHeight: '200px',
      overflowY: 'auto' as const
    },
    condutorItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
      borderBottom: `1px solid ${systemColors.border.divider}`,
      transition: 'background 0.15s ease'
    },
    condutorItemLast: {
      borderBottom: 'none'
    },
    condutorInfo: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px'
    },
    condutorName: {
      fontSize: '14px',
      fontWeight: '500',
      color: systemColors.text.primary
    },
    condutorDetails: {
      fontSize: '12px',
      color: systemColors.text.secondary
    },
    removeButton: {
      padding: '6px 12px',
      borderRadius: '6px',
      border: 'none',
      background: 'rgba(255, 59, 48, 0.1)',
      color: '#FF3B30',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.15s ease'
    },
    emptyState: {
      padding: '20px',
      textAlign: 'center' as const,
      color: systemColors.text.secondary,
      fontSize: '14px',
      fontStyle: 'italic'
    },
    label: systemStyles.input.label
  };

  return (
    <div ref={formContainerRef} style={styles.container}>
      {/* Seção de Condutores Cadastrados */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Condutores Cadastrados</h4>
        <div style={{marginBottom: '16px'}}>
          <label style={styles.selectLabel}>Selecionar Condutor</label>
          <div style={styles.selectRow}>
            <div style={{ position: 'relative', flex: 1 }}>
              <select
                style={{
                  ...styles.select,
                  ...(focusedField === 'condutorSelecionado' ? styles.selectFocus : {}),
                  paddingRight: '24px',
                  appearance: 'none' as const,
                  WebkitAppearance: 'none' as const,
                  MozAppearance: 'none' as const
                }}
                value={condutorSelecionado}
                onChange={(e) => handleCondutorSelect(e.target.value)}
                onFocus={() => handleInputFocus('condutorSelecionado')}
                onBlur={handleInputBlur}
                onClick={() => playClickSound()}
              >
                <option value="">Selecione um condutor cadastrado</option>
                {condutoresCadastrados.map((condutor) => (
                  <option key={condutor.id} value={condutor.id}>
                    {condutor.nomeCondutor} - {condutor.cpfCondutor} ({condutor.categoriaCnh})
                  </option>
                ))}
              </select>
              <div style={systemStyles.select.arrow}>
                <div style={systemStyles.select.arrowIcon}></div>
              </div>
            </div>
            <AddButton
              onClick={handleAdicionarCondutorCadastrado}
              disabled={!condutorSelecionado}
              label="Adicionar Condutor"
            />
          </div>
          <div style={styles.infoText}>
            Selecione um condutor cadastrado para adicionar à lista de condutores da MDF-e.
          </div>
        </div>
      </div>

      {/* Seção de Novo Condutor */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Novo Condutor</h4>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nome Completo *</label>
            <input {...getInputProps('nomeCondutor', 'João Silva')} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>CPF *</label>
            <input {...getInputProps('cpfCondutor', '123.456.789-00')} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>CNH *</label>
            <input {...getInputProps('cnhCondutor', '12345678901')} />
          </div>
          <div style={styles.formGroup}>
            <AddButton
              onClick={handleAdicionarNovoCondutor}
              disabled={!novoCondutor.nomeCondutor || !novoCondutor.cpfCondutor || !novoCondutor.cnhCondutor}
              label="Adicionar Novo Condutor"
            />
          </div>
        </div>
      </div>

      {/* Lista de Condutores Selecionados */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Condutores Selecionados</h4>
        <div style={styles.condutoresList}>
          {formData.condutoresSelecionados && formData.condutoresSelecionados.length > 0 ? (
            formData.condutoresSelecionados.map((condutor: Driver, index: number) => (
              <div
                key={condutor.id}
                style={{
                  ...styles.condutorItem,
                  ...(index === formData.condutoresSelecionados.length - 1 ? styles.condutorItemLast : {})
                }}
              >
                <div style={styles.condutorInfo}>
                  <div style={styles.condutorName}>{condutor.nomeCondutor}</div>
                  <div style={styles.condutorDetails}>
                    CPF: {condutor.cpfCondutor} | CNH: {condutor.cnhCondutor}
                  </div>
                </div>
                <button
                  style={styles.removeButton}
                  onClick={() => handleRemoverCondutor(condutor.id)}
                >
                  Remover
                </button>
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>
              Nenhum condutor selecionado
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
