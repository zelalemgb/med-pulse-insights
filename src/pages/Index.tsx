
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart3, Users, TrendingUp, Shield, Database } from "lucide-react";
import AdminSetupPrompt from "@/components/AdminSetupPrompt";
import { FirstAdminTestPanel } from "@/components/FirstAdminTestPanel";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pharmaceutical Supply Chain Analytics
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive analytics and management system for pharmaceutical supply chains, 
            inventory optimization, and data-driven decision making.
          </p>
        </div>

        {/* Admin Setup Prompt - Only shows if no national users exist */}
        <AdminSetupPrompt />

        {/* Test Panel for Development */}
        <div className="mb-8">
          <FirstAdminTestPanel />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Real-time insights into supply chain performance, consumption patterns, and forecasting.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Multi-level aggregation analysis</li>
                <li>• Predictive forecasting models</li>
                <li>• Performance benchmarking</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-12 h-12 text-green-600 mb-4" />
              <CardTitle>Role-Based Access</CardTitle>
              <CardDescription>
                Comprehensive user management with facility-specific roles and permissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• National to facility-level roles</li>
                <li>• Conditional permissions</li>
                <li>• Audit trail tracking</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="w-12 h-12 text-purple-600 mb-4" />
              <CardTitle>Supply Chain Optimization</CardTitle>
              <CardDescription>
                AI-powered recommendations for inventory optimization and wastage reduction.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Automated stock level optimization</li>
                <li>• Expiry management</li>
                <li>• Demand forecasting</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4">
          {user ? (
            <div className="space-y-4">
              <p className="text-gray-600">Welcome back! Access your dashboard to continue.</p>
              <Link to="/dashboard">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Shield className="mr-2 h-5 w-5" />
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">Sign in to access the pharmaceutical analytics platform.</p>
              <Link to="/auth">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Shield className="mr-2 h-5 w-5" />
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
