import React from 'react';
import { BackButton } from '../../../components/BackButton';
import { macStyles } from '../../../styles/style';

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
  const styles = macStyles.pages.clients;

  return (
    <div style={styles.searchContainer}>
      {/* Header com botão voltar e campo de pesquisa */}
      <div style={styles.searchHeaderRow}>
        {onBackClick && (
          <BackButton onClick={onBackClick} />
        )}
        
        <div style={{ flex: 1 }} className="search-input-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
          />
        </div>
      </div>

      {/* Estatísticas e botão adicional */}
      <div style={styles.searchStats}>
        <span style={styles.statsText}>
          {resultsCount} {resultsCount === 1 ? 'cliente encontrado' : 'clientes encontrados'}
        </span>
        
        {additionalButton && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {additionalButton}
          </div>
        )}
      </div>
    </div>
  );
}
