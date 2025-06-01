
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Upload, 
  TrendingUp, 
  BarChart3,
  ArrowRight
} from "lucide-react";

const QuickActionCards = () => {
  const quickActions = [
    {
      title: "Import Data",
      description: "Upload and manage your pharmaceutical inventory data",
      icon: Upload,
      path: "/import",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Conduct Forecast",
      description: "Generate demand forecasts and consumption predictions",
      icon: TrendingUp,
      path: "/dashboard?tab=analytics",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "View Analytics",
      description: "Access comprehensive analytics and insights",
      icon: BarChart3,
      path: "/analytics",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="mb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
