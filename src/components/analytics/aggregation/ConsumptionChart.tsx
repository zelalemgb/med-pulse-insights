
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartDataItem } from '@/types/multiLevelAggregation';

interface ConsumptionChartProps {
  data: ChartDataItem[];
  selectedLevel: string;
}

const ConsumptionChart: React.FC<ConsumptionChartProps> = ({ data, selectedLevel }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Consumption by {selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="consumption" fill="#8884d8" name="Total Consumption" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ConsumptionChart;
