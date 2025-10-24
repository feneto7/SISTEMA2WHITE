// Hook para otimização de imagens e assets
// Implementa lazy loading, compressão e cache para melhor performance
import { useState, useEffect, useRef, useCallback } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  lazy?: boolean;
  quality?: number;
}

// Componente de imagem otimizada
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  style,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMiA2VjE4TTYgMTJIMTgiIHN0cm9rZT0iI0NDQ0NDQyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+',
  lazy = true,
  quality = 80
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  // Gerar URL otimizada (simulação de compressão)
  const optimizedSrc = useMemo(() => {
    if (hasError) return placeholder;
    if (!isInView) return placeholder;
    
    // Aqui você pode implementar compressão de imagem
    // Por exemplo, usando um serviço como Cloudinary ou similar
    return src;
  }, [src, isInView, hasError, placeholder]);

  return (
    <div
      ref={imgRef}
      className={className}
      style={{
        position: 'relative',
        width: width || 'auto',
        height: height || 'auto',
        overflow: 'hidden',
        ...style
      }}
    >
      {!isLoaded && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1
          }}
        >
          <img
            src={placeholder}
            alt=""
            style={{
              width: '24px',
              height: '24px',
              opacity: 0.5
            }}
          />
        </div>
      )}
      
      {isInView && (
        <img
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.3s ease',
            opacity: isLoaded ? 1 : 0
          }}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
        />
      )}
    </div>
  );
}

// Hook para pré-carregamento de imagens
export function useImagePreloader(urls: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const preloadImages = async () => {
      const promises = urls.map(url => {
        if (loadedImages.has(url)) return Promise.resolve();
        
        setLoadingImages(prev => new Set(prev).add(url));
        
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            setLoadedImages(prev => new Set(prev).add(url));
            setLoadingImages(prev => {
              const newSet = new Set(prev);
              newSet.delete(url);
              return newSet;
            });
            resolve();
          };
          img.onerror = reject;
          img.src = url;
        });
      });

      try {
        await Promise.all(promises);
      } catch (error) {
        console.warn('Erro ao pré-carregar imagens:', error);
      }
    };

    preloadImages();
  }, [urls, loadedImages]);

  return {
    loadedImages,
    loadingImages,
    isLoaded: (url: string) => loadedImages.has(url),
    isLoading: (url: string) => loadingImages.has(url)
  };
}

// Hook para otimização de assets
export function useAssetOptimization() {
  const [cache, setCache] = useState<Map<string, string>>(new Map());

  const optimizeAsset = useCallback(async (url: string): Promise<string> => {
    if (cache.has(url)) {
      return cache.get(url)!;
    }

    try {
      // Aqui você pode implementar otimizações como:
      // - Compressão de imagens
      // - Conversão de formato
      // - Redimensionamento
      // - Cache local
      
      const optimizedUrl = url; // Placeholder
      setCache(prev => new Map(prev).set(url, optimizedUrl));
      return optimizedUrl;
    } catch (error) {
      console.warn('Erro ao otimizar asset:', error);
      return url;
    }
  }, [cache]);

  return {
    optimizeAsset,
    cache
  };
}

// Componente para ícones SVG otimizados
interface OptimizedIconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function OptimizedIcon({ name, size = 24, color = 'currentColor', className, style }: OptimizedIconProps) {
  // Cache de ícones SVG para evitar re-renderizações
  const iconCache = useMemo(() => {
    const icons: Record<string, string> = {
      search: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>`,
      edit: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
      delete: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,6 5,6 21,6"></polyline><path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
      plus: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`
    };
    return icons;
  }, [size, color]);

  const iconSvg = iconCache[name] || iconCache.plus;

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
      dangerouslySetInnerHTML={{ __html: iconSvg }}
    />
  );
}

// Hook para compressão de dados
export function useDataCompression() {
  const compressData = useCallback((data: any): string => {
    try {
      // Simulação de compressão (em produção, use uma biblioteca real)
      const jsonString = JSON.stringify(data);
      return btoa(jsonString); // Base64 encoding como exemplo
    } catch (error) {
      console.warn('Erro ao comprimir dados:', error);
      return JSON.stringify(data);
    }
  }, []);

  const decompressData = useCallback((compressedData: string): any => {
    try {
      const jsonString = atob(compressedData);
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn('Erro ao descomprimir dados:', error);
      return null;
    }
  }, []);

  return {
    compressData,
    decompressData
  };
}
