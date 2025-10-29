import React from 'react';
import { AppIcons } from '../../../components/Icons/AppIcons';
import { useTheme } from '../../../styles/ThemeProvider';

// Componente de busca para usuários
// Modularizado e reutilizável seguindo as regras do projeto
interface UserSearchBoxProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
  resultsCount: number;
  onNewUserClick?: () => void;
}

export function UserSearchBox({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Buscar usuários...", 
  resultsCount,
  onNewUserClick
}: UserSearchBoxProps): JSX.Element {
  const { systemStyles, systemColors } = useTheme();
  return (
    <div style={systemStyles.searchBox.container}>
      <div style={searchHeaderRow}>
        <div style={searchFieldContainer}>
          <div style={searchIconWrapper}>
            <AppIcons.Search size={14} color={systemColors.text.tertiary} />
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              ...systemStyles.searchField.field,
              width: '100%',
              height: '28px',
              paddingLeft: '32px',
              paddingRight: '10px'
            }}
          />
        </div>
        {onNewUserClick && (
          <div style={{ flexShrink: 0 }}>
            <button
              style={{
                ...systemStyles.button.primary,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '28px',
                padding: '0 12px'
              }}
              onClick={onNewUserClick}
            >
              <PlusIcon size={14} />
              Novo Usuário
            </button>
          </div>
        )}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '12px'
      }}>
        <span style={{
          fontSize: '11px',
          color: systemColors.text.secondary,
          fontWeight: '500',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
          {resultsCount} {resultsCount === 1 ? 'usuário encontrado' : 'usuários encontrados'}
        </span>
      </div>
    </div>
  );
}

const searchHeaderRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
  justifyContent: 'space-between'
};

const searchFieldContainer: React.CSSProperties = {
  position: 'relative',
  flex: 1,
  display: 'flex',
  alignItems: 'center'
};

const searchIconWrapper: React.CSSProperties = {
  position: 'absolute',
  left: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
  zIndex: 1
};

// Estilo do input agora vem do tema via useTheme

// Componente de ícone plus
const PlusIcon = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

