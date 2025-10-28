//--------------------------------------------------------------------
// ABA DE CONFIGURAÇÕES DE PARÂMETROS
// Permite configurar parâmetros fiscais (ICMS, PIS, COFINS e IPI)
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { systemStyles, systemColors } from '../../../styles/systemStyle';
import { useClickSound } from '../../../hooks/useClickSound';
import { ICMSSubTab, PISSubTab, COFINSSubTab, IPISubTab } from './Parametros';

type ParametrosSubTab = 'icms' | 'pis' | 'cofins' | 'ipi';

export function ParametrosTab(): JSX.Element {
  const playClickSound = useClickSound();
  const [activeTab, setActiveTab] = useState<ParametrosSubTab>('icms');

  const tabs: { key: ParametrosSubTab; label: string }[] = [
    { key: 'icms', label: 'ICMS' },
    { key: 'pis', label: 'PIS' },
    { key: 'cofins', label: 'COFINS' },
    { key: 'ipi', label: 'IPI' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'icms':
        return <ICMSSubTab />;
      case 'pis':
        return <PISSubTab />;
      case 'cofins':
        return <COFINSSubTab />;
      case 'ipi':
        return <IPISubTab />;
      default:
        return <ICMSSubTab />;
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

