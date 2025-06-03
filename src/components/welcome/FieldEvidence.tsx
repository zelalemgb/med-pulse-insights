
import React from 'react';
import { CheckCircle } from "lucide-react";

const FieldEvidence = () => {
  const beforeMetrics = [
    "28% stock-out rate on essential medicines",
    "45-day average procurement lead time",
    "Manual reporting with 2-week delays",
    "Limited visibility across facility networks"
  ];

  const afterMetrics = [
    "8% stock-out rate (72% improvement)",
    "18-day average lead time (60% faster)",
    "Real-time reporting and alerts",
    "Complete network transparency"
  ];

  return (
    <div className="mb-20">
      <div className="bg-gray-50 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            Field Implementation Results
          </h2>
          <p className="text-gray-600">
            Verified outcomes from pilot implementations across Ethiopian health facilities
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Before System Implementation</h4>
            <div className="space-y-3">
              {beforeMetrics.map((metric) => (
                <div key={metric} className="flex items-center">
                  <div className="w-3 h-3 bg-red-400 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">{metric}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-4">After 12 Months</h4>
            <div className="space-y-3">
              {afterMetrics.map((metric) => (
                <div key={metric} className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                  <span className="text-sm text-gray-700">{metric}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldEvidence;
