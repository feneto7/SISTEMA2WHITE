import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook para reproduzir som de clique em botões
 * Otimizado com pool de áudio para cliques rápidos consecutivos
 */
export function useClickSound() {
  const audioPoolRef = useRef<HTMLAudioElement[]>([]);
  const currentIndexRef = useRef(0);
  const isInitializedRef = useRef(false);

  // Inicializa o pool de áudio
  useEffect(() => {
    if (!isInitializedRef.current) {
      // Cria 3 instâncias de áudio para cliques rápidos
      for (let i = 0; i < 3; i++) {
        const audio = new Audio('/sound/click.wav');
        audio.volume = 0.3;
        audio.preload = 'auto';
        audioPoolRef.current.push(audio);
      }
      isInitializedRef.current = true;
    }
  }, []);

  const playClickSound = useCallback(() => {
    try {
      if (audioPoolRef.current.length > 0) {
        // Seleciona a próxima instância do pool
        const audio = audioPoolRef.current[currentIndexRef.current];
        
        // Reinicia o áudio
        audio.currentTime = 0;
        
        // Reproduz imediatamente
        audio.play().catch((error) => {
          console.warn('Não foi possível reproduzir o som de clique:', error);
        });
        
        // Move para a próxima instância (round-robin)
        currentIndexRef.current = (currentIndexRef.current + 1) % audioPoolRef.current.length;
      }
    } catch (error) {
      console.warn('Erro ao reproduzir som de clique:', error);
    }
  }, []);

  return playClickSound;
}