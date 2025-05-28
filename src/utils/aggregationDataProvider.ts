
import { AggregationData, PerformanceMetrics } from '@/types/multiLevelAggregation';

export const createMockAggregationData = (): AggregationData[] => [
  {
    id: 'national',
    name: 'National Level',
    level: 'national',
    totalConsumption: 125000,
    totalProducts: 2450,
    stockOutRate: 12.5,
    wastageRate: 8.2,
    children: [
      {
        id: 'region-1',
        name: 'Northern Region',
        level: 'regional',
        totalConsumption: 45000,
        totalProducts: 890,
        stockOutRate: 10.2,
        wastageRate: 7.5,
        children: [
          {
            id: 'zone-1',
            name: 'North Zone A',
            level: 'zonal',
            totalConsumption: 22500,
            totalProducts: 445,
            stockOutRate: 9.8,
            wastageRate: 6.9
          },
          {
            id: 'zone-2',
            name: 'North Zone B',
            level: 'zonal',
            totalConsumption: 22500,
            totalProducts: 445,
            stockOutRate: 10.6,
            wastageRate: 8.1
          }
        ]
      },
      {
        id: 'region-2',
        name: 'Southern Region',
        level: 'regional',
        totalConsumption: 40000,
        totalProducts: 780,
        stockOutRate: 14.1,
        wastageRate: 8.8,
        children: [
          {
            id: 'zone-3',
            name: 'South Zone A',
            level: 'zonal',
            totalConsumption: 20000,
            totalProducts: 390,
            stockOutRate: 13.5,
            wastageRate: 8.2
          },
          {
            id: 'zone-4',
            name: 'South Zone B',
            level: 'zonal',
            totalConsumption: 20000,
            totalProducts: 390,
            stockOutRate: 14.7,
            wastageRate: 9.4
          }
        ]
      },
      {
        id: 'region-3',
        name: 'Eastern Region',
        level: 'regional',
        totalConsumption: 40000,
        totalProducts: 780,
        stockOutRate: 13.2,
        wastageRate: 8.5
      }
    ]
  }
];

export const getDataForLevel = (
  aggregationData: AggregationData[], 
  level: 'zonal' | 'regional' | 'national'
): AggregationData[] => {
  const national = aggregationData[0];
  switch (level) {
    case 'national':
      return [national];
    case 'regional':
      return national.children || [];
    case 'zonal':
      return national.children?.flatMap(region => region.children || []) || [];
    default:
      return [];
  }
};

export const calculatePerformanceMetrics = (data: AggregationData[]): PerformanceMetrics => {
  const totalConsumption = data.reduce((sum, item) => sum + item.totalConsumption, 0);
  const avgStockOutRate = data.reduce((sum, item) => sum + item.stockOutRate, 0) / data.length;
  const avgWastageRate = data.reduce((sum, item) => sum + item.wastageRate, 0) / data.length;
  
  return {
    totalConsumption,
    avgStockOutRate,
    avgWastageRate,
    totalRegions: data.length
  };
};
