import React from 'react';

// Navegação simples baseada em contexto para telas do renderer
// Rotas definidas no sistema: manter simples sem dependências externas
export type Route = 'login' | 'home' | 'products' | 'clients' | 'users' | 'fiscal' | 'mdfe' | 'sales' | 'settings';

interface NavigationContextValue {
  route: Route;
  navigate: (to: Route) => void;
}

const NavigationContext = React.createContext<NavigationContextValue | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [route, setRoute] = React.useState<Route>('login');

  const navigate = React.useCallback((to: Route) => {
    setRoute(to);
  }, []);

  const value = React.useMemo(() => ({ route, navigate }), [route, navigate]);

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNavigation(): NavigationContextValue {
  const ctx = React.useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
}


