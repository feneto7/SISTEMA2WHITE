//--------------------------------------------------------------------
// MODAL DE SELEÇÃO DE CLIENTE
// Modal para pesquisar e selecionar um cliente na venda
// Acionado por CTRL+I no PDV
//--------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../styles/ThemeProvider';
import { SearchField } from '../../../components/SearchField';
import { NewClientModal } from '../../../components/NewClientModal/NewClientModal';

interface Client {
  id: string;
  name: string;
  cpfCnpj: string;
  phone?: string;
  city?: string;
}

interface ClientSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClient: (client: Client) => void;
}

export function ClientSelectModal({ isOpen, onClose, onSelectClient }: ClientSelectModalProps): JSX.Element | null {
  const { systemStyles, systemColors } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const selectedItemRef = React.useRef<HTMLDivElement>(null);
  const [clients, setClients] = useState<Client[]>([
    { id: '1', name: 'João Silva', cpfCnpj: '123.456.789-00', phone: '(11) 99999-9999', city: 'São Paulo' },
    { id: '2', name: 'Maria Santos', cpfCnpj: '987.654.321-00', phone: '(11) 88888-8888', city: 'São Paulo' },
    { id: '3', name: 'Pedro Oliveira', cpfCnpj: '456.789.123-00', phone: '(11) 77777-7777', city: 'Rio de Janeiro' },
    { id: '4', name: 'Ana Costa', cpfCnpj: '789.123.456-00', phone: '(11) 66666-6666', city: 'Belo Horizonte' },
    { id: '5', name: 'Carlos Ferreira', cpfCnpj: '321.654.987-00', phone: '(11) 55555-5555', city: 'Curitiba' }
  ]);

  // Filtrar clientes baseado na pesquisa
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cpfCnpj.includes(searchTerm) ||
    client.phone?.includes(searchTerm) ||
    client.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Resetar índice quando mudar a pesquisa
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  // Scroll automático para o item selecionado
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [selectedIndex]);

  // Listener de teclado
  useEffect(() => {
    // Não processa teclas se o modal de novo cliente estiver aberto
    if (!isOpen || isNewClientModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredClients.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredClients[selectedIndex]) {
            onSelectClient(filteredClients[selectedIndex]);
            onClose();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isNewClientModalOpen, selectedIndex, filteredClients, onClose, onSelectClient]);


  // Função para lidar com o salvamento de um novo cliente
  const handleSaveNewClient = (newClientData: any) => {
    const newClient: Client = {
      id: Date.now().toString(),
      name: newClientData.name,
      cpfCnpj: newClientData.document,
      phone: newClientData.phone,
      city: newClientData.city || ''
    };
    
    // Adiciona o novo cliente à lista
    setClients(prev => [...prev, newClient]);
    
    // Fecha o modal de novo cliente
    setIsNewClientModalOpen(false);
    
    // Opcional: Seleciona automaticamente o novo cliente
    onSelectClient(newClient);
    onClose();
  };

  if (!isOpen) return null;

  const styles = {
    modal: {
      ...systemStyles.modal.container,
      width: '800px',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden'
    },
    searchContainer: {
      padding: '16px 20px',
      borderBottom: `1px solid ${systemColors.border.light}`,
      background: systemColors.background.primary,
      flexShrink: 0
    },
    cellName: {
      fontSize: '14px',
      fontWeight: '600',
      color: systemColors.text.primary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    cellText: {
      fontSize: '13px',
      color: systemColors.text.primary,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    emptyState: {
      padding: '40px 20px',
      textAlign: 'center' as const,
      color: systemColors.text.secondary,
      fontSize: '14px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }
  };

  const getClientRowStyle = (index: number) => {
    const isSelected = index === selectedIndex;
    const isHovered = index === hoveredIndex;

    const baseStyle = {
      ...systemStyles.list.row,
      gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr',
      display: 'grid',
      cursor: 'pointer',
      animationDelay: `${index * 0.05}s`
    };

    if (isSelected) {
      return {
        ...baseStyle,
        ...systemStyles.list.rowSelected,
        transform: 'translateX(4px)',
        boxShadow: '0 2px 8px rgba(10, 132, 255, 0.2)'
      };
    } else if (isHovered) {
      return {
        ...baseStyle,
        ...systemStyles.list.rowHover
      };
    }

    return baseStyle;
  };

  return (
    <div style={systemStyles.modal.overlay}>
      <div style={styles.modal}>
        {/* Title Bar com traffic lights */}
        <div style={{ ...systemStyles.modal.titleBar, flexShrink: 0 }}>
          <div style={systemStyles.trafficLights.container}>
            <button 
              style={{...systemStyles.trafficLights.button, ...systemStyles.trafficLights.red}} 
              onClick={onClose}
            ></button>
            <button style={{...systemStyles.trafficLights.button, ...systemStyles.trafficLights.yellow}}></button>
            <button style={{...systemStyles.trafficLights.button, ...systemStyles.trafficLights.green}}></button>
          </div>
          <div style={systemStyles.modal.title}>Selecionar Cliente</div>
          <div style={{ width: '60px' }}></div>
        </div>

        {/* Campo de pesquisa */}
        <div style={styles.searchContainer}>
          <SearchField
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Pesquisar por nome, CPF/CNPJ, telefone ou cidade"
          />
        </div>

        {/* Header da lista */}
        <div style={{
          ...systemStyles.list.header,
          gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr',
          display: 'grid',
          flexShrink: 0
        }}>
          <div style={systemStyles.list.headerCell}>Nome</div>
          <div style={systemStyles.list.headerCell}>CPF/CNPJ</div>
          <div style={systemStyles.list.headerCell}>Telefone</div>
          <div style={systemStyles.list.headerCell}>Cidade</div>
        </div>

        {/* Lista de clientes */}
        <div style={{ ...systemStyles.list.content, flex: 1, minHeight: 0 }}>
          {filteredClients.length === 0 ? (
            <div style={styles.emptyState}>
              {searchTerm
                ? 'Nenhum cliente encontrado com os critérios de busca'
                : 'Nenhum cliente cadastrado'}
            </div>
          ) : (
            filteredClients.map((client, index) => (
              <div
                key={client.id}
                ref={index === selectedIndex ? selectedItemRef : null}
                style={getClientRowStyle(index)}
                onClick={() => {
                  onSelectClient(client);
                  onClose();
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={styles.cellName}>{client.name}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={styles.cellText}>{client.cpfCnpj}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={styles.cellText}>{client.phone || '-'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={styles.cellText}>{client.city || '-'}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer com botões */}
        <div style={{ ...systemStyles.modal.footer, flexShrink: 0 }}>
          <div style={systemStyles.modal.footerLeft}>
            <button
              style={systemStyles.button.default}
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
          <div style={systemStyles.modal.footerRight}>
            <button
              style={systemStyles.button.primary}
              onClick={() => setIsNewClientModalOpen(true)}
            >
              Novo
            </button>
          </div>
        </div>
      </div>

      {/* Animação fadeIn para as linhas */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {/* Modal de Novo Cliente */}
      <NewClientModal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        onSave={handleSaveNewClient}
      />
    </div>
  );
}

