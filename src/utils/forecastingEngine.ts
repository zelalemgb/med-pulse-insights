
import { ProductData, PeriodData } from '@/types/pharmaceutical';
import { ConsumptionAnalyzer, ConsumptionMetrics } from './consumptionAnalysis';

export interface ForecastParameters {
  method: 'movingAverage' | 'exponentialSmoothing' | 'seasonalDecomposition';
  periods: number;
  alpha?: number; // smoothing parameter for exponential smoothing
  beta?: number; // trend smoothing parameter
  gamma?: number; // seasonal smoothing parameter
  safetyStockDays: number;
}

export interface ForecastResult {
  productId: string;
  predictedConsumption: number[];
  safetyStock: number;
  reorderPoint: number;
  maxStock: number;
  forecastAccuracy: number;
  parameters: ForecastParameters;
  confidence: number;
}

export class ForecastingEngine {
  /**
   * Generate forecast using moving average method
   */
  static movingAverageForecast(
    consumptionData: number[],
    periods: number = 3,
    forecastPeriods: number = 12
  ): number[] {
    if (consumptionData.length < periods) {
      return Array(forecastPeriods).fill(0);
    }

    const validData = consumptionData.filter(c => c >= 0);
    if (validData.length === 0) return Array(forecastPeriods).fill(0);

    // Calculate moving average for the last 'periods' values
    const recentData = validData.slice(-periods);
    const average = recentData.reduce((sum, val) => sum + val, 0) / recentData.length;
    
    return Array(forecastPeriods).fill(average);
  }

  /**
   * Generate forecast using exponential smoothing
   */
  static exponentialSmoothingForecast(
    consumptionData: number[],
    alpha: number = 0.3,
    forecastPeriods: number = 12
  ): number[] {
    const validData = consumptionData.filter(c => c >= 0);
    if (validData.length === 0) return Array(forecastPeriods).fill(0);

    let smoothedValue = validData[0];
    
    // Apply exponential smoothing to historical data
    for (let i = 1; i < validData.length; i++) {
      smoothedValue = alpha * validData[i] + (1 - alpha) * smoothedValue;
    }

    return Array(forecastPeriods).fill(smoothedValue);
  }

  /**
   * Generate forecast using Holt-Winters method (trend + seasonality)
   */
  static holtWintersForecast(
    consumptionData: number[],
    alpha: number = 0.3,
    beta: number = 0.1,
    gamma: number = 0.1,
    seasonLength: number = 12,
    forecastPeriods: number = 12
  ): number[] {
    const validData = consumptionData.filter(c => c >= 0);
    if (validData.length < seasonLength * 2) {
      return this.exponentialSmoothingForecast(validData, alpha, forecastPeriods);
    }

    // Initialize components
    let level = validData.slice(0, seasonLength).reduce((sum, val) => sum + val, 0) / seasonLength;
    let trend = this.calculateInitialTrend(validData, seasonLength);
    const seasonal = this.calculateInitialSeasonals(validData, seasonLength);

    const forecasts: number[] = [];
    
    // Apply Holt-Winters method
    for (let i = seasonLength; i < validData.length; i++) {
      const previousLevel = level;
      level = alpha * (validData[i] - seasonal[i % seasonLength]) + (1 - alpha) * (level + trend);
      trend = beta * (level - previousLevel) + (1 - beta) * trend;
      seasonal[i % seasonLength] = gamma * (validData[i] - level) + (1 - gamma) * seasonal[i % seasonLength];
    }

    // Generate forecasts
    for (let i = 0; i < forecastPeriods; i++) {
      const forecast = (level + (i + 1) * trend) * seasonal[i % seasonLength];
      forecasts.push(Math.max(0, forecast));
    }

    return forecasts;
  }

  /**
   * Calculate safety stock based on demand variability and lead time
   */
  static calculateSafetyStock(
    consumptionData: number[],
    leadTimeDays: number = 30,
    serviceLevel: number = 0.95
  ): number {
    const validData = consumptionData.filter(c => c >= 0);
    if (validData.length < 2) return 0;

    const mean = validData.reduce((sum, val) => sum + val, 0) / validData.length;
    const variance = validData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (validData.length - 1);
    const standardDeviation = Math.sqrt(variance);

    // Z-score for service level (95% = 1.645, 99% = 2.326)
    const zScore = serviceLevel >= 0.99 ? 2.326 : serviceLevel >= 0.95 ? 1.645 : 1.282;
    
    // Safety stock = Z-score × std dev × √(lead time)
    const leadTimeMonths = leadTimeDays / 30;
    return zScore * standardDeviation * Math.sqrt(leadTimeMonths);
  }

  /**
   * Comprehensive forecasting for a product
   */
  static generateForecast(product: ProductData, parameters?: Partial<ForecastParameters>): ForecastResult {
    const defaultParams: ForecastParameters = {
      method: 'exponentialSmoothing',
      periods: 6,
      alpha: 0.3,
      beta: 0.1,
      gamma: 0.1,
      safetyStockDays: 30,
      ...parameters
    };

    const consumptionData = product.periods.map(p => p.consumptionIssue);
    const consumptionMetrics = ConsumptionAnalyzer.analyzeProduct(product).metrics;

    let predictedConsumption: number[];

    switch (defaultParams.method) {
      case 'movingAverage':
        predictedConsumption = this.movingAverageForecast(
          consumptionData,
          defaultParams.periods,
          12
        );
        break;
      case 'seasonalDecomposition':
        predictedConsumption = this.holtWintersForecast(
          consumptionData,
          defaultParams.alpha!,
          defaultParams.beta!,
          defaultParams.gamma!,
          12,
          12
        );
        break;
      default:
        predictedConsumption = this.exponentialSmoothingForecast(
          consumptionData,
          defaultParams.alpha!,
          12
        );
    }

    const safetyStock = this.calculateSafetyStock(
      consumptionData,
      defaultParams.safetyStockDays
    );

    const avgForecast = predictedConsumption.reduce((sum, val) => sum + val, 0) / predictedConsumption.length;
    const reorderPoint = avgForecast + safetyStock;
    const maxStock = reorderPoint + (avgForecast * 2); // 2 months buffer

    const forecastAccuracy = this.calculateForecastAccuracy(product, defaultParams);
    const confidence = Math.min(1, consumptionMetrics.aamc > 0 ? 0.8 : 0.3);

    return {
      productId: product.id,
      predictedConsumption,
      safetyStock,
      reorderPoint,
      maxStock,
      forecastAccuracy,
      parameters: defaultParams,
      confidence
    };
  }

  private static calculateInitialTrend(data: number[], seasonLength: number): number {
    let trend = 0;
    for (let i = 0; i < seasonLength; i++) {
      trend += (data[i + seasonLength] - data[i]) / seasonLength;
    }
    return trend / seasonLength;
  }

  private static calculateInitialSeasonals(data: number[], seasonLength: number): number[] {
    const seasonals: number[] = [];
    const averages: number[] = [];

    // Calculate season averages
    for (let i = 0; i < data.length; i += seasonLength) {
      const seasonData = data.slice(i, i + seasonLength);
      const avg = seasonData.reduce((sum, val) => sum + val, 0) / seasonData.length;
      averages.push(avg);
    }

    // Calculate seasonal indices
    for (let i = 0; i < seasonLength; i++) {
      let sum = 0;
      let count = 0;
      for (let j = i; j < data.length; j += seasonLength) {
        const avgIndex = Math.floor(j / seasonLength);
        if (averages[avgIndex] > 0) {
          sum += data[j] / averages[avgIndex];
          count++;
        }
      }
      seasonals[i] = count > 0 ? sum / count : 1;
    }

    return seasonals;
  }

  private static calculateForecastAccuracy(product: ProductData, params: ForecastParameters): number {
    // Simplified accuracy calculation based on data quality and pattern stability
    const validPeriods = product.periods.filter(p => p.consumptionIssue > 0).length;
    const totalPeriods = product.periods.length;
    
    const dataQuality = validPeriods / totalPeriods;
    const patternStability = Math.max(0, 1 - (ConsumptionAnalyzer.analyzeProduct(product).metrics.variabilityCoefficient / 100));
    
    return Math.min(1, (dataQuality + patternStability) / 2);
  }
}
