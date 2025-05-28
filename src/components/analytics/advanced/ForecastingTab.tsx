
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MLForecast, MLModel } from '@/types/advancedAnalytics';

interface ForecastingTabProps {
  forecastData: MLForecast[];
  selectedModel: MLModel;
}

const ForecastingTab: React.FC<ForecastingTabProps> = ({ forecastData, selectedModel }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>ML-Based Consumption Forecast ({selectedModel.toUpperCase()})</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual" strokeWidth={2} />
              <Line type="monotone" dataKey="predicted" stroke="#ff7300" name="Predicted" strokeWidth={2} strokeDasharray="5 5" />
              <Line type="monotone" dataKey="upperBound" stroke="#ff7300" name="Upper Bound" strokeOpacity={0.3} />
              <Line type="monotone" dataKey="lowerBound" stroke="#ff7300" name="Lower Bound" strokeOpacity={0.3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Forecast Confidence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {forecastData.slice(-4).map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm">{item.period}</span>
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${getConfidenceColor(item.confidence)}`}>
                    {item.confidence}%
                  </span>
                  <div className="w-16 h-2 bg-gray-200 rounded">
                    <div 
                      className="h-full bg-blue-500 rounded"
                      style={{ width: `${item.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForecastingTab;
