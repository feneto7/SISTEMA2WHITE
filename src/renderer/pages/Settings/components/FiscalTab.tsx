//--------------------------------------------------------------------
// ABA DE CONFIGURAÇÕES FISCAIS
// Permite configurar certificado digital e numeração de documentos fiscais
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { systemStyles, systemColors } from '../../../styles/systemStyle';
import { useClickSound } from '../../../hooks/useClickSound';
import { AppIcons } from '../../../components/Icons/AppIcons';
import { CertificateSubTab, NFESubTab, NFCeSubTab, NFSeSubTab, MDFeSubTab } from './Fiscal';

type FiscalSubTab = 'certificado' | 'nfe' | 'nfce' | 'nfse' | 'mdfe';

export function FiscalTab(): JSX.Element {
  const playClickSound = useClickSound();
  const [activeTab, setActiveTab] = useState<FiscalSubTab>('certificado');

  const tabs: { key: FiscalSubTab; label: string }[] = [
    { key: 'certificado', label: 'Certificado Digital' },
    { key: 'nfe', label: 'NF-e' },
    { key: 'nfce', label: 'NFC-e' },
    { key: 'nfse', label: 'NFS-e' },
    { key: 'mdfe', label: 'MDF-e' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'certificado':
        return <CertificateSubTab />;
      case 'nfe':
        return <NFESubTab />;
      case 'nfce':
        return <NFCeSubTab />;
      case 'nfse':
        return <NFSeSubTab />;
      case 'mdfe':
        return <MDFeSubTab />;
      default:
        return <CertificateSubTab />;
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      gap: '0'
    }}>
      {/* Abas centralizadas */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '20px 20px 0 20px'
      }}>
        <div style={{
          ...systemStyles.tabs.container,
          padding: '8px 20px 0 20px'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              style={{
                ...systemStyles.tabs.tab,
                ...(activeTab === tab.key ? systemStyles.tabs.tabActive : {})
              }}
              onClick={() => {
                playClickSound();
                setActiveTab(tab.key);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Container do conteúdo */}
      <div style={{
        background: systemColors.background.content,
        border: `1px solid ${systemColors.border.light}`,
        borderRadius: '10px',
        padding: '20px',
        flex: 1,
        overflow: 'auto',
        margin: '0 20px 20px 20px'
      }}>
        {renderTabContent()}
      </div>
    </div>
  );
}

