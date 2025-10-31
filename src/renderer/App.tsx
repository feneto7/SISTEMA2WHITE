import React, { Suspense, lazy, useState, useEffect } from 'react';
import { NavigationProvider, useNavigation } from './router/Navigation';
import { SplashScreen } from './components/SplashScreen';

// Lazy loading das páginas para melhor performance
// Carrega apenas quando necessário, reduzindo o bundle inicial
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Home = lazy(() => import('./pages/Home/Home').then(module => ({ default: module.Home })));
const Products = lazy(() => import('./pages/Products/Products').then(module => ({ default: module.Products })));
const Clients = lazy(() => import('./pages/Clients/Clients').then(module => ({ default: module.Clients })));
const Users = lazy(() => import('./pages/Users/Users').then(module => ({ default: module.Users })));
const MDFePage = lazy(() => import('./pages/MDFe/MDFe').then(module => ({ default: module.MDFePage })));
const Sales = lazy(() => import('./pages/Sales/Sales').then(module => ({ default: module.default })));
const Settings = lazy(() => import('./pages/Settings/Settings').then(module => ({ default: module.default })));
const Attendances = lazy(() => import('./pages/Attendances/Attendances').then(module => ({ default: module.default })));


// Componente de loading otimizado
const PageLoader = () => (
  <div style={{
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-blur)',
    color: 'var(--text-primary)',
    fontSize: '16px',
    fontWeight: '500'
  }}>
    Carregando...
  </div>
);

function AppContent(): JSX.Element {
  const { route } = useNavigation();

  // Renderização condicional com lazy loading
  const renderPage = () => {
    switch (route) {
      case 'login':
        return <Login />;
      case 'products':
        return <Products />;
      case 'clients':
        return <Clients />;
      case 'users':
        return <Users />;
      case 'mdfe':
        return <MDFePage />;
      case 'sales':
        return <Sales />;
      case 'settings':
        return <Settings />;
      case 'attendances':
        return <Attendances />;
      default:
        return <Home />;
    }
  };

  return (
    <Suspense fallback={<PageLoader />}>
      {renderPage()}
    </Suspense>
  );
}

export function App(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <SplashScreen />}
      {!isLoading && (
        <NavigationProvider>
          <AppContent />
        </NavigationProvider>
      )}
    </>
  );
}


