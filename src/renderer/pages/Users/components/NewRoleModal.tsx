import React, { useState } from 'react';
import { useTheme } from '../../../styles/ThemeProvider';
import { useClickSound } from '../../../hooks/useClickSound';
import { RoleForm } from './RoleForm';
import { AppIcons } from '../../../components/Icons/AppIcons';

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface NewRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roleData: {
    name: string;
    permissions: string[];
  }) => void;
}

// Modal de Novo Perfil
// Permite criar novos perfis de usuário com permissões customizadas
export function NewRoleModal({ isOpen, onClose, onSave }: NewRoleModalProps): JSX.Element | null {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    permissions: [] as string[]
  });

  // Lista de permissões disponíveis no sistema
  const availablePermissions: Permission[] = [
    { id: 'products', name: 'Produtos', description: 'Gerenciar produtos' },
    { id: 'clients', name: 'Clientes', description: 'Gerenciar clientes' },
    { id: 'users', name: 'Usuários', description: 'Gerenciar usuários' },
    { id: 'sales', name: 'Vendas', description: 'Realizar vendas' },
    { id: 'mdfe', name: 'MDF-e', description: 'Gerenciar MDF-e' },
    { id: 'settings', name: 'Configurações', description: 'Alterar configurações' },
    { id: 'reports', name: 'Relatórios', description: 'Visualizar relatórios' }
  ];

  // Função para fechar o modal
  const handleClose = () => {
    setFormData({
      name: '',
      permissions: []
    });
    onClose();
  };

  // Função para salvar o perfil
  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Digite o nome do perfil');
      return;
    }

    if (formData.permissions.length === 0) {
      alert('Selecione pelo menos uma permissão');
      return;
    }

    onSave(formData);
    handleClose();
  };

  // Função para atualizar dados do formulário
  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Função para alternar permissão
  const togglePermission = (permissionId: string) => {
    setFormData(prev => {
      const permissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId];
      return { ...prev, permissions };
    });
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
      zIndex: 1001,
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)'
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={{
        ...systemStyles.window,
        width: '600px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column' as const,
        overflow: 'hidden'
      }}>
        {/* Header do modal */}
        <div style={{
          ...systemStyles.titleBar,
          position: 'relative' as const
        }}>
          <div style={systemStyles.trafficLights.container}>
            <div 
              style={{
                ...systemStyles.trafficLights.button,
                ...systemStyles.trafficLights.red,
                ...(isCloseHovered ? { opacity: 0.8 } : {})
              }} 
              onClick={() => {
                playClickSound();
                handleClose();
              }}
              onMouseEnter={() => setIsCloseHovered(true)}
              onMouseLeave={() => setIsCloseHovered(false)}
            />
            <div 
              style={{
                ...systemStyles.trafficLights.button,
                ...systemStyles.trafficLights.yellow
              }} 
            />
            <div 
              style={{
                ...systemStyles.trafficLights.button,
                ...systemStyles.trafficLights.green
              }} 
            />
          </div>
          <h2 style={systemStyles.titleBarTitle}>Novo Perfil</h2>
          <div style={{ width: '60px' }}></div>
        </div>

        {/* Conteúdo do modal */}
        <div style={{
          flex: 1,
          background: systemColors.background.content,
          padding: '20px',
          overflow: 'auto'
        }}>
          <RoleForm 
            formData={formData}
            availablePermissions={availablePermissions}
            onFormDataChange={updateFormData}
            onTogglePermission={togglePermission}
          />
        </div>

        {/* Footer com botões */}
        <div style={{
          padding: '16px 20px',
          background: systemColors.background.primary,
          borderTop: `1px solid ${systemColors.border.light}`,
          display: 'flex',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <button
            style={{
              ...systemStyles.button.default,
              padding: '6px 20px'
            }}
            onClick={() => {
              playClickSound();
              handleClose();
            }}
          >
            Cancelar
          </button>
          <button
            style={{
              ...systemStyles.button.primary,
              padding: '6px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onClick={() => {
              playClickSound();
              handleSave();
            }}
          >
            <AppIcons.Save size={14} />
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

