
import { ProductData } from '@/types/pharmaceutical';
import { AggregatedMetrics } from '@/types/aggregation';

export class MetricsCalculator {
  /**
   * Compute aggregated metrics from product data
   */
  static computeMetrics(products: ProductData[]): AggregatedMetrics {
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
  private static calculatePerformanceScore(stockOutRate: number, wastageRate: number): number {
    // Lower stock out and wastage rates = higher performance
    const stockOutScore = Math.max(0, 100 - (stockOutRate * 4)); // Penalty for stock outs
    const wastageScore = Math.max(0, 100 - (wastageRate * 6)); // Higher penalty for wastage
    
    return Math.round((stockOutScore + wastageScore) / 2);
  }
}
