
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { mockPharmaceuticalData } from '@/data/pharmaceuticalData';

export const ForecastAnalysis = () => {
  // Generate forecast data based on historical consumption
  const generateForecast = (product: any) => {
    const quarterlyConsumption = product.quarters.map(q => q.consumptionIssue);
    const avgConsumption = quarterlyConsumption.reduce((sum, val) => sum + val, 0) / 4;
    
    // Simple trend analysis
    const trend = (quarterlyConsumption[3] - quarterlyConsumption[0]) / 3;
    
    return {
      productName: product.productName,
      historical: quarterlyConsumption,
      forecast: [
        Math.max(0, quarterlyConsumption[3] + trend),
        Math.max(0, quarterlyConsumption[3] + (trend * 2)),
        Math.max(0, quarterlyConsumption[3] + (trend * 3)),
        Math.max(0, quarterlyConsumption[3] + (trend * 4))
      ],
      avgConsumption,
      trend: trend > 0 ? 'Increasing' : trend < 0 ? 'Decreasing' : 'Stable'
    };
  };

  const forecastData = mockPharmaceuticalData.map(generateForecast);

  // Prepare data for the main forecast chart
  const chartData = [
    { period: 'Q1 2023', actual: 500, forecast: null },
    { period: 'Q2 2023', actual: 170, forecast: null },
    { period: 'Q3 2023', actual: 1097, forecast: null },
    { period: 'Q4 2023', actual: 603, forecast: null },
    { period: 'Q1 2024', actual: null, forecast: 636 },
    { period: 'Q2 2024', actual: null, forecast: 669 },
    { period: 'Q3 2024', actual: null, forecast: 702 },
    { period: 'Q4 2024', actual: null, forecast: 735 }
  ];

  // Procurement recommendations
  const procurementRecommendations = forecastData.map(item => {
    const nextQuarterNeed = item.forecast[0];
    const currentStock = mockPharmaceuticalData.find(p => p.productName === item.productName)?.quarters[3].endingBalance || 0;
    const recommendedOrder = Math.max(0, nextQuarterNeed - currentStock + (nextQuarterNeed * 0.2)); // 20% safety stock
    
    return {
      productName: item.productName,
      currentStock,
      forecastDemand: nextQuarterNeed,
      recommendedOrder: recommendedOrder,
      priority: recommendedOrder > nextQuarterNeed ? 'High' : recommendedOrder > 0 ? 'Medium' : 'Low'
    };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Consumption Forecast (Amoxicillin + Clavulanic Acid)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Actual Consumption"
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#ff7300" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Forecasted Consumption"
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Procurement Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {procurementRecommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium text-sm mb-2">{rec.productName.substring(0, 40)}...</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Current Stock: <span className="font-bold">{rec.currentStock}</span></div>
                    <div>Forecast Demand: <span className="font-bold">{Math.round(rec.forecastDemand)}</span></div>
                    <div>Recommended Order: <span className="font-bold">{Math.round(rec.recommendedOrder)}</span></div>
                    <div>Priority: 
                      <span className={`font-bold ml-1 ${
                        rec.priority === 'High' ? 'text-red-600' : 
                        rec.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {rec.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Forecast Accuracy Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-blue-600">85%</h3>
              <p className="text-sm text-muted-foreground">Forecast Accuracy</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-600">12%</h3>
              <p className="text-sm text-muted-foreground">Mean Absolute Error</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-purple-600">3.2</h3>
              <p className="text-sm text-muted-foreground">Months Lead Time</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-orange-600">95%</h3>
              <p className="text-sm text-muted-foreground">Service Level</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Consumption Trends Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {forecastData.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <h4 className="font-medium">{item.productName.substring(0, 40)}...</h4>
                  <p className="text-sm text-muted-foreground">Avg Consumption: {Math.round(item.avgConsumption)} units/quarter</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-sm ${
                    item.trend === 'Increasing' ? 'bg-red-100 text-red-800' :
                    item.trend === 'Decreasing' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
