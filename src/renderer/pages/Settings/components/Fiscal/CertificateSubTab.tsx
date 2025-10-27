//--------------------------------------------------------------------
// SUB-ABA DE CERTIFICADO DIGITAL
// Configurações do certificado digital A1 ou A3
//--------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { systemColors, systemStyles } from '../../../../styles/systemStyle';

// Tipagem para a API do Electron
declare global {
  interface Window {
    electronAPI: {
      getInstalledCertificates: () => Promise<string[]>;
    };
  }
}

const STORAGE_KEY = 'selected_certificate';

export function CertificateSubTab(): JSX.Element {
  const [selectedCertificate, setSelectedCertificate] = useState('');
  const [savedCertificate, setSavedCertificate] = useState('');
  const [certificates, setCertificates] = useState<string[]>([]);
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Carregar certificado salvo ao montar o componente
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSavedCertificate(saved);
      setSelectedCertificate(saved);
    }
  }, []);

  useEffect(() => {
    const fetchCertificates = async () => {
      setIsLoading(true);
      try {
        console.log('CertificateSubTab: Iniciando busca de certificados...');
        console.log('CertificateSubTab: window.electronAPI disponível?', !!window.electronAPI);
        
        if (window.electronAPI) {
          console.log('CertificateSubTab: Chamando getInstalledCertificates...');
          const installedCertificates = await window.electronAPI.getInstalledCertificates();
          console.log('CertificateSubTab: Certificados recebidos:', installedCertificates);
          setCertificates(installedCertificates);
        } else {
          console.warn('CertificateSubTab: electronAPI não disponível');
          // Fallback para dados de teste
          setCertificates([
            'Certificado Digital Teste - CPF: 123.456.789-00',
            'AC BRASIL v5 - CPF: 987.654.321-00',
            'Certificado A1 - CNPJ: 12.345.678/0001-90'
          ]);
        }
      } catch (error) {
        console.error('CertificateSubTab: Erro ao buscar certificados:', error);
        setCertificates([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const handleSave = () => {
    if (selectedCertificate) {
      localStorage.setItem(STORAGE_KEY, selectedCertificate);
      setSavedCertificate(selectedCertificate);
      setShowSuccessMessage(true);
      
      // Ocultar mensagem após 3 segundos
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }
  };

  const hasChanges = selectedCertificate !== savedCertificate;

  const getSelectStyle = (isFocused: boolean) => ({
    ...systemStyles.select.field,
    ...(isFocused ? systemStyles.select.fieldFocus : {}),
    ...(isLoading ? { opacity: 0.6, cursor: 'wait' } : {})
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <p style={{ 
        fontSize: '13px', 
        color: systemColors.text.secondary,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}>
        Selecione o certificado digital A1 ou A3 para assinatura de documentos fiscais.
      </p>

      {/* Campo de seleção do certificado */}
      <div style={systemStyles.input.container}>
        <label style={systemStyles.input.label}>Certificado Digital *</label>
        <div style={systemStyles.select.container}>
          <select
            value={selectedCertificate}
            onChange={(e) => setSelectedCertificate(e.target.value)}
            onFocus={() => setIsSelectFocused(true)}
            onBlur={() => setIsSelectFocused(false)}
            style={getSelectStyle(isSelectFocused)}
            disabled={isLoading}
          >
            <option value="">
              {isLoading ? 'Carregando certificados...' : 'Selecione um certificado'}
            </option>
            {certificates.map((cert, index) => (
              <option key={index} value={cert}>
                {cert}
              </option>
            ))}
          </select>
          <div style={systemStyles.select.arrow}>
            <div style={systemStyles.select.arrowIcon}></div>
          </div>
        </div>
        {certificates.length === 0 && !isLoading && (
          <p style={{
            fontSize: '11px',
            color: systemColors.text.secondary,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            margin: '4px 0 0 0'
          }}>
            Nenhum certificado digital encontrado. Instale um certificado A1 ou A3.
          </p>
        )}
      </div>

      {/* Botão Salvar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleSave}
          disabled={!hasChanges || !selectedCertificate}
          style={{
            ...systemStyles.button.primary,
            ...(!hasChanges || !selectedCertificate ? systemStyles.button.disabled : {}),
            ...(!hasChanges || !selectedCertificate ? {} : systemStyles.button.primaryHover)
          }}
          onMouseOver={(e) => {
            if (hasChanges && selectedCertificate) {
              Object.assign(e.currentTarget.style, systemStyles.button.primaryHover);
            }
          }}
          onMouseOut={(e) => {
            if (hasChanges && selectedCertificate) {
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
            Certificado salvo com sucesso!
          </span>
        </div>
      )}

      {/* Informações do certificado salvo */}
      {savedCertificate && !showSuccessMessage && (
        <div style={{
          padding: '12px',
          background: systemColors.selection.background,
          border: `1px solid ${systemColors.selection.border}`,
          borderRadius: '6px'
        }}>
          <p style={{
            fontSize: '12px',
            color: systemColors.text.primary,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            margin: 0
          }}>
            <strong>Certificado selecionado:</strong> {savedCertificate}
          </p>
        </div>
      )}
    </div>
  );
}
