//--------------------------------------------------------------------
// SIDEBAR DE CONFIGURAÇÕES
// Barra lateral com categorias de configurações
// Inspirado no sidebar das Preferências do Sistema do macOS
//--------------------------------------------------------------------
import React, { useState } from 'react';
import { AppIcons } from '../../../components/Icons/AppIcons';
import { SearchField } from '../../../components/SearchField';
import { systemStyles, systemColors } from '../../../styles/systemStyle';
import { useClickSound } from '../../../hooks/useClickSound';
import { SettingsTab } from '../Settings';

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onSelectTab: (tab: SettingsTab) => void;
}

interface SettingsItem {
  id: SettingsTab;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
}

export function SettingsSidebar({ activeTab, onSelectTab }: SettingsSidebarProps): JSX.Element {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const playClickSound = useClickSound();

  const settingsItems: SettingsItem[] = [
    { id: 'empresa', label: 'Empresa', icon: AppIcons.Document },
    { id: 'fiscal', label: 'Fiscal', icon: AppIcons.Invoice },
    { id: 'email', label: 'Email', icon: AppIcons.Mail },
    { id: 'recebimentos', label: 'Recebimentos', icon: AppIcons.Dollar },
    { id: 'pagamento', label: 'Formas de Pagamento', icon: AppIcons.Invoice },
    { id: 'impressoras', label: 'Impressoras', icon: AppIcons.Settings },
    { id: 'balanca', label: 'Balança', icon: AppIcons.Config },
    { id: 'gaveta', label: 'Gaveta', icon: AppIcons.Folder },
    { id: 'dock', label: 'Dock', icon: AppIcons.Settings },
    { id: 'parametros', label: 'Parâmetros', icon: AppIcons.Config }
  ];

  const handleItemClick = (tab: SettingsTab) => {
    playClickSound();
    onSelectTab(tab);
  };

  const getItemStyle = (itemId: string) => {
    const isActive = itemId === activeTab;
    const isHovered = itemId === hoveredItem;

    if (isActive) {
      return { ...styles.item, ...styles.itemSelected };
    } else if (isHovered) {
      return { ...styles.item, ...styles.itemHover };
    }
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
    },
    itemIcon: {
      width: '20px',
      height: '20px',
      marginRight: '8px'
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

      {/* Lista de itens de configuração */}
      <div style={styles.section}>
        {settingsItems.map((item) => {
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
              <Icon 
                size={20} 
                color={isActive ? '#FFFFFF' : systemColors.text.primary} 
              />
              <span style={{ 
                color: isActive ? '#FFFFFF' : 'inherit'
              }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

