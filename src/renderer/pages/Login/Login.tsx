//--------------------------------------------------------------------
// TELA DE LOGIN
// Tela de autenticação estilo macOS com animação de fundo
// Utiliza o componente AnimatedWaves para efeito de ondas
//--------------------------------------------------------------------

import React from 'react';
import { AnimatedWaves, useAnimatedBackground } from '../../styles/bgHome';
import { useNavigation } from '../../router/Navigation';
import { LoginCard } from './components';

export function Login(): JSX.Element {
  const { navigate } = useNavigation();

  // Injetar animações CSS do background
  useAnimatedBackground();

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
      {/* Background animado */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        overflow: 'hidden',
        background: 'linear-gradient(315deg, rgba(101,0,94,1) 3%, rgba(60,132,206,1) 38%, rgba(48,238,226,1) 68%, rgba(255,25,25,1) 98%)',
        backgroundSize: '400% 400%',
        backgroundAttachment: 'fixed',
        animation: 'gradient 15s ease infinite'
      }}>
        <AnimatedWaves />
      </div>

      {/* Card de login */}
      <LoginCard onLogin={handleLogin} />
    </div>
  );
}
