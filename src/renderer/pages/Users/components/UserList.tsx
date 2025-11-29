import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { AppIcons } from '../../../components/Icons/AppIcons';
import { useTheme } from '../../../styles/ThemeProvider';
import { useClickSound } from '../../../hooks/useClickSound';
import { ActionButton } from '../../../components/ActionButton';

// Componente de listagem de usuários
// Modularizado e reutilizável seguindo as regras do projeto
interface User {
  id: string;
  name: string;
  email: string;
  profileName: string;
  status: 'active' | 'inactive';
  lastAccess: string;
}

interface UserListProps {
  users: User[];
  nameColumnWidth: number;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (user: User) => void;
}

export const UserList = React.memo<UserListProps>(({ users, nameColumnWidth, onEditUser, onDeleteUser }) => {
  const { systemColors } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);

  // Função de navegação por teclado
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (users.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev < users.length - 1 ? prev + 1 : 0;
          return newIndex;
        });
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev > 0 ? prev - 1 : users.length - 1;
          return newIndex;
        });
        break;
      
      case 'Home':
        e.preventDefault();
        setSelectedIndex(0);
        break;
      
      case 'End':
        e.preventDefault();
        setSelectedIndex(users.length - 1);
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < users.length) {
          console.log('Usuário selecionado:', users[selectedIndex]);
        }
        break;
      
      case 'Escape':
        e.preventDefault();
        setSelectedIndex(-1);
        break;
    }
  }, [users.length, selectedIndex, users]);

  // Adicionar listener de teclado
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Scroll automático para o item selecionado
  useEffect(() => {
    if (selectedItemRef.current && listRef.current) {
      const listRect = listRef.current.getBoundingClientRect();
      const itemRect = selectedItemRef.current.getBoundingClientRect();
      
      if (itemRect.top < listRect.top || itemRect.bottom > listRect.bottom) {
        selectedItemRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [selectedIndex]);

  // Resetar seleção quando a lista muda
  useEffect(() => {
    setSelectedIndex(-1);
  }, [users]);

  // Estado vazio
  const emptyState = useMemo(() => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: '12px',
      padding: '40px'
    }}>
      <AppIcons.Search size={48} color={systemColors.text.tertiary} />
      <p style={{
        fontSize: '16px',
        fontWeight: '500',
        color: systemColors.text.secondary,
        margin: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}>Nenhum usuário encontrado</p>
      <p style={{
        fontSize: '13px',
        color: systemColors.text.tertiary,
        margin: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}>Tente buscar com outros termos</p>
    </div>
  ), [systemColors.text.tertiary, systemColors.text.secondary]);

  // Função para renderizar item individual
  const renderUserItem = useCallback((user: User, index: number) => (
    <UserRow 
      key={user.id} 
      user={user} 
      index={index} 
      nameColumnWidth={nameColumnWidth}
      isSelected={index === selectedIndex}
      onEditUser={onEditUser}
      onDeleteUser={onDeleteUser}
      ref={index === selectedIndex ? selectedItemRef : null}
    />
  ), [nameColumnWidth, selectedIndex, onEditUser, onDeleteUser]);

  if (users.length === 0) {
    return emptyState;
  }

  return (
    <div className="list-content" ref={listRef}>
      {users.map((user, index) => renderUserItem(user, index))}
    </div>
  );
});

UserList.displayName = 'UserList';

interface UserRowProps {
  user: User;
  index: number;
  nameColumnWidth: number;
  isSelected: boolean;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (user: User) => void;
}

const UserRow = React.memo(React.forwardRef<HTMLDivElement, UserRowProps>(({ 
  user, 
  index, 
  nameColumnWidth, 
  isSelected,
  onEditUser,
  onDeleteUser
}, ref) => {
  const { systemStyles, systemColors } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const playClickSound = useClickSound();

  // Estilo da linha
  const rowStyle = useMemo(() => {
    const baseStyle = {
      gridTemplateColumns: `${nameColumnWidth}px 1fr 1fr 0.8fr 80px`,
      padding: '16px 12px',
      borderBottom: `1px solid ${systemColors.border.divider}`,
      background: systemColors.background.content,
      display: 'grid',
      gap: '16px',
      animationDelay: `${index * 0.05}s`,
      animation: 'fadeIn 0.3s ease forwards',
      opacity: 0,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    };

    if (isSelected) {
      return {
        ...baseStyle,
        ...systemStyles.list.rowSelected
      };
    } else if (isHovered) {
      return { 
        ...baseStyle, 
        ...systemStyles.list.rowHover
      };
    }
    
    return baseStyle;
  }, [nameColumnWidth, index, isSelected, isHovered, systemColors.border.divider, systemColors.background.content, systemStyles.list.rowSelected, systemStyles.list.rowHover]);

  // Callbacks
  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    onEditUser?.(user);
  }, [playClickSound, onEditUser, user]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    onDeleteUser?.(user);
  }, [playClickSound, onDeleteUser, user]);

  const handleClick = useCallback(() => {
    console.log('Usuário clicado:', user);
  }, [user]);

  return (
    <div
      ref={ref}
      style={rowStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div style={{ display: 'flex', alignItems: 'center' }} className="cell-name">
        <div style={{
          fontSize: '14px',
          fontWeight: '500',
          color: systemColors.text.primary,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>{user.name}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }} className="cell-email">
        <span style={{
          fontSize: '13px',
          color: systemColors.text.primary
        }}>{user.email}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }} className="cell-role">
        <span style={{
          fontSize: '11px',
          color: user.profileName.toLowerCase().includes('admin') ? '#FF9500' : '#34C759',
          background: user.profileName.toLowerCase().includes('admin') ? 'rgba(255, 149, 0, 0.1)' : 'rgba(52, 199, 89, 0.1)',
          padding: '4px 10px',
          borderRadius: '6px',
          fontWeight: '600'
        }}>
          {user.profileName || 'Usuário'}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }} className="cell-status">
        <span style={{
          fontSize: '11px',
          color: user.status === 'active' ? '#34C759' : '#FF3B30',
          background: user.status === 'active' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
          padding: '4px 10px',
          borderRadius: '6px',
          fontWeight: '600'
        }}>
          {user.status === 'active' ? 'Ativo' : 'Inativo'}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }} className="cell-actions">
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {onEditUser && (
            <ActionButton
              icon={<AppIcons.Edit size={16} color={systemColors.text.secondary} />}
              onClick={handleEdit}
              title="Editar usuário"
            />
          )}
          {onDeleteUser && (
            <ActionButton
              icon={<AppIcons.Delete size={16} color="#FF3B30" />}
              onClick={handleDelete}
              title="Excluir usuário"
            />
          )}
        </div>
      </div>
    </div>
  );
}));

UserRow.displayName = 'UserRow';

