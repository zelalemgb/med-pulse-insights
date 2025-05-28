
import { ProductData } from '@/types/pharmaceutical';

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  dataLoadTime: number;
}

export interface OptimizationConfig {
  enableVirtualization: boolean;
  batchSize: number;
  cacheTimeout: number;
  lazyLoadThreshold: number;
}

export class PerformanceOptimizer {
  private config: OptimizationConfig;
  private metrics: PerformanceMetrics = {
    renderTime: 0,
    memoryUsage: 0,
    cacheHitRate: 0,
    dataLoadTime: 0,
  };
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  constructor(config: OptimizationConfig) {
    this.config = config;
  }

  // Data virtualization for large datasets
  virtualizeData<T>(data: T[], startIndex: number, endIndex: number): T[] {
    if (!this.config.enableVirtualization) {
      return data;
    }
    return data.slice(startIndex, endIndex);
  }

  // Batch processing
  processBatch<T, R>(
    items: T[],
    processor: (batch: T[]) => Promise<R[]>,
    batchSize: number = this.config.batchSize
  ): Promise<R[]> {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }

    return Promise.all(batches.map(processor)).then(results => results.flat());
  }

  // Enhanced caching with TTL
  setCache<T>(key: string, data: T, ttl: number = this.config.cacheTimeout): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  getCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Performance monitoring
  measurePerformance<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
    
    if (name.includes('render')) {
      this.metrics.renderTime = duration;
    } else if (name.includes('load')) {
      this.metrics.dataLoadTime = duration;
    }
    
    return result;
  }

  async measureAsyncPerformance<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    
    console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
    
    if (name.includes('render')) {
      this.metrics.renderTime = duration;
    } else if (name.includes('load')) {
      this.metrics.dataLoadTime = duration;
    }
    
    return result;
  }

  // Memory usage tracking
  trackMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
    }
  }

  // Debounce utility for performance
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Throttle utility for performance
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  getMetrics(): PerformanceMetrics {
    this.trackMemoryUsage();
    return { ...this.metrics };
  }

  // Database query optimization
  optimizeQuery(query: string, params: any[]): { query: string; params: any[] } {
    // Basic query optimization - add indexes hints, limit clauses, etc.
    let optimizedQuery = query;
    
    // Add LIMIT if not present
    if (!query.toLowerCase().includes('limit')) {
      optimizedQuery += ' LIMIT 1000';
    }
    
    // Add ORDER BY optimization
    if (query.toLowerCase().includes('order by') && !query.toLowerCase().includes('index')) {
      // Suggest using indexes for ORDER BY
      console.log('Consider adding index for ORDER BY clause');
    }
    
    return { query: optimizedQuery, params };
  }
}

export const performanceOptimizer = new PerformanceOptimizer({
  enableVirtualization: true,
  batchSize: 100,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  lazyLoadThreshold: 50,
});
