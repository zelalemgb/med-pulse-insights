
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FeatureDescriptions = () => {
  const featureDescriptions = [
    {
      title: "Import Data",
      description: "Easily upload your pharmaceutical inventory data from Excel files or CSV formats. Our intelligent system automatically maps your data fields and validates entries to ensure accuracy. Support for batch uploads and real-time data synchronization keeps your inventory information up-to-date.",
      benefits: ["Excel/CSV file support", "Automatic data validation", "Batch processing", "Real-time sync"],
      path: "/import"
    },
    {
      title: "Conduct Forecast",
      description: "Leverage advanced AI algorithms to predict future demand patterns and consumption trends. Our forecasting engine analyzes historical data, seasonal patterns, and external factors to provide accurate predictions that help optimize your inventory levels and prevent stockouts.",
      benefits: ["AI-powered predictions", "Seasonal analysis", "Historical trend analysis", "Stockout prevention"],
      path: "/dashboard?tab=analytics"
    },
    {
      title: "View Analytics",
      description: "Access comprehensive dashboards and interactive visualizations that transform your data into actionable insights. Monitor key performance indicators, track consumption patterns, identify trends, and make data-driven decisions to optimize your pharmaceutical supply chain.",
      benefits: ["Interactive dashboards", "Real-time monitoring", "Trend identification", "Performance tracking"],
      path: "/analytics"
    }
  ];

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features at Your Fingertips</h2>
        <p className="text-gray-600 text-lg">Explore what each feature can do for your pharmaceutical operations</p>
      </div>
      
      <div className="space-y-8">
        {featureDescriptions.map((feature, index) => (
          <Card key={feature.title} className="shadow-lg border-0">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 text-base leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {feature.benefits.map((benefit) => (
                      <span key={benefit} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-center lg:text-right">
                  <Link to={feature.path}>
                    <Button size="lg" className="h-12 px-8 text-base font-medium">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeatureDescriptions;
