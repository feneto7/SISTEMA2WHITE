import React, { useState } from 'react';
import { TopMenu } from './components/TopMenu';
import { DockMenu } from './components/DockMenu';
import { LaunchpadOperations } from './components/LaunchpadOperations';
import { LaunchpadFiscal } from './components/LaunchpadFiscal';
import { AnimatedWaves, useAnimatedBackground, getBgHomeContainer } from '../../styles/bgHome';
import { useTheme } from '../../styles/ThemeProvider';
import { useNavigation } from '../../router/Navigation';

export function Home(): JSX.Element {
  // Injeta as animações CSS no head
  useAnimatedBackground();
  const { navigate } = useNavigation();
  const { theme } = useTheme();
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false);
  const [isLaunchpadFiscalOpen, setIsLaunchpadFiscalOpen] = useState(false);

  const handleOpenLaunchpad = () => {
    setIsLaunchpadOpen(true);
  };

  const handleCloseLaunchpad = () => {
    setIsLaunchpadOpen(false);
  };

  const handleOpenLaunchpadFiscal = () => {
    setIsLaunchpadFiscalOpen(true);
  };

  const handleCloseLaunchpadFiscal = () => {
    setIsLaunchpadFiscalOpen(false);
  };

  const handleSelectOperation = (operationId: string) => {
    switch (operationId) {
      case 'sale':
        navigate('sales' as any);
        break;
      case 'budget':
        console.log('Abrindo Sistema de Orçamentos');
        // TODO: Implementar navegação para Sistema de Orçamentos
        break;
      case 'order':
        console.log('Abrindo Sistema de Pedidos');
        // TODO: Implementar navegação para Sistema de Pedidos
        break;
      case 'service':
        console.log('Abrindo Sistema de Serviços');
        // TODO: Implementar navegação para Sistema de Serviços
        break;
      case 'return':
        console.log('Abrindo Sistema de Devoluções');
        // TODO: Implementar navegação para Sistema de Devoluções
        break;
      case 'exchange':
        console.log('Abrindo Sistema de Trocas');
        // TODO: Implementar navegação para Sistema de Trocas
        break;
      default:
        console.log(`Abrindo ${operationId}`);
    }
  };

  const handleSelectDocument = (documentId: string) => {
    switch (documentId) {
      case 'mdfe':
        navigate('mdfe');
        break;
      case 'nfe':
        console.log('Abrindo NF-e');
        // TODO: Implementar navegação para NF-e
        break;
      case 'nfce':
        console.log('Abrindo NFC-e');
        // TODO: Implementar navegação para NFC-e
        break;
      case 'nfse':
        console.log('Abrindo NFS-e');
        // TODO: Implementar navegação para NFS-e
        break;
      default:
        console.log(`Abrindo ${documentId}`);
    }
  };

  return (
    <div style={layoutRoot}>
      {/* Background animado com gradiente */}
      <div style={getBgHomeContainer(theme)}>
        <AnimatedWaves />
      </div>

      <TopMenu />
      
      <div style={contentArea}>
        <h1 style={{ margin: 0, fontWeight: 600, color: '#FFFFFF', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>Bem-vindo</h1>
        
      </div>

      <DockMenu 
        onOpenOperations={handleOpenLaunchpad} 
        onOpenFiscal={handleOpenLaunchpadFiscal}
      />

      {/* LaunchpadOperations modal */}
      <LaunchpadOperations
        isOpen={isLaunchpadOpen}
        onClose={handleCloseLaunchpad}
        onSelectOperation={handleSelectOperation}
      />

      {/* LaunchpadFiscal modal */}
      <LaunchpadFiscal
        isOpen={isLaunchpadFiscalOpen}
        onClose={handleCloseLaunchpadFiscal}
        onSelectDocument={handleSelectDocument}
      />
    </div>
  );
}

const layoutRoot: React.CSSProperties = {
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden'
};

const contentArea: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: '20px',
  position: 'relative',
  zIndex: 1
};



