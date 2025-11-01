//--------------------------------------------------------------------
// PÁGINA DE ATENDIMENTOS
// Tela operacional com abas: Meus Pedidos, Balcão PDV, Pedidos Salão e Cozinha
// Segue o mesmo layout base de páginas do sistema, com sidebar e conteúdo dinâmico
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { useNavigation } from '../../router/Navigation';
import { BackButton } from '../../components/BackButton';
import { useTheme } from '../../styles/ThemeProvider';
import { AttendancesSidebar } from './components/AttendancesSidebar';
import { MyOrdersTab } from './components/MyOrders';
import { CounterPDVTab } from './components/CounterPDV';
import { HallOrdersTab } from './components/Hall';
import { KitchenTab } from './components/Kitchen';

export type AttendancesTab = 'myOrders' | 'counter' | 'hall' | 'kitchen';

function Attendances(): JSX.Element {
  const { navigate } = useNavigation();
  const [activeTab, setActiveTab] = useState<AttendancesTab>('myOrders');
  const { systemStyles, systemColors } = useTheme();

  // Renderiza o conteúdo da aba selecionada
  const renderContent = () => {
    switch (activeTab) {
      case 'myOrders':
        return <MyOrdersTab />;
      case 'counter':
        return <CounterPDVTab />;
      case 'hall':
        return <HallOrdersTab />;
      case 'kitchen':
        return <KitchenTab />;
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
      overflow: 'hidden',
      background: systemColors.background.content,
      borderRadius: '10px',
      border: `1px solid ${systemColors.border.light}`,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
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
          <h1 style={styles.title}>Atendimentos</h1>
        </div>
        <div style={styles.headerRight}></div>
      </div>

      {/* Conteúdo principal com sidebar e área de conteúdo */}
      <div style={styles.mainContent}>
        <AttendancesSidebar activeTab={activeTab} onSelectTab={setActiveTab} />
        <div style={styles.contentArea}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Attendances;


