
import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LevelSelector from './aggregation/LevelSelector';
import PerformanceOverview from './aggregation/PerformanceOverview';
import ConsumptionChart from './aggregation/ConsumptionChart';
import PerformanceChart from './aggregation/PerformanceChart';
import ComparisonView from './aggregation/ComparisonView';
import { createMockAggregationData, getDataForLevel, calculatePerformanceMetrics } from '@/utils/aggregationDataProvider';
import { ChartDataItem } from '@/types/multiLevelAggregation';

const MultiLevelAggregation = () => {
  const [selectedLevel, setSelectedLevel] = useState<'zonal' | 'regional' | 'national'>('zonal');

  // Mock hierarchical data with caching simulation
  const aggregationData = useMemo(() => createMockAggregationData(), []);

  const currentLevelData = useMemo(() => 
    getDataForLevel(aggregationData, selectedLevel), 
    [aggregationData, selectedLevel]
  );

  const chartData: ChartDataItem[] = useMemo(() => 
    currentLevelData.map(item => ({
      name: item.name,
      consumption: item.totalConsumption,
      products: item.totalProducts,
      stockOutRate: item.stockOutRate,
      wastageRate: item.wastageRate
    })), 
    [currentLevelData]
  );

  const performanceMetrics = useMemo(() => 
    calculatePerformanceMetrics(currentLevelData), 
    [currentLevelData]
  );

  return (
    <div className="space-y-6">
      <LevelSelector 
        selectedLevel={selectedLevel} 
        onLevelChange={setSelectedLevel} 
      />

      <PerformanceOverview 
        metrics={performanceMetrics} 
        selectedLevel={selectedLevel} 
      />

      <Tabs defaultValue="consumption" className="space-y-4">
        <TabsList>
          <TabsTrigger value="consumption">Consumption Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="comparison">Regional Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="consumption">
          <ConsumptionChart data={chartData} selectedLevel={selectedLevel} />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceChart data={chartData} />
        </TabsContent>

        <TabsContent value="comparison">
          <ComparisonView data={currentLevelData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MultiLevelAggregation;
