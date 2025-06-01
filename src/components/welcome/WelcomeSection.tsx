
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart3, Shield, TrendingUp } from "lucide-react";

const WelcomeSection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Smart Pharmaceutical Analytics
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your pharmaceutical supply chain with AI-powered insights and real-time analytics.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 h-auto">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Three Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 max-w-5xl mx-auto">
          <Card className="text-center p-8 hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Real-Time Insights</h3>
              <p className="text-gray-600">
                Monitor your supply chain performance with live data and predictive analytics.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-8 hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Secure & Compliant</h3>
              <p className="text-gray-600">
                Enterprise-grade security with role-based access and audit trails.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-8 hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Optimize Operations</h3>
              <p className="text-gray-600">
                Reduce waste and improve efficiency with AI-driven recommendations.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicator */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full border">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Enterprise-Grade Security</span>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to transform your supply chain?
          </h2>
          <p className="text-gray-600 mb-8">
            Join the future of pharmaceutical analytics today.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 h-auto mr-4">
              Get Started
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
