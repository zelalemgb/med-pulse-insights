
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

export interface CacheStats {
  hitRate: number;
  size: number;
  totalRequests: number;
}
