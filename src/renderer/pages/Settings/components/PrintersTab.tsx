//--------------------------------------------------------------------
// ABA DE CONFIGURAÇÕES DE IMPRESSORAS
// Três sub-abas: Cupom, Matricial e Comum
// Layout e estilo seguem o padrão do projeto e da aba Fiscal
//--------------------------------------------------------------------

import React, { useState } from 'react';
import { useTheme } from '../../../styles/ThemeProvider';
import { useClickSound } from '../../../hooks/useClickSound';

type PrinterSubTab = 'cupom' | 'matricial' | 'comum';

// Sub-abas (placeholders – prontos para evoluir)
function CouponPrinterTab(): JSX.Element {
  const { systemColors } = useTheme();
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ color: systemColors.text.secondary }}>Configurações da Impressora de Cupom</div>
      {/* Aqui entram as configurações específicas: porta, modelo, largura, corte, etc. */}
    </div>
  );
}

function MatrixPrinterTab(): JSX.Element {
  const { systemColors } = useTheme();
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ color: systemColors.text.secondary }}>Configurações da Impressora Matricial</div>
      {/* Aqui entram as configurações específicas: porta, colunas, avanço, etc. */}
    </div>
  );
}

function CommonPrinterTab(): JSX.Element {
  const { systemColors } = useTheme();
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ color: systemColors.text.secondary }}>Configurações de Impressora Comum (Sistema)</div>
      {/* Aqui entram opções padrão de impressão do SO: seleção de impressora, orientação, etc. */}
    </div>
  );
}

export function PrintersTab(): JSX.Element {
  const playClickSound = useClickSound();
  const [activeTab, setActiveTab] = useState<PrinterSubTab>('cupom');
  const { systemStyles, systemColors } = useTheme();

  const tabs: { key: PrinterSubTab; label: string }[] = [
    { key: 'cupom', label: 'Cupom' },
    { key: 'matricial', label: 'Matricial' },
    { key: 'comum', label: 'Comum' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'cupom':
        return <CouponPrinterTab />;
      case 'matricial':
        return <MatrixPrinterTab />;
      case 'comum':
        return <CommonPrinterTab />;
      default:
        return <CouponPrinterTab />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 0 }}>
      {/* Abas centralizadas */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 20px 0 20px' }}>
        <div style={{ ...systemStyles.tabs.container, padding: '8px 20px 0 20px' }}>
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
      <div
        style={{
          background: systemColors.background.content,
          border: `1px solid ${systemColors.border.light}`,
          borderRadius: '10px',
          padding: '20px',
          flex: 1,
          overflow: 'auto',
          margin: '0 20px 20px 20px'
        }}
      >
        {renderTabContent()}
      </div>
    </div>
  );
}


