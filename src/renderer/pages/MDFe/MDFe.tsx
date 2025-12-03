import React, { useState, useEffect } from 'react';
import { useTheme } from '../../styles/ThemeProvider';
import { MDFeList, MDFe, NewMDFe } from './components';
import { useNavigation } from '../../router/Navigation';
import { useClickSound } from '../../hooks/useClickSound';
import { BackButton } from '../../components/BackButton';
import { MDFeRegistrations } from './components/MDFeRegistrations';
import { AppIcons } from '../../components/Icons/AppIcons';
import { apiPost, apiGet } from '../../utils/apiService';
import { Dialog } from '../../components/Dialog';
import { MDFeStatus, mapLegacyStatus } from './types/mdfeStatus';

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
  const [isSaving, setIsSaving] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [resultDialogType, setResultDialogType] = useState<'success' | 'error'>('success');
  const [resultMessage, setResultMessage] = useState('');
  const [resultHint, setResultHint] = useState('');
  const [mdfes, setMdfes] = useState<MDFe[]>([]);
  const [isLoadingMdfes, setIsLoadingMdfes] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Tipo para resposta da API (campos em inglês conforme regras do projeto)
  type ApiMdfe = {
    id: number;
    accessKey: string;
    identification: {
      number: string;
      series: string;
      initialState: string;
      finalState: string;
      issueDate: string;
    } | null;
    driver: string | null;
    status: string;
    lastEvent: {
      statusCode: string;
      reason: string;
      eventType: string;
      protocolNumber: string;
      eventDate: string;
    } | null;
    createdAt: string;
    updatedAt: string;
  };

  // Função para mapear dados da API (português) para interface em inglês
  const mapApiMdfeToMdfe = (apiResponse: any): MDFe => {
    const identification = apiResponse.ide;
    const lastEvent = apiResponse.ultimoEvento;
    
    // Mapear status da API para o tipo MDFeStatus
    const status: MDFeStatus = mapLegacyStatus(apiResponse.status);

    return {
      id: String(apiResponse.id),
      number: identification?.nMDF || '000000',
      series: identification?.serie || '000',
      accessKey: apiResponse.chave || '',
      initialState: identification?.UFIni || '',
      finalState: identification?.UFFim || '',
      driver: apiResponse.condutor || 'Não informado',
      status: status,
      issueDate: identification?.dhEmi ? new Date(identification.dhEmi).toISOString().split('T')[0] : '',
      authorizationDate: lastEvent?.dhEvento ? new Date(lastEvent.dhEvento).toISOString().split('T')[0] : undefined
    };
  };

  // Carregar MDF-es da API
  const loadMdfes = async () => {
    try {
      setIsLoadingMdfes(true);
      setLoadError(null);

      const response = await apiGet('/api/mdfe', {
        requireAuth: true
      });

      if (response.ok && response.data?.data) {
        const apiMdfesList = response.data.data;
        const mappedMdfes = apiMdfesList.map(mapApiMdfeToMdfe);
        setMdfes(mappedMdfes);
      } else {
        throw new Error(response.data?.message || 'Erro ao carregar MDF-es');
      }
    } catch (error: any) {
      console.error('Erro ao carregar MDF-es:', error);
      setLoadError(error?.message || 'Não foi possível carregar as MDF-es');
      setMdfes([]);
    } finally {
      setIsLoadingMdfes(false);
    }
  };

  // Carregar MDF-es ao montar o componente
  useEffect(() => {
    loadMdfes();
  }, []);

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

  const handleSaveNewMDFe = async (mdfeData: any) => {
    try {
      setIsSaving(true);
      
      // Extrai o JSON estruturado do MDF-e
      const mdfeJSON = mdfeData.mdfeJSON;
      
      if (!mdfeJSON) {
        throw new Error('JSON do MDF-e não encontrado. Por favor, valide o formulário antes de salvar.');
      }

      // Envia para a API
      const response = await apiPost('/api/mdfe', mdfeJSON, {
        requireAuth: true
      });

      if (response.ok && response.status === 201) {
        // Sucesso
        setResultDialogType('success');
        setResultMessage('MDF-e criada com sucesso!');
        setResultHint(`A MDF-e foi salva no sistema e todas as tabelas foram preenchidas automaticamente.`);
        setShowResultDialog(true);
        
        // Fecha o modal de criação
        setIsNewMDFeModalOpen(false);
        
        // Recarrega a lista de MDF-es após salvar
        await loadMdfes();
      } else {
        // Erro na resposta da API
        const errorMessage = response.data?.message || response.data?.error || 'Erro ao salvar MDF-e';
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      // Erro ao fazer requisição ou processar resposta
      setResultDialogType('error');
      setResultMessage('Erro ao criar MDF-e');
      
      let errorHint = 'Não foi possível salvar a MDF-e.';
      if (error?.message) {
        errorHint += `\n\nErro: ${error.message}`;
      } else if (typeof error === 'string') {
        errorHint += `\n\nErro: ${error}`;
      }
      
      setResultHint(errorHint);
      setShowResultDialog(true);
    } finally {
      setIsSaving(false);
    }
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

      {/* Dialog de resultado (sucesso/erro) */}
      <Dialog
        isOpen={showResultDialog}
        onClose={() => setShowResultDialog(false)}
        onConfirm={() => setShowResultDialog(false)}
        icon={
          resultDialogType === 'success' 
            ? <AppIcons.CheckCircle size={60} color="#28CA42" />
            : <AppIcons.Alert size={60} color="#ff5f57" />
        }
        warning={resultMessage}
        hint={resultHint}
        confirmLabel="OK"
        showCancel={false}
        width="640px"
      />
    </div>
  );
}
