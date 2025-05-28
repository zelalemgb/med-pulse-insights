
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { mockPharmaceuticalData } from '@/data/pharmaceuticalData';

export const SeasonalityTrends = () => {
  // Prepare seasonality data for radar chart
  const seasonalityData = [
    { quarter: 'Q1', value: 21, fullMark: 100 },
    { quarter: 'Q2', value: 7, fullMark: 100 },
    { quarter: 'Q3', value: 46, fullMark: 100 },
    { quarter: 'Q4', value: 25, fullMark: 100 }
  ];

  // Quarterly comparison data
  const quarterlyComparison = [
    { quarter: 'Q1', consumption: 500, percentage: 21, temperature: 25, rainfall: 120 },
    { quarter: 'Q2', consumption: 170, percentage: 7, temperature: 30, rainfall: 80 },
    { quarter: 'Q3', consumption: 1097, percentage: 46, temperature: 28, rainfall: 200 },
    { quarter: 'Q4', consumption: 603, percentage: 25, temperature: 24, rainfall: 150 }
  ];

  // Seasonal patterns for different drug categories
  const categorySeasonality = [
    { category: 'Antibiotics', q1: 30, q2: 20, q3: 35, q4: 40 },
    { category: 'Antivirals', q1: 45, q2: 15, q3: 20, q4: 50 },
    { category: 'Pain Relief', q1: 25, q2: 25, q3: 25, q4: 30 },
    { category: 'Respiratory', q1: 40, q2: 20, q3: 25, q4: 45 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Seasonal Consumption Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={seasonalityData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="quarter" />
                <PolarRadiusAxis angle={90} domain={[0, 50]} />
                <Radar
                  name="Consumption %"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quarterly Trends & Environmental Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={quarterlyComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="consumption" fill="#8884d8" name="Consumption" />
                <Bar yAxisId="right" dataKey="temperature" fill="#82ca9d" name="Avg Temp (°C)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seasonal Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Key Seasonal Patterns</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800">Q3 Peak (46% of annual consumption)</h4>
                  <p className="text-sm text-blue-600">Highest consumption period, likely due to seasonal illnesses</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-800">Q2 Low (7% of annual consumption)</h4>
                  <p className="text-sm text-red-600">Lowest consumption period, potential for stock reduction</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800">Q1 & Q4 Moderate (21% & 25%)</h4>
                  <p className="text-sm text-green-600">Steady consumption periods for baseline planning</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Procurement Recommendations</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-3">
                  <h4 className="font-medium">Pre-Q3 Stock Building</h4>
                  <p className="text-sm text-muted-foreground">Increase inventory by 40% before Q3 to meet peak demand</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-3">
                  <h4 className="font-medium">Q2 Inventory Optimization</h4>
                  <p className="text-sm text-muted-foreground">Reduce orders during Q2 to minimize carrying costs</p>
                </div>
                <div className="border-l-4 border-green-500 pl-3">
                  <h4 className="font-medium">Year-end Planning</h4>
                  <p className="text-sm text-muted-foreground">Plan for Q4 uptick and Q1 seasonal demand</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category-wise Seasonal Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Drug Category</th>
                  <th className="text-center p-2">Q1</th>
                  <th className="text-center p-2">Q2</th>
                  <th className="text-center p-2">Q3</th>
                  <th className="text-center p-2">Q4</th>
                  <th className="text-left p-2">Pattern</th>
                </tr>
              </thead>
              <tbody>
                {categorySeasonality.map((category, index) => {
                  const peak = Math.max(category.q1, category.q2, category.q3, category.q4);
                  const peakQuarter = peak === category.q1 ? 'Q1' : 
                                   peak === category.q2 ? 'Q2' : 
                                   peak === category.q3 ? 'Q3' : 'Q4';
                  
                  return (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{category.category}</td>
                      <td className="text-center p-2">{category.q1}%</td>
                      <td className="text-center p-2">{category.q2}%</td>
                      <td className="text-center p-2">{category.q3}%</td>
                      <td className="text-center p-2">{category.q4}%</td>
                      <td className="p-2 text-sm text-muted-foreground">Peak in {peakQuarter}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
