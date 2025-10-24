import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { SearchIcon, CloseIcon, DetailIcon } from '../../../components/Icons/Icons';
import { macStyles } from '../../../styles/style';
import { useClickSound } from '../../../hooks/useClickSound';
import { VirtualList, useListPerformance, useDebounce } from '../../../hooks/useVirtualization';
import { useElementScrollbarStyles } from '../../../hooks/useScrollbarStyles';

// Interface para MDFe
export interface MDFe {
  id: string;
  numero: string;
  serie: string;
  chave: string;
  emitente: string;
  destinatario: string;
  valor: number;
  status: 'pendente' | 'autorizada' | 'cancelada' | 'rejeitada';
  dataEmissao: string;
  dataAutorizacao?: string;
}

interface MDFeListProps {
  mdfes: MDFe[];
  onCloseMDFe?: (mdfe: MDFe) => void;
  onDetailMDFe?: (mdfe: MDFe) => void;
}

// Componente de listagem de MDF-es
// Modularizado e reutilizável seguindo as regras do projeto
export const MDFeList = React.memo<MDFeListProps>(({ mdfes, onCloseMDFe, onDetailMDFe }) => {
  const styles = macStyles.pages.clients;
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);

  // Aplicar estilos de scrollbar específicos para listas
  useElementScrollbarStyles(listRef, 'list');

  // Verificar se precisa de virtualização
  const { shouldVirtualize, itemCount } = useListPerformance(mdfes, 50);

  // Memoizar função de navegação por teclado para evitar recriações desnecessárias
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (mdfes.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev < mdfes.length - 1 ? prev + 1 : 0;
          return newIndex;
        });
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev > 0 ? prev - 1 : mdfes.length - 1;
          return newIndex;
        });
        break;
      
      case 'Home':
        e.preventDefault();
        setSelectedIndex(0);
        break;
      
      case 'End':
        e.preventDefault();
        setSelectedIndex(mdfes.length - 1);
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < mdfes.length) {
          // Aqui você pode adicionar ação ao pressionar Enter
          console.log('MDFe selecionado:', mdfes[selectedIndex]);
        }
        break;
      
      case 'Escape':
        e.preventDefault();
        setSelectedIndex(-1);
        break;
    }
  }, [mdfes.length, selectedIndex, mdfes]);

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

  // Resetar seleção quando a lista de MDF-es muda
  useEffect(() => {
    setSelectedIndex(-1);
  }, [mdfes]);

  // Memoizar estado vazio para evitar recriações
  const emptyState = useMemo(() => (
    <div style={styles.emptyState}>
      <SearchIcon size={48} color="rgba(0, 0, 0, 0.2)" />
      <p style={styles.emptyText}>Nenhuma MDF-e encontrada</p>
      <p style={styles.emptySubtext}>Clique em "Nova MDF-e" para criar a primeira</p>
    </div>
  ), [styles.emptyState, styles.emptyText, styles.emptySubtext]);

  // Função para renderizar item individual
  const renderMDFeItem = useCallback((mdfe: MDFe, index: number) => (
    <MDFeRow 
      key={mdfe.id} 
      mdfe={mdfe} 
      index={index} 
      isSelected={index === selectedIndex}
      onCloseMDFe={onCloseMDFe}
      onDetailMDFe={onDetailMDFe}
      ref={index === selectedIndex ? selectedItemRef : null}
    />
  ), [selectedIndex, onCloseMDFe, onDetailMDFe]);

  if (mdfes.length === 0) {
    return (
      <div style={styles.listContainer}>
        <div style={{
          ...styles.listHeader,
          gridTemplateColumns: '2fr 1fr 1fr 1fr 0.8fr 80px'
        }}>
          <div style={styles.headerCell}>
            Número/Série
            <div style={styles.headerCellDivider}></div>
          </div>
          <div style={styles.headerCell}>
            Emitente
            <div style={styles.headerCellDivider}></div>
          </div>
          <div style={styles.headerCell}>
            Destinatário
            <div style={styles.headerCellDivider}></div>
          </div>
          <div style={styles.headerCell}>
            Valor
            <div style={styles.headerCellDivider}></div>
          </div>
          <div style={styles.headerCell}>Status</div>
          <div style={styles.headerCell}>Ações</div>
        </div>
        <div style={styles.listContent}>
          {emptyState}
        </div>
      </div>
    );
  }

  // Usar virtualização para listas grandes
  if (shouldVirtualize) {
    return (
      <div style={styles.listContainer}>
        <div style={{
          ...styles.listHeader,
          gridTemplateColumns: '2fr 1fr 1fr 1fr 0.8fr 80px'
        }}>
          <div style={styles.headerCell}>
            Número/Série
            <div style={styles.headerCellDivider}></div>
          </div>
          <div style={styles.headerCell}>
            Emitente
            <div style={styles.headerCellDivider}></div>
          </div>
          <div style={styles.headerCell}>
            Destinatário
            <div style={styles.headerCellDivider}></div>
          </div>
          <div style={styles.headerCell}>
            Valor
            <div style={styles.headerCellDivider}></div>
          </div>
          <div style={styles.headerCell}>Status</div>
          <div style={styles.headerCell}>Ações</div>
        </div>
        <VirtualList
          items={mdfes}
          itemHeight={60} // Altura estimada de cada item
          containerHeight={400} // Altura do container
          renderItem={renderMDFeItem}
          overscan={5}
          className="list-content"
          style={styles.listContent}
        />
      </div>
    );
  }

  // Renderização normal para listas pequenas
  return (
    <div style={styles.listContainer}>
      <div style={{
        ...styles.listHeader,
        gridTemplateColumns: '2fr 1fr 1fr 1fr 0.8fr 80px'
      }}>
        <div style={styles.headerCell}>
          Número/Série
          <div style={styles.headerCellDivider}></div>
        </div>
        <div style={styles.headerCell}>
          Emitente
          <div style={styles.headerCellDivider}></div>
        </div>
        <div style={styles.headerCell}>
          Destinatário
          <div style={styles.headerCellDivider}></div>
        </div>
        <div style={styles.headerCell}>
          Valor
          <div style={styles.headerCellDivider}></div>
        </div>
        <div style={styles.headerCell}>Status</div>
        <div style={styles.headerCell}>Ações</div>
      </div>

      <div style={styles.listContent} className="list-content" ref={listRef}>
        {mdfes.map((mdfe, index) => renderMDFeItem(mdfe, index))}
      </div>
    </div>
  );
});

MDFeList.displayName = 'MDFeList';

interface MDFeRowProps {
  mdfe: MDFe;
  index: number;
  isSelected: boolean;
  onCloseMDFe?: (mdfe: MDFe) => void;
  onDetailMDFe?: (mdfe: MDFe) => void;
  ref?: React.RefObject<HTMLDivElement> | null;
}

const MDFeRow = React.memo<MDFeRowProps>(({ 
  mdfe, 
  index, 
  isSelected,
  onCloseMDFe,
  onDetailMDFe
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const styles = macStyles.pages.clients;
  const playClickSound = useClickSound();

  // Memoizar estilo da linha para evitar recálculos desnecessários
  const rowStyle = useMemo(() => {
    const baseStyle = {
      ...styles.listRow,
      gridTemplateColumns: '2fr 1fr 1fr 1fr 0.8fr 80px',
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
  }, [styles.listRow, styles.listRowHover, index, isSelected, isHovered]);

  // Memoizar callbacks para evitar recriações
  const handleClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    onCloseMDFe?.(mdfe);
  }, [playClickSound, onCloseMDFe, mdfe]);

  const handleDetail = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    onDetailMDFe?.(mdfe);
  }, [playClickSound, onDetailMDFe, mdfe]);

  const handleClick = useCallback(() => {
    console.log('MDFe clicado:', mdfe);
  }, [mdfe]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'autorizada':
        return styles.typeBadgeIndividual; // Verde
      case 'pendente':
        return styles.typeBadgeCompany; // Laranja
      case 'cancelada':
        return { ...styles.typeBadgeCompany, color: '#FF3B30', background: 'rgba(255, 59, 48, 0.1)' };
      case 'rejeitada':
        return { ...styles.typeBadgeCompany, color: '#FF3B30', background: 'rgba(255, 59, 48, 0.1)' };
      default:
        return styles.typeBadgeCompany;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div
      style={rowStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div style={styles.rowCell} className="cell-numero">
        <div>
          <div style={styles.clientName}>{mdfe.numero}/{mdfe.serie}</div>
          <div style={styles.emailText}>{mdfe.chave}</div>
        </div>
      </div>
      <div style={styles.rowCell} className="cell-emitente">
        <span style={styles.emailText}>{mdfe.emitente}</span>
      </div>
      <div style={styles.rowCell} className="cell-destinatario">
        <span style={styles.phoneText}>{mdfe.destinatario}</span>
      </div>
      <div style={styles.rowCell} className="cell-valor">
        <span style={styles.emailText}>{formatCurrency(mdfe.valor)}</span>
      </div>
      <div style={styles.rowCell} className="cell-status">
        <span style={getStatusStyle(mdfe.status)}>
          {mdfe.status.toUpperCase()}
        </span>
      </div>
      <div style={styles.rowCell} className="cell-actions">
        <div style={styles.actionButtons}>
          {onCloseMDFe && (
            <button
              style={styles.actionButton}
              onClick={handleClose}
              title="Encerrar MDF-e"
            >
              <CloseIcon size={16} color="rgba(255, 149, 0, 0.8)" />
            </button>
          )}
          {onDetailMDFe && (
            <button
              style={styles.actionButton}
              onClick={handleDetail}
              title="Detalhar MDF-e"
            >
              <DetailIcon size={16} color="rgba(0, 0, 0, 0.6)" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

MDFeRow.displayName = 'MDFeRow';
