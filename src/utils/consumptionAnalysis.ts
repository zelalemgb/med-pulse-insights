
import { ProductData, PeriodData } from '@/types/pharmaceutical';

export interface ConsumptionMetrics {
  aamc: number; // Adjusted Average Monthly Consumption
  amc: number; // Average Monthly Consumption
  consumptionPattern: 'stable' | 'increasing' | 'decreasing' | 'seasonal' | 'irregular';
  seasonalityIndex: number;
  variabilityCoefficient: number;
  trend: number; // percentage change per period
}

export interface ConsumptionAnalysisResult {
  productId: string;
  metrics: ConsumptionMetrics;
  recommendations: string[];
  confidence: number; // 0-1 scale
}

export class ConsumptionAnalyzer {
  /**
   * Calculate Adjusted Average Monthly Consumption (aAMC)
   * Optimized for real-time calculations
   */
  static calculateAAMC(periods: PeriodData[]): number {
    const validPeriods = periods.filter(p => 
      p.consumptionIssue > 0 && p.stockOutDays === 0
    );
    
    if (validPeriods.length === 0) return 0;
    
    const totalConsumption = validPeriods.reduce((sum, p) => sum + p.consumptionIssue, 0);
    return totalConsumption / validPeriods.length;
  }

  /**
   * Calculate standard AMC including stock-out periods
   */
  static calculateAMC(periods: PeriodData[]): number {
    const periodsWithConsumption = periods.filter(p => p.consumptionIssue > 0);
    if (periodsWithConsumption.length === 0) return 0;
    
    const totalConsumption = periodsWithConsumption.reduce((sum, p) => sum + p.consumptionIssue, 0);
    return totalConsumption / periodsWithConsumption.length;
  }

  /**
   * Analyze consumption patterns using statistical methods
   */
  static analyzeConsumptionPattern(periods: PeriodData[]): {
    pattern: ConsumptionMetrics['consumptionPattern'];
    trend: number;
    variability: number;
  } {
    const consumptions = periods.map(p => p.consumptionIssue);
    const validConsumptions = consumptions.filter(c => c > 0);
    
    if (validConsumptions.length < 3) {
      return { pattern: 'irregular', trend: 0, variability: 100 };
    }

    // Calculate trend using linear regression
    const trend = this.calculateTrend(validConsumptions);
    
    // Calculate coefficient of variation
    const mean = validConsumptions.reduce((sum, c) => sum + c, 0) / validConsumptions.length;
    const variance = validConsumptions.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / validConsumptions.length;
    const standardDeviation = Math.sqrt(variance);
    const variability = mean > 0 ? (standardDeviation / mean) * 100 : 100;

    // Determine pattern based on trend and variability
    let pattern: ConsumptionMetrics['consumptionPattern'];
    if (variability > 50) {
      pattern = 'irregular';
    } else if (Math.abs(trend) < 5) {
      pattern = 'stable';
    } else if (trend > 5) {
      pattern = 'increasing';
    } else if (trend < -5) {
      pattern = 'decreasing';
    } else {
      pattern = this.detectSeasonality(validConsumptions) ? 'seasonal' : 'stable';
    }

    return { pattern, trend, variability };
  }

  /**
   * Calculate seasonality index for the product
   */
  static calculateSeasonalityIndex(periods: PeriodData[]): number {
    const consumptions = periods.map(p => p.consumptionIssue).filter(c => c > 0);
    if (consumptions.length < 4) return 0;

    const mean = consumptions.reduce((sum, c) => sum + c, 0) / consumptions.length;
    const seasonalDeviations = consumptions.map(c => Math.abs(c - mean) / mean);
    
    return seasonalDeviations.reduce((sum, dev) => sum + dev, 0) / seasonalDeviations.length;
  }

  /**
   * Comprehensive consumption analysis
   */
  static analyzeProduct(product: ProductData): ConsumptionAnalysisResult {
    const aamc = this.calculateAAMC(product.periods);
    const amc = this.calculateAMC(product.periods);
    const { pattern, trend, variability } = this.analyzeConsumptionPattern(product.periods);
    const seasonalityIndex = this.calculateSeasonalityIndex(product.periods);

    const metrics: ConsumptionMetrics = {
      aamc,
      amc,
      consumptionPattern: pattern,
      seasonalityIndex,
      variabilityCoefficient: variability,
      trend
    };

    const recommendations = this.generateRecommendations(metrics, product);
    const confidence = this.calculateConfidence(product.periods, metrics);

    return {
      productId: product.id,
      metrics,
      recommendations,
      confidence
    };
  }

  private static calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const indices = Array.from({ length: n }, (_, i) => i);
    
    const sumX = indices.reduce((sum, x) => sum + x, 0);
    const sumY = values.reduce((sum, y) => sum + y, 0);
    const sumXY = indices.reduce((sum, x, i) => sum + x * values[i], 0);
    const sumXX = indices.reduce((sum, x) => sum + x * x, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const avgY = sumY / n;
    
    return avgY > 0 ? (slope / avgY) * 100 : 0;
  }

  private static detectSeasonality(values: number[]): boolean {
    if (values.length < 6) return false;
    
    // Simple autocorrelation check for seasonal patterns
    const lag = Math.floor(values.length / 2);
    let correlation = 0;
    
    for (let i = 0; i < values.length - lag; i++) {
      correlation += values[i] * values[i + lag];
    }
    
    return Math.abs(correlation) > 0.6;
  }

  private static generateRecommendations(metrics: ConsumptionMetrics, product: ProductData): string[] {
    const recommendations: string[] = [];
    
    if (metrics.variabilityCoefficient > 50) {
      recommendations.push('High variability detected - review ordering patterns');
    }
    
    if (metrics.consumptionPattern === 'increasing' && metrics.trend > 20) {
      recommendations.push('Increasing consumption trend - consider higher safety stock');
    }
    
    if (metrics.consumptionPattern === 'decreasing' && metrics.trend < -20) {
      recommendations.push('Decreasing consumption trend - review stock levels');
    }
    
    if (metrics.seasonalityIndex > 0.3) {
      recommendations.push('Seasonal patterns detected - implement seasonal forecasting');
    }
    
    const stockOutPeriods = product.periods.filter(p => p.stockOutDays > 0).length;
    if (stockOutPeriods > 0) {
      recommendations.push(`${stockOutPeriods} stock-out periods detected - review safety stock`);
    }
    
    return recommendations;
  }

  private static calculateConfidence(periods: PeriodData[], metrics: ConsumptionMetrics): number {
    const dataQuality = periods.filter(p => p.consumptionIssue > 0).length / periods.length;
    const variabilityFactor = Math.max(0, 1 - (metrics.variabilityCoefficient / 100));
    
    return Math.min(1, dataQuality * variabilityFactor);
  }
}
