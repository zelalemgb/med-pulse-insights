
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const RegionalPerformance = () => {
  const regions = [
    {
      name: "Oromia Region",
      metrics: [
        { label: "Stock-out Reduction", value: "-34%", color: "text-green-600" },
        { label: "Facilities Connected", value: "156", color: "text-gray-900" },
        { label: "Response Time", value: "&lt; 24hrs", color: "text-blue-600" }
      ]
    },
    {
      name: "Tigray Region",
      metrics: [
        { label: "Availability Rate", value: "96.8%", color: "text-green-600" },
        { label: "Facilities Connected", value: "89", color: "text-gray-900" },
        { label: "Cost Efficiency", value: "+18%", color: "text-purple-600" }
      ]
    },
    {
      name: "SNNP Region",
      metrics: [
        { label: "Emergency Response", value: "&lt; 6hrs", color: "text-green-600" },
        { label: "Facilities Connected", value: "124", color: "text-gray-900" },
        { label: "Forecasting Accuracy", value: "91.3%", color: "text-blue-600" }
      ]
    }
  ];

  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-light text-gray-900 mb-4">
          Regional Impact Analysis
        </h2>
        <p className="text-gray-600">
          Measurable improvements across different administrative levels
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {regions.map((region) => (
          <Card key={region.name} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">{region.name}</h3>
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-3">
                {region.metrics.map((metric) => (
                  <div key={metric.label} className="flex justify-between">
                    <span className="text-sm text-gray-600">{metric.label}</span>
                    <span className={`font-medium ${metric.color}`} dangerouslySetInnerHTML={{ __html: metric.value }} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RegionalPerformance;
