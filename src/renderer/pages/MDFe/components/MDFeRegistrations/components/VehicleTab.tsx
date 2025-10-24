import React, { useState, useRef } from 'react';
import { useClickSound } from '../../../../../hooks/useClickSound';
import { modalStyles } from '../../../../../styles/modalStyles';
import { PlusIcon, EditIcon, DeleteIcon } from '../../../../../components/Icons';
import { NewVehicleModal } from './index';
import { useElementScrollbarStyles } from '../../../../../hooks/useScrollbarStyles';

interface Vehicle {
  id: string;
  placa: string;
  renavam: string;
  chassi: string;
  marca: string;
  modelo: string;
  anoFabricacao: string;
  anoModelo: string;
  cor: string;
  combustivel: string;
  capacidade: string;
  proprietario: string;
  cpfCnpjProprietario: string;
  enderecoProprietario: string;
  cidadeProprietario: string;
  ufProprietario: string;
  cepProprietario: string;
}

interface VehicleTabProps {
  formData: any;
  onUpdateFormData: (field: string, value: string | boolean) => void;
}

export function VehicleTab({ formData, onUpdateFormData }: VehicleTabProps): JSX.Element {
  const playClickSound = useClickSound();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Aplicar estilos de scrollbar específicos para listas
  useElementScrollbarStyles(listContainerRef, 'list');

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
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
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
        <h3 style={styles.title}>Veículos Cadastrados</h3>
        <button
          style={styles.newButton}
          onClick={() => {
            playClickSound();
            handleNewVehicle();
          }}
        >
          <PlusIcon size={14} />
          Novo Veículo
        </button>
      </div>

      {/* Lista de Veículos */}
      <div ref={listContainerRef} style={styles.listContainer}>
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
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={styles.rowCell}>{vehicle.placa}</div>
                <div style={styles.rowCell}>{vehicle.marca} {vehicle.modelo}</div>
                <div style={styles.rowCell}>{vehicle.anoFabricacao}</div>
                <div style={styles.rowCell}>{vehicle.proprietario}</div>
                <div style={styles.actionButtons}>
                  <button
                    style={styles.actionButton}
                    onClick={() => {
                      playClickSound();
                      handleEditVehicle(vehicle);
                    }}
                    title="Editar"
                  >
                    <EditIcon size={12} />
                  </button>
                  <button
                    style={styles.actionButton}
                    onClick={() => {
                      playClickSound();
                      handleDeleteVehicle(vehicle.id);
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
      <NewVehicleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveVehicle}
        editingVehicle={editingVehicle}
      />
    </div>
  );
}
