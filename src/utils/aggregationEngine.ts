
import { ProductData } from '@/types/pharmaceutical';

export interface AggregationLevel {
  id: string;
  name: string;
  type: 'facility' | 'zonal' | 'regional' | 'national';
  parentId?: string;
}

export interface AggregatedMetrics {
  totalConsumption: number;
  totalProducts: number;
  averageAAMC: number;
  stockOutRate: number;
  wastageRate: number;
  facilityCount: number;
  performanceScore: number;
}

export interface CacheEntry {
  key: string;
  data: any;
  timestamp: Date;
  ttl: number; // Time to live in milliseconds
}

export class AggregationEngine {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Aggregate data across multiple levels with caching
   */
  async aggregateByLevel(
    products: ProductData[], 
    level: AggregationLevel,
    useCache: boolean = true
  ): Promise<AggregatedMetrics> {
    const cacheKey = `agg_${level.id}_${level.type}`;
    
    // Check cache first
    if (useCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        console.log(`Cache hit for ${cacheKey}`);
        return cached;
      }
    }

    // Calculate aggregated metrics
    console.log(`Computing aggregation for level: ${level.name}`);
    const startTime = performance.now();

    const metrics = this.computeAggregatedMetrics(products);
    
    const endTime = performance.now();
    console.log(`Aggregation completed in ${(endTime - startTime).toFixed(2)}ms`);

    // Cache the result
    if (useCache) {
      this.setCache(cacheKey, metrics);
    }

    return metrics;
  }

  /**
   * Compute aggregated metrics from product data
   */
  private computeAggregatedMetrics(products: ProductData[]): AggregatedMetrics {
    if (products.length === 0) {
      return {
        totalConsumption: 0,
        totalProducts: 0,
        averageAAMC: 0,
        stockOutRate: 0,
        wastageRate: 0,
        facilityCount: 0,
        performanceScore: 0
      };
    }

    // Calculate totals
    const totalConsumption = products.reduce((sum, p) => sum + p.annualAverages.annualConsumption, 0);
    const totalProducts = products.length;
    
    // Calculate average AAMC
    const totalAAMC = products.reduce((sum, p) => sum + p.annualAverages.aamc, 0);
    const averageAAMC = totalAAMC / totalProducts;

    // Calculate stock out rate
    const productsWithStockOuts = products.filter(p => 
      p.periods.some(period => period.stockOutDays > 0)
    ).length;
    const stockOutRate = (productsWithStockOuts / totalProducts) * 100;

    // Calculate average wastage rate
    const totalWastageRate = products.reduce((sum, p) => sum + p.annualAverages.wastageRate, 0);
    const wastageRate = totalWastageRate / totalProducts;

    // Calculate unique facilities
    const uniqueFacilities = new Set(products.map(p => p.facilityId));
    const facilityCount = uniqueFacilities.size;

    // Calculate performance score (0-100)
    const performanceScore = this.calculatePerformanceScore(stockOutRate, wastageRate);

    return {
      totalConsumption,
      totalProducts,
      averageAAMC,
      stockOutRate,
      wastageRate,
      facilityCount,
      performanceScore
    };
  }

  /**
   * Calculate performance score based on key metrics
   */
  private calculatePerformanceScore(stockOutRate: number, wastageRate: number): number {
    // Lower stock out and wastage rates = higher performance
    const stockOutScore = Math.max(0, 100 - (stockOutRate * 4)); // Penalty for stock outs
    const wastageScore = Math.max(0, 100 - (wastageRate * 6)); // Higher penalty for wastage
    
    return Math.round((stockOutScore + wastageScore) / 2);
  }

  /**
   * Hierarchical aggregation for multi-level views
   */
  async aggregateHierarchy(
    products: ProductData[],
    levels: AggregationLevel[]
  ): Promise<Map<string, AggregatedMetrics>> {
    const results = new Map<string, AggregatedMetrics>();
    
    // Group products by level
    const productsByLevel = this.groupProductsByLevel(products, levels);
    
    // Aggregate each level in parallel for better performance
    const aggregationPromises = levels.map(async level => {
      const levelProducts = productsByLevel.get(level.id) || [];
      const metrics = await this.aggregateByLevel(levelProducts, level);
      return { level: level.id, metrics };
    });

    const aggregationResults = await Promise.all(aggregationPromises);
    
    aggregationResults.forEach(result => {
      results.set(result.level, result.metrics);
    });

    return results;
  }

  /**
   * Group products by aggregation level
   */
  private groupProductsByLevel(
    products: ProductData[], 
    levels: AggregationLevel[]
  ): Map<string, ProductData[]> {
    const grouped = new Map<string, ProductData[]>();
    
    levels.forEach(level => {
      // For this implementation, we'll simulate level grouping
      // In a real system, this would use facility hierarchy data
      const levelProducts = this.filterProductsForLevel(products, level);
      grouped.set(level.id, levelProducts);
    });

    return grouped;
  }

  /**
   * Filter products for a specific aggregation level
   */
  private filterProductsForLevel(products: ProductData[], level: AggregationLevel): ProductData[] {
    // Simulate filtering based on level type
    // In production, this would use actual facility hierarchy
    switch (level.type) {
      case 'facility':
        return products.filter(p => p.facilityId === level.id);
      case 'zonal':
        // Simulate zonal grouping
        return products.filter((_, index) => index % 3 === 0);
      case 'regional':
        // Simulate regional grouping
        return products.filter((_, index) => index % 2 === 0);
      case 'national':
        return products;
      default:
        return [];
    }
  }

  /**
   * Cache management
   */
  private setCache(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    const entry: CacheEntry = {
      key,
      data,
      timestamp: new Date(),
      ttl
    };
    this.cache.set(key, entry);
    
    // Clean up expired entries
    this.cleanupExpiredCache();
  }

  private getFromCache(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    const entryTime = entry.timestamp.getTime();
    
    if (now - entryTime > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private cleanupExpiredCache(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp.getTime() > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { hitRate: number; size: number; totalRequests: number } {
    // This would be tracked in a real implementation
    return {
      hitRate: 0.94, // 94% cache hit rate
      size: this.cache.size,
      totalRequests: 1000 // Mock total requests
    };
  }

  /**
   * Clear cache for specific level or all
   */
  clearCache(levelId?: string): void {
    if (levelId) {
      const keysToDelete = Array.from(this.cache.keys())
        .filter(key => key.includes(levelId));
      keysToDelete.forEach(key => this.cache.delete(key));
    } else {
      this.cache.clear();
    }
  }
}

// Export singleton instance
export const aggregationEngine = new AggregationEngine();
