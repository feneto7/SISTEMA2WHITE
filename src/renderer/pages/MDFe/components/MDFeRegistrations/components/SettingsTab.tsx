import React from 'react';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { modalStyles } from '../../../../../styles/modalStyles';

interface SettingsTabProps {
  formData: any;
  onUpdateFormData: (field: string, value: string | boolean) => void;
}

export function SettingsTab({ formData, onUpdateFormData }: SettingsTabProps): JSX.Element {
  const playClickSound = useClickSound();

  const handleInputChange = (field: string, value: string) => {
    onUpdateFormData(field, value);
  };

  return (
    <div style={modalStyles.tabContent}>
      <h3 style={modalStyles.tabContentTitle}>Configurações do Sistema</h3>
      
      {/* Environment Settings */}
      <div style={modalStyles.formSection}>
        <h4 style={modalStyles.formSectionTitle}>Ambiente</h4>
        <div style={modalStyles.formGrid}>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Ambiente</label>
            <select
              style={modalStyles.formInput}
              value={formData.ambiente}
              onChange={(e) => handleInputChange('ambiente', e.target.value)}
              onClick={() => playClickSound()}
            >
              <option value="homologacao">Homologação</option>
              <option value="producao">Produção</option>
            </select>
          </div>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Série</label>
            <input
              type="text"
              style={modalStyles.formInput}
              value={formData.serie}
              onChange={(e) => handleInputChange('serie', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="001"
            />
          </div>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Número Inicial</label>
            <input
              type="number"
              style={modalStyles.formInput}
              value={formData.numeroInicial}
              onChange={(e) => handleInputChange('numeroInicial', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="1"
            />
          </div>
        </div>
      </div>

      {/* Digital Certificate */}
      <div style={modalStyles.formSection}>
        <h4 style={modalStyles.formSectionTitle}>Certificado Digital</h4>
        <div style={modalStyles.formGrid}>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Caminho do Certificado</label>
            <input
              type="text"
              style={modalStyles.formInput}
              value={formData.certificadoDigital}
              onChange={(e) => handleInputChange('certificadoDigital', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="C:\certificados\certificado.p12"
            />
          </div>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Senha do Certificado</label>
            <input
              type="password"
              style={modalStyles.formInput}
              value={formData.senhaCertificado}
              onChange={(e) => handleInputChange('senhaCertificado', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="Senha do certificado"
            />
          </div>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Validade do Certificado</label>
            <input
              type="date"
              style={modalStyles.formInput}
              value={formData.validadeCertificado}
              onChange={(e) => handleInputChange('validadeCertificado', e.target.value)}
              onClick={() => playClickSound()}
            />
          </div>
        </div>
      </div>

      {/* Issuer Information */}
      <div style={modalStyles.formSection}>
        <h4 style={modalStyles.formSectionTitle}>Dados do Emitente</h4>
        <div style={modalStyles.formGrid}>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Nome/Razão Social</label>
            <input
              type="text"
              style={modalStyles.formInput}
              value={formData.emitente}
              onChange={(e) => handleInputChange('emitente', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="Empresa Transportadora LTDA"
            />
          </div>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>CNPJ</label>
            <input
              type="text"
              style={modalStyles.formInput}
              value={formData.cnpjEmitente}
              onChange={(e) => handleInputChange('cnpjEmitente', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="12.345.678/0001-90"
            />
          </div>
          <div style={{...modalStyles.formGroup, ...modalStyles.formGridFull}}>
            <label style={modalStyles.formLabel}>Endereço</label>
            <input
              type="text"
              style={modalStyles.formInput}
              value={formData.enderecoEmitente}
              onChange={(e) => handleInputChange('enderecoEmitente', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="Rua das Empresas, 123"
            />
          </div>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Cidade</label>
            <input
              type="text"
              style={modalStyles.formInput}
              value={formData.cidadeEmitente}
              onChange={(e) => handleInputChange('cidadeEmitente', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="São Paulo"
            />
          </div>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>UF</label>
            <input
              type="text"
              style={modalStyles.formInput}
              value={formData.ufEmitente}
              onChange={(e) => handleInputChange('ufEmitente', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="SP"
            />
          </div>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>CEP</label>
            <input
              type="text"
              style={modalStyles.formInput}
              value={formData.cepEmitente}
              onChange={(e) => handleInputChange('cepEmitente', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="01234-567"
            />
          </div>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Telefone</label>
            <input
              type="text"
              style={modalStyles.formInput}
              value={formData.telefoneEmitente}
              onChange={(e) => handleInputChange('telefoneEmitente', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="(11) 3333-4444"
            />
          </div>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>E-mail</label>
            <input
              type="email"
              style={modalStyles.formInput}
              value={formData.emailEmitente}
              onChange={(e) => handleInputChange('emailEmitente', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="contato@empresa.com"
            />
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div style={modalStyles.formSection}>
        <h4 style={modalStyles.formSectionTitle}>Configurações do Sistema</h4>
        <div style={modalStyles.formGrid}>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Timeout (segundos)</label>
            <input
              type="number"
              style={modalStyles.formInput}
              value={formData.timeout}
              onChange={(e) => handleInputChange('timeout', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="30"
            />
          </div>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>Tentativas de Reenvio</label>
            <input
              type="number"
              style={modalStyles.formInput}
              value={formData.tentativasReenvio}
              onChange={(e) => handleInputChange('tentativasReenvio', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="3"
            />
          </div>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>
              <input
                type="checkbox"
                checked={formData.backupAutomatico}
                onChange={(e) => onUpdateFormData('backupAutomatico', e.target.checked)}
                onClick={() => playClickSound()}
                style={{ marginRight: '8px' }}
              />
              Backup Automático
            </label>
          </div>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>
              <input
                type="checkbox"
                checked={formData.notificacoesEmail}
                onChange={(e) => onUpdateFormData('notificacoesEmail', e.target.checked)}
                onClick={() => playClickSound()}
                style={{ marginRight: '8px' }}
              />
              Notificações por E-mail
            </label>
          </div>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.formLabel}>
              <input
                type="checkbox"
                checked={formData.logDetalhado}
                onChange={(e) => onUpdateFormData('logDetalhado', e.target.checked)}
                onClick={() => playClickSound()}
                style={{ marginRight: '8px' }}
              />
              Log Detalhado
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
