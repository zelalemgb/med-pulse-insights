
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Zap } from 'lucide-react';
import { MLModel, ForecastHorizon } from '@/types/advancedAnalytics';

interface ModelConfigurationProps {
  selectedModel: MLModel;
  forecastHorizon: ForecastHorizon;
  isProcessing: boolean;
  onModelChange: (model: MLModel) => void;
  onHorizonChange: (horizon: ForecastHorizon) => void;
  onRunAnalysis: () => void;
}

const ModelConfiguration: React.FC<ModelConfigurationProps> = ({
  selectedModel,
  forecastHorizon,
  isProcessing,
  onModelChange,
  onHorizonChange,
  onRunAnalysis
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Advanced Analytics Engine
          </CardTitle>
          <div className="flex gap-2">
            <Select value={selectedModel} onValueChange={onModelChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prophet">Prophet</SelectItem>
                <SelectItem value="arima">ARIMA</SelectItem>
                <SelectItem value="lstm">LSTM Neural Net</SelectItem>
              </SelectContent>
            </Select>
            <Select value={forecastHorizon} onValueChange={onHorizonChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Months</SelectItem>
                <SelectItem value="6">6 Months</SelectItem>
                <SelectItem value="12">12 Months</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={onRunAnalysis} disabled={isProcessing}>
              {isProcessing ? <Zap className="h-4 w-4 animate-spin mr-2" /> : <Brain className="h-4 w-4 mr-2" />}
              {isProcessing ? 'Processing...' : 'Run Analysis'}
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ModelConfiguration;
