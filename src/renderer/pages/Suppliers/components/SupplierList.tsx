import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { SearchIcon, EditIcon, DeleteIcon } from '../../../components/Icons/Icons';
import { ActionButton } from '../../../components/ActionButton';
import { useTheme } from '../../../styles/ThemeProvider';
import { useClickSound } from '../../../hooks/useClickSound';
import { VirtualList, useListPerformance, useDebounce } from '../../../hooks/useVirtualization';

// Componente de listagem de fornecedores
// Modularizado e reutilizável seguindo as regras do projeto
interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  type: 'individual' | 'company';
  status: 'active' | 'inactive';
  registrationDate: string;
}

interface SupplierListProps {
  suppliers: Supplier[];
  nameColumnWidth: number;
  onEditSupplier?: (supplier: Supplier) => void;
  onDeleteSupplier?: (supplier: Supplier) => void;
}

export const SupplierList = React.memo<SupplierListProps>(({ suppliers, nameColumnWidth, onEditSupplier, onDeleteSupplier }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);
  const { systemStyles, systemColors } = useTheme();

  // Verificar se precisa de virtualização
  const { shouldVirtualize, itemCount } = useListPerformance(suppliers, 50);

  // Memoizar função de navegação por teclado para evitar recriações desnecessárias
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (suppliers.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev < suppliers.length - 1 ? prev + 1 : 0;
          return newIndex;
        });
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev > 0 ? prev - 1 : suppliers.length - 1;
          return newIndex;
        });
        break;
      
      case 'Home':
        e.preventDefault();
        setSelectedIndex(0);
        break;
      
      case 'End':
        e.preventDefault();
        setSelectedIndex(suppliers.length - 1);
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suppliers.length) {
          // Aqui você pode adicionar ação ao pressionar Enter
          console.log('Fornecedor selecionado:', suppliers[selectedIndex]);
        }
        break;
      
      case 'Escape':
        e.preventDefault();
        setSelectedIndex(-1);
        break;
    }
  }, [suppliers.length, selectedIndex, suppliers]);

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

  // Resetar seleção quando a lista de fornecedores muda
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suppliers]);

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
      }}>Nenhum fornecedor encontrado</p>
      <p style={{
        fontSize: '13px',
        color: 'rgba(0, 0, 0, 0.4)',
        margin: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}>Tente buscar com outros termos</p>
    </div>
  ), []);

  // Função para renderizar item individual
  const renderSupplierItem = useCallback((supplier: Supplier, index: number) => (
    <SupplierRow 
      key={supplier.id} 
      supplier={supplier} 
      index={index} 
      nameColumnWidth={nameColumnWidth}
      isSelected={index === selectedIndex}
      onEditSupplier={onEditSupplier}
      onDeleteSupplier={onDeleteSupplier}
      ref={index === selectedIndex ? selectedItemRef : null}
    />
  ), [nameColumnWidth, selectedIndex, onEditSupplier, onDeleteSupplier]);

  if (suppliers.length === 0) {
    return emptyState;
  }

  // Usar virtualização para listas grandes
  if (shouldVirtualize) {
    return (
      <VirtualList
        items={suppliers}
        itemHeight={60} // Altura estimada de cada item
        containerHeight={400} // Altura do container
        renderItem={renderSupplierItem}
        overscan={5}
        className="list-content"
        style={systemStyles.list.content}
      />
    );
  }

  // Renderização normal para listas pequenas
  return (
    <div style={systemStyles.list.content} className="list-content" ref={listRef}>
      {suppliers.map((supplier, index) => renderSupplierItem(supplier, index))}
    </div>
  );
});

SupplierList.displayName = 'SupplierList';

interface SupplierRowProps {
  supplier: Supplier;
  index: number;
  nameColumnWidth: number;
  isSelected: boolean;
  onEditSupplier?: (supplier: Supplier) => void;
  onDeleteSupplier?: (supplier: Supplier) => void;
}

const SupplierRow = React.memo(React.forwardRef<HTMLDivElement, SupplierRowProps>(({ 
  supplier, 
  index, 
  nameColumnWidth, 
  isSelected,
  onEditSupplier,
  onDeleteSupplier
}, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const playClickSound = useClickSound();
  const { systemColors } = useTheme();

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
    onEditSupplier?.(supplier);
  }, [playClickSound, onEditSupplier, supplier]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    onDeleteSupplier?.(supplier);
  }, [playClickSound, onDeleteSupplier, supplier]);

  const handleClick = useCallback(() => {
    console.log('Fornecedor clicado:', supplier);
  }, [supplier]);

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
        }}>{supplier.name}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }} className="cell-email">
        <span style={{
          fontSize: '13px',
          color: systemColors.text.primary
        }}>{supplier.email}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }} className="cell-phone">
        <span style={{
          fontSize: '13px',
          color: systemColors.text.primary
        }}>{supplier.phone}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }} className="cell-document">
        <span style={{
          fontSize: '13px',
          color: systemColors.text.primary
        }}>{supplier.document}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }} className="cell-type">
        <span style={{
          fontSize: '11px',
          color: supplier.type === 'individual' ? '#34C759' : '#FF9500',
          background: supplier.type === 'individual' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 149, 0, 0.1)',
          padding: '4px 10px',
          borderRadius: '6px',
          fontWeight: '600'
        }}>
          {supplier.type === 'individual' ? 'Pessoa Física' : 'Pessoa Jurídica'}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }} className="cell-actions">
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {onEditSupplier && (
            <ActionButton
              icon={<EditIcon size={16} color={systemColors.text.secondary} />}
              onClick={handleEdit}
              title="Editar fornecedor"
            />
          )}
          {onDeleteSupplier && (
            <ActionButton
              icon={<DeleteIcon size={16} color="#FF3B30" />}
              onClick={handleDelete}
              title="Excluir fornecedor"
            />
          )}
        </div>
      </div>
    </div>
  );
}));

SupplierRow.displayName = 'SupplierRow';


