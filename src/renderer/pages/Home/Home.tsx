import React, { useState } from 'react';
import { TopMenu } from './components/TopMenu';
import { DockMenu } from './components/DockMenu';
import { LaunchpadOperations } from './components/LaunchpadOperations';
import { LaunchpadFiscal } from './components/LaunchpadFiscal';
import { useNavigation } from '../../router/Navigation';
import { useTheme } from '../../styles/ThemeProvider';
import { getBgHomeSimpleContainer } from '../../styles/bgHomeSimple';
import logoImage from '../../../main/img/logo.png';

export function Home(): JSX.Element {
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

  // Filtro do logo baseado no tema
  const logoFilter = theme === 'dark' 
    ? 'brightness(0)' // Logo preto no tema dark
    : 'brightness(0) saturate(100%) invert(36%)'; // Logo cinza escuro no tema light

  return (
    <div style={layoutRoot}>
      {/* Background simples conforme o tema */}
      <div style={getBgHomeSimpleContainer(theme)} />

      <TopMenu />
      
      <div style={contentArea}>
        {/* Logo centralizado */}
        <div style={logoContainer}>
          <img 
            src={logoImage} 
            alt="Logo" 
            style={{
              ...logoStyle,
              filter: logoFilter,
              WebkitFilter: logoFilter
            }}
          />
        </div>
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

const logoContainer: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '64px'
};

const logoStyle: React.CSSProperties = {
  width: '80px',
  height: '80px',
  objectFit: 'contain' as const
  // Filtro aplicado dinamicamente baseado no tema no componente
};



