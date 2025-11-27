import React, { Suspense, lazy, useState, useEffect } from 'react';
import { NavigationProvider, useNavigation } from './router/Navigation';
import { SplashScreen } from './components/SplashScreen';
import { PageTransition } from './components/PageTransition';

// Lazy loading das páginas para melhor performance
// Carrega apenas quando necessário, reduzindo o bundle inicial
const TenantSelection = lazy(() => import('./pages/TenantSelection').then(module => ({ default: module.TenantSelection })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Home = lazy(() => import('./pages/Home/Home').then(module => ({ default: module.Home })));
const Products = lazy(() => import('./pages/Products/Products').then(module => ({ default: module.Products })));
const Clients = lazy(() => import('./pages/Clients/Clients').then(module => ({ default: module.Clients })));
const Suppliers = lazy(() => import('./pages/Suppliers/Suppliers').then(module => ({ default: module.Suppliers })));
const Users = lazy(() => import('./pages/Users/Users').then(module => ({ default: module.Users })));
const MDFePage = lazy(() => import('./pages/MDFe/MDFe').then(module => ({ default: module.MDFePage })));
const Sales = lazy(() => import('./pages/Sales/Sales').then(module => ({ default: module.default })));
const Settings = lazy(() => import('./pages/Settings/Settings').then(module => ({ default: module.default })));
const Attendances = lazy(() => import('./pages/Attendances/Attendances').then(module => ({ default: module.default })));

function AppContent(): JSX.Element {
  const { route } = useNavigation();

  // Renderização condicional com lazy loading
  const renderPage = () => {
    switch (route) {
      case 'tenant':
        return <TenantSelection />;
      case 'login':
        return <Login />;
      case 'products':
        return <Products />;
      case 'clients':
        return <Clients />;
      case 'suppliers':
        return <Suppliers />;
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
    <PageTransition currentRoute={route}>
      {renderPage()}
    </PageTransition>
  );
}

export function App(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento inicial - aguarda toda a sequência de animações terminar
    // Timeline: Letras (2.1s) + Logo (2.3s + 1.5s = 3.8s) + Brilho (0.5s) + Fade out (0.8s) = 5.2s
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5200);

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


