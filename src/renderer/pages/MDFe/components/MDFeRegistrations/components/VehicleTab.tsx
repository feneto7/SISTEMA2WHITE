import React, { useState, useRef } from 'react';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { useTheme } from '../../../../../styles/ThemeProvider';
import { AppIcons } from '../../../../../components/Icons/AppIcons';
import { NewVehicleModal } from './index';

interface Vehicle {
  id: string;
  licensePlate: string;
  renavamCode: string;
  chassis: string;
  brand: string;
  model: string;
  manufacturingYear: string;
  modelYear: string;
  color: string;
  fuelType: string;
  capacityKg: string;
  ownerName: string;
  ownerDocument: string;
  ownerAddress: string;
  ownerCity: string;
  ownerState: string;
  ownerZipCode: string;
}

interface VehicleTabProps {
  formData: any;
  onUpdateFormData: (field: string, value: string | boolean) => void;
}

export function VehicleTab({ formData, onUpdateFormData }: VehicleTabProps): JSX.Element {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);


  const handleSaveVehicle = (vehicleData: Vehicle) => {
    if (editingVehicle) {
      setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? vehicleData : v));
    } else {
      setVehicles(prev => [...prev, vehicleData]);
    }
    setEditingVehicle(null);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleDeleteVehicle = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
      setVehicles(prev => prev.filter(v => v.id !== id));
    }
  };

  const handleNewVehicle = () => {
    setEditingVehicle(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(null);
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
        <h3 style={styles.title}>Veículos Cadastrados</h3>
        <button
          style={styles.newButton}
          onClick={() => {
            playClickSound();
            handleNewVehicle();
          }}
        >
          <AppIcons.Add size={14} />
          Novo Veículo
        </button>
      </div>

      {/* Lista de Veículos */}
        <div ref={listContainerRef} className="scrollbar-list" style={styles.listContainer}>
        <div style={styles.listHeader}>
          <div style={styles.headerCell}>Placa</div>
          <div style={styles.headerCell}>Marca/Modelo</div>
          <div style={styles.headerCell}>Ano</div>
          <div style={styles.headerCell}>Proprietário</div>
          <div style={styles.headerCell}>Ações</div>
        </div>
        
        <div style={styles.listContent}>
          {vehicles.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>Nenhum veículo cadastrado</p>
            </div>
          ) : (
            vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                style={styles.listRow}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = systemColors.control.hover as string;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={styles.rowCell}>{vehicle.licensePlate}</div>
                <div style={styles.rowCell}>{vehicle.brand} {vehicle.model}</div>
                <div style={styles.rowCell}>{vehicle.manufacturingYear}</div>
                <div style={styles.rowCell}>{vehicle.ownerName}</div>
                <div style={styles.actionButtons}>
                  <button
                    style={styles.actionButton}
                    onClick={() => {
                      playClickSound();
                      handleEditVehicle(vehicle);
                    }}
                    title="Editar"
                  >
                    <AppIcons.Edit size={12} />
                  </button>
                  <button
                    style={styles.actionButton}
                    onClick={() => {
                      playClickSound();
                      handleDeleteVehicle(vehicle.id);
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
      <NewVehicleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveVehicle}
        editingVehicle={editingVehicle}
      />
    </div>
  );
}
