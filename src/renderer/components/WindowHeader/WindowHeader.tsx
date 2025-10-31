import React from 'react';
import { useTheme } from '../../styles/ThemeProvider';
import { useClickSound } from '../../hooks/useClickSound';

// Header padrão de janela (macOS) com apenas o botão vermelho (fechar)
interface WindowHeaderProps {
  title: string;
  onClose: () => void;
}

export function WindowHeader({ title, onClose }: WindowHeaderProps): JSX.Element {
  const { systemStyles } = useTheme();
  const playClickSound = useClickSound();

  return (
    <div style={{
      ...systemStyles.titleBar,
      position: 'relative' as const,
      flexShrink: 0
    }}>
      <div style={systemStyles.trafficLights.container}>
        <button
          style={{
            ...systemStyles.trafficLights.button,
            ...systemStyles.trafficLights.red
          }}
          onClick={() => { playClickSound(); onClose(); }}
          aria-label="Fechar"
          title="Fechar"
        />
      </div>
      <h2 style={{
        ...systemStyles.titleBarTitle,
        position: 'absolute' as const,
        left: '50%',
        transform: 'translateX(-50%)'
      }}>
        {title}
      </h2>
      <div style={{ width: '60px' }} />
    </div>
  );
}


