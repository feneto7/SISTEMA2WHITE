import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook para exibir notificações do sistema
 * Usa a Notification API do HTML5 para melhor controle sobre o som
 */
export function useSystemNotification() {
  const permissionCheckedRef = useRef(false);

  // Solicitar permissão de notificação uma vez quando o componente montar
  useEffect(() => {
    if (!permissionCheckedRef.current && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().catch((error) => {
          console.warn('Erro ao solicitar permissão de notificação:', error);
        });
      }
      permissionCheckedRef.current = true;
    }
  }, []);

  const showNotification = useCallback((title: string, body: string, icon?: string) => {
    try {
      // Usar Notification API do HTML5 diretamente para melhor controle sobre o som
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          const notification = new Notification(title, {
            body,
            icon,
            silent: true, // Sem som da notificação do sistema
            requireInteraction: false,
            tag: 'order-notification' // Tag para evitar notificações duplicadas
          });
          
          // Auto-fechar após 5 segundos
          setTimeout(() => {
            notification.close();
          }, 5000);
        } else if (Notification.permission === 'default') {
          // Solicitar permissão se ainda não foi concedida
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              const notification = new Notification(title, {
                body,
                icon,
                silent: true,
                requireInteraction: false,
                tag: 'order-notification'
              });
              
              setTimeout(() => {
                notification.close();
              }, 5000);
            }
          });
        }
      } else {
        // Fallback para Electron API se HTML5 Notification não estiver disponível
        if ((window as any).electron && (window as any).electron.showNotification) {
          (window as any).electron.showNotification({ title, body, icon });
        }
      }
    } catch (error) {
      console.warn('Erro ao exibir notificação:', error);
    }
  }, []);

  return showNotification;
}

