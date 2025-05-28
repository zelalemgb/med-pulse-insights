
export interface AggregationData {
  id: string;
  name: string;
  level: 'facility' | 'zonal' | 'regional' | 'national';
  totalConsumption: number;
  totalProducts: number;
  stockOutRate: number;
  wastageRate: number;
  children?: AggregationData[];
}

export interface PerformanceMetrics {
  totalConsumption: number;
  avgStockOutRate: number;
  avgWastageRate: number;
  totalRegions: number;
}

export interface ChartDataItem {
  name: string;
  consumption: number;
  products: number;
  stockOutRate: number;
  wastageRate: number;
}
