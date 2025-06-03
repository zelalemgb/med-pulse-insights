
import React from 'react';
import { BarChart3, Activity, Users } from "lucide-react";

const SystemCapabilities = () => {
  const capabilities = [
    {
      icon: BarChart3,
      title: "Real-Time Monitoring",
      description: "Continuous tracking of stock levels, consumption patterns, and supply chain bottlenecks across facilities.",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Activity,
      title: "Predictive Analytics",
      description: "Machine learning algorithms forecast demand patterns and identify potential stock-outs before they occur.",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Users,
      title: "Multi-Level Access",
      description: "Role-based dashboards for national, regional, zonal, and facility-level stakeholders with appropriate data access.",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-light text-gray-900 mb-4">
          Core System Functions
        </h2>
        <p className="text-gray-600">
          Evidence-based tools for pharmaceutical supply chain management
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {capabilities.map((capability) => (
          <div key={capability.title} className="text-center">
            <div className={`${capability.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
              <capability.icon className={`w-8 h-8 ${capability.color}`} />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">{capability.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {capability.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemCapabilities;
