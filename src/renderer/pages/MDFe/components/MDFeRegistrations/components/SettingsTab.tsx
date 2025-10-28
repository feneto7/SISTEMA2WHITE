import React from 'react';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { systemStyles, systemColors } from '../../../../../styles/systemStyle';

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
    <div style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
      <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 24px 0', paddingBottom: '16px', borderBottom: '1px solid #C8C8C8', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>Configurações do Sistema</h3>
      
      {/* Environment Settings */}
      <div style={{ backgroundColor: '#FBFBFB', border: '1px solid #B4B4B4', borderRadius: '4px', padding: '12px', marginBottom: '16px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 8px 0', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>Ambiente</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>Ambiente</label>
            <select
              style={systemStyles.input.field}
              value={formData.ambiente}
              onChange={(e) => handleInputChange('ambiente', e.target.value)}
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
              value={formData.serie}
              onChange={(e) => handleInputChange('serie', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="001"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>Número Inicial</label>
            <input
              type="number"
              style={systemStyles.input.field}
              value={formData.numeroInicial}
              onChange={(e) => handleInputChange('numeroInicial', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="1"
            />
          </div>
        </div>
      </div>

      {/* Digital Certificate */}
      <div style={{ backgroundColor: '#FBFBFB', border: '1px solid #B4B4B4', borderRadius: '4px', padding: '12px', marginBottom: '16px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 8px 0', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>Certificado Digital</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>Caminho do Certificado</label>
            <input
              type="text"
              style={systemStyles.input.field}
              value={formData.certificadoDigital}
              onChange={(e) => handleInputChange('certificadoDigital', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="C:\certificados\certificado.p12"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>Senha do Certificado</label>
            <input
              type="password"
              style={systemStyles.input.field}
              value={formData.senhaCertificado}
              onChange={(e) => handleInputChange('senhaCertificado', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="Senha do certificado"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>Validade do Certificado</label>
            <input
              type="date"
              style={systemStyles.input.field}
              value={formData.validadeCertificado}
              onChange={(e) => handleInputChange('validadeCertificado', e.target.value)}
              onClick={() => playClickSound()}
            />
          </div>
        </div>
      </div>

      {/* Issuer Information */}
      <div style={{ backgroundColor: '#FBFBFB', border: '1px solid #B4B4B4', borderRadius: '4px', padding: '12px', marginBottom: '16px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 8px 0', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>Dados do Emitente</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>Nome/Razão Social</label>
            <input
              type="text"
              style={systemStyles.input.field}
              value={formData.emitente}
              onChange={(e) => handleInputChange('emitente', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="Empresa Transportadora LTDA"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>CNPJ</label>
            <input
              type="text"
              style={systemStyles.input.field}
              value={formData.cnpjEmitente}
              onChange={(e) => handleInputChange('cnpjEmitente', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="12.345.678/0001-90"
            />
          </div>
          <div style={{ marginBottom: '20px', gridColumn: '1 / -1' }}>
            <label style={systemStyles.input.label}>Endereço</label>
            <input
              type="text"
              style={systemStyles.input.field}
              value={formData.enderecoEmitente}
              onChange={(e) => handleInputChange('enderecoEmitente', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="Rua das Empresas, 123"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>Cidade</label>
            <input
              type="text"
              style={systemStyles.input.field}
              value={formData.cidadeEmitente}
              onChange={(e) => handleInputChange('cidadeEmitente', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="São Paulo"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>UF</label>
            <input
              type="text"
              style={systemStyles.input.field}
              value={formData.ufEmitente}
              onChange={(e) => handleInputChange('ufEmitente', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="SP"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>CEP</label>
            <input
              type="text"
              style={systemStyles.input.field}
              value={formData.cepEmitente}
              onChange={(e) => handleInputChange('cepEmitente', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="01234-567"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>Telefone</label>
            <input
              type="text"
              style={systemStyles.input.field}
              value={formData.telefoneEmitente}
              onChange={(e) => handleInputChange('telefoneEmitente', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="(11) 3333-4444"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={systemStyles.input.label}>E-mail</label>
            <input
              type="email"
              style={systemStyles.input.field}
              value={formData.emailEmitente}
              onChange={(e) => handleInputChange('emailEmitente', e.target.value)}
              onClick={() => playClickSound()}
              placeholder="contato@empresa.com"
            />
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div style={{ backgroundColor: '#FBFBFB', border: '1px solid #B4B4B4', borderRadius: '4px', padding: '12px', marginBottom: '16px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 8px 0', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>Configurações do Sistema</h4>
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
                checked={formData.backupAutomatico}
                onChange={(e) => onUpdateFormData('backupAutomatico', e.target.checked)}
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
                checked={formData.notificacoesEmail}
                onChange={(e) => onUpdateFormData('notificacoesEmail', e.target.checked)}
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
