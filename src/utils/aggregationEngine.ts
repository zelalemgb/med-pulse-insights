
import { ProductData } from '@/types/pharmaceutical';
import { AggregationLevel, AggregatedMetrics } from '@/types/aggregation';
import { cacheManager } from './cacheManager';
import { MetricsCalculator } from './metricsCalculator';
import { HierarchyManager } from './hierarchyManager';

export class AggregationEngine {
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
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        console.log(`Cache hit for ${cacheKey}`);
        return cached;
      }
    }

    // Calculate aggregated metrics
    console.log(`Computing aggregation for level: ${level.name}`);
    const startTime = performance.now();

    const metrics = MetricsCalculator.computeMetrics(products);
    
    const endTime = performance.now();
    console.log(`Aggregation completed in ${(endTime - startTime).toFixed(2)}ms`);

    // Cache the result
    if (useCache) {
      cacheManager.set(cacheKey, metrics);
    }

    return metrics;
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
    const productsByLevel = HierarchyManager.groupProductsByLevel(products, levels);
    
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
   * Get cache statistics
   */
  getCacheStats() {
    return cacheManager.getStats();
  }

  /**
   * Clear cache for specific level or all
   */
  clearCache(levelId?: string): void {
    cacheManager.clear(levelId);
  }
}

// Export singleton instance
export const aggregationEngine = new AggregationEngine();

// Re-export types for backward compatibility
export type { AggregationLevel, AggregatedMetrics, CacheEntry } from '@/types/aggregation';
