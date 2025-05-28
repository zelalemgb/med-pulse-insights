
import { useCallback, useMemo, memo } from 'react';

// Higher-order component for automatic memoization
export function withMemoization<P extends object>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prevProps: P, nextProps: P) => boolean
) {
  return memo(Component, propsAreEqual);
}

// Hook for optimized event handlers
export function useOptimizedHandlers<T extends Record<string, (...args: any[]) => any>>(
  handlers: T
): T {
  return useMemo(() => {
    const optimized = {} as T;
    
    Object.keys(handlers).forEach(key => {
      optimized[key as keyof T] = useCallback(handlers[key], [handlers[key]]);
    });
    
    return optimized;
  }, [handlers]);
}

// Hook for expensive computations with memoization
export function useExpensiveComputation<T, D extends any[]>(
  computation: (...deps: D) => T,
  dependencies: D,
  isEqual?: (a: T, b: T) => boolean
): T {
  return useMemo(() => computation(...dependencies), dependencies);
}

// Hook for optimized list rendering
export function useOptimizedList<T>(
  items: T[],
  keyExtractor: (item: T, index: number) => string | number,
  renderItem: (item: T, index: number) => React.ReactNode
) {
  const memoizedRenderItem = useCallback(renderItem, [renderItem]);
  
  const renderedItems = useMemo(() => {
    return items.map((item, index) => ({
      key: keyExtractor(item, index),
      element: memoizedRenderItem(item, index)
    }));
  }, [items, keyExtractor, memoizedRenderItem]);

  return renderedItems;
}

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const startTime = useMemo(() => performance.now(), []);
  
  const logRenderTime = useCallback(() => {
    const renderTime = performance.now() - startTime;
    if (renderTime > 16) { // Warn if render takes longer than one frame
      console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
  }, [componentName, startTime]);

  // Log on every render in development
  if (process.env.NODE_ENV === 'development') {
    logRenderTime();
  }

  return { renderTime: performance.now() - startTime };
}
