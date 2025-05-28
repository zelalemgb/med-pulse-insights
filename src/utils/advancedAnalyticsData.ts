
import { MLForecast, PatternAnalysis, ScalabilityMetrics, MLModel, ForecastHorizon } from '@/types/advancedAnalytics';

export const generateForecastData = (selectedModel: MLModel, forecastHorizon: ForecastHorizon): MLForecast[] => [
  { period: 'Jan 2024', actual: 1200, predicted: 1180, confidence: 85, upperBound: 1250, lowerBound: 1110 },
  { period: 'Feb 2024', actual: 1150, predicted: 1165, confidence: 87, upperBound: 1220, lowerBound: 1110 },
  { period: 'Mar 2024', actual: 1300, predicted: 1285, confidence: 82, upperBound: 1380, lowerBound: 1190 },
  { period: 'Apr 2024', actual: 1100, predicted: 1125, confidence: 89, upperBound: 1200, lowerBound: 1050 },
  { period: 'May 2024', predicted: 1240, confidence: 78, upperBound: 1340, lowerBound: 1140 },
  { period: 'Jun 2024', predicted: 1195, confidence: 76, upperBound: 1300, lowerBound: 1090 },
  { period: 'Jul 2024', predicted: 1320, confidence: 74, upperBound: 1450, lowerBound: 1190 },
  { period: 'Aug 2024', predicted: 1275, confidence: 72, upperBound: 1410, lowerBound: 1140 },
];

export const patternAnalysisData: PatternAnalysis[] = [
  {
    pattern: 'Seasonal Surge',
    confidence: 92,
    description: 'Q4 consumption increases by 35% for respiratory medications',
    products: ['Amoxicillin', 'Cough Syrup', 'Paracetamol'],
    impact: 'high'
  },
  {
    pattern: 'Supply Chain Disruption',
    confidence: 78,
    description: 'Monthly delivery delays correlate with 15% wastage increase',
    products: ['Insulin', 'Vaccines', 'Antibiotics'],
    impact: 'high'
  },
  {
    pattern: 'Facility Size Correlation',
    confidence: 85,
    description: 'Larger facilities show 12% better efficiency in stock management',
    products: ['All Categories'],
    impact: 'medium'
  },
  {
    pattern: 'Expiry Prediction',
    confidence: 88,
    description: 'Products with <30 days shelf life have 67% higher wastage risk',
    products: ['Short-shelf life medicines'],
    impact: 'high'
  }
];

export const scalabilityMetrics: ScalabilityMetrics = {
  dataProcessingTime: '2.3s',
  cacheHitRate: '94%',
  predictionAccuracy: '87%',
  modelTrainingTime: '45min',
  dataPoints: '1.2M',
  featuresProcessed: 156
};
