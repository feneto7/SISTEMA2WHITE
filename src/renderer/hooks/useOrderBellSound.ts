import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook para reproduzir som de sino de pedido
 * Otimizado com pool de áudio para múltiplas reproduções
 */
export function useOrderBellSound() {
  const audioPoolRef = useRef<HTMLAudioElement[]>([]);
  const currentIndexRef = useRef(0);
  const isInitializedRef = useRef(false);

  // Inicializa o pool de áudio
  useEffect(() => {
    if (!isInitializedRef.current) {
      // Cria 2 instâncias de áudio para múltiplas reproduções
      for (let i = 0; i < 2; i++) {
        const audio = new Audio('/sound/orderbell.mp3');
        audio.volume = 1.0;
        audio.preload = 'auto';
        audioPoolRef.current.push(audio);
      }
      isInitializedRef.current = true;
    }
  }, []);

  const playOrderBellSound = useCallback(() => {
    try {
      if (audioPoolRef.current.length > 0) {
        // Seleciona a próxima instância do pool
        const audio = audioPoolRef.current[currentIndexRef.current];
        
        // Reinicia o áudio
        audio.currentTime = 0;
        
        // Reproduz imediatamente
        audio.play().catch((error) => {
          console.warn('Não foi possível reproduzir o som de sino de pedido:', error);
        });
        
        // Move para a próxima instância (round-robin)
        currentIndexRef.current = (currentIndexRef.current + 1) % audioPoolRef.current.length;
      }
    } catch (error) {
      console.warn('Erro ao reproduzir som de sino de pedido:', error);
    }
  }, []);

  return playOrderBellSound;
}

