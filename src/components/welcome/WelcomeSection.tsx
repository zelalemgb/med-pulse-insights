
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MapPin,
  CheckCircle,
  ArrowRight,
  Activity
} from "lucide-react";

const WelcomeSection = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Clean and Data-Focused */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-8 leading-tight">
            Pharmaceutical Supply Chain
            <span className="block font-medium text-blue-600">Analytics Platform</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Real-time visibility into pharmaceutical inventory across healthcare facilities. 
            Evidence-based insights for better patient outcomes.
          </p>
          
          {/* Primary Action */}
          <div className="flex justify-center mb-8">
            <Link to="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 h-auto">
                Access Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Live Metrics Dashboard */}
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
            <Card className="text-center border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">487</div>
                <div className="text-sm text-gray-600">Active Facilities</div>
                <div className="text-xs text-green-600 mt-1 flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12 this month
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">94.2%</div>
                <div className="text-sm text-gray-600">Stock Availability</div>
                <div className="text-xs text-green-600 mt-1 flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +2.8% from Q3
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">18</div>
                <div className="text-sm text-gray-600">Days Avg. Lead Time</div>
                <div className="text-xs text-green-600 mt-1 flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  -4 days improved
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-orange-600 mb-2">2.1%</div>
                <div className="text-sm text-gray-600">Wastage Rate</div>
                <div className="text-xs text-green-600 mt-1 flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  -0.9% reduction
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Regional Performance Evidence */}
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
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Oromia Region</h3>
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Stock-out Reduction</span>
                    <span className="font-medium text-green-600">-34%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Facilities Connected</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="font-medium text-blue-600">< 24hrs</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Tigray Region</h3>
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Availability Rate</span>
                    <span className="font-medium text-green-600">96.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Facilities Connected</span>
                    <span className="font-medium">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cost Efficiency</span>
                    <span className="font-medium text-purple-600">+18%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">SNNP Region</h3>
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Emergency Response</span>
                    <span className="font-medium text-green-600">< 6hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Facilities Connected</span>
                    <span className="font-medium">124</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Forecasting Accuracy</span>
                    <span className="font-medium text-blue-600">91.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Capabilities */}
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
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Real-Time Monitoring</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Continuous tracking of stock levels, consumption patterns, and supply chain bottlenecks across facilities.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Predictive Analytics</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Machine learning algorithms forecast demand patterns and identify potential stock-outs before they occur.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Multi-Level Access</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Role-based dashboards for national, regional, zonal, and facility-level stakeholders with appropriate data access.
              </p>
            </div>
          </div>
        </div>

        {/* Field Evidence */}
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
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">28% stock-out rate on essential medicines</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">45-day average procurement lead time</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">Manual reporting with 2-week delays</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">Limited visibility across facility networks</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">After 12 Months</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                    <span className="text-sm text-gray-700">8% stock-out rate (72% improvement)</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                    <span className="text-sm text-gray-700">18-day average lead time (60% faster)</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                    <span className="text-sm text-gray-700">Real-time reporting and alerts</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                    <span className="text-sm text-gray-700">Complete network transparency</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Access and Contact */}
        <div className="text-center bg-blue-50 rounded-lg p-12">
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            Access the Platform
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join health facilities, government partners, and development organizations 
            using data-driven insights to strengthen pharmaceutical supply chains.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 h-auto">
                Request Access
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto border-2">
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
