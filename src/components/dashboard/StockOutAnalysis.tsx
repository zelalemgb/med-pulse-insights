
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { mockPharmaceuticalData } from '@/data/pharmaceuticalData';

export const StockOutAnalysis = () => {
  // Calculate stock out metrics
  const stockOutData = mockPharmaceuticalData.map(product => {
    const totalStockOutDays = product.quarters.reduce((sum, q) => sum + q.stockOutDays, 0);
    const avgStockOutDays = totalStockOutDays / 4;
    
    return {
      productName: product.productName,
      totalStockOutDays,
      avgStockOutDays,
      quarters: product.quarters.map(q => ({
        quarter: q.quarter,
        stockOutDays: q.stockOutDays,
        consumptionImpact: q.stockOutDays > 0 ? q.consumptionIssue * 0.3 : 0 // Estimated impact
      })),
      classification: product.venClassification,
      criticalLevel: product.venClassification === 'V' && totalStockOutDays > 60 ? 'Critical' : 
                    totalStockOutDays > 30 ? 'High' : 
                    totalStockOutDays > 0 ? 'Medium' : 'Good'
    };
  });

  // Quarterly stock out trends
  const quarterlyStockOuts = [
    { quarter: 'Q1', products: 1, days: 83, impact: 150 },
    { quarter: 'Q2', products: 1, days: 90, impact: 200 },
    { quarter: 'Q3', products: 1, days: 90, impact: 180 },
    { quarter: 'Q4', products: 1, days: 90, impact: 170 }
  ];

  // Stock out impact analysis
  const impactAnalysis = [
    { category: 'Patient Care', impact: 'High', description: 'Delayed treatments and alternative therapies' },
    { category: 'Financial', impact: 'Medium', description: 'Emergency procurement at higher costs' },
    { category: 'Operational', impact: 'High', description: 'Increased workload for pharmacy staff' },
    { category: 'Compliance', impact: 'Medium', description: 'Potential regulatory compliance issues' }
  ];

  const totalStockOutProducts = stockOutData.filter(item => item.totalStockOutDays > 0).length;
  const avgStockOutDays = stockOutData.reduce((sum, item) => sum + item.avgStockOutDays, 0) / stockOutData.length;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products with Stock Outs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalStockOutProducts}</div>
            <p className="text-xs text-muted-foreground">Out of {stockOutData.length} products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Stock Out Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{avgStockOutDays.toFixed(1)} days</div>
            <p className="text-xs text-muted-foreground">Per quarter average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stockOutData.filter(item => item.criticalLevel === 'Critical').length}
            </div>
            <p className="text-xs text-muted-foreground">Vital drugs with extended stock outs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">75%</div>
            <p className="text-xs text-muted-foreground">Products available when needed</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quarterly Stock Out Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={quarterlyStockOuts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="days" fill="#FF8042" name="Stock Out Days" />
                <Line yAxisId="right" dataKey="impact" stroke="#8884D8" name="Impact Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Out Impact by Quarter</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={quarterlyStockOuts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="impact" stroke="#8884d8" strokeWidth={2} name="Impact Score" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stock Out Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Product-wise Stock Out Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Product</th>
                  <th className="text-center p-3">VEN Class</th>
                  <th className="text-center p-3">Total Stock Out Days</th>
                  <th className="text-center p-3">Avg Days/Quarter</th>
                  <th className="text-center p-3">Risk Level</th>
                  <th className="text-center p-3">Q1</th>
                  <th className="text-center p-3">Q2</th>
                  <th className="text-center p-3">Q3</th>
                  <th className="text-center p-3">Q4</th>
                </tr>
              </thead>
              <tbody>
                {stockOutData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{item.productName.substring(0, 30)}...</td>
                    <td className="text-center p-3">
                      <Badge variant={item.classification === 'V' ? 'destructive' : 
                                   item.classification === 'E' ? 'secondary' : 'default'}>
                        {item.classification}
                      </Badge>
                    </td>
                    <td className="text-center p-3 font-bold">{item.totalStockOutDays}</td>
                    <td className="text-center p-3">{item.avgStockOutDays.toFixed(1)}</td>
                    <td className="text-center p-3">
                      <Badge variant={item.criticalLevel === 'Critical' ? 'destructive' : 
                                   item.criticalLevel === 'High' ? 'secondary' : 
                                   item.criticalLevel === 'Medium' ? 'outline' : 'default'}>
                        {item.criticalLevel}
                      </Badge>
                    </td>
                    {item.quarters.map((q, qIndex) => (
                      <td key={qIndex} className="text-center p-3">
                        {q.stockOutDays > 0 ? (
                          <span className="text-red-600 font-bold">{q.stockOutDays}</span>
                        ) : (
                          <span className="text-green-600">0</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Impact Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Out Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Impact Categories</h3>
              <div className="space-y-3">
                {impactAnalysis.map((impact, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{impact.category}</h4>
                      <Badge variant={impact.impact === 'High' ? 'destructive' : 'secondary'}>
                        {impact.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{impact.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Prevention Strategies</h3>
              <div className="space-y-3">
                <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                  <h4 className="font-medium">Safety Stock Optimization</h4>
                  <p className="text-sm text-gray-600">Maintain 30-day safety stock for vital medications</p>
                </div>
                <div className="p-3 border-l-4 border-green-500 bg-green-50">
                  <h4 className="font-medium">Automated Reordering</h4>
                  <p className="text-sm text-gray-600">Set up automatic reorder points based on consumption patterns</p>
                </div>
                <div className="p-3 border-l-4 border-orange-500 bg-orange-50">
                  <h4 className="font-medium">Supplier Diversification</h4>
                  <p className="text-sm text-gray-600">Identify backup suppliers for critical medications</p>
                </div>
                <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
                  <h4 className="font-medium">Emergency Procurement</h4>
                  <p className="text-sm text-gray-600">Establish fast-track procurement for urgent needs</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
