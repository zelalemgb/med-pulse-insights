
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Upload, 
  BarChart3,
  Database,
  ArrowRight,
  TrendingUp
} from "lucide-react";

const QuickActionCards = () => {
  const quickActions = [
    {
      title: "Advanced Analytics",
      description: "Access comprehensive analytics and insights from your data",
      icon: BarChart3,
      path: "/analytics",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Manage Facilities",
      description: "View and manage health facilities and associations",
      icon: Database,
      path: "/facilities",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Import Data",
      description: "Upload consumption data and forecasting files",
      icon: Upload,
      path: "/import",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Import Forecast Data",
      description: "Upload forecast data for multi-level aggregation analysis",
      icon: TrendingUp,
      path: "/import?type=forecast",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="mb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {quickActions.map((action) => (
          <Card key={action.path} className="hover:shadow-xl transition-all duration-300 group border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className={`w-16 h-16 ${action.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className={`w-8 h-8 ${action.color}`} />
              </div>
              <CardTitle className="flex items-center justify-between text-xl">
                {action.title}
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">{action.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={action.path}>
                <Button className="w-full h-12 text-base font-medium" variant="outline">
                  {action.title}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuickActionCards;
