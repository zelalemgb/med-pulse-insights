
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const LiveMetrics = () => {
  const metrics = [
    {
      value: "487",
      label: "Active Facilities",
      trend: "+12 this month",
      color: "text-blue-600"
    },
    {
      value: "94.2%",
      label: "Stock Availability",
      trend: "+2.8% from Q3",
      color: "text-green-600"
    },
    {
      value: "18",
      label: "Days Avg. Lead Time",
      trend: "-4 days improved",
      color: "text-purple-600"
    },
    {
      value: "2.1%",
      label: "Wastage Rate",
      trend: "-0.9% reduction",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-light text-gray-900 mb-4">
          Current System Performance
        </h2>
        <p className="text-gray-600">
          Live data from health facilities across Ethiopia
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {metrics.map((metric) => (
          <Card key={metric.label} className="text-center border-0 shadow-sm">
            <CardContent className="p-6">
              <div className={`text-3xl font-bold ${metric.color} mb-2`}>{metric.value}</div>
              <div className="text-sm text-gray-600">{metric.label}</div>
              <div className="text-xs text-green-600 mt-1 flex items-center justify-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                {metric.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LiveMetrics;
