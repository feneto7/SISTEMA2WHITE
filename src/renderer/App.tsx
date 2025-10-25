import React, { Suspense, lazy } from 'react';
import { globalStyles } from './styles/style';
import { sharedStyles, applyScrollbarStyles } from './styles/shared';
import { globalInputFocusStyles } from './styles/styleModal';
import { NavigationProvider, useNavigation } from './router/Navigation';

// Lazy loading das páginas para melhor performance
// Carrega apenas quando necessário, reduzindo o bundle inicial
const Home = lazy(() => import('./pages/Home/Home').then(module => ({ default: module.Home })));
const Products = lazy(() => import('./pages/Products/Products').then(module => ({ default: module.Products })));
const Clients = lazy(() => import('./pages/Clients/Clients').then(module => ({ default: module.Clients })));
const Fiscal = lazy(() => import('./pages/Fiscal/Fiscal').then(module => ({ default: module.Fiscal })));
const MDFe = lazy(() => import('./pages/MDFe/MDFe').then(module => ({ default: module.MDFePage })));
const Operations = lazy(() => import('./pages/Operations/Operations').then(module => ({ default: module.default })));
const Sales = lazy(() => import('./pages/Sales/Sales').then(module => ({ default: module.default })));

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
  // Apply global CSS variables to document root
  React.useEffect(() => {
    const root = document.documentElement;
    Object.entries(globalStyles.variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    
    // Apply shared styles variables
    Object.entries(sharedStyles.variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    
    // Inject CSS animations
    const style = document.createElement('style');
    style.textContent = Object.values(sharedStyles.animations).join('\n');
    document.head.appendChild(style);
    
    // Inject global input focus styles
    const focusStyle = document.createElement('style');
    focusStyle.textContent = globalInputFocusStyles;
    document.head.appendChild(focusStyle);
    
    // Apply macOS scrollbar styles globally
    applyScrollbarStyles('global');
    
    return () => {
      document.head.removeChild(style);
      document.head.removeChild(focusStyle);
    };
  }, []);

  const { route } = useNavigation();

  // Renderização condicional com lazy loading
  const renderPage = () => {
    switch (route) {
      case 'products':
        return <Products />;
      case 'clients':
        return <Clients />;
      case 'fiscal':
        return <Fiscal />;
      case 'mdfe':
        return <MDFe />;
      case 'operations':
        return <Operations />;
      case 'sales':
        return <Sales />;
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
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}


