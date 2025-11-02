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
export type PDVOrderType = 'counter' | 'table';

function Attendances(): JSX.Element {
  const { navigate } = useNavigation();
  const [activeTab, setActiveTab] = useState<AttendancesTab>('myOrders');
  const [isPDVOpen, setIsPDVOpen] = useState(false);
  const [pdvOrderType, setPDVOrderType] = useState<PDVOrderType>('counter');
  const { systemStyles, systemColors } = useTheme();

  // Função para abrir o PDV em modo fullscreen
  const handleOpenPDV = (orderType: PDVOrderType) => {
    setPDVOrderType(orderType);
    setIsPDVOpen(true);
  };

  // Função para fechar o PDV
  const handleClosePDV = () => {
    setIsPDVOpen(false);
  };

  // Renderiza o conteúdo da aba selecionada
  const renderContent = () => {
    switch (activeTab) {
      case 'myOrders':
        return <MyOrdersTab />;
      case 'counter':
        return <CounterPDVTab />;
      case 'hall':
        return <HallOrdersTab onNewOrder={() => handleOpenPDV('table')} />;
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
      gap: '20px',
      position: 'relative' as const
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
    },
    pdvOverlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: systemColors.background.content,
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column' as const
    },
    pdvContent: {
      height: '100vh',
      width: '100vw'
    }
  };

  return (
    <>
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

      {/* PDV em modo fullscreen */}
      {isPDVOpen && (
        <div style={styles.pdvOverlay}>
          <div style={styles.pdvContent}>
            <CounterPDVTab initialOrderType={pdvOrderType} onClose={handleClosePDV} />
          </div>
        </div>
      )}
    </>
  );
}

export default Attendances;


