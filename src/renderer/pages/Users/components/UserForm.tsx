import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../styles/ThemeProvider';
import { AddButton } from '../../../components/AddButton/AddButton';
import { NewRoleModal } from './NewRoleModal';
import { apiGet } from '../../../utils/apiService';

// Componente de ícone de olho aberto
const EyeIcon = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

// Componente de ícone de olho fechado
const EyeOffIcon = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

interface UserFormProps {
  formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  };
  onFormDataChange: (field: string, value: string) => void;
}

// Formulário de usuário com campos básicos
// Inclui nome, email, senha, confirmação de senha e perfil
export function UserForm({ formData, onFormDataChange }: UserFormProps): JSX.Element {
  // Formulário de criação de usuário
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [profiles, setProfiles] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { systemStyles, systemColors } = useTheme();

  // Estilo padrão para inputs - o foco é aplicado globalmente via CSS
  const getInputStyle = () => ({
    ...systemStyles.input.field
  });

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setIsLoadingProfiles(true);
        type ApiProfile = {
          id: string;
          name: string;
        };
        const response = await apiGet<{ message: string; data: ApiProfile[] }>('/api/permission-profiles');
        if (response.ok && Array.isArray(response.data?.data)) {
          const apiProfiles = response.data.data;
          setProfiles(apiProfiles.map((p) => ({ id: String(p.id), name: p.name })));
        }
      } catch (error) {
        console.error('Erro ao carregar perfis de permissão:', error);
      } finally {
        setIsLoadingProfiles(false);
      }
    };

    loadProfiles();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Campo Nome */}
      <div style={systemStyles.input.container}>
        <label style={systemStyles.input.label}>Nome Completo</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onFormDataChange('name', e.target.value)}
          onFocus={() => setIsNameFocused(true)}
          onBlur={() => setIsNameFocused(false)}
          placeholder="Digite o nome completo"
          style={getInputStyle()}
        />
      </div>

      {/* Campo Email */}
      <div style={systemStyles.input.container}>
        <label style={systemStyles.input.label}>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => onFormDataChange('email', e.target.value)}
          onFocus={() => setIsEmailFocused(true)}
          onBlur={() => setIsEmailFocused(false)}
          placeholder="usuario@email.com"
          style={getInputStyle()}
        />
      </div>

      {/* Campo Perfil (Role) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <label style={systemStyles.input.label}>Perfil</label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '12px',
          alignItems: 'end'
        }}>
          <div style={systemStyles.select.container}>
            <select
              value={formData.role}
              onChange={(e) => onFormDataChange('role', e.target.value)}
              style={systemStyles.select.field}
            >
              <option value="">
                {isLoadingProfiles ? 'Carregando perfis...' : 'Selecione um perfil'}
              </option>
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>
            <div style={systemStyles.select.arrow}>
              <div style={systemStyles.select.arrowIcon}></div>
            </div>
          </div>
          <AddButton
            onClick={() => {
              setIsRoleModalOpen(true);
            }}
            label="Adicionar Perfil"
          />
        </div>
      </div>

      {/* Campo Senha */}
      <div style={systemStyles.input.container}>
        <label style={systemStyles.input.label}>Senha</label>
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => onFormDataChange('password', e.target.value)}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            placeholder="Mínimo 6 caracteres"
            style={getInputStyle()}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              borderWidth: 0,
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: systemColors.text.secondary
            }}
          >
            {showPassword ? (
              <EyeOffIcon size={16} />
            ) : (
              <EyeIcon size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Campo Confirmar Senha */}
      <div style={systemStyles.input.container}>
        <label style={systemStyles.input.label}>Confirmar Senha</label>
        <div style={{ position: 'relative' }}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => onFormDataChange('confirmPassword', e.target.value)}
            onFocus={() => setIsConfirmPasswordFocused(true)}
            onBlur={() => setIsConfirmPasswordFocused(false)}
            placeholder="Digite a senha novamente"
            style={getInputStyle()}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              borderWidth: 0,
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: systemColors.text.secondary
            }}
          >
            {showConfirmPassword ? (
              <EyeOffIcon size={16} />
            ) : (
              <EyeIcon size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Modal de Novo Perfil */}
      <NewRoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onSave={(roleData) => {
          console.log('Novo perfil criado:', roleData);
          // Aqui você adicionaria a lógica para salvar o perfil e atualizar o select
        }}
      />
    </div>
  );
}

