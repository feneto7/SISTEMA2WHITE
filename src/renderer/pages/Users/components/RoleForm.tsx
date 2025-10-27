import React, { useState } from 'react';
import { systemStyles, systemColors } from '../../../styles/systemStyle';

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface RoleFormProps {
  formData: {
    name: string;
    permissions: string[];
  };
  availablePermissions: Permission[];
  onFormDataChange: (field: string, value: string | string[]) => void;
  onTogglePermission: (permissionId: string) => void;
}

// Componente de checkbox customizado estilo macOS
function Checkbox({ 
  checked, 
  onChange, 
  label 
}: { 
  checked: boolean; 
  onChange: () => void; 
  label: string;
}): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{
        ...systemStyles.checkbox.container,
        ...(isHovered ? { backgroundColor: 'rgba(0, 0, 0, 0.03)' } : {})
      }}
      onClick={onChange}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        ...systemStyles.checkbox.box,
        ...(checked ? systemStyles.checkbox.boxChecked : {})
      }}>
        {checked && (
          <svg 
            width="10" 
            height="10" 
            viewBox="0 0 10 10" 
            fill="none" 
            style={systemStyles.checkbox.checkmark}
          >
            <path
              d="M2 5L4 7L8 2"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span style={systemStyles.checkbox.label}>{label}</span>
    </div>
  );
}

// Formulário de perfil de usuário
// Inclui nome do perfil e seleção de permissões
export function RoleForm({ 
  formData, 
  availablePermissions, 
  onFormDataChange, 
  onTogglePermission 
}: RoleFormProps): JSX.Element {
  const [isNameFocused, setIsNameFocused] = useState(false);

  // Função para obter estilo do input baseado no foco
  const getInputStyle = (isFocused: boolean) => ({
    ...systemStyles.input.field,
    ...(isFocused ? systemStyles.input.fieldFocus : {})
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Campo Nome do Perfil */}
      <div style={systemStyles.input.container}>
        <label style={systemStyles.input.label}>Nome do Perfil</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onFormDataChange('name', e.target.value)}
          onFocus={() => setIsNameFocused(true)}
          onBlur={() => setIsNameFocused(false)}
          placeholder="Digite o nome do perfil"
          style={getInputStyle(isNameFocused)}
        />
      </div>

      {/* Seção de Permissões */}
      <div>
        <label style={{
          ...systemStyles.input.label,
          marginBottom: '12px',
          display: 'block'
        }}>
          Permissões
        </label>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          background: systemColors.background.white,
          border: `1px solid ${systemColors.border.light}`,
          borderRadius: '8px',
          padding: '12px'
        }}>
          {availablePermissions.map((permission) => (
            <div key={permission.id} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <Checkbox
                checked={formData.permissions.includes(permission.id)}
                onChange={() => onTogglePermission(permission.id)}
                label={permission.name}
              />
              <span style={{
                fontSize: '10px',
                color: systemColors.text.secondary,
                marginLeft: '22px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
              }}>
                {permission.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

