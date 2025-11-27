//--------------------------------------------------------------------
// TELA DE LOGIN
// Tela de autenticação estilo macOS com background simples
// Utiliza bgHomeSimple.ts para background conforme o tema
//--------------------------------------------------------------------

import React, { useState } from 'react';
import { useNavigation } from '../../router/Navigation';
import { useTheme } from '../../styles/ThemeProvider';
import { getBgHomeSimpleContainer } from '../../styles/bgHomeSimple';
import { LoginCard } from './components';
import { apiPost } from '../../utils/apiService';
import { Dialog } from '../../components/Dialog';
import { AppIcons } from '../../components/Icons/AppIcons';

export function Login(): JSX.Element {
  const { navigate } = useNavigation();
  const { theme } = useTheme();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Callback de login bem-sucedido
  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoggingIn(true);

      // Faz login na API
      const response = await apiPost('/api/auth/login', {
        email,
        password
      }, {
        requireAuth: false // Login não requer autenticação
      });

      if (response.ok && response.data) {
        // A API retorna: { message: "...", data: { token: "...", user: {...} } }
        const token = response.data.data?.token || response.data.token || response.data.access_token;
        if (token) {
          localStorage.setItem('authToken', token);
          // Navega para home após login bem-sucedido
          navigate('home');
        } else {
          throw new Error('Token não recebido da API');
        }
      } else {
        // Erro na resposta da API
        const errorMsg = response.data?.message || 'Erro ao fazer login';
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      // Erro ao fazer login
      setErrorMessage(error?.message || 'Erro ao fazer login. Verifique suas credenciais.');
      setShowErrorDialog(true);
    } finally {
      setIsLoggingIn(false);
    }
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
      <LoginCard onLogin={handleLogin} isLoading={isLoggingIn} />

      {/* Dialog de erro */}
      <Dialog
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        onConfirm={() => setShowErrorDialog(false)}
        icon={<AppIcons.Alert size={60} color="#ff5f57" />}
        warning="Erro ao fazer login"
        hint={errorMessage}
        confirmLabel="OK"
        showCancel={false}
        width="640px"
      />
    </div>
  );
}
