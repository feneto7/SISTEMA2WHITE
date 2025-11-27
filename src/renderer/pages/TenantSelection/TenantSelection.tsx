//--------------------------------------------------------------------
// TELA DE SELEÇÃO DE TENANT
// Tela para seleção do tenant antes do login
// Valida se o tenant existe e salva no localStorage
//--------------------------------------------------------------------

import React from 'react';
import { useNavigation } from '../../router/Navigation';
import { useTheme } from '../../styles/ThemeProvider';
import { getBgHomeSimpleContainer } from '../../styles/bgHomeSimple';
import { TenantSelectionCard } from './components';
import { validateTenant, saveTenantId } from '../../utils/tenantService';

export function TenantSelection(): JSX.Element {
  const { navigate } = useNavigation();
  const { theme } = useTheme();

  // Callback quando o tenant é validado com sucesso
  const handleContinue = (tenantId: string) => {
    // Salva o tenant ID no localStorage
    saveTenantId(tenantId);
    
    // Navega para a tela de login
    navigate('login');
  };

  const styles = {
    container: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1
    }
  };

  return (
    <div style={styles.container}>
      {/* Background simples conforme o tema */}
      <div style={getBgHomeSimpleContainer(theme)} />

      {/* Card de seleção de tenant */}
      <TenantSelectionCard 
        onContinue={handleContinue}
        onValidate={validateTenant}
      />
    </div>
  );
}

