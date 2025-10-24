import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { SearchIcon, EditIcon, DeleteIcon } from '../../../components/Icons/Icons';
import { macStyles } from '../../../styles/style';
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
  const styles = macStyles.pages.clients;
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
    <div style={styles.emptyState}>
      <SearchIcon size={48} color="rgba(0, 0, 0, 0.2)" />
      <p style={styles.emptyText}>Nenhum cliente encontrado</p>
      <p style={styles.emptySubtext}>Tente buscar com outros termos</p>
    </div>
  ), [styles.emptyState, styles.emptyText, styles.emptySubtext]);

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
        style={styles.listContent}
      />
    );
  }

  // Renderização normal para listas pequenas
  return (
    <div style={styles.listContent} className="list-content" ref={listRef}>
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

const ClientRow = React.memo<ClientRowProps>(({ 
  client, 
  index, 
  nameColumnWidth, 
  isSelected,
  onEditClient,
  onDeleteClient
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const styles = macStyles.pages.clients;
  const playClickSound = useClickSound();

  // Memoizar estilo da linha para evitar recálculos desnecessários
  const rowStyle = useMemo(() => {
    const baseStyle = {
      ...styles.listRow,
      gridTemplateColumns: `${nameColumnWidth}px 1fr 1fr 1fr 0.8fr 80px`,
      animationDelay: `${index * 0.05}s`,
      cursor: 'pointer',
      transition: 'all 0.15s ease'
    };

    // Aplicar estilo de hover ou seleção
    if (isSelected) {
      return {
        ...baseStyle,
        background: 'rgba(10, 132, 255, 0.1)',
        border: '1px solid rgba(10, 132, 255, 0.3)',
        transform: 'translateX(4px)',
        boxShadow: '0 2px 8px rgba(10, 132, 255, 0.2)'
      };
    } else if (isHovered) {
      return { ...baseStyle, ...styles.listRowHover };
    }
    
    return baseStyle;
  }, [styles.listRow, styles.listRowHover, nameColumnWidth, index, isSelected, isHovered]);

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
      style={rowStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div style={styles.rowCell} className="cell-name">
        <div style={styles.clientName}>{client.name}</div>
      </div>
      <div style={styles.rowCell} className="cell-email">
        <span style={styles.emailText}>{client.email}</span>
      </div>
      <div style={styles.rowCell} className="cell-phone">
        <span style={styles.phoneText}>{client.phone}</span>
      </div>
      <div style={styles.rowCell} className="cell-document">
        <span style={styles.documentText}>{client.document}</span>
      </div>
      <div style={styles.rowCell} className="cell-type">
        <span style={client.type === 'individual' ? styles.typeBadgeIndividual : styles.typeBadgeCompany}>
          {client.type === 'individual' ? 'Pessoa Física' : 'Pessoa Jurídica'}
        </span>
      </div>
      <div style={styles.rowCell} className="cell-actions">
        <div style={styles.actionButtons}>
          {onEditClient && (
            <button
              style={styles.actionButton}
              onClick={handleEdit}
              title="Editar cliente"
            >
              <EditIcon size={16} color="rgba(0, 0, 0, 0.6)" />
            </button>
          )}
          {onDeleteClient && (
            <button
              style={styles.actionButton}
              onClick={handleDelete}
              title="Excluir cliente"
            >
              <DeleteIcon size={16} color="rgba(255, 59, 48, 0.8)" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

ClientRow.displayName = 'ClientRow';
