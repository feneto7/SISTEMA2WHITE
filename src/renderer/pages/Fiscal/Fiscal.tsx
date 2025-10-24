import React, { useState } from 'react';
import { macStyles } from '../../styles/style';
import { useClickSound } from '../../hooks/useClickSound';
import { useNavigation } from '../../router/Navigation';
import { BackButton } from '../../components/BackButton';
import { 
  ReceiptIcon, 
  UsersIcon, 
  TruckIcon, 
  ServiceIcon
} from '../../components/Icons/Icons';

// Página do Menu Fiscal
// Contém os botões para documentos fiscais eletrônicos
export function Fiscal(): JSX.Element {
  const playClickSound = useClickSound();
  const { navigate } = useNavigation();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  // Dados dos botões fiscais
  const fiscalButtons = [
    {
      id: 'nfe',
      title: 'NF-e',
      subtitle: 'Nota Fiscal Eletrônica',
      description: 'Emitir notas fiscais eletrônicas',
      icon: ReceiptIcon
    },
    {
      id: 'nfce',
      title: 'NFC-e',
      subtitle: 'Nota Fiscal do Consumidor Eletrônica',
      description: 'Emitir notas fiscais para consumidor final',
      icon: UsersIcon
    },
    {
      id: 'mdfe',
      title: 'MDF-e',
      subtitle: 'Manifesto Eletrônico de Documentos Fiscais',
      description: 'Gerenciar manifesto de documentos fiscais',
      icon: TruckIcon
    },
    {
      id: 'nfse',
      title: 'NFS-e',
      subtitle: 'Nota Fiscal de Serviços Eletrônica',
      description: 'Emitir notas fiscais de serviços',
      icon: ServiceIcon
    }
  ];

  const handleButtonClick = (buttonId: string) => {
    playClickSound();
    
    switch (buttonId) {
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
        console.log(`Abrindo ${buttonId}`);
    }
  };

  const styles = {
    container: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      padding: '20px',
      gap: '20px',
      overflow: 'hidden'
    },
    header: {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderRadius: 'var(--border-radius-large)',
      border: '1px solid rgba(255, 255, 255, 0.9)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      color: 'var(--text-primary)',
      margin: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px'
    },
    content: {
      flex: 1,
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderRadius: 'var(--border-radius-large)',
      border: '1px solid rgba(255, 255, 255, 0.9)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    },
    subtitle: {
      fontSize: '14px',
      color: 'var(--text-secondary)',
      marginBottom: '32px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px'
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
      maxWidth: '600px',
      width: '100%'
    },
    button: {
      background: 'linear-gradient(to bottom, #f5f5f5, #e8e8e8)',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      borderRadius: 'var(--border-radius-large)',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      padding: '24px 20px',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center' as const,
      minHeight: '160px',
      position: 'relative' as const,
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    buttonHover: {
      background: 'linear-gradient(to bottom, #f8f8f8, #e0e0e0)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
      transform: 'translateY(-1px)'
    },
    buttonIcon: {
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: 'var(--text-primary)',
      marginBottom: '6px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px'
    },
    buttonSubtitle: {
      fontSize: '12px',
      color: 'var(--text-secondary)',
      marginBottom: '6px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.3px',
      fontWeight: '500',
      lineHeight: '1.2'
    },
    buttonDescription: {
      fontSize: '11px',
      color: 'rgba(0, 0, 0, 0.5)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      lineHeight: '1.3',
      maxWidth: '200px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header com botão voltar */}
      <div style={styles.header}>
        <BackButton 
          onClick={() => navigate('home')} 
          label="Voltar para Home" 
        />
        <h1 style={styles.title}>Menu Fiscal</h1>
        <div style={{ width: '80px' }} /> {/* Spacer para centralizar o título */}
      </div>

      {/* Conteúdo principal */}
      <div style={styles.content}>
        <p style={styles.subtitle}>Documentos Fiscais Eletrônicos</p>
        
        <div style={styles.gridContainer}>
          {fiscalButtons.map((button) => (
            <div
              key={button.id}
              style={{
                ...styles.button,
                ...(hoveredButton === button.id ? styles.buttonHover : {})
              }}
              onClick={() => handleButtonClick(button.id)}
              onMouseEnter={() => setHoveredButton(button.id)}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <div style={styles.buttonIcon}>
                <button.icon size={48} color="var(--accent)" />
              </div>
              <h3 style={styles.buttonTitle}>{button.title}</h3>
              <p style={styles.buttonSubtitle}>{button.subtitle}</p>
              <p style={styles.buttonDescription}>{button.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
