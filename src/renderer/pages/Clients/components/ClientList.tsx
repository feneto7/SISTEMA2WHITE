import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { SearchIcon, EditIcon, DeleteIcon } from '../../../components/Icons/Icons';
import { ActionButton } from '../../../components/ActionButton';
import { systemStyles, systemColors } from '../../../styles/systemStyle';
import { useClickSound } from '../../../hooks/useClickSound';
import { VirtualList, useListPerformance, useDebounce } from '../../../hooks/useVirtualization';

// Componente de listagem de clientes
// Modularizado e reutilizável seguindo as regras do projeto
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

interface ClientListProps {
  clients: Client[];
  nameColumnWidth: number;
  onEditClient?: (client: Client) => void;
  onDeleteClient?: (client: Client) => void;
}

export const ClientList = React.memo<ClientListProps>(({ clients, nameColumnWidth, onEditClient, onDeleteClient }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);

  // Verificar se precisa de virtualização
  const { shouldVirtualize, itemCount } = useListPerformance(clients, 50);

  // Memoizar função de navegação por teclado para evitar recriações desnecessárias
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (clients.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev < clients.length - 1 ? prev + 1 : 0;
          return newIndex;
        });
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev > 0 ? prev - 1 : clients.length - 1;
          return newIndex;
        });
        break;
      
      case 'Home':
        e.preventDefault();
        setSelectedIndex(0);
        break;
      
      case 'End':
        e.preventDefault();
        setSelectedIndex(clients.length - 1);
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < clients.length) {
          // Aqui você pode adicionar ação ao pressionar Enter
          console.log('Cliente selecionado:', clients[selectedIndex]);
        }
        break;
      
      case 'Escape':
        e.preventDefault();
        setSelectedIndex(-1);
        break;
    }
  }, [clients.length, selectedIndex, clients]);

  // Adicionar listener de teclado quando o componente monta
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
      
      // Verificar se o item está visível
      if (itemRect.top < listRect.top || itemRect.bottom > listRect.bottom) {
        selectedItemRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [selectedIndex]);

  // Resetar seleção quando a lista de clientes muda
  useEffect(() => {
    setSelectedIndex(-1);
  }, [clients]);

  // Memoizar estado vazio para evitar recriações
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
      <SearchIcon size={48} color="rgba(0, 0, 0, 0.2)" />
      <p style={{
        fontSize: '16px',
        fontWeight: '500',
        color: systemColors.text.secondary,
        margin: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}>Nenhum cliente encontrado</p>
      <p style={{
        fontSize: '13px',
        color: 'rgba(0, 0, 0, 0.4)',
        margin: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}>Tente buscar com outros termos</p>
    </div>
  ), []);

  // Função para renderizar item individual
  const renderClientItem = useCallback((client: Client, index: number) => (
    <ClientRow 
      key={client.id} 
      client={client} 
      index={index} 
      nameColumnWidth={nameColumnWidth}
      isSelected={index === selectedIndex}
      onEditClient={onEditClient}
      onDeleteClient={onDeleteClient}
      ref={index === selectedIndex ? selectedItemRef : null}
    />
  ), [nameColumnWidth, selectedIndex, onEditClient, onDeleteClient]);

  if (clients.length === 0) {
    return emptyState;
  }

  // Usar virtualização para listas grandes
  if (shouldVirtualize) {
    return (
      <VirtualList
        items={clients}
        itemHeight={60} // Altura estimada de cada item
        containerHeight={400} // Altura do container
        renderItem={renderClientItem}
        overscan={5}
        className="list-content"
        style={systemStyles.list.content}
      />
    );
  }

  // Renderização normal para listas pequenas
  return (
    <div style={systemStyles.list.content} className="list-content" ref={listRef}>
      {clients.map((client, index) => renderClientItem(client, index))}
    </div>
  );
});

ClientList.displayName = 'ClientList';

interface ClientRowProps {
  client: Client;
  index: number;
  nameColumnWidth: number;
  isSelected: boolean;
  onEditClient?: (client: Client) => void;
  onDeleteClient?: (client: Client) => void;
}

const ClientRow = React.memo(React.forwardRef<HTMLDivElement, ClientRowProps>(({ 
  client, 
  index, 
  nameColumnWidth, 
  isSelected,
  onEditClient,
  onDeleteClient
}, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const playClickSound = useClickSound();

  // Memoizar estilo da linha para evitar recálculos desnecessários
  const rowStyle = useMemo(() => {
    const baseStyle = {
      gridTemplateColumns: `${nameColumnWidth}px 1fr 1fr 1fr 0.8fr 80px`,
      padding: '16px 12px',
      borderBottom: `1px solid ${systemColors.border.divider}`,
      display: 'grid',
      gap: '16px',
      animationDelay: `${index * 0.05}s`,
      animation: 'fadeIn 0.3s ease forwards',
      opacity: 0,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    };

    // Aplicar estilo de hover ou seleção
    if (isSelected) {
      return {
        ...baseStyle,
        background: systemColors.selection.background,
        border: `1px solid ${systemColors.selection.border}`,
        transform: 'translateX(4px)',
        boxShadow: '0 2px 8px rgba(10, 132, 255, 0.2)'
      };
    } else if (isHovered) {
      return { 
        ...baseStyle, 
        background: systemColors.control.hover
      };
    }
    
    return baseStyle;
  }, [nameColumnWidth, index, isSelected, isHovered]);

  // Memoizar callbacks para evitar recriações
  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    onEditClient?.(client);
  }, [playClickSound, onEditClient, client]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    onDeleteClient?.(client);
  }, [playClickSound, onDeleteClient, client]);

  const handleClick = useCallback(() => {
    console.log('Cliente clicado:', client);
  }, [client]);

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
        }}>{client.name}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }} className="cell-email">
        <span style={{
          fontSize: '13px',
          color: systemColors.text.primary
        }}>{client.email}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }} className="cell-phone">
        <span style={{
          fontSize: '13px',
          color: systemColors.text.primary
        }}>{client.phone}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }} className="cell-document">
        <span style={{
          fontSize: '13px',
          color: systemColors.text.primary
        }}>{client.document}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }} className="cell-type">
        <span style={{
          fontSize: '11px',
          color: client.type === 'individual' ? '#34C759' : '#FF9500',
          background: client.type === 'individual' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 149, 0, 0.1)',
          padding: '4px 10px',
          borderRadius: '6px',
          fontWeight: '600'
        }}>
          {client.type === 'individual' ? 'Pessoa Física' : 'Pessoa Jurídica'}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }} className="cell-actions">
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {onEditClient && (
            <ActionButton
              icon={<EditIcon size={16} color={systemColors.text.secondary} />}
              onClick={handleEdit}
              title="Editar cliente"
            />
          )}
          {onDeleteClient && (
            <ActionButton
              icon={<DeleteIcon size={16} color="#FF3B30" />}
              onClick={handleDelete}
              title="Excluir cliente"
            />
          )}
        </div>
      </div>
    </div>
  );
}));

ClientRow.displayName = 'ClientRow';
