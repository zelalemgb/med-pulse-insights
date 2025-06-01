
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart3, Building2, TrendingUp, Users, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const UserDashboardPreview = () => {
  const { profile } = useAuth();

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      'facility_officer': 'Facility Officer',
      'facility_manager': 'Facility Manager',
      'zonal': 'Zonal',
      'regional': 'Regional',
      'national': 'National',
      'data_analyst': 'Data Analyst',
      'program_manager': 'Program Manager',
      'procurement': 'Procurement',
      'finance': 'Finance',
      'qa': 'Quality Assurance'
    };
    return roleNames[role] || role.charAt(0).toUpperCase() + role.slice(1);
  };

  const quickActions = [
    {
      title: "View Dashboard",
      description: "Access your personalized analytics dashboard",
      icon: BarChart3,
      path: "/dashboard",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Manage Facilities",
      description: "View and manage facility information",
      icon: Building2,
      path: "/facilities",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Analytics",
      description: "Deep dive into consumption and performance metrics",
      icon: TrendingUp,
      path: "/analytics",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Role Testing",
      description: "Test and validate user roles and permissions",
      icon: Users,
      path: "/role-testing",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back, {profile?.full_name || 'User'}!
          </h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <p className="text-xl text-gray-600">
              You're logged in as
            </p>
            {profile?.role && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {getRoleDisplayName(profile.role)}
              </span>
            )}
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access your pharmaceutical analytics dashboard and manage your supply chain data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {quickActions.map((action) => (
            <Card key={action.path} className="hover:shadow-lg transition-shadow group">
              <CardHeader>
                <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <action.icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <CardTitle className="flex items-center justify-between">
                  {action.title}
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={action.path}>
                  <Button className="w-full" variant="outline">
                    Go to {action.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Quick Stats Overview</CardTitle>
              <CardDescription>
                Get a quick overview of your key metrics and recent activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">24</div>
                  <div className="text-sm text-gray-600">Active Facilities</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">98.5%</div>
                  <div className="text-sm text-gray-600">System Uptime</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">156</div>
                  <div className="text-sm text-gray-600">Reports Generated</div>
                </div>
              </div>
              <div className="mt-6">
                <Link to="/dashboard">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    View Full Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPreview;
