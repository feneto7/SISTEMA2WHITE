//--------------------------------------------------------------------
// PAGE TRANSITION
// Componente que gerencia transições entre páginas
// Mantém a página atual visível e mostra spinner durante carregamento
//--------------------------------------------------------------------

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { LoadingSpinner } from '../LoadingSpinner';

interface PageTransitionProps {
  children: React.ReactNode;
  currentRoute: string;
}

export function PageTransition({ children, currentRoute }: PageTransitionProps): JSX.Element {
  const [currentPage, setCurrentPage] = useState<React.ReactNode>(null);
  const [nextPage, setNextPage] = useState<React.ReactNode>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const previousRouteRef = useRef<string>(currentRoute);
  const isInitialMount = useRef(true);

  // Detecta mudança de rota
  useEffect(() => {
    if (isInitialMount.current) {
      // Primeira montagem - carrega diretamente
      isInitialMount.current = false;
      setCurrentPage(children);
      return;
    }

    if (previousRouteRef.current !== currentRoute) {
      // Rota mudou - inicia transição
      setIsTransitioning(true);
      setNextPage(children);
      previousRouteRef.current = currentRoute;
    }
  }, [currentRoute, children]);

  // Componente que detecta quando o Suspense terminou
  function PageLoader({ children: pageContent }: { children: React.ReactNode }) {
    useEffect(() => {
      // Quando este componente monta, a página carregou
      if (isTransitioning) {
        // Pequeno delay para garantir renderização completa
        const timer = setTimeout(() => {
          setCurrentPage(nextPage);
          setIsTransitioning(false);
          setNextPage(null);
        }, 100);
        
        return () => clearTimeout(timer);
      }
    }, [pageContent]);

    return <>{pageContent}</>;
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Página atual - sempre visível */}
      {currentPage && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}>
          {currentPage}
        </div>
      )}
      
      {/* Spinner durante transição */}
      {isTransitioning && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          pointerEvents: 'none'
        }}>
          <LoadingSpinner size={40} />
        </div>
      )}
      
      {/* Nova página carregando em background (invisível) */}
      {isTransitioning && nextPage && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0,
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 0
        }}>
          <Suspense fallback={null}>
            <PageLoader>{nextPage}</PageLoader>
          </Suspense>
        </div>
      )}
    </div>
  );
}

