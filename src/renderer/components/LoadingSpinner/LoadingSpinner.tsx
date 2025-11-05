//--------------------------------------------------------------------
// LOADING SPINNER
// Componente de loading simples com animação de rotação
// Usado para indicar carregamento de páginas, modais, etc.
//--------------------------------------------------------------------

import React from 'react';
import { useTheme } from '../../styles/ThemeProvider';

interface LoadingSpinnerProps {
  size?: number;
  showOverlay?: boolean;
  borderWidth?: number;
}

export function LoadingSpinner({ 
  size = 20, 
  showOverlay = false,
  borderWidth = 2
}: LoadingSpinnerProps): JSX.Element {
  const { systemColors } = useTheme();

  const spinnerContent = (
    <div
      className="loading-spinner"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: `${borderWidth}px solid ${systemColors.border.light}`,
        borderTop: `${borderWidth}px solid ${systemColors.text.primary}`,
        borderRadius: '50%',
        animation: 'spinAnimation 1s linear infinite'
      }}
    />
  );

  if (showOverlay) {
    return (
      <>
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          {spinnerContent}
        </div>
        <style>
          {`
            @keyframes spinAnimation {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {spinnerContent}
      </div>
      <style>
        {`
          @keyframes spinAnimation {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
}
