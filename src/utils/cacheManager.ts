
import { CacheEntry, CacheStats } from '@/types/aggregation';

export class CacheManager {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Set cache entry with TTL
   */
  set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    const entry: CacheEntry = {
      key,
      data,
      timestamp: new Date(),
      ttl
    };
    this.cache.set(key, entry);
    
    // Clean up expired entries
    this.cleanupExpired();
  }

  /**
   * Get cache entry if not expired
   */
  get(key: string): any | null {
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

  /**
   * Clean up expired cache entries
   */
  private cleanupExpired(): void {
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
  getStats(): CacheStats {
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
  clear(levelId?: string): void {
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
export const cacheManager = new CacheManager();
