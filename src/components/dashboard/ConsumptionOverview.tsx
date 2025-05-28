
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockPharmaceuticalData, calculateMetrics } from '@/data/pharmaceuticalData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const ConsumptionOverview = () => {
  const metrics = calculateMetrics(mockPharmaceuticalData);
  
  const quarterlyData = [
    { quarter: 'Q1', consumption: 500, received: 2000, ending: 1500 },
    { quarter: 'Q2', consumption: 170, received: 640, ending: 1970 },
    { quarter: 'Q3', consumption: 1097, received: 456, ending: 1329 },
    { quarter: 'Q4', consumption: 603, received: 500, ending: 1193 }
  ];

  const venClassificationData = [
    { name: 'Vital (V)', value: 1, color: '#0088FE' },
    { name: 'Essential (E)', value: 0, color: '#00C49F' },
    { name: 'Non-essential (N)', value: 1, color: '#FFBB28' }
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active pharmaceutical items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalConsumption.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total units consumed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Out Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.stockOutRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Products with stock outs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Wastage Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgWastageRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Average across all products</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quarterly Consumption vs Received</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="consumption" fill="#8884d8" name="Consumption" />
                <Bar dataKey="received" fill="#82ca9d" name="Received" />
                <Bar dataKey="ending" fill="#ffc658" name="Ending Balance" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>VEN Classification Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={venClassificationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {venClassificationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
