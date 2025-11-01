//--------------------------------------------------------------------
// SIDEBAR DE ATENDIMENTOS
// Barra lateral para navegação entre abas operacionais de atendimento
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { useTheme } from '../../../styles/ThemeProvider';
import { AppIcons } from '../../../components/Icons/AppIcons';
import { SearchField } from '../../../components/SearchField';
import { AttendancesTab } from '../Attendances';
import { useClickSound } from '../../../hooks/useClickSound';

interface AttendancesSidebarProps {
  activeTab: AttendancesTab;
  onSelectTab: (tab: AttendancesTab) => void;
}

interface NavItem {
  id: AttendancesTab;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
}

export function AttendancesSidebar({ activeTab, onSelectTab }: AttendancesSidebarProps): JSX.Element {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();

  const navItems: NavItem[] = [
    { id: 'myOrders', label: 'Meus Pedidos', icon: AppIcons.Document },
    { id: 'counter', label: 'Balcão PDV', icon: AppIcons.Invoice },
    { id: 'hall', label: 'Pedidos Salão', icon: AppIcons.Config },
    { id: 'kitchen', label: 'Cozinha', icon: AppIcons.Settings }
  ];

  const handleItemClick = (tab: AttendancesTab) => {
    playClickSound();
    onSelectTab(tab);
  };

  const getItemStyle = (itemId: string) => {
    const isActive = itemId === activeTab;
    const isHovered = itemId === hoveredItem;

    if (isActive) return { ...styles.item, ...styles.itemSelected };
    if (isHovered) return { ...styles.item, ...styles.itemHover };
    return styles.item;
  };

  const styles = {
    container: {
      ...systemStyles.sidebar.container,
      width: '240px',
      minWidth: '240px',
      border: `1px solid ${systemColors.border.light}`,
      background: systemColors.background.sidebar,
      padding: '10px 0',
      borderRadius: '10px',
      marginLeft: '0',
      marginTop: '0',
      marginBottom: '0',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      borderRight: 'none'
    },
    searchContainer: {
      padding: '0 10px 10px 10px'
    },
    section: {
      marginBottom: '0'
    },
    item: {
      ...systemStyles.sidebar.item,
      padding: '8px 10px',
      margin: '2px 10px',
      cursor: 'pointer',
      transition: 'all 0.1s ease',
      borderRadius: '6px'
    },
    itemHover: {
      ...systemStyles.sidebar.itemHover
    },
    itemSelected: {
      ...systemStyles.sidebar.itemSelected
    }
  };

  return (
    <div style={styles.container}>
      {/* Campo de busca */}
      <div style={styles.searchContainer}>
        <SearchField
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar"
        />
      </div>

      {/* Lista de itens de navegação */}
      <div style={styles.section}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeTab;

          return (
            <div
              key={item.id}
              style={getItemStyle(item.id)}
              onClick={() => handleItemClick(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Icon size={20} color={isActive ? '#FFFFFF' : systemColors.text.primary} />
              <span style={{ color: isActive ? '#FFFFFF' : 'inherit' }}>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}


