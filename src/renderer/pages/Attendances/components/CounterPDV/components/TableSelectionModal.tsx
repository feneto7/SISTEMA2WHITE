//--------------------------------------------------------------------
// MODAL DE SELEÇÃO DE MESA
// Modal para exibir e selecionar uma mesa cadastrada
// Usado no PDV para vincular pedidos do tipo "mesa" à mesa escolhida
//--------------------------------------------------------------------
import React from 'react';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { WindowHeader } from '../../../../../components/WindowHeader/WindowHeader';
import { TableCard } from '../../Hall/components/TableCard';

interface Table {
  id: string;
  number: number;
  status: 'free' | 'occupied' | 'reserved';
}

interface TableSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTable: (table: Table) => void;
}

export function TableSelectionModal({ isOpen, onClose, onSelectTable }: TableSelectionModalProps): JSX.Element | null {
  const { systemStyles, systemColors } = useTheme();
  const playClickSound = useClickSound();

  // Dados mock das mesas (em produção viria da API)
  const mockTables: Table[] = [
    { id: '1', number: 1, status: 'free' },
    { id: '2', number: 2, status: 'free' },
    { id: '3', number: 3, status: 'occupied' },
    { id: '4', number: 4, status: 'free' },
    { id: '5', number: 5, status: 'reserved' },
    { id: '6', number: 6, status: 'free' },
    { id: '7', number: 7, status: 'occupied' },
    { id: '8', number: 8, status: 'free' },
    { id: '9', number: 9, status: 'free' },
    { id: '10', number: 10, status: 'free' },
    { id: '11', number: 11, status: 'free' },
    { id: '12', number: 12, status: 'occupied' }
  ];

  const handleClose = () => {
    playClickSound();
    onClose();
  };

  const handleSelectTable = (table: Table) => {
    playClickSound();
    onSelectTable(table);
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)'
    }
  };

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={{
        ...systemStyles.window,
        width: '600px',
        maxWidth: '90vw',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column' as const,
        overflow: 'hidden'
      }} onClick={(e) => e.stopPropagation()}>
        {/* Header do modal */}
        <WindowHeader title="Selecionar Mesa" onClose={handleClose} />

        {/* Conteúdo do modal - Grid de mesas */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px',
          background: systemColors.background.content
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 12
          }}>
            {mockTables.map((table) => (
              <TableCard 
                key={table.id}
                table={table}
                onAddOrder={() => {}}
                onClick={() => handleSelectTable(table)}
                showAddOrderButton={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

