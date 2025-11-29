import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { AddButton } from '../../../../../components/AddButton';

// Route tab for NewMDFe modal
// Handles route information including loading location, UF path, and unloading location
interface RouteTabProps {
  formData: any;
  onUpdateFormData: (field: string, value: any) => void;
}

interface RouteStateItem {
  id: string;
  state: string;
  order: number;
}

interface City {
  name: string;
  ibgeCode: string;
}

export function RouteTab({ formData, onUpdateFormData }: RouteTabProps): JSX.Element {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [newState, setNewState] = useState('');
  const [loadingCities, setLoadingCities] = useState<City[]>([]);
  const [unloadingCities, setUnloadingCities] = useState<City[]>([]);
  const [loadingCitiesLoading, setLoadingCitiesLoading] = useState(false);
  const [loadingUnloadingCities, setLoadingUnloadingCities] = useState(false);
  
  const formContainerRef = useRef<HTMLDivElement>(null);


  // Lista de UFs brasileiras
  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  // Função para buscar cidades da API BrasilAPI
  const fetchCities = async (state: string, type: 'loading' | 'unloading') => {
    if (!state) return;
    
    const setLoading = type === 'loading' ? setLoadingCitiesLoading : setLoadingUnloadingCities;
    const setCities = type === 'loading' ? setLoadingCities : setUnloadingCities;
    
    setLoading(true);
    try {
      const response = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${state}?providers=dados-abertos-br,gov,wikipedia`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar municípios: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Mapear os dados para o formato esperado
      // Remove o estado entre parênteses do nome do município (ex: "SÃO FELIPE (BAHIA)" -> "SÃO FELIPE")
      const formattedCities: City[] = data.map((city: any) => ({
        name: city.nome.replace(/\s*\([^)]*\)\s*$/, '').trim(),
        ibgeCode: city.codigo_ibge
      }));
      
      setCities(formattedCities);
      console.log(`Municípios de ${state} carregados:`, formattedCities.length);
    } catch (error) {
      console.error(`Erro ao buscar municípios de ${state}:`, error);
      setCities([]);
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
  const handleLoadingStateChange = (state: string) => {
    playClickSound();
    onUpdateFormData('loadingState', state);
    onUpdateFormData('loadingCity', '');
  };

  // Handler para mudança de UF de descarregamento
  const handleUnloadingStateChange = (state: string) => {
    playClickSound();
    onUpdateFormData('unloadingState', state);
    onUpdateFormData('unloadingCity', '');
  };

  const handleAddStateToRoute = () => {
    if (!newState) return;
    
    playClickSound();
    const currentStates = formData.routeStates || [];
    const newStateItem: RouteStateItem = {
      id: Date.now().toString(),
      state: newState,
      order: currentStates.length + 1
    };
    
    onUpdateFormData('routeStates', [...currentStates, newStateItem]);
    setNewState('');
  };

  const handleRemoveStateFromRoute = (stateId: string) => {
    playClickSound();
    const currentStates = formData.routeStates || [];
    const filteredStates = currentStates.filter((item: RouteStateItem) => item.id !== stateId);
    
    // Reordenar as UFs restantes
    const reorderedStates = filteredStates.map((item: RouteStateItem, index: number) => ({
      ...item,
      order: index + 1
    }));
    
    onUpdateFormData('routeStates', reorderedStates);
  };

  useEffect(() => {
    if (!formData.loadingState) {
      setLoadingCities([]);
      return;
    }
    fetchCities(formData.loadingState, 'loading');
  }, [formData.loadingState]);

  useEffect(() => {
    if (!formData.unloadingState) {
      setUnloadingCities([]);
      return;
    }
    fetchCities(formData.unloadingState, 'unloading');
  }, [formData.unloadingState]);

  useEffect(() => {
    if (!formData.loadingCity) {
      return;
    }
    setLoadingCities((prev) => {
      const exists = prev.some(
        (city) => city.name.toUpperCase() === formData.loadingCity.toUpperCase()
      );
      if (exists) {
        return prev;
      }
      const notas = Array.isArray(formData.invoices) ? formData.invoices : [];
      const referenceInvoice = notas.find(
        (nota: any) =>
          (nota.issuerCityName || '').toUpperCase() === formData.loadingCity.toUpperCase()
      );
      const ibgeCode = referenceInvoice?.issuerCityCode || formData.loadingCity;
      return [
        {
          name: formData.loadingCity,
          ibgeCode
        },
        ...prev
      ];
    });
  }, [formData.loadingCity, formData.invoices]);

  useEffect(() => {
    if (!formData.unloadingCity) {
      return;
    }
    setUnloadingCities((prev) => {
      const exists = prev.some(
        (city) => city.name.toUpperCase() === formData.unloadingCity.toUpperCase()
      );
      if (exists) {
        return prev;
      }
      const notas = Array.isArray(formData.invoices) ? formData.invoices : [];
      const referenceInvoice = notas.find(
        (nota: any) =>
          (nota.recipientCityName || '').toUpperCase() ===
          formData.unloadingCity.toUpperCase()
      );
      const ibgeCode = referenceInvoice?.recipientCityCode || formData.unloadingCity;
      return [
        {
          name: formData.unloadingCity,
          ibgeCode
        },
        ...prev
      ];
    });
  }, [formData.unloadingCity, formData.invoices]);

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
      backgroundColor: systemColors.background.primary,
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
                value={formData.loadingState || ''}
                onChange={(e) => handleLoadingStateChange(e.target.value)}
                onFocus={() => handleInputFocus('loadingState')}
                onBlur={handleInputBlur}
                onClick={() => playClickSound()}
              >
                <option value="">Selecione a UF</option>
                {brazilianStates.map(uf => (
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
              {loadingCitiesLoading && (
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
                  opacity: loadingCitiesLoading ? 0.7 : 1
                }}
                value={formData.loadingCity || ''}
                onChange={(e) => {
                  playClickSound();
                  onUpdateFormData('loadingCity', e.target.value);
                }}
                onFocus={() => handleInputFocus('municipioCarregamento')}
                onBlur={handleInputBlur}
                onClick={() => playClickSound()}
                disabled={!formData.loadingState || loadingCitiesLoading}
              >
                <option value="">
                  {!formData.loadingState 
                    ? 'Selecione uma UF primeiro' 
                    : loadingCitiesLoading 
                      ? 'Carregando municípios...'
                      : 'Selecione o município'}
                </option>
                {loadingCities.map(city => (
                  <option key={city.ibgeCode} value={city.name}>
                    {city.name}
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
                value={newState}
                onChange={(e) => {
                  playClickSound();
                  setNewState(e.target.value);
                }}
                onFocus={() => handleInputFocus('routeNewState')}
                onBlur={handleInputBlur}
                onClick={() => playClickSound()}
              >
                <option value="">Selecione uma UF</option>
                {brazilianStates.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
              <div style={systemStyles.select.arrow}>
                <div style={systemStyles.select.arrowIcon}></div>
              </div>
            </div>
          </div>
          <AddButton
            onClick={handleAddStateToRoute}
            disabled={!newState}
            label="Adicionar UF"
          />
        </div>
        <div style={styles.infoText}>
          Adicione as UFs por onde a carga passará durante o transporte, na ordem correta.
        </div>

        {/* Lista de UFs */}
        {formData.routeStates && formData.routeStates.length > 0 ? (
          <div style={styles.ufsList}>
            {formData.routeStates.map((routeState: RouteStateItem) => (
              <div key={routeState.id} style={styles.ufItem}>
                <div style={styles.ufInfo}>
                  <span style={styles.ufOrder}>#{routeState.order}</span>
                  <span style={styles.ufName}>{routeState.state}</span>
                </div>
                <button
                  style={styles.removeButton}
                  onClick={() => handleRemoveStateFromRoute(routeState.id)}
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
                value={formData.unloadingState || ''}
                onChange={(e) => handleUnloadingStateChange(e.target.value)}
                onFocus={() => handleInputFocus('unloadingState')}
                onBlur={handleInputBlur}
                onClick={() => playClickSound()}
              >
                <option value="">Selecione a UF</option>
                {brazilianStates.map(uf => (
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
              {loadingUnloadingCities && (
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
                  opacity: loadingUnloadingCities ? 0.7 : 1
                }}
                value={formData.unloadingCity || ''}
                onChange={(e) => {
                  playClickSound();
                  onUpdateFormData('unloadingCity', e.target.value);
                }}
                onFocus={() => handleInputFocus('municipioDescarregamento')}
                onBlur={handleInputBlur}
                onClick={() => playClickSound()}
                disabled={!formData.unloadingState || loadingUnloadingCities}
              >
                <option value="">
                  {!formData.unloadingState 
                    ? 'Selecione uma UF primeiro' 
                    : loadingUnloadingCities 
                      ? 'Carregando municípios...'
                      : 'Selecione o município'}
                </option>
                {unloadingCities.map(city => (
                  <option key={city.ibgeCode} value={city.name}>
                    {city.name}
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
