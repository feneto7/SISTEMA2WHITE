import React, { useState, useRef } from 'react';
import { systemStyles, systemColors } from '../../../../../styles/systemStyle';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { AddButton } from '../../../../../components/AddButton';

// Route tab for NewMDFe modal
// Handles route information including loading location, UF path, and unloading location
interface RouteTabProps {
  formData: any;
  onUpdateFormData: (field: string, value: any) => void;
}

interface UFPercurso {
  id: string;
  uf: string;
  ordem: number;
}

interface Municipio {
  nome: string;
  codigo_ibge: string;
}

export function RouteTab({ formData, onUpdateFormData }: RouteTabProps): JSX.Element {
  const playClickSound = useClickSound();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [novaUF, setNovaUF] = useState('');
  const [municipiosCarregamento, setMunicipiosCarregamento] = useState<Municipio[]>([]);
  const [municipiosDescarregamento, setMunicipiosDescarregamento] = useState<Municipio[]>([]);
  const [loadingMunicipiosCarregamento, setLoadingMunicipiosCarregamento] = useState(false);
  const [loadingMunicipiosDescarregamento, setLoadingMunicipiosDescarregamento] = useState(false);
  
  const formContainerRef = useRef<HTMLDivElement>(null);


  // Lista de UFs brasileiras
  const ufsBrasileiras = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  // Função para buscar municípios da API BrasilAPI
  const fetchMunicipios = async (uf: string, tipo: 'carregamento' | 'descarregamento') => {
    if (!uf) return;
    
    const setLoading = tipo === 'carregamento' ? setLoadingMunicipiosCarregamento : setLoadingMunicipiosDescarregamento;
    const setMunicipios = tipo === 'carregamento' ? setMunicipiosCarregamento : setMunicipiosDescarregamento;
    
    setLoading(true);
    try {
      const response = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${uf}?providers=dados-abertos-br,gov,wikipedia`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar municípios: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Mapear os dados para o formato esperado
      const municipiosFormatados: Municipio[] = data.map((municipio: any) => ({
        nome: municipio.nome,
        codigo_ibge: municipio.codigo_ibge
      }));
      
      setMunicipios(municipiosFormatados);
      console.log(`Municípios de ${uf} carregados:`, municipiosFormatados.length);
    } catch (error) {
      console.error(`Erro ao buscar municípios de ${uf}:`, error);
      setMunicipios([]);
    } finally {
      setLoading(false);
    }
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

  // Handler para mudança de UF de carregamento
  const handleUFCarregamentoChange = async (uf: string) => {
    playClickSound();
    onUpdateFormData('ufCarregamento', uf);
    onUpdateFormData('municipioCarregamento', ''); // Limpar município ao trocar UF
    
    if (uf) {
      await fetchMunicipios(uf, 'carregamento');
    } else {
      setMunicipiosCarregamento([]);
    }
  };

  // Handler para mudança de UF de descarregamento
  const handleUFDescarregamentoChange = async (uf: string) => {
    playClickSound();
    onUpdateFormData('ufDescarregamento', uf);
    onUpdateFormData('municipioDescarregamento', ''); // Limpar município ao trocar UF
    
    if (uf) {
      await fetchMunicipios(uf, 'descarregamento');
    } else {
      setMunicipiosDescarregamento([]);
    }
  };

  const handleAdicionarUF = () => {
    if (!novaUF) return;
    
    playClickSound();
    const ufsAtuais = formData.ufsPercurso || [];
    const novaUFItem: UFPercurso = {
      id: Date.now().toString(),
      uf: novaUF,
      ordem: ufsAtuais.length + 1
    };
    
    onUpdateFormData('ufsPercurso', [...ufsAtuais, novaUFItem]);
    setNovaUF('');
  };

  const handleRemoverUF = (ufId: string) => {
    playClickSound();
    const ufsAtuais = formData.ufsPercurso || [];
    const ufsFiltradas = ufsAtuais.filter((uf: UFPercurso) => uf.id !== ufId);
    
    // Reordenar as UFs restantes
    const ufsReordenadas = ufsFiltradas.map((uf: UFPercurso, index: number) => ({
      ...uf,
      ordem: index + 1
    }));
    
    onUpdateFormData('ufsPercurso', ufsReordenadas);
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
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginBottom: '16px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '6px'
    },
    ufContainer: {
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-end',
      marginBottom: '16px',
      padding: '16px',
      backgroundColor: systemColors.background.content,
      borderRadius: '6px',
      border: `1px solid ${systemColors.border.light}`
    },
    ufSelect: {
      flex: 1
    },
    ufsList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
      marginTop: '16px'
    },
    ufItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
      backgroundColor: systemColors.background.white,
      border: `1px solid ${systemColors.border.light}`,
      borderRadius: '6px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      transition: 'background 0.15s ease'
    },
    ufInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    ufOrder: {
      fontSize: '12px',
      fontWeight: '600',
      color: systemColors.text.secondary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      minWidth: '30px'
    },
    ufName: {
      fontSize: '14px',
      fontWeight: '500',
      color: systemColors.text.primary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    removeButton: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      border: '1px solid #ff3b30',
      background: '#ff3b30',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: 'bold',
      transition: 'all 0.15s ease'
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '40px 20px',
      color: systemColors.text.secondary,
      fontStyle: 'italic',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    infoText: {
      fontSize: '11px',
      color: systemColors.text.secondary,
      fontStyle: 'italic',
      marginTop: '4px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    label: systemStyles.input.label
  };

  return (
    <div ref={formContainerRef} className="scrollbar-modal" style={styles.container}>
      {/* Seção de Local de Carregamento */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Local de Carregamento</h4>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>UF:</label>
            <div style={{ position: 'relative' }}>
              <select
                style={{
                  ...systemStyles.select.field,
                  appearance: 'none' as const,
                  WebkitAppearance: 'none' as const,
                  MozAppearance: 'none' as const
                }}
                value={formData.ufCarregamento || ''}
                onChange={(e) => handleUFCarregamentoChange(e.target.value)}
                onFocus={() => handleInputFocus('ufCarregamento')}
                onBlur={handleInputBlur}
                onClick={() => playClickSound()}
              >
                <option value="">Selecione a UF</option>
                {ufsBrasileiras.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
              <div style={systemStyles.select.arrow}>
                <div style={systemStyles.select.arrowIcon}></div>
              </div>
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Município:
              {loadingMunicipiosCarregamento && (
                <span style={{
                  marginLeft: '8px',
                  fontSize: '10px',
                  color: '#007AFF',
                  fontWeight: '400'
                }}>
                  🔄 Carregando...
                </span>
              )}
            </label>
            <div style={{ position: 'relative' }}>
              <select
                style={{
                  ...systemStyles.select.field,
                  appearance: 'none' as const,
                  WebkitAppearance: 'none' as const,
                  MozAppearance: 'none' as const,
                  opacity: loadingMunicipiosCarregamento ? 0.7 : 1
                }}
                value={formData.municipioCarregamento || ''}
                onChange={(e) => {
                  playClickSound();
                  onUpdateFormData('municipioCarregamento', e.target.value);
                }}
                onFocus={() => handleInputFocus('municipioCarregamento')}
                onBlur={handleInputBlur}
                onClick={() => playClickSound()}
                disabled={!formData.ufCarregamento || loadingMunicipiosCarregamento}
              >
                <option value="">
                  {!formData.ufCarregamento 
                    ? 'Selecione uma UF primeiro' 
                    : loadingMunicipiosCarregamento 
                      ? 'Carregando municípios...'
                      : 'Selecione o município'}
                </option>
                {municipiosCarregamento.map(municipio => (
                  <option key={municipio.codigo_ibge} value={municipio.nome}>
                    {municipio.nome}
                  </option>
                ))}
              </select>
              <div style={systemStyles.select.arrow}>
                <div style={systemStyles.select.arrowIcon}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de UFs de Percurso */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>UFs de Percurso</h4>
        <div style={styles.ufContainer}>
          <div style={styles.ufSelect}>
            <label style={styles.label}>Adicionar UF:</label>
            <div style={{ position: 'relative' }}>
              <select
                style={{
                  ...systemStyles.select.field,
                  appearance: 'none' as const,
                  WebkitAppearance: 'none' as const,
                  MozAppearance: 'none' as const
                }}
                value={novaUF}
                onChange={(e) => {
                  playClickSound();
                  setNovaUF(e.target.value);
                }}
                onFocus={() => handleInputFocus('novaUF')}
                onBlur={handleInputBlur}
                onClick={() => playClickSound()}
              >
                <option value="">Selecione uma UF</option>
                {ufsBrasileiras.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
              <div style={systemStyles.select.arrow}>
                <div style={systemStyles.select.arrowIcon}></div>
              </div>
            </div>
          </div>
          <AddButton
            onClick={handleAdicionarUF}
            disabled={!novaUF}
            label="Adicionar UF"
          />
        </div>
        <div style={styles.infoText}>
          Adicione as UFs por onde a carga passará durante o transporte, na ordem correta.
        </div>

        {/* Lista de UFs */}
        {formData.ufsPercurso && formData.ufsPercurso.length > 0 ? (
          <div style={styles.ufsList}>
            {formData.ufsPercurso.map((uf: UFPercurso, index: number) => (
              <div key={uf.id} style={styles.ufItem}>
                <div style={styles.ufInfo}>
                  <span style={styles.ufOrder}>#{uf.ordem}</span>
                  <span style={styles.ufName}>{uf.uf}</span>
                </div>
                <button
                  style={styles.removeButton}
                  onClick={() => handleRemoverUF(uf.id)}
                  title="Remover UF"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            Nenhuma UF de percurso adicionada
            <br />
            Selecione uma UF e clique em "Adicionar UF" para começar
          </div>
        )}
      </div>

      {/* Seção de Local de Descarregamento */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Local de Descarregamento</h4>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>UF:</label>
            <div style={{ position: 'relative' }}>
              <select
                style={{
                  ...systemStyles.select.field,
                  appearance: 'none' as const,
                  WebkitAppearance: 'none' as const,
                  MozAppearance: 'none' as const
                }}
                value={formData.ufDescarregamento || ''}
                onChange={(e) => handleUFDescarregamentoChange(e.target.value)}
                onFocus={() => handleInputFocus('ufDescarregamento')}
                onBlur={handleInputBlur}
                onClick={() => playClickSound()}
              >
                <option value="">Selecione a UF</option>
                {ufsBrasileiras.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
              <div style={systemStyles.select.arrow}>
                <div style={systemStyles.select.arrowIcon}></div>
              </div>
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Município:
              {loadingMunicipiosDescarregamento && (
                <span style={{
                  marginLeft: '8px',
                  fontSize: '10px',
                  color: '#007AFF',
                  fontWeight: '400'
                }}>
                  🔄 Carregando...
                </span>
              )}
            </label>
            <div style={{ position: 'relative' }}>
              <select
                style={{
                  ...systemStyles.select.field,
                  appearance: 'none' as const,
                  WebkitAppearance: 'none' as const,
                  MozAppearance: 'none' as const,
                  opacity: loadingMunicipiosDescarregamento ? 0.7 : 1
                }}
                value={formData.municipioDescarregamento || ''}
                onChange={(e) => {
                  playClickSound();
                  onUpdateFormData('municipioDescarregamento', e.target.value);
                }}
                onFocus={() => handleInputFocus('municipioDescarregamento')}
                onBlur={handleInputBlur}
                onClick={() => playClickSound()}
                disabled={!formData.ufDescarregamento || loadingMunicipiosDescarregamento}
              >
                <option value="">
                  {!formData.ufDescarregamento 
                    ? 'Selecione uma UF primeiro' 
                    : loadingMunicipiosDescarregamento 
                      ? 'Carregando municípios...'
                      : 'Selecione o município'}
                </option>
                {municipiosDescarregamento.map(municipio => (
                  <option key={municipio.codigo_ibge} value={municipio.nome}>
                    {municipio.nome}
                  </option>
                ))}
              </select>
              <div style={systemStyles.select.arrow}>
                <div style={systemStyles.select.arrowIcon}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
