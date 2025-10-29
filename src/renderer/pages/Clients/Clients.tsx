import React, { useState, lazy, Suspense } from 'react';
import { useTheme } from '../../styles/ThemeProvider';
import { ClientSearchBox, ClientList } from './components';
import { useNavigation } from '../../router/Navigation';
import { useClickSound } from '../../hooks/useClickSound';
import { BackButton } from '../../components/BackButton';

// Lazy loading do modal para melhor performance
// Carrega apenas quando necessário
const NewClientModal = lazy(() => import('../../components/NewClientModal').then(module => ({ default: module.NewClientModal })));

// Ícone de plus simples para o botão novo cliente
const PlusIcon = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

// Componente de loading para o modal
const ModalLoader = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  }}>
    <div style={{
      background: 'var(--bg-primary)',
      padding: '20px',
      borderRadius: '8px',
      color: 'var(--text-primary)'
    }}>
      Carregando modal...
    </div>
  </div>
);

// Página de Clientes do sistema
// Permite buscar, visualizar e gerenciar clientes cadastrados
// Estilos importados de @styles/style.ts e componentes modularizados
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  type: 'individual' | 'company';
  status: 'active' | 'inactive';
  registrationDate: string;
}

export function Clients(): JSX.Element {
  const { navigate } = useNavigation();
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'João Silva Santos',
      email: 'joao.silva@email.com',
      phone: '(11) 99999-9999',
      document: '123.456.789-00',
      type: 'individual',
      status: 'active',
      registrationDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Maria Oliveira Costa',
      email: 'maria.oliveira@email.com',
      phone: '(11) 88888-8888',
      document: '987.654.321-00',
      type: 'individual',
      status: 'active',
      registrationDate: '2024-01-20'
    },
    {
      id: '3',
      name: 'Tech Solutions Ltda',
      email: 'contato@techsolutions.com',
      phone: '(11) 3333-3333',
      document: '12.345.678/0001-90',
      type: 'company',
      status: 'active',
      registrationDate: '2024-02-01'
    },
    {
      id: '4',
      name: 'Pedro Almeida',
      email: 'pedro.almeida@email.com',
      phone: '(11) 77777-7777',
      document: '456.789.123-00',
      type: 'individual',
      status: 'inactive',
      registrationDate: '2024-02-10'
    },
    {
      id: '5',
      name: 'Digital Marketing Corp',
      email: 'info@digitalmarketing.com',
      phone: '(11) 4444-4444',
      document: '98.765.432/0001-10',
      type: 'company',
      status: 'active',
      registrationDate: '2024-02-15'
    }
  ]);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    client.document.includes(searchTerm)
  );

  // Funções de callback para ações dos clientes
  const handleEditClient = (client: Client) => {
    console.log('Editar cliente:', client);
    // Aqui você pode abrir um modal de edição ou navegar para uma página de edição
  };

  const handleDeleteClient = (client: Client) => {
    console.log('Excluir cliente:', client);
    // Aqui você pode mostrar uma confirmação e excluir o cliente
  };

  // Função para salvar novo cliente
  const handleSaveClient = (newClientData: Omit<Client, 'id' | 'registrationDate'>) => {
    const newClient: Client = {
      ...newClientData,
      id: Date.now().toString(), // ID simples baseado em timestamp
      registrationDate: new Date().toISOString().split('T')[0] // Data atual
    };
    
    setClients(prev => [...prev, newClient]);
    console.log('Novo cliente salvo:', newClient);
  };

  const [nameColumnWidth, setNameColumnWidth] = useState<number>(300);
  const [isNewClientHovered, setIsNewClientHovered] = useState(false);
  const minWidth = 200;
  const maxWidth = 500;

  return (
    <div style={{
      ...systemStyles.page.container,
      padding: '20px',
      gap: '20px',
      overflow: 'hidden'
    }}>
      {/* Header com botão voltar */}
      <div style={systemStyles.page.header}>
        <BackButton 
          onClick={() => navigate('home')} 
          label="Voltar para Home" 
        />
        <h1 style={systemStyles.page.title}>Clientes</h1>
        <div style={{ width: '80px' }} />
      </div>
      {/* Barra de pesquisa */}
      <ClientSearchBox
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Buscar clientes por nome, email, telefone ou documento..."
        resultsCount={filteredClients.length}
        additionalButton={
          <button
            style={{
              ...systemStyles.button.primary,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              ...(isNewClientHovered ? systemStyles.button.primaryHover : {})
            }}
            onMouseEnter={() => setIsNewClientHovered(true)}
            onMouseLeave={() => setIsNewClientHovered(false)}
            onClick={() => {
              playClickSound();
              setIsModalOpen(true);
            }}
          >
            <PlusIcon size={14} />
            Novo Cliente
          </button>
        }
      />

      {/* Lista de clientes */}
      <div style={{
        ...systemStyles.list.container,
        flexDirection: 'column' as const
      }}>
        <div style={{
          ...systemStyles.list.header,
          gridTemplateColumns: `${nameColumnWidth}px 1fr 1fr 1fr 0.8fr 80px`,
          display: 'grid'
        }}>
          <div style={{ 
            ...systemStyles.list.headerCell, 
            width: nameColumnWidth, 
            cursor: 'col-resize' 
          }}
            onMouseDown={(e) => {
              const startX = e.clientX;
              const startWidth = nameColumnWidth;
              const onMove = (ev: MouseEvent) => {
                const delta = ev.clientX - startX;
                const next = Math.min(maxWidth, Math.max(minWidth, startWidth + delta));
                setNameColumnWidth(next);
              };
              const onUp = () => {
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onUp);
              };
              window.addEventListener('mousemove', onMove);
              window.removeEventListener('mouseup', onUp);
            }}
          >
            Nome/Razão Social
          </div>
          <div style={systemStyles.list.headerCell}>Email</div>
          <div style={systemStyles.list.headerCell}>Telefone</div>
          <div style={systemStyles.list.headerCell}>Documento</div>
          <div style={systemStyles.list.headerCell}>Tipo</div>
          <div style={systemStyles.list.headerCell}>Ações</div>
        </div>

        <ClientList 
          clients={filteredClients} 
          nameColumnWidth={nameColumnWidth}
          onEditClient={handleEditClient}
          onDeleteClient={handleDeleteClient}
        />
      </div>

      {/* Modal de novo cliente com lazy loading */}
      {isModalOpen && (
        <Suspense fallback={<ModalLoader />}>
          <NewClientModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveClient}
          />
        </Suspense>
      )}
    </div>
  );
}
