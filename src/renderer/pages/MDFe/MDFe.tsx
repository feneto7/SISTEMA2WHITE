import React, { useState } from 'react';
import { useTheme } from '../../styles/ThemeProvider';
import { MDFeList, MDFe, NewMDFe } from './components';
import { useNavigation } from '../../router/Navigation';
import { useClickSound } from '../../hooks/useClickSound';
import { BackButton } from '../../components/BackButton';
import { MDFeRegistrations } from './components/MDFeRegistrations';
import { AppIcons } from '../../components/Icons/AppIcons';

// Página de MDF-e do sistema
// Permite visualizar e gerenciar MDF-es emitidas
// Header simples com título e botões, lista embaixo
export function MDFePage(): JSX.Element {
  const { navigate } = useNavigation();
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  const [isNewMDFePressed, setIsNewMDFePressed] = useState(false);
  const [isCadastrosPressed, setIsCadastrosPressed] = useState(false);
  const [isCadastrosModalOpen, setIsCadastrosModalOpen] = useState(false);
  const [isNewMDFeModalOpen, setIsNewMDFeModalOpen] = useState(false);
  
  // Dados mockados de MDF-es
  const [mdfes, setMdfes] = useState<MDFe[]>([
    {
      id: '1',
      numero: '000001',
      serie: '001',
      chave: '31240123456789000123550010000000010000000001',
      emitente: 'Netinove Consultoria e Sistemas',
      destinatario: 'Digital Marketing Corp',
      valor: 1500.00,
      status: 'autorizado',
      dataEmissao: '2024-01-15',
      dataAutorizacao: '2024-01-15'
    },
    {
      id: '2',
      numero: '000002',
      serie: '001',
      chave: '31240123456789000123550010000000020000000002',
      emitente: 'Netinove Consultoria e Sistemas',
      destinatario: 'João Silva Santos',
      valor: 850.50,
      status: 'transmitidoAguardando',
      dataEmissao: '2024-01-20'
    },
    {
      id: '3',
      numero: '000003',
      serie: '001',
      chave: '31240123456789000123550010000000030000000003',
      emitente: 'Netinove Consultoria e Sistemas',
      destinatario: 'Maria Oliveira Costa',
      valor: 2200.75,
      status: 'autorizado',
      dataEmissao: '2024-02-01',
      dataAutorizacao: '2024-02-01'
    },
    {
      id: '4',
      numero: '000004',
      serie: '001',
      chave: '31240123456789000123550010000000040000000004',
      emitente: 'Netinove Consultoria e Sistemas',
      destinatario: 'Pedro Almeida',
      valor: 1200.00,
      status: 'cancelado',
      dataEmissao: '2024-02-10',
      dataAutorizacao: '2024-02-10'
    },
    {
      id: '5',
      numero: '000005',
      serie: '001',
      chave: '31240123456789000123550010000000050000000005',
      emitente: 'Netinove Consultoria e Sistemas',
      destinatario: 'Digital Marketing Corp',
      valor: 3000.00,
      status: 'rejeitado',
      dataEmissao: '2024-02-15'
    }
  ]);

  // Funções de callback para ações dos MDF-es
  const handleCloseMDFe = (mdfe: MDFe) => {
    console.log('Encerrar MDF-e:', mdfe);
    // TODO: Implementar encerramento de MDF-e
  };

  const handleDetailMDFe = (mdfe: MDFe) => {
    console.log('Detalhar MDF-e:', mdfe);
    // TODO: Implementar visualização de detalhes da MDF-e
  };

  const handleNewMDFe = () => {
    playClickSound();
    setIsNewMDFeModalOpen(true);
  };

  const handleCadastros = () => {
    playClickSound();
    setIsCadastrosModalOpen(true);
  };

  const handleSaveNewMDFe = (mdfeData: any) => {
    // TODO: Implementar salvamento da nova MDF-e
    console.log('Salvando nova MDF-e:', mdfeData);
    // Por enquanto, apenas fecha o modal
    setIsNewMDFeModalOpen(false);
  };

  const styles = {
    container: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      padding: '20px',
      gap: '20px',
      overflow: 'hidden',
      background: systemColors.background.content
    },
    header: {
      ...systemStyles.page.header
    },
    title: {
      ...systemStyles.page.title,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px'
    },
    newButton: {
      ...systemStyles.button.default,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      whiteSpace: 'nowrap' as const
    },
    newButtonActive: {
      ...systemStyles.button.defaultActive
    },
    buttonGroup: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header com título e botões */}
      <div style={styles.header}>
        <BackButton 
          onClick={() => navigate('home')} 
          label="Voltar para Home" 
        />
        <h1 style={styles.title}>MDF-e</h1>
        <div style={styles.buttonGroup}>
          <button
            className="no-hover-effect"
            style={{
              ...styles.newButton,
              ...(isCadastrosPressed ? styles.newButtonActive : {})
            }}
            onMouseLeave={() => {
              setIsCadastrosPressed(false);
            }}
            onMouseDown={() => setIsCadastrosPressed(true)}
            onMouseUp={() => setIsCadastrosPressed(false)}
            onClick={handleCadastros}
          >
            Cadastros
          </button>
          <button
            className="no-hover-effect"
            style={{
              ...styles.newButton,
              ...(isNewMDFePressed ? styles.newButtonActive : {})
            }}
            onMouseLeave={() => {
              setIsNewMDFePressed(false);
            }}
            onMouseDown={() => setIsNewMDFePressed(true)}
            onMouseUp={() => setIsNewMDFePressed(false)}
            onClick={handleNewMDFe}
          >
            <AppIcons.Add size={14} />
            Nova MDF-e
          </button>
        </div>
      </div>

      {/* Lista de MDF-es */}
      <MDFeList 
        mdfes={mdfes}
        onCloseMDFe={handleCloseMDFe}
        onDetailMDFe={handleDetailMDFe}
      />

      {/* Modal de Cadastros */}
        <MDFeRegistrations
          isOpen={isCadastrosModalOpen}
          onClose={() => setIsCadastrosModalOpen(false)}
        />

      {/* Modal de Nova MDF-e */}
      <NewMDFe
        isOpen={isNewMDFeModalOpen}
        onClose={() => setIsNewMDFeModalOpen(false)}
        onSave={handleSaveNewMDFe}
      />
    </div>
  );
}
