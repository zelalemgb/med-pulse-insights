
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  BarChart3, 
  Shield, 
  TrendingUp, 
  Clock, 
  Users, 
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Award,
  Lock,
  Zap
} from "lucide-react";

const WelcomeSection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Enhanced Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-32 max-w-4xl mx-auto">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Trusted by 500+ Healthcare Facilities
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Transform Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Pharmaceutical</span>
            <br />Supply Chain
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            AI-powered analytics platform designed for healthcare professionals to optimize inventory, reduce waste, and ensure medication availability when it matters most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-10 py-6 h-auto text-white shadow-lg hover:shadow-xl transition-all duration-200">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-10 py-6 h-auto border-2 hover:bg-gray-50">
              Watch Demo
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            ✓ No credit card required • ✓ 30-day free trial • ✓ Setup in 5 minutes
          </p>
        </div>

        {/* Enhanced Feature Showcase - 6 Cards */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to optimize your supply chain
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed specifically for pharmaceutical inventory management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-Time Analytics</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get instant insights into consumption patterns, stock levels, and demand forecasting with interactive dashboards.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Role-Based Access</h3>
                <p className="text-gray-600 leading-relaxed">
                  Secure, compliant access controls with customizable permissions for different team roles and facilities.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Optimization</h3>
                <p className="text-gray-600 leading-relaxed">
                  AI-driven recommendations to reduce waste, optimize reorder points, and maintain optimal stock levels.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-200 transition-colors">
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Automated Alerts</h3>
                <p className="text-gray-600 leading-relaxed">
                  Never run out of critical medications with intelligent alerts for low stock, expiration dates, and reorder times.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="bg-cyan-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-200 transition-colors">
                  <Users className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Multi-Facility Management</h3>
                <p className="text-gray-600 leading-relaxed">
                  Centralized oversight across multiple locations with facility-specific analytics and cross-location insights.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="bg-red-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-200 transition-colors">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Risk Management</h3>
                <p className="text-gray-600 leading-relaxed">
                  Proactive identification of supply chain risks, shortage predictions, and mitigation strategies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get started in 3 simple steps
            </h2>
            <p className="text-xl text-gray-600">
              From setup to insights in minutes, not months
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect Your Data</h3>
              <p className="text-gray-600">
                Import your existing inventory data or start fresh. Our system integrates with most pharmacy management systems.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Configure Settings</h3>
              <p className="text-gray-600">
                Set up your facilities, user roles, and preferences. Our smart defaults get you up and running quickly.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Start Optimizing</h3>
              <p className="text-gray-600">
                Begin receiving AI-powered insights and recommendations to optimize your pharmaceutical supply chain.
              </p>
            </div>
          </div>
        </div>

        {/* Trust & Credibility Section */}
        <div className="mb-32">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Healthcare Facilities</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">25%</div>
                <div className="text-gray-600">Average Cost Reduction</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
                <div className="text-gray-600">System Uptime</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
                <div className="text-gray-600">Expert Support</div>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-8 mt-12 pt-8 border-t">
              <div className="flex items-center gap-2 text-gray-600">
                <Award className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Lock className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">SOC 2 Type II</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Shield className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium">Enterprise Security</span>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-16 text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to optimize your supply chain?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Join hundreds of healthcare facilities already using our platform to reduce costs and improve patient care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-10 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-200">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-10 py-6 h-auto border-2 border-white text-white hover:bg-white/10">
              Contact Sales
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm opacity-90">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              <span>Free 30-day trial</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
