import React from 'react';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { useTheme } from '../../../../../styles/ThemeProvider';

interface SettingsTabProps {
  formData: any;
  onUpdateFormData: (field: string, value: string | boolean) => void;
}

export function SettingsTab({ formData, onUpdateFormData }: SettingsTabProps): JSX.Element {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();

  const handleInputChange = (field: string, value: string) => {
    onUpdateFormData(field, value);
  };

  return (
    <div style={{ flex: 1, padding: '24px', overflow: 'auto', background: systemColors.background.content }}>
      <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 24px 0', paddingBottom: '16px', borderBottom: `1px solid ${systemColors.border.light}`, color: systemColors.text.primary, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>Configurações do Sistema</h3>
      
      {/* Environment Settings */}
      <div style={{ background: systemColors.background.primary, border: `1px solid ${systemColors.border.light}`, borderRadius: '4px', padding: '12px', marginBottom: '16px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 8px 0', color: systemColors.text.primary, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>Ambiente</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>Ambiente</label>
            <select
              style={systemStyles.select.field}
              value={formData.environment}
              onChange={(e) => handleInputChange('environment', e.target.value)}
              onClick={() => playClickSound()}
            >
              <option value="homologacao">Homologação</option>
              <option value="producao">Produção</option>
            </select>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>Série</label>
            <input
              type="text"
              style={systemStyles.input.field}
              value={formData.series}
              onChange={(e) => handleInputChange('series', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="001"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>Número Inicial</label>
            <input
              type="number"
              style={systemStyles.input.field}
              value={formData.initialNumber}
              onChange={(e) => handleInputChange('initialNumber', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="1"
            />
          </div>
        </div>
      </div>

      {/* Digital Certificate */}
      <div style={{ background: systemColors.background.primary, border: `1px solid ${systemColors.border.light}`, borderRadius: '4px', padding: '12px', marginBottom: '16px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 8px 0', color: systemColors.text.primary, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>Certificado Digital</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>Caminho do Certificado</label>
            <input
              type="text"
              style={systemStyles.input.field}
              value={formData.digitalCertificatePath}
              onChange={(e) => handleInputChange('digitalCertificatePath', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="C:\certificados\certificado.p12"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>Senha do Certificado</label>
            <input
              type="password"
              style={systemStyles.input.field}
              value={formData.digitalCertificatePassword}
              onChange={(e) => handleInputChange('digitalCertificatePassword', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="Senha do certificado"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>Validade do Certificado</label>
            <input
              type="date"
              style={systemStyles.input.field}
              value={formData.digitalCertificateExpiration}
              onChange={(e) => handleInputChange('digitalCertificateExpiration', e.target.value)}
              onClick={() => playClickSound()}
            />
          </div>
        </div>
      </div>

      {/* Issuer Information */}
      <div style={{ background: systemColors.background.primary, border: `1px solid ${systemColors.border.light}`, borderRadius: '4px', padding: '12px', marginBottom: '16px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 8px 0', color: systemColors.text.primary, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>Dados do Emitente</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>Nome/Razão Social</label>
            <input
              type="text"
              style={systemStyles.input.field}
              value={formData.issuerName}
              onChange={(e) => handleInputChange('issuerName', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="Empresa Transportadora LTDA"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>CNPJ</label>
            <input
              type="text"
              style={systemStyles.input.field}
              value={formData.issuerCnpj}
              onChange={(e) => handleInputChange('issuerCnpj', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="12.345.678/0001-90"
            />
          </div>
          <div style={{ marginBottom: '20px', gridColumn: '1 / -1' }}>
            <label style={systemStyles.input.label}>Endereço</label>
            <input
              type="text"
              style={systemStyles.input.field}
              value={formData.issuerAddress}
              onChange={(e) => handleInputChange('issuerAddress', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="Rua das Empresas, 123"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>Cidade</label>
            <input
              type="text"
              style={systemStyles.input.field}
              value={formData.issuerCity}
              onChange={(e) => handleInputChange('issuerCity', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="São Paulo"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>UF</label>
            <input
              type="text"
              style={systemStyles.input.field}
              value={formData.issuerState}
              onChange={(e) => handleInputChange('issuerState', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="SP"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>CEP</label>
            <input
              type="text"
              style={systemStyles.input.field}
              value={formData.issuerZipCode}
              onChange={(e) => handleInputChange('issuerZipCode', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="01234-567"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>Telefone</label>
            <input
              type="text"
              style={systemStyles.input.field}
              value={formData.issuerPhone}
              onChange={(e) => handleInputChange('issuerPhone', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="(11) 3333-4444"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>E-mail</label>
            <input
              type="email"
              style={systemStyles.input.field}
              value={formData.issuerEmail}
              onChange={(e) => handleInputChange('issuerEmail', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="contato@empresa.com"
            />
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div style={{ background: systemColors.background.primary, border: `1px solid ${systemColors.border.light}`, borderRadius: '4px', padding: '12px', marginBottom: '16px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 8px 0', color: systemColors.text.primary, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>Configurações do Sistema</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>Timeout (segundos)</label>
            <input
              type="number"
              style={systemStyles.input.field}
              value={formData.timeout}
              onChange={(e) => handleInputChange('timeout', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="30"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>Tentativas de Reenvio</label>
            <input
              type="number"
              style={systemStyles.input.field}
              value={formData.tentativasReenvio}
              onChange={(e) => handleInputChange('tentativasReenvio', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="3"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>
              <input
                type="checkbox"
                checked={formData.automaticBackup}
                onChange={(e) => onUpdateFormData('automaticBackup', e.target.checked)}
                onClick={() => playClickSound()}
                style={{ marginRight: '8px' }}
              />
              Backup Automático
            </label>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>
              <input
                type="checkbox"
                checked={formData.emailNotifications}
                onChange={(e) => onUpdateFormData('emailNotifications', e.target.checked)}
                onClick={() => playClickSound()}
                style={{ marginRight: '8px' }}
              />
              Notificações por E-mail
            </label>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>
              <input
                type="checkbox"
                checked={formData.detailedLog}
                onChange={(e) => onUpdateFormData('detailedLog', e.target.checked)}
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
