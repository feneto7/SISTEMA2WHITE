//--------------------------------------------------------------------
// IMPORTAÇÃO DE DEPENDÊNCIAS
// Página de Operações - Sistema de Gestão de Operações Comerciais
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { macStyles } from '../../styles/style';
import { useNavigation } from '../../router/Navigation';
import { useClickSound } from '../../hooks/useClickSound';
import { BackButton } from '../../components/BackButton';

// Ícones SVG customizados para operações
const ShoppingCartIcon = ({ size = 48, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"/>
  </svg>
);

const FileInvoiceIcon = ({ size = 48, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6C5.44772 2 5 2.44772 5 3V21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21V8L14 2Z"/>
    <path d="M14 2V8H19"/>
    <path d="M16 13H8"/>
    <path d="M16 17H8"/>
    <path d="M10 9H8"/>
  </svg>
);

const ClipboardListIcon = ({ size = 48, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11H15"/>
    <path d="M9 15H15"/>
    <path d="M9 19H13"/>
    <path d="M14 2H6C5.44772 2 5 2.44772 5 3V21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21V8L14 2Z"/>
    <path d="M14 2V8H19"/>
  </svg>
);

const ServiceOrderIcon = ({ size = 48, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2573 9.77251 19.9887C9.5799 19.7201 9.31074 19.5166 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.01062 9.77251C4.27925 9.5799 4.48278 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"/>
  </svg>
);

const UndoIcon = ({ size = 48, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V3H7"/>
    <path d="M21 17V21H17"/>
    <path d="M17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V5C19 3.89543 18.1046 3 17 3Z"/>
    <path d="M9 9L12 12L9 15"/>
  </svg>
);

const ExchangeIcon = ({ size = 48, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 3H8C6.89543 3 6 3.89543 6 5V19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V5C18 3.89543 17.1046 3 16 3Z"/>
    <path d="M12 7L9 10L12 13"/>
    <path d="M12 17L15 14L12 11"/>
  </svg>
);

// Página de Operações Comerciais
// Contém os botões para diferentes tipos de operações comerciais
function Operations(): JSX.Element {
  const playClickSound = useClickSound();
  const { navigate } = useNavigation();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  // Dados dos botões de operações
  const operationButtons = [
    {
      id: 'sale',
      title: 'Venda',
      subtitle: 'Sistema de Vendas',
      description: 'Realizar vendas de produtos e serviços',
      icon: ShoppingCartIcon
    },
    {
      id: 'budget',
      title: 'Orçamento',
      subtitle: 'Sistema de Orçamentos',
      description: 'Criar e gerenciar orçamentos',
      icon: FileInvoiceIcon
    },
    {
      id: 'order',
      title: 'Pedido',
      subtitle: 'Sistema de Pedidos',
      description: 'Gerenciar pedidos de clientes',
      icon: ClipboardListIcon
    },
    {
      id: 'service',
      title: 'Ordem de Serviço',
      subtitle: 'Sistema de Serviços',
      description: 'Criar e controlar ordens de serviço',
      icon: ServiceOrderIcon
    },
    {
      id: 'return',
      title: 'Devolução',
      subtitle: 'Sistema de Devoluções',
      description: 'Processar devoluções de produtos',
      icon: UndoIcon
    },
    {
      id: 'exchange',
      title: 'Troca',
      subtitle: 'Sistema de Trocas',
      description: 'Gerenciar trocas de produtos',
      icon: ExchangeIcon
    }
  ];

  const handleButtonClick = (buttonId: string) => {
    playClickSound();
    
    switch (buttonId) {
      case 'sale':
        console.log('Abrindo Sistema de Vendas');
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
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      maxWidth: '900px',
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
        <h1 style={styles.title}>Operações Comerciais</h1>
        <div style={{ width: '80px' }} /> {/* Spacer para centralizar o título */}
      </div>

      {/* Conteúdo principal */}
      <div style={styles.content}>
        <p style={styles.subtitle}>Sistemas de Operações Comerciais</p>
        
        <div style={styles.gridContainer}>
          {operationButtons.map((button) => (
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

export default Operations; 