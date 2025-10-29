import React from 'react';
import { ThemeTokens, lightTheme, darkTheme } from './shared';
import { createSystemStyles } from './systemStyle';

type ThemeName = 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeName;
  tokens: ThemeTokens;
  systemColors: ReturnType<typeof createSystemStyles>['systemColors'];
  systemStyles: ReturnType<typeof createSystemStyles>['systemStyles'];
  setTheme: (name: ThemeName) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const initial = (localStorage.getItem('app.theme') as ThemeName) || 'light';
  const [theme, setThemeState] = React.useState<ThemeName>(initial);

  const tokens = theme === 'dark' ? darkTheme : lightTheme;
  const { systemColors, systemStyles } = React.useMemo(() => createSystemStyles(tokens), [tokens]);

  const setTheme = (name: ThemeName) => {
    setThemeState(name);
    localStorage.setItem('app.theme', name);
  };

  const value: ThemeContextValue = {
    theme,
    tokens,
    systemColors,
    systemStyles,
    setTheme
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}


