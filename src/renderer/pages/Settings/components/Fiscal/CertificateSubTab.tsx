//--------------------------------------------------------------------
// SUB-ABA DE CERTIFICADO DIGITAL
// Configurações do certificado digital A1 ou A3 e ambiente fiscal
//--------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../styles/ThemeProvider';
import { extractCertificateMetadata } from '../../../../utils/certificateUtils';
import { Dialog } from '../../../../components/Dialog/Dialog';

const ENVIRONMENT_KEY = 'fiscal_environment';
const CERTIFICATE_TYPE_KEY = 'certificate_type';
const CERTIFICATE_FILE_KEY = 'certificate_file_base64';
const CERTIFICATE_PASSWORD_KEY = 'certificate_password';
const CERTIFICATE_METADATA_KEY = 'certificate_metadata';

interface CertificateMetadata {
  fileName: string;
  filePath: string;
  uploadDate: string;
  validFrom?: string;
  validTo?: string;
  cnpj?: string;
  companyName?: string;
}

export function CertificateSubTab(): JSX.Element {
  const { systemColors, systemStyles } = useTheme();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [environment, setEnvironment] = useState<'producao' | 'homologacao'>('homologacao');
  const [savedEnvironment, setSavedEnvironment] = useState<'producao' | 'homologacao'>('homologacao');
  
  // Estados do certificado
  const [certificateType, setCertificateType] = useState<'A1' | 'A3'>('A1');
  const [savedCertificateType, setSavedCertificateType] = useState<'A1' | 'A3'>('A1');
  const [certificateFile, setCertificateFile] = useState<string>('');
  const [savedCertificateFile, setSavedCertificateFile] = useState<string>('');
  const [certificatePassword, setCertificatePassword] = useState<string>('');
  const [savedCertificatePassword, setSavedCertificatePassword] = useState<string>('');
  const [certificateMetadata, setCertificateMetadata] = useState<CertificateMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tempFilePath, setTempFilePath] = useState<string>('');
  
  // Estados para Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogWarning, setDialogWarning] = useState<string>('');
  const [dialogHint, setDialogHint] = useState<string>('');

  // Carregar dados salvos ao montar o componente
  useEffect(() => {
    const savedEnv = localStorage.getItem(ENVIRONMENT_KEY) as 'producao' | 'homologacao' | null;
    if (savedEnv) {
      setSavedEnvironment(savedEnv);
      setEnvironment(savedEnv);
    }

    const savedType = localStorage.getItem(CERTIFICATE_TYPE_KEY) as 'A1' | 'A3' | null;
    if (savedType) {
      setSavedCertificateType(savedType);
      setCertificateType(savedType);
    }

    // Carregar certificado em Base64
    const savedCertificateFile = localStorage.getItem(CERTIFICATE_FILE_KEY);
    if (savedCertificateFile) {
      setCertificateFile(savedCertificateFile);
      setSavedCertificateFile(savedCertificateFile);
    }

    // Carregar senha do certificado
    const savedPassword = localStorage.getItem(CERTIFICATE_PASSWORD_KEY);
    if (savedPassword) {
      setCertificatePassword(savedPassword);
      setSavedCertificatePassword(savedPassword);
    }

    // Carregar metadados do certificado
    const savedMetadata = localStorage.getItem(CERTIFICATE_METADATA_KEY);
    if (savedMetadata) {
      const metadata = JSON.parse(savedMetadata);
      setCertificateMetadata(metadata);
      
      // Restaurar caminho do arquivo se disponível nos metadados
      if (metadata.filePath) {
        setTempFilePath(metadata.filePath);
      }
    }
  }, []);

  // Função para selecionar certificado
  const handleSelectCertificate = async () => {
    try {
      setIsLoading(true);
      
      const filePaths = await window.electron.showOpenDialog({
        properties: ['openFile'],
        title: 'Selecionar Certificado Digital',
        buttonLabel: 'Selecionar',
        filters: [
          { name: 'Certificado Digital', extensions: ['pfx', 'p12'] }
        ]
      });

      if (filePaths && filePaths.length > 0) {
        const filePath = filePaths[0];
        const fileName = filePath.split('\\').pop() || filePath.split('/').pop() || 'certificado.pfx';
        
        // Salvar caminho temporário para validar depois
        setTempFilePath(filePath);
        
        // Ler arquivo e converter para Base64
        const base64 = await window.electronAPI.readFileAsBase64(filePath);
        
        setCertificateFile(base64);
        
        // Extrair metadados básicos usando utilitário
        const metadata = extractCertificateMetadata(fileName, filePath);
        
        setCertificateMetadata(metadata);
      }
    } catch (error) {
      console.error('Erro ao selecionar certificado:', error);
      setDialogWarning('Erro ao selecionar certificado');
      setDialogHint('Não foi possível selecionar o arquivo. Verifique se o arquivo está acessível e tente novamente.');
      setDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para validar certificado e extrair informações
  const handleValidateCertificate = async () => {
    if (!tempFilePath || !certificatePassword) {
      setDialogWarning('Campos obrigatórios');
      setDialogHint('Selecione um certificado e informe a senha antes de validar.');
      setDialogOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      
      // Ler informações do certificado
      const certInfo = await window.electronAPI.readCertificateInfo(tempFilePath, certificatePassword);
      
      // Atualizar metadados com informações extraídas
      if (certificateMetadata) {
        const updatedMetadata: CertificateMetadata = {
          ...certificateMetadata,
          validFrom: certInfo.validFrom,
          validTo: certInfo.validTo,
          cnpj: certInfo.cnpj || undefined,
          companyName: certInfo.companyName || undefined
        };
        
        setCertificateMetadata(updatedMetadata);
      }
      
      setDialogWarning('Certificado validado');
      setDialogHint('O certificado foi validado com sucesso e as informações foram extraídas.');
      setDialogOpen(true);
    } catch (error: any) {
      console.error('Erro ao validar certificado:', error);
      
      const errorMessage = error?.message || 'Erro desconhecido';
      
      if (errorMessage.includes('Senha incorreta')) {
        setDialogWarning('Senha incorreta');
        setDialogHint('A senha informada está incorreta. Verifique a senha do certificado e tente novamente.');
      } else {
        setDialogWarning('Erro ao validar certificado');
        setDialogHint(errorMessage || 'Não foi possível validar o certificado. Verifique o arquivo e a senha e tente novamente.');
      }
      
      setDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    // Validar se certificado foi selecionado
    if (!certificateFile) {
      setDialogWarning('Certificado não selecionado');
      setDialogHint('Selecione um certificado digital antes de salvar.');
      setDialogOpen(true);
      return;
    }

    // Validar se senha foi informada
    if (!certificatePassword) {
      setDialogWarning('Senha não informada');
      setDialogHint('Informe a senha do certificado antes de salvar.');
      setDialogOpen(true);
      return;
    }

    // Salvar dados no localStorage
    localStorage.setItem(ENVIRONMENT_KEY, environment);
    localStorage.setItem(CERTIFICATE_TYPE_KEY, certificateType);
    localStorage.setItem(CERTIFICATE_FILE_KEY, certificateFile);
    localStorage.setItem(CERTIFICATE_PASSWORD_KEY, certificatePassword);
    
    if (certificateMetadata) {
      localStorage.setItem(CERTIFICATE_METADATA_KEY, JSON.stringify(certificateMetadata));
    }
    
    // Atualizar estados salvos para comparação
    setSavedEnvironment(environment);
    setSavedCertificateType(certificateType);
    setSavedCertificateFile(certificateFile);
    setSavedCertificatePassword(certificatePassword);
    setShowSuccessMessage(true);
    
    // Ocultar mensagem após 3 segundos
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  // Verificar se há dados válidos para salvar
  const hasValidData = certificateFile !== '' && certificatePassword !== '';
  
  // Verificar se há mudanças em relação aos valores salvos
  const hasChanges = 
    environment !== savedEnvironment || 
    certificateType !== savedCertificateType ||
    certificateFile !== savedCertificateFile ||
    certificatePassword !== savedCertificatePassword;
  
  // Botão deve estar habilitado se há dados válidos E há mudanças
  // Também habilita se há dados válidos mas ainda não foram salvos (primeira vez)
  const canSave = hasValidData && (hasChanges || (savedCertificateFile === '' && savedCertificatePassword === ''));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <p style={{ 
        fontSize: '13px', 
        color: systemColors.text.secondary,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}>
        Configure o certificado digital e o ambiente fiscal para emissão de documentos fiscais.
      </p>

      {/* Seleção de Ambiente Fiscal */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px',
        padding: '20px',
        background: systemColors.background.secondary,
        border: `1px solid ${systemColors.border.light}`,
        borderRadius: '8px'
      }}>
        <label style={{
          ...systemStyles.input.label,
          marginBottom: '8px'
        }}>
          Ambiente Fiscal *
        </label>
        
        <div style={{ display: 'flex', gap: '24px' }}>
          {/* Opção Produção */}
          <label style={systemStyles.radio.container}>
            <div 
              style={{
                ...systemStyles.radio.circle,
                ...(environment === 'producao' ? systemStyles.radio.circleChecked : {})
              }}
              onClick={() => setEnvironment('producao')}
            >
              {environment === 'producao' && (
                <div style={systemStyles.radio.dot}></div>
              )}
            </div>
            <span style={systemStyles.radio.label}>Produção</span>
          </label>

          {/* Opção Homologação */}
          <label style={systemStyles.radio.container}>
            <div 
              style={{
                ...systemStyles.radio.circle,
                ...(environment === 'homologacao' ? systemStyles.radio.circleChecked : {})
              }}
              onClick={() => setEnvironment('homologacao')}
            >
              {environment === 'homologacao' && (
                <div style={systemStyles.radio.dot}></div>
              )}
            </div>
            <span style={systemStyles.radio.label}>Homologação</span>
          </label>
        </div>

        {/* Indicador visual do ambiente selecionado */}
        <div style={{
          padding: '12px 16px',
          background: environment === 'producao' ? '#FFF3E0' : '#E3F2FD',
          border: `1px solid ${environment === 'producao' ? '#FF9800' : '#2196F3'}`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: environment === 'producao' ? '#FF9800' : '#2196F3'
          }}></div>
          <span style={{
            fontSize: '12px',
            color: systemColors.text.primary,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
          }}>
            {environment === 'producao' 
              ? 'Sistema configurado para PRODUÇÃO - Documentos fiscais serão válidos.' 
              : 'Sistema configurado para HOMOLOGAÇÃO - Documentos fiscais serão apenas para testes.'}
          </span>
        </div>
      </div>

      {/* Tipo de Certificado */}
      <div style={systemStyles.input.container}>
        <label style={systemStyles.input.label}>Tipo de Certificado *</label>
        <div style={systemStyles.select.container}>
          <select
            value={certificateType}
            onChange={(e) => setCertificateType(e.target.value as 'A1' | 'A3')}
            style={systemStyles.select.field}
          >
            <option value="A1">A1 (Arquivo Digital)</option>
            <option value="A3">A3 (Token/Cartão)</option>
          </select>
          <div style={systemStyles.select.arrow}>
            <div style={systemStyles.select.arrowIcon}></div>
          </div>
        </div>
        <p style={{
          fontSize: '11px',
          color: systemColors.text.secondary,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          margin: '4px 0 0 0'
        }}>
          {certificateType === 'A1' 
            ? 'Certificado armazenado em arquivo .pfx ou .p12' 
            : 'Certificado armazenado em token USB ou cartão inteligente'}
        </p>
      </div>

      {/* Seleção do Arquivo de Certificado */}
      <div style={systemStyles.input.container}>
        <label style={systemStyles.input.label}>Arquivo do Certificado *</label>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={handleSelectCertificate}
            disabled={isLoading}
            style={{
              ...systemStyles.button.primary,
              flex: '0 0 auto',
              ...(isLoading ? systemStyles.button.disabled : {})
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                Object.assign(e.currentTarget.style, systemStyles.button.primaryHover);
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                Object.assign(e.currentTarget.style, systemStyles.button.primary);
              }
            }}
          >
            {isLoading ? 'Carregando...' : 'Selecionar Certificado'}
          </button>
          
          {certificateMetadata && (
            <span style={{
              fontSize: '12px',
              color: systemColors.text.secondary,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
            }}>
              {certificateMetadata.fileName}
            </span>
          )}
        </div>
        <p style={{
          fontSize: '11px',
          color: systemColors.text.secondary,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          margin: '4px 0 0 0'
        }}>
          Selecione o arquivo .pfx ou .p12 do certificado digital
        </p>
      </div>

      {/* Campo de Senha */}
      <div style={systemStyles.input.container}>
        <label style={systemStyles.input.label}>Senha do Certificado *</label>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <input
              type="password"
              value={certificatePassword}
              onChange={(e) => setCertificatePassword(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && certificatePassword && tempFilePath) {
                  handleValidateCertificate();
                }
              }}
              placeholder="Digite a senha do certificado"
              style={systemStyles.input.field}
              disabled={!certificateFile}
            />
          </div>
          <button
            onClick={handleValidateCertificate}
            disabled={!certificatePassword || !tempFilePath || isLoading}
            style={{
              ...systemStyles.button.primary,
              flex: '0 0 auto',
              ...(!certificatePassword || !tempFilePath || isLoading ? systemStyles.button.disabled : {})
            }}
            onMouseOver={(e) => {
              if (certificatePassword && tempFilePath && !isLoading) {
                Object.assign(e.currentTarget.style, systemStyles.button.primaryHover);
              }
            }}
            onMouseOut={(e) => {
              if (certificatePassword && tempFilePath && !isLoading) {
                Object.assign(e.currentTarget.style, systemStyles.button.primary);
              }
            }}
          >
            {isLoading ? 'Validando...' : 'Validar'}
          </button>
        </div>
        <p style={{
          fontSize: '11px',
          color: systemColors.text.secondary,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          margin: '4px 0 0 0'
        }}>
          Digite a senha e clique em "Validar" para extrair as informações do certificado
        </p>
      </div>

      {/* Botão Salvar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleSave}
          disabled={!canSave}
          style={{
            ...systemStyles.button.primary,
            ...(!canSave ? systemStyles.button.disabled : {}),
            ...(!canSave ? {} : systemStyles.button.primaryHover)
          }}
          onMouseOver={(e) => {
            if (canSave) {
              Object.assign(e.currentTarget.style, systemStyles.button.primaryHover);
            }
          }}
          onMouseOut={(e) => {
            if (canSave) {
              Object.assign(e.currentTarget.style, systemStyles.button.primary);
            }
          }}
        >
          Salvar
        </button>
      </div>

      {/* Mensagem de sucesso */}
      {showSuccessMessage && (
        <div style={{
          padding: '12px 16px',
          background: '#E8F5E9',
          border: '1px solid #66BB6A',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#66BB6A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            ✓
          </div>
          <span style={{
            fontSize: '12px',
            color: '#2E7D32',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
          }}>
            Certificado e configurações salvos com sucesso!
          </span>
        </div>
      )}

      {/* Informações do Certificado Salvo */}
      {certificateMetadata && !showSuccessMessage && (
        <div style={{
          padding: '20px',
          background: systemColors.background.secondary,
          border: `1px solid ${systemColors.border.light}`,
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: systemColors.text.primary,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            margin: 0
          }}>
            Informações do Certificado
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {certificateMetadata.validTo && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: '12px',
                  color: systemColors.text.secondary,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                }}>
                  Validade:
                </span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: systemColors.text.primary,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                }}>
                  {new Date(certificateMetadata.validTo).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}

            {certificateMetadata.cnpj && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: '12px',
                  color: systemColors.text.secondary,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                }}>
                  CNPJ:
                </span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: systemColors.text.primary,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                }}>
                  {certificateMetadata.cnpj}
                </span>
              </div>
            )}

            {certificateMetadata.companyName && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: '12px',
                  color: systemColors.text.secondary,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                }}>
                  Empresa:
                </span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: systemColors.text.primary,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                }}>
                  {certificateMetadata.companyName}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dialog para mensagens */}
      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={() => setDialogOpen(false)}
        warning={dialogWarning}
        hint={dialogHint}
        confirmLabel="OK"
        showCancel={false}
      />

    </div>
  );
}
