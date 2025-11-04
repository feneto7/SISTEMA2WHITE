//--------------------------------------------------------------------
// BACKGROUND SIMPLES HOME
// Background minimalista estilo macOS
// Tema light: bg-gray-300 (#d1d5db)
// Tema dark: background.content do tema dark (#38383B)
//--------------------------------------------------------------------

import React from 'react';
import { darkTheme } from './shared';

// Estilos para o background simples
export const bgHomeSimpleStyles = {
  containerLight: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    backgroundColor: '#d1d5db' // bg-gray-300
  },
  containerDark: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    backgroundColor: darkTheme.background.content // #38383B - mesma cor do content das páginas
  }
};

// Retorna o estilo do container conforme o tema
export function getBgHomeSimpleContainer(theme: 'light' | 'dark' = 'light') {
  return theme === 'dark' ? bgHomeSimpleStyles.containerDark : bgHomeSimpleStyles.containerLight;
}

