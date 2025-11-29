import React, { useState, useEffect } from 'react';
import { useTheme } from '../../styles/ThemeProvider';
import { UserSearchBox, UserList, NewUserModal } from './components';
import { useNavigation } from '../../router/Navigation';
import { useClickSound } from '../../hooks/useClickSound';
import { BackButton } from '../../components/BackButton';
import { apiGet, apiPost, apiPut } from '../../utils/apiService';

// Interface para usuário do sistema
interface User {
  id: string;
  name: string;
  email: string;
  profileName: string;
  profileId?: string | null;
  status: 'active' | 'inactive';
  lastAccess: string;
}

// Página de Usuários do sistema
// Permite buscar, visualizar e gerenciar usuários cadastrados
export function Users(): JSX.Element {
  const { systemStyles, systemColors } = useTheme();
  const { navigate } = useNavigation();
  const playClickSound = useClickSound();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Lista filtrada para busca em memória
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Funções de callback para ações dos usuários
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsNewUserModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    console.log('Excluir usuário:', user);
  };

  type NewUserFormData = {
    id?: string;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  };

  type ApiUser = {
    id: string;
    name: string;
    email: string;
    permission_profile?: {
      name: string;
    };
    permission_profile_id?: number | string | null;
    status?: string;
    last_access_at?: string;
  };

  const mapApiUserToUser = (apiUser: ApiUser): User => ({
    id: String(apiUser.id),
    name: apiUser.name,
    email: apiUser.email,
    profileName: apiUser.permission_profile?.name || 'Usuário',
    profileId: apiUser.permission_profile_id !== undefined && apiUser.permission_profile_id !== null
      ? String(apiUser.permission_profile_id)
      : null,
    status: apiUser.status === 'inactive' ? 'inactive' : 'active',
    lastAccess: apiUser.last_access_at || ''
  });

  const handleSaveNewUser = async (userData: NewUserFormData) => {
    try {
      // Atualização de usuário
      if (userData.id) {
        const body: Record<string, any> = {
          name: userData.name,
          email: userData.email
        };

        if (userData.password) {
          body.password = userData.password;
          body.password_confirmation = userData.confirmPassword;
        }

        if (userData.role) {
          body.permission_profile_id = userData.role;
        }

        const response = await apiPut<{ message: string; data: ApiUser }>(`/api/users/${userData.id}`, body);

        if (response.ok && response.data?.data) {
          const updatedUser = mapApiUserToUser(response.data.data);
          setUsers(prev =>
            prev.map(user => (user.id === updatedUser.id ? updatedUser : user))
          );
        } else {
          throw new Error(response.data?.message || 'Erro ao atualizar usuário');
        }
      } else {
        // Criação de usuário
        const body = {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          password_confirmation: userData.confirmPassword,
          permission_profile_id: userData.role || null
        };

        const response = await apiPost<{ message: string; user: ApiUser }>('/api/users', body);

        if (response.ok && response.data?.user) {
          const createdUser = mapApiUserToUser(response.data.user);
          setUsers(prev => [...prev, createdUser]);
        } else {
          throw new Error(response.data?.message || 'Erro ao criar usuário');
        }
      }
    } catch (error: any) {
      console.error('Erro ao salvar usuário:', error);
      alert(error?.message || 'Erro ao salvar usuário');
    } finally {
      setEditingUser(null);
    }
  };

  const [nameColumnWidth, setNameColumnWidth] = useState<number>(300);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const minWidth = 200;
  const maxWidth = 500;

  // Carrega usuários da API do tenant
  useEffect(() => {
        const loadUsers = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        const response = await apiGet<{ message: string; data: ApiUser[] }>('/api/users');

        if (response.ok && Array.isArray(response.data?.data)) {
          const apiUsers = response.data.data;

          const mappedUsers: User[] = apiUsers.map((apiUser) => mapApiUserToUser(apiUser));

          setUsers(mappedUsers);
        } else {
          throw new Error(response.data?.message || 'Erro ao carregar usuários');
        }
      } catch (error: any) {
        console.error('Erro ao carregar usuários:', error);
        setLoadError(error?.message || 'Erro ao carregar usuários');
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      gap: '20px',
      overflow: 'hidden',
      position: 'relative',
      background: systemColors.background.content
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
        placeholder="Buscar usuários por nome, email ou perfil..."
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
          <div style={systemStyles.list.headerCell}>Perfil</div>
          <div style={systemStyles.list.headerCell}>Status</div>
          <div style={systemStyles.list.headerCell}>Ações</div>
        </div>

        <div style={{
          ...systemStyles.list.content,
          flex: 1,
          overflow: 'auto'
        }}>
          {isLoading ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              fontSize: 14,
              color: systemColors.text.secondary
            }}>
              Carregando usuários...
            </div>
          ) : loadError ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 8,
              fontSize: 13,
              color: systemColors.text.secondary
            }}>
              <span>{loadError}</span>
              <span>Tente novamente mais tarde.</span>
            </div>
          ) : (
            <UserList 
              users={filteredUsers} 
              nameColumnWidth={nameColumnWidth}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
            />
          )}
        </div>
      </div>

      {/* Modal de Novo Usuário */}
      <NewUserModal
        isOpen={isNewUserModalOpen}
        onClose={() => {
          setIsNewUserModalOpen(false);
          setEditingUser(null);
        }}
        editingUser={editingUser
          ? {
              id: editingUser.id,
              name: editingUser.name,
              email: editingUser.email,
              profileId: editingUser.profileId ?? undefined
            }
          : null}
        onSave={handleSaveNewUser}
      />
    </div>
  );
}

