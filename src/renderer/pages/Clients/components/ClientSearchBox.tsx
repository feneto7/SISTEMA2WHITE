import React from 'react';
import { SearchIcon } from '../../../components/Icons/Icons';
import { BackButton } from '../../../components/BackButton';
import { systemStyles, systemColors } from '../../../styles/systemStyle';

// Componente de busca para clientes
// Modularizado e reutilizável seguindo as regras do projeto
interface ClientSearchBoxProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
  resultsCount: number;
  onBackClick?: () => void;
  additionalButton?: React.ReactNode;
}

export function ClientSearchBox({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Buscar clientes...", 
  resultsCount,
  onBackClick,
  additionalButton
}: ClientSearchBoxProps): JSX.Element {
  return (
    <div style={systemStyles.searchBox.container}>
      <div style={searchHeaderRow}>
        {onBackClick && (
          <BackButton onClick={onBackClick} label="Voltar" />
        )}
        <div style={searchFieldContainer}>
          <div style={searchIconWrapper}>
            <SearchIcon size={14} color={systemColors.text.tertiary} />
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={searchInputStyle}
          />
        </div>
        {additionalButton && (
          <div style={{ flexShrink: 0 }}>
            {additionalButton}
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
          {resultsCount} {resultsCount === 1 ? 'cliente encontrado' : 'clientes encontrados'}
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

const searchInputStyle: React.CSSProperties = {
  ...systemStyles.searchField.field,
  width: '100%',
  height: '28px',
  paddingLeft: '32px',
  paddingRight: '10px'
};
