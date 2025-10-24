import React, { useState, useRef } from 'react';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { modalStyles } from '../../../../../styles/modalStyles';
import { PlusIcon, EditIcon, DeleteIcon } from '../../../../../components/Icons';
import { NewDriverModal } from './NewDriverModal';
import { useElementScrollbarStyles } from '../../../../../hooks/useScrollbarStyles';

interface Driver {
  id: string;
  nomeMotorista: string;
  cpfMotorista: string;
  rgMotorista: string;
  cnhMotorista: string;
  categoriaCnh: string;
  validadeCnh: string;
  telefoneMotorista: string;
  emailMotorista: string;
  enderecoMotorista: string;
  cidadeMotorista: string;
  ufMotorista: string;
  cepMotorista: string;
  dataNascimento: string;
  estadoCivil: string;
  nomePai: string;
  nomeMae: string;
}

interface DriverTabProps {
  formData: any;
  onUpdateFormData: (field: string, value: string | boolean) => void;
}

export function DriverTab({ formData, onUpdateFormData }: DriverTabProps): JSX.Element {
  const playClickSound = useClickSound();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Aplicar estilos de scrollbar específicos para listas
  useElementScrollbarStyles(listContainerRef, 'list');

  const handleSaveDriver = (driverData: Driver) => {
    if (editingDriver) {
      setDrivers(prev => prev.map(d => d.id === editingDriver.id ? driverData : d));
    } else {
      setDrivers(prev => [...prev, driverData]);
    }
    setEditingDriver(null);
  };

  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver);
    setIsModalOpen(true);
  };

  const handleDeleteDriver = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este motorista?')) {
      setDrivers(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleNewDriver = () => {
    setEditingDriver(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDriver(null);
  };

  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '12px',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
    },
    title: {
      fontSize: '16px',
      fontWeight: '600',
      color: 'var(--text-primary)',
      margin: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      textTransform: 'uppercase' as const
    },
    newButton: {
      borderRadius: '6px',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      background: 'linear-gradient(to bottom, #f5f5f5, #e8e8e8)',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgba(0, 0, 0, 0.7)',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      fontSize: '13px',
      fontWeight: '500',
      padding: '8px 12px',
      gap: '6px',
      textTransform: 'uppercase' as const
    },
    listContainer: {
      background: 'rgba(255, 255, 255, 0.6)',
      borderRadius: '8px',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    },
    listHeader: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr 80px',
      gap: '16px',
      padding: '12px 16px',
      background: 'rgba(246, 246, 246, 0.95)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    headerCell: {
      fontSize: '11px',
      fontWeight: '600',
      color: 'var(--text-secondary)',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px'
    },
    listContent: {
      maxHeight: '300px',
      overflow: 'auto'
    },
    listRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr 80px',
      gap: '16px',
      padding: '12px 16px',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      transition: 'all 0.15s ease',
      cursor: 'pointer',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    listRowHover: {
      background: 'rgba(0, 0, 0, 0.02)'
    },
    rowCell: {
      fontSize: '12px',
      color: 'var(--text-primary)',
      display: 'flex',
      alignItems: 'center'
    },
    actionButtons: {
      display: 'flex',
      gap: '6px',
      justifyContent: 'center',
      alignItems: 'center'
    },
    actionButton: {
      borderRadius: '4px',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      background: 'linear-gradient(to bottom, #f5f5f5, #e8e8e8)',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgba(0, 0, 0, 0.7)',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      fontSize: '12px',
      fontWeight: '500',
      padding: '4px',
      width: '24px',
      height: '24px',
      textTransform: 'uppercase' as const
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      color: 'var(--text-secondary)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    },
    emptyText: {
      fontSize: '14px',
      margin: 0,
      textTransform: 'uppercase' as const
    }
  };

  return (
    <div style={modalStyles.tabContent}>
      {/* Header com título e botão Novo */}
      <div style={styles.header}>
        <h3 style={styles.title}>Motoristas Cadastrados</h3>
        <button
          style={styles.newButton}
          onClick={() => {
            playClickSound();
            handleNewDriver();
          }}
        >
          <PlusIcon size={14} />
          Novo Motorista
        </button>
      </div>

      {/* Lista de Motoristas */}
      <div ref={listContainerRef} style={styles.listContainer}>
        <div style={styles.listHeader}>
          <div style={styles.headerCell}>Nome</div>
          <div style={styles.headerCell}>CPF</div>
          <div style={styles.headerCell}>CNH</div>
          <div style={styles.headerCell}>Categoria</div>
          <div style={styles.headerCell}>Ações</div>
        </div>
        
        <div style={styles.listContent}>
          {drivers.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>Nenhum motorista cadastrado</p>
            </div>
          ) : (
            drivers.map((driver) => (
              <div
                key={driver.id}
                style={styles.listRow}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={styles.rowCell}>{driver.nomeMotorista}</div>
                <div style={styles.rowCell}>{driver.cpfMotorista}</div>
                <div style={styles.rowCell}>{driver.cnhMotorista}</div>
                <div style={styles.rowCell}>{driver.categoriaCnh}</div>
                <div style={styles.actionButtons}>
                  <button
                    style={styles.actionButton}
                    onClick={() => {
                      playClickSound();
                      handleEditDriver(driver);
                    }}
                    title="Editar"
                  >
                    <EditIcon size={12} />
                  </button>
                  <button
                    style={styles.actionButton}
                    onClick={() => {
                      playClickSound();
                      handleDeleteDriver(driver.id);
                    }}
                    title="Excluir"
                  >
                    <DeleteIcon size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de Formulário */}
      <NewDriverModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveDriver}
        editingDriver={editingDriver}
      />
    </div>
  );
}
