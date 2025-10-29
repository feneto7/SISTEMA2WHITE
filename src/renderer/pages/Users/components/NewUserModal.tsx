import React, { useState } from 'react';
import { useTheme } from '../../../styles/ThemeProvider';
import { useClickSound } from '../../../hooks/useClickSound';
import { UserForm } from './UserForm';
import { AppIcons } from '../../../components/Icons/AppIcons';

interface NewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'admin' | 'user';
  }) => void;
}

// Modal de Novo Usuário
// Permite criar novos usuários com permissões e dados básicos
export function NewUserModal({ isOpen, onClose, onSave }: NewUserModalProps): JSX.Element | null {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'admin' | 'user'
  });

  // Função para fechar o modal
  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user'
    });
    onClose();
  };

  // Função para salvar o usuário
  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    onSave(formData);
    handleClose();
  };

  // Função para atualizar dados do formulário
  const updateFormData = (field: string, value: string | 'admin' | 'user') => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      zIndex: 1000,
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
          <h2 style={systemStyles.titleBarTitle}>Novo Usuário</h2>
          <div style={{ width: '60px' }}></div>
        </div>

        {/* Conteúdo do modal */}
        <div style={{
          flex: 1,
          background: systemColors.background.content,
          padding: '20px',
          overflow: 'auto'
        }}>
          <UserForm 
            formData={formData}
            onFormDataChange={updateFormData}
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

