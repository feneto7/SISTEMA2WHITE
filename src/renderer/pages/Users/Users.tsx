import React, { useState } from 'react';
import { systemStyles, systemColors } from '../../styles/systemStyle';
import { UserSearchBox, UserList, NewUserModal } from './components';
import { useNavigation } from '../../router/Navigation';
import { useClickSound } from '../../hooks/useClickSound';
import { BackButton } from '../../components/BackButton';

// Interface para usuário do sistema
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastAccess: string;
}

// Página de Usuários do sistema
// Permite buscar, visualizar e gerenciar usuários cadastrados
export function Users(): JSX.Element {
  const { navigate } = useNavigation();
  const playClickSound = useClickSound();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao.silva@email.com',
      role: 'admin',
      status: 'active',
      lastAccess: '2024-10-26'
    },
    {
      id: '2',
      name: 'Maria Oliveira',
      email: 'maria.oliveira@email.com',
      role: 'user',
      status: 'active',
      lastAccess: '2024-10-25'
    },
    {
      id: '3',
      name: 'Pedro Santos',
      email: 'pedro.santos@email.com',
      role: 'user',
      status: 'inactive',
      lastAccess: '2024-10-20'
    },
    {
      id: '4',
      name: 'Ana Costa',
      email: 'ana.costa@email.com',
      role: 'admin',
      status: 'active',
      lastAccess: '2024-10-26'
    },
    {
      id: '5',
      name: 'Carlos Lima',
      email: 'carlos.lima@email.com',
      role: 'user',
      status: 'active',
      lastAccess: '2024-10-24'
    }
  ]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Funções de callback para ações dos usuários
  const handleEditUser = (user: User) => {
    console.log('Editar usuário:', user);
  };

  const handleDeleteUser = (user: User) => {
    console.log('Excluir usuário:', user);
  };

  const handleSaveNewUser = (userData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'admin' | 'user';
  }) => {
    console.log('Salvar novo usuário:', userData);
    // Aqui você adicionaria a lógica para salvar o usuário
  };

  const [nameColumnWidth, setNameColumnWidth] = useState<number>(300);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const minWidth = 200;
  const maxWidth = 500;

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      gap: '20px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Header com botão voltar */}
      <div style={systemStyles.page.header}>
        <BackButton 
          onClick={() => navigate('home')} 
          label="Voltar para Home" 
        />
        <h1 style={systemStyles.page.title}>Usuários</h1>
        <div style={{ width: '80px' }} />
      </div>
      
      {/* Barra de pesquisa */}
      <UserSearchBox
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Buscar usuários por nome, email ou função..."
        resultsCount={filteredUsers.length}
        onNewUserClick={() => {
          playClickSound();
          setIsNewUserModalOpen(true);
        }}
      />

      {/* Lista de usuários */}
      <div style={{
        ...systemStyles.list.container,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0
      }}>
        <div style={{
          ...systemStyles.list.header,
          gridTemplateColumns: `${nameColumnWidth}px 1fr 1fr 0.8fr 80px`,
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
            Nome
          </div>
          <div style={systemStyles.list.headerCell}>Email</div>
          <div style={systemStyles.list.headerCell}>Função</div>
          <div style={systemStyles.list.headerCell}>Status</div>
          <div style={systemStyles.list.headerCell}>Ações</div>
        </div>

        <div style={{
          ...systemStyles.list.content,
          flex: 1,
          overflow: 'auto'
        }}>
          <UserList 
            users={filteredUsers} 
            nameColumnWidth={nameColumnWidth}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        </div>
      </div>

      {/* Modal de Novo Usuário */}
      <NewUserModal
        isOpen={isNewUserModalOpen}
        onClose={() => setIsNewUserModalOpen(false)}
        onSave={handleSaveNewUser}
      />
    </div>
  );
}

