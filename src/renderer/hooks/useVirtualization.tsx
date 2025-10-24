import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Hook para virtualização de listas grandes
// Otimiza performance renderizando apenas itens visíveis
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number; // Número de itens extras para renderizar fora da viewport
  className?: string;
  style?: React.CSSProperties;
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className,
  style
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  // Calcular itens visíveis
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );

    return {
      start: Math.max(0, startIndex - overscan),
      end: Math.min(items.length - 1, endIndex + overscan)
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // Itens visíveis para renderizar
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1);
  }, [items, visibleRange]);

  // Altura total da lista
  const totalHeight = items.length * itemHeight;

  // Offset para posicionar os itens visíveis
  const offsetY = visibleRange.start * itemHeight;

  // Handler de scroll otimizado
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      className={className}
      style={{
        height: containerHeight,
        overflow: 'auto',
        ...style
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={visibleRange.start + index}
              style={{
                height: itemHeight,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Hook para virtualização com busca otimizada
interface VirtualSearchListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  searchTerm: string;
  searchFunction: (item: T, term: string) => boolean;
  overscan?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function VirtualSearchList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  searchTerm,
  searchFunction,
  overscan = 5,
  className,
  style
}: VirtualSearchListProps<T>) {
  // Filtrar itens baseado na busca
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    return items.filter(item => searchFunction(item, searchTerm));
  }, [items, searchTerm, searchFunction]);

  return (
    <VirtualList
      items={filteredItems}
      itemHeight={itemHeight}
      containerHeight={containerHeight}
      renderItem={renderItem}
      overscan={overscan}
      className={className}
      style={style}
    />
  );
}

// Hook para debounce de busca
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook para performance de listas grandes
export function useListPerformance<T>(items: T[], threshold: number = 100) {
  const [shouldVirtualize, setShouldVirtualize] = useState(false);

  useEffect(() => {
    setShouldVirtualize(items.length > threshold);
  }, [items.length, threshold]);

  return {
    shouldVirtualize,
    itemCount: items.length,
    needsOptimization: items.length > threshold
  };
}
