import React from 'react';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { modalStyles } from '../../../../../styles/modalStyles';

interface RoutesTabProps {
  formData: any;
  onUpdateFormData: (field: string, value: string | boolean) => void;
}

export function RoutesTab({ formData, onUpdateFormData }: RoutesTabProps): JSX.Element {
  const playClickSound = useClickSound();

  const handleInputChange = (field: string, value: string) => {
    onUpdateFormData(field, value);
  };

  return (
    <div style={modalStyles.tabContent}>
      <h3 style={modalStyles.tabContentTitle}>Dados das Rotas</h3>
      
      {/* Route Information */}
      <div style={modalStyles.formSection}>
        <h4 style={modalStyles.formSectionTitle}>Informações da Rota</h4>
        <div style={modalStyles.formGrid}>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Nome da Rota</label>
            <input
              type="text"
              style={modalStyles.formInput}
              value={formData.nomeRota}
              onChange={(e) => handleInputChange('nomeRota', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="São Paulo - Rio de Janeiro"
            />
          </div>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Origem</label>
            <input
              type="text"
              style={modalStyles.formInput}
              value={formData.origem}
              onChange={(e) => handleInputChange('origem', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="São Paulo/SP"
            />
          </div>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Destino</label>
            <input
              type="text"
              style={modalStyles.formInput}
              value={formData.destino}
              onChange={(e) => handleInputChange('destino', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="Rio de Janeiro/RJ"
            />
          </div>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Distância (km)</label>
            <input
              type="number"
              style={modalStyles.formInput}
              value={formData.distancia}
              onChange={(e) => handleInputChange('distancia', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="430"
            />
          </div>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Tempo Estimado</label>
            <input
              type="text"
              style={modalStyles.formInput}
              value={formData.tempoEstimado}
              onChange={(e) => handleInputChange('tempoEstimado', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="5h30min"
            />
          </div>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Combustível Estimado (L)</label>
            <input
              type="number"
              style={modalStyles.formInput}
              value={formData.combustivelEstimado}
              onChange={(e) => handleInputChange('combustivelEstimado', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="50"
            />
          </div>
        </div>
      </div>

      {/* Schedule Information */}
      <div style={modalStyles.formSection}>
        <h4 style={modalStyles.formSectionTitle}>Horários</h4>
        <div style={modalStyles.formGrid}>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Horário de Saída</label>
            <input
              type="time"
              style={modalStyles.formInput}
              value={formData.horarioSaida}
              onChange={(e) => handleInputChange('horarioSaida', e.target.value)}
              onClick={() => playClickSound()}
            />
          </div>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Horário de Chegada</label>
            <input
              type="time"
              style={modalStyles.formInput}
              value={formData.horarioChegada}
              onChange={(e) => handleInputChange('horarioChegada', e.target.value)}
              onClick={() => playClickSound()}
            />
          </div>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Dias da Semana</label>
            <select
              style={modalStyles.formInput}
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
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div style={modalStyles.formSection}>
        <h4 style={modalStyles.formSectionTitle}>Informações Adicionais</h4>
        <div style={modalStyles.formGrid}>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Pedágio (R$)</label>
            <input
              type="number"
              style={modalStyles.formInput}
              value={formData.pedagio}
              onChange={(e) => handleInputChange('pedagio', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="45.50"
            />
          </div>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Pontos de Parada</label>
            <input
              type="text"
              style={modalStyles.formInput}
              value={formData.pontosParada}
              onChange={(e) => handleInputChange('pontosParada', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="Posto BR, Restaurante"
            />
          </div>
          <div style={{...modalStyles.formGroup, ...modalStyles.formGridFull}}>
            <label style={modalStyles.formLabel}>Observações</label>
            <textarea
              style={{...modalStyles.formInput, minHeight: '80px', resize: 'vertical'}}
              value={formData.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="Observações importantes sobre a rota..."
            />
          </div>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>
              <input
                type="checkbox"
                checked={formData.ativo}
                onChange={(e) => onUpdateFormData('ativo', e.target.checked)}
                onClick={() => playClickSound()}
                style={{ marginRight: '8px' }}
              />
              Rota Ativa
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
