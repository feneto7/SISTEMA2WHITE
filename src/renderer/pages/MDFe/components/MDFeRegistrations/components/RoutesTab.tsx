import React from 'react';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { systemStyles, systemColors } from '../../../../../styles/systemStyle';

interface RoutesTabProps {
  formData: any;
  onUpdateFormData: (field: string, value: string | boolean) => void;
}

export function RoutesTab({ formData, onUpdateFormData }: RoutesTabProps): JSX.Element {
  const playClickSound = useClickSound();

  const handleInputChange = (field: string, value: string) => {
    onUpdateFormData(field, value);
  };

  const styles = {
    container: {
      padding: '20px'
    },
    title: {
      ...systemStyles.page.title,
      fontSize: '18px',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: `1px solid ${systemColors.border.light}`
    },
    section: {
      marginBottom: '24px'
    },
    sectionTitle: {
      ...systemStyles.page.title,
      fontSize: '14px',
      marginBottom: '12px'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px'
    },
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      ...systemStyles.input.label
    },
    input: {
      ...systemStyles.input.field
    },
    select: {
      ...systemStyles.select.field
    },
    textarea: {
      ...systemStyles.input.field,
      minHeight: '80px',
      resize: 'vertical' as const
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    fullWidth: {
      gridColumn: '1 / -1'
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Dados das Rotas</h3>
      
      {/* Route Information */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Informações da Rota</h4>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nome da Rota</label>
            <input
              type="text"
              style={styles.input}
              value={formData.nomeRota}
              onChange={(e) => handleInputChange('nomeRota', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="São Paulo - Rio de Janeiro"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Origem</label>
            <input
              type="text"
              style={styles.input}
              value={formData.origem}
              onChange={(e) => handleInputChange('origem', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="São Paulo/SP"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Destino</label>
            <input
              type="text"
              style={styles.input}
              value={formData.destino}
              onChange={(e) => handleInputChange('destino', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="Rio de Janeiro/RJ"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Distância (km)</label>
            <input
              type="number"
              style={styles.input}
              value={formData.distancia}
              onChange={(e) => handleInputChange('distancia', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="430"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tempo Estimado</label>
            <input
              type="text"
              style={styles.input}
              value={formData.tempoEstimado}
              onChange={(e) => handleInputChange('tempoEstimado', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="5h30min"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Combustível Estimado (L)</label>
            <input
              type="number"
              style={styles.input}
              value={formData.combustivelEstimado}
              onChange={(e) => handleInputChange('combustivelEstimado', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="50"
            />
          </div>
        </div>
      </div>

      {/* Schedule Information */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Horários</h4>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Horário de Saída</label>
            <input
              type="time"
              style={styles.input}
              value={formData.horarioSaida}
              onChange={(e) => handleInputChange('horarioSaida', e.target.value)}
              onClick={() => playClickSound()}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Horário de Chegada</label>
            <input
              type="time"
              style={styles.input}
              value={formData.horarioChegada}
              onChange={(e) => handleInputChange('horarioChegada', e.target.value)}
              onClick={() => playClickSound()}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Dias da Semana</label>
            <div style={{ position: 'relative' as const }}>
              <select
                style={styles.select}
                value={formData.diasSemana}
                onChange={(e) => handleInputChange('diasSemana', e.target.value)}
                onClick={() => playClickSound()}
              >
                <option value="">Selecione</option>
                <option value="seg-sex">Segunda a Sexta</option>
                <option value="seg-sab">Segunda a Sábado</option>
                <option value="dom-dom">Todos os dias</option>
                <option value="personalizado">Personalizado</option>
              </select>
              <div style={systemStyles.select.arrow}>
                <div style={systemStyles.select.arrowIcon}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Informações Adicionais</h4>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Pedágio (R$)</label>
            <input
              type="number"
              style={styles.input}
              value={formData.pedagio}
              onChange={(e) => handleInputChange('pedagio', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="45.50"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Pontos de Parada</label>
            <input
              type="text"
              style={styles.input}
              value={formData.pontosParada}
              onChange={(e) => handleInputChange('pontosParada', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="Posto BR, Restaurante"
            />
          </div>
          <div style={{...styles.formGroup, ...styles.fullWidth}}>
            <label style={styles.label}>Observações</label>
            <textarea
              style={styles.textarea}
              value={formData.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="Observações importantes sobre a rota..."
            />
          </div>
          <div style={styles.formGroup}>
            <div style={systemStyles.checkbox.container}>
              <div style={systemStyles.checkbox.box}>
                {formData.ativo && (
                  <svg style={systemStyles.checkbox.checkmark} viewBox="0 0 10 10">
                    <polyline points="1,5 4,8 9,1" stroke="#FFFFFF" strokeWidth="2" fill="none" />
                  </svg>
                )}
              </div>
              <label style={systemStyles.checkbox.label}>Rota Ativa</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
