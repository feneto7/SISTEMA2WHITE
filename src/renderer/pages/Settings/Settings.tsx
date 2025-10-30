//--------------------------------------------------------------------
// PÁGINA DE CONFIGURAÇÕES
// Tela de configurações do sistema com layout inspirado no macOS
// Sidebar com categorias e conteúdo dinâmico baseado na seleção
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { useNavigation } from '../../router/Navigation';
import { BackButton } from '../../components/BackButton';
import { SettingsSidebar } from './components/SettingsSidebar';
import { CompanyForm } from './components/CompanyForm';
import { FiscalTab } from './components/FiscalTab';
import { PrintersTab } from './components/PrintersTab';
import { ParametrosTab } from './components/ParametrosTab';
import { useTheme } from '../../styles/ThemeProvider';

export type SettingsTab = 'empresa' | 'fiscal' | 'email' | 'recebimentos' | 'pagamento' | 'impressoras' | 'balanca' | 'gaveta' | 'dock' | 'parametros';

function Settings(): JSX.Element {
  const { navigate } = useNavigation();
  const [activeTab, setActiveTab] = useState<SettingsTab>('empresa');
  const { systemStyles, systemColors } = useTheme();

  const renderContent = () => {
    switch (activeTab) {
      case 'empresa':
        return <CompanyForm />;
      case 'fiscal':
        return <FiscalTab />;
      case 'email':
        return <div style={styles.placeholder}>Configurações de Email</div>;
      case 'recebimentos':
        return <div style={styles.placeholder}>Configurações de Recebimentos</div>;
      case 'pagamento':
        return <div style={styles.placeholder}>Formas de Pagamento</div>;
      case 'impressoras':
        return <PrintersTab />;
      case 'balanca':
        return <div style={styles.placeholder}>Configurações de Balança</div>;
      case 'gaveta':
        return <div style={styles.placeholder}>Configurações de Gaveta</div>;
      case 'dock':
        return <div style={styles.placeholder}>Configurações do Dock</div>;
      case 'parametros':
        return <ParametrosTab />;
      default:
        return null;
    }
  };

  const styles = {
    container: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      background: systemColors.background.content,
      padding: '20px',
      gap: '20px'
    },
    header: {
      ...systemStyles.page.header,
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      justifyContent: 'flex-start'
    },
    headerCenter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    headerRight: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    title: {
      ...systemStyles.page.title,
      margin: 0
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      overflow: 'hidden'
    },
    contentArea: {
      flex: 1,
      padding: '24px',
      overflow: 'auto',
      background: systemColors.background.content,
      borderRadius: '10px',
      border: `1px solid ${systemColors.border.light}`,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    placeholder: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      fontSize: '18px',
      fontWeight: '500',
      color: systemColors.text.secondary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <BackButton onClick={() => navigate('home')} label="Voltar para Home" />
        </div>
        <div style={styles.headerCenter}>
          <h1 style={styles.title}>Configurações</h1>
        </div>
        <div style={styles.headerRight}></div>
      </div>

      {/* Conteúdo principal com sidebar e área de conteúdo */}
      <div style={styles.mainContent}>
        <SettingsSidebar activeTab={activeTab} onSelectTab={setActiveTab} />
        <div style={styles.contentArea}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Settings;

