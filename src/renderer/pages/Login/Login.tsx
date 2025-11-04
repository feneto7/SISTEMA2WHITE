//--------------------------------------------------------------------
// TELA DE LOGIN
// Tela de autenticação estilo macOS com background simples
// Utiliza bgHomeSimple.ts para background conforme o tema
//--------------------------------------------------------------------

import React from 'react';
import { useNavigation } from '../../router/Navigation';
import { useTheme } from '../../styles/ThemeProvider';
import { getBgHomeSimpleContainer } from '../../styles/bgHomeSimple';
import { LoginCard } from './components';

export function Login(): JSX.Element {
  const { navigate } = useNavigation();
  const { theme } = useTheme();

  // Callback de login bem-sucedido
  const handleLogin = (email: string, password: string) => {
    // Aqui você pode adicionar lógica de autenticação
    console.log('Login com:', email, password);
    navigate('home');
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

      {/* Card de login */}
      <LoginCard onLogin={handleLogin} />
    </div>
  );
}
