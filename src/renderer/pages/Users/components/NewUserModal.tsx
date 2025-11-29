import React, { useState } from 'react';
import { useTheme } from '../../../styles/ThemeProvider';
import { useClickSound } from '../../../hooks/useClickSound';
import { UserForm } from './UserForm';
import { AppIcons } from '../../../components/Icons/AppIcons';
import { WindowHeader } from '../../../components/WindowHeader/WindowHeader';

interface NewUserFormData {
  id?: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

interface EditingUserSummary {
  id: string;
  name: string;
  email: string;
  profileId?: string | null;
}

interface NewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser?: EditingUserSummary | null;
  onSave: (userData: NewUserFormData) => void;
}

// Modal de Usuário
// Usado tanto para criar quanto para editar usuários na tabela users
export function NewUserModal({ isOpen, onClose, editingUser, onSave }: NewUserModalProps): JSX.Element | null {
  const playClickSound = useClickSound();
  const { systemStyles, systemColors } = useTheme();
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const [formData, setFormData] = useState<NewUserFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });

  const isEditMode = !!editingUser;

  // Sincroniza dados quando abrir o modal para edição
  React.useEffect(() => {
    if (isOpen && editingUser) {
      setFormData({
        id: editingUser.id,
        name: editingUser.name,
        email: editingUser.email,
        password: '',
        confirmPassword: '',
        role: editingUser.profileId || ''
      });
    }

    if (isOpen && !editingUser) {
      setFormData({
        id: undefined,
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
      });
    }
  }, [isOpen, editingUser]);

  // Função para fechar o modal
  const handleClose = () => {
    setFormData({
      id: undefined,
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: ''
    });
    onClose();
  };

  // Função para salvar/atualizar o usuário
  const handleSave = () => {
    if (!formData.name || !formData.email) {
      alert('Preencha nome e email');
      return;
    }

    if (!isEditMode) {
      // Criação exige senha obrigatória
      if (!formData.password || !formData.confirmPassword) {
        alert('Preencha a senha e a confirmação');
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
    } else {
      // Edição: senha é opcional; se preenchida, valida
      const hasPasswordChange = formData.password || formData.confirmPassword;

      if (hasPasswordChange) {
        if (formData.password !== formData.confirmPassword) {
          alert('As senhas não coincidem');
          return;
        }

        if (formData.password.length < 6) {
          alert('A senha deve ter pelo menos 6 caracteres');
          return;
        }
      }
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
        <WindowHeader title={isEditMode ? 'Editar Usuário' : 'Novo Usuário'} onClose={handleClose} />

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
            {isEditMode ? 'Atualizar' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}

