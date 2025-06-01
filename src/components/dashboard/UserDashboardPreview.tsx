
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
import { useAuth } from "@/contexts/AuthContext";

const UserDashboardPreview = () => {
  const { profile } = useAuth();

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

  const featureDescriptions = [
    {
      title: "Import Data",
      description: "Easily upload your pharmaceutical inventory data from Excel files or CSV formats. Our intelligent system automatically maps your data fields and validates entries to ensure accuracy. Support for batch uploads and real-time data synchronization keeps your inventory information up-to-date.",
      benefits: ["Excel/CSV file support", "Automatic data validation", "Batch processing", "Real-time sync"]
    },
    {
      title: "Conduct Forecast",
      description: "Leverage advanced AI algorithms to predict future demand patterns and consumption trends. Our forecasting engine analyzes historical data, seasonal patterns, and external factors to provide accurate predictions that help optimize your inventory levels and prevent stockouts.",
      benefits: ["AI-powered predictions", "Seasonal analysis", "Historical trend analysis", "Stockout prevention"]
    },
    {
      title: "View Analytics",
      description: "Access comprehensive dashboards and interactive visualizations that transform your data into actionable insights. Monitor key performance indicators, track consumption patterns, identify trends, and make data-driven decisions to optimize your pharmaceutical supply chain.",
      benefits: ["Interactive dashboards", "Real-time monitoring", "Trend identification", "Performance tracking"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Welcome back, {profile?.full_name || 'User'}!
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Access your pharmaceutical analytics platform and manage your supply chain data with confidence.
            </p>
          </div>
        </div>

        {/* Main Action Cards */}
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

        {/* Feature Descriptions */}
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
                      <Link to={quickActions[index].path}>
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

        {/* System Overview */}
        <div className="text-center">
          <Card className="max-w-4xl mx-auto shadow-xl border-0">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl">
                Ready to optimize your pharmaceutical supply chain?
              </CardTitle>
              <CardDescription className="text-lg">
                Start with any of the three core features above and unlock the power of data-driven decision making
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-blue-600">500+</div>
                  <div className="text-base text-gray-600">Healthcare Facilities</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-green-600">98.5%</div>
                  <div className="text-base text-gray-600">Data Accuracy</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-purple-600">25%</div>
                  <div className="text-base text-gray-600">Cost Reduction</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPreview;
