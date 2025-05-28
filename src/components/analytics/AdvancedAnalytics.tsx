
import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ModelConfiguration from './advanced/ModelConfiguration';
import PerformanceMetrics from './advanced/PerformanceMetrics';
import ForecastingTab from './advanced/ForecastingTab';
import PatternsTab from './advanced/PatternsTab';
import OptimizationTab from './advanced/OptimizationTab';
import ScalabilityTab from './advanced/ScalabilityTab';
import { generateForecastData, patternAnalysisData, scalabilityMetrics } from '@/utils/advancedAnalyticsData';
import { MLModel, ForecastHorizon } from '@/types/advancedAnalytics';

const AdvancedAnalytics = () => {
  const [selectedModel, setSelectedModel] = useState<MLModel>('prophet');
  const [forecastHorizon, setForecastHorizon] = useState<ForecastHorizon>('6');
  const [isProcessing, setIsProcessing] = useState(false);

  const forecastData = useMemo(() => 
    generateForecastData(selectedModel, forecastHorizon), 
    [selectedModel, forecastHorizon]
  );

  const handleRunAnalysis = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 3000);
  };

  return (
    <div className="space-y-6">
      <ModelConfiguration
        selectedModel={selectedModel}
        forecastHorizon={forecastHorizon}
        isProcessing={isProcessing}
        onModelChange={setSelectedModel}
        onHorizonChange={setForecastHorizon}
        onRunAnalysis={handleRunAnalysis}
      />

      <PerformanceMetrics metrics={scalabilityMetrics} />

      <Tabs defaultValue="forecasting" className="space-y-4">
        <TabsList>
          <TabsTrigger value="forecasting">ML Forecasting</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Recognition</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="scalability">Scalability</TabsTrigger>
        </TabsList>

        <TabsContent value="forecasting">
          <ForecastingTab forecastData={forecastData} selectedModel={selectedModel} />
        </TabsContent>

        <TabsContent value="patterns">
          <PatternsTab patternAnalysis={patternAnalysisData} />
        </TabsContent>

        <TabsContent value="optimization">
          <OptimizationTab />
        </TabsContent>

        <TabsContent value="scalability">
          <ScalabilityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
