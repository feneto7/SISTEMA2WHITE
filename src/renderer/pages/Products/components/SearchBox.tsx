import React from 'react';
import { SearchIcon } from '../../../components/Icons/Icons';
import { BackButton } from '../../../components/BackButton';
import { macStyles } from '../../../styles/style';

// Componente de busca para páginas do sistema
// Reutilizável e modularizado seguindo as regras do projeto
interface SearchBoxProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
  resultsCount: number;
  onBackClick?: () => void;
  additionalButton?: React.ReactNode;
}

export function SearchBox({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Buscar...", 
  resultsCount,
  onBackClick,
  additionalButton
}: SearchBoxProps): JSX.Element {
  const styles = macStyles.pages.products;

  return (
    <div style={styles.searchContainer}>
      <div style={searchHeaderRow}>
        {onBackClick && (
          <BackButton onClick={onBackClick} label="Voltar" />
        )}
        <div style={{ flex: 1 }} className="search-input-container">
          <SearchIcon size={18} color="rgba(0, 0, 0, 0.5)" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div style={styles.searchStats}>
        <span style={styles.statsText}>
          {resultsCount} {resultsCount === 1 ? 'item encontrado' : 'itens encontrados'}
        </span>
        {additionalButton && (
          <div style={{ marginLeft: 'auto' }}>
            {additionalButton}
          </div>
        )}
      </div>
    </div>
  );
}

const searchHeaderRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  width: '100%'
};
