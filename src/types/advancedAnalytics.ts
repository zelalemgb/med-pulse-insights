
export interface MLForecast {
  period: string;
  actual?: number;
  predicted: number;
  confidence: number;
  upperBound: number;
  lowerBound: number;
}

export interface PatternAnalysis {
  pattern: string;
  confidence: number;
  description: string;
  products: string[];
  impact: 'high' | 'medium' | 'low';
}

export interface ScalabilityMetrics {
  dataProcessingTime: string;
  cacheHitRate: string;
  predictionAccuracy: string;
  modelTrainingTime: string;
  dataPoints: string;
  featuresProcessed: number;
}

export type MLModel = 'arima' | 'lstm' | 'prophet';
export type ForecastHorizon = '3' | '6' | '12';
