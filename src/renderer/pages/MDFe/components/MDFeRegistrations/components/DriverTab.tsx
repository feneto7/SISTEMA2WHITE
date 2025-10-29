import React, { useState, useRef } from 'react';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { AppIcons } from '../../../../../components/Icons/AppIcons';
import { NewDriverModal } from './NewDriverModal';

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
  const { systemStyles, systemColors } = useTheme();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);


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
      borderBottom: `1px solid ${systemColors.border.light}`
    },
    title: {
      ...systemStyles.page.title,
      fontSize: '16px'
    },
    newButton: {
      ...systemStyles.button.default,
      padding: '8px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    listContainer: {
      background: systemColors.background.content,
      borderRadius: '8px',
      border: `1px solid ${systemColors.border.light}`,
      overflow: 'hidden'
    },
    listHeader: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr 80px',
      gap: '16px',
      padding: '12px 16px',
      background: systemColors.background.primary,
      borderBottom: `1px solid ${systemColors.border.light}`,
      ...systemStyles.list.headerCell
    },
    headerCell: {
      ...systemStyles.list.headerCell
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
      borderBottom: `1px solid ${systemColors.border.divider}`,
      transition: 'all 0.15s ease',
      cursor: 'pointer'
    },
    listRowHover: {
      background: systemColors.control.hover
    },
    rowCell: {
      fontSize: '12px',
      color: systemColors.text.primary,
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
      ...systemStyles.button.default,
      padding: '4px',
      width: '24px',
      height: '24px'
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      color: systemColors.text.secondary
    },
    emptyText: {
      fontSize: '14px',
      margin: 0
    }
  };

  return (
    <div style={{ padding: '20px' }}>
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
          <AppIcons.Add size={14} />
          Novo Motorista
        </button>
      </div>

      {/* Lista de Motoristas */}
        <div ref={listContainerRef} className="scrollbar-list" style={styles.listContainer}>
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
                  e.currentTarget.style.background = systemColors.control.hover as string;
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
                    <AppIcons.Edit size={12} />
                  </button>
                  <button
                    style={styles.actionButton}
                    onClick={() => {
                      playClickSound();
                      handleDeleteDriver(driver.id);
                    }}
                    title="Excluir"
                  >
                    <AppIcons.Delete size={12} />
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
