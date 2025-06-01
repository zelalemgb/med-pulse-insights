
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  BarChart3, 
  Building2, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Settings,
  Upload,
  Download,
  Bell,
  Calendar,
  Zap
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";

const UserDashboardPreview = () => {
  const { profile } = useAuth();
  const { canAccess, userRole } = usePermissions();

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

  // Role-based quick actions
  const getQuickActions = () => {
    const baseActions = [
      {
        title: "View Dashboard",
        description: "Access your personalized analytics dashboard",
        icon: BarChart3,
        path: "/dashboard",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        priority: 1
      }
    ];

    const roleSpecificActions = [];

    // Facility management actions
    if (canAccess.manageFacilities || userRole === 'facility_manager') {
      roleSpecificActions.push({
        title: "Manage Facilities",
        description: "View and manage facility information",
        icon: Building2,
        path: "/facilities",
        color: "text-green-600",
        bgColor: "bg-green-50",
        priority: 2
      });
    }

    // Analytics actions for authorized roles
    if (canAccess.dataAnalysis) {
      roleSpecificActions.push({
        title: "Advanced Analytics",
        description: "Deep dive into consumption and performance metrics",
        icon: TrendingUp,
        path: "/analytics",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        priority: 3
      });
    }

    // Import/Export for officers and managers
    if (canAccess.importData || canAccess.exportData) {
      roleSpecificActions.push({
        title: "Data Management",
        description: "Import and export pharmaceutical data",
        icon: Upload,
        path: "/import",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        priority: 4
      });
    }

    // Role testing for all authenticated users
    roleSpecificActions.push({
      title: "Role Testing",
      description: "Test and validate user roles and permissions",
      icon: Users,
      path: "/role-testing",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      priority: 5
    });

    return [...baseActions, ...roleSpecificActions].sort((a, b) => a.priority - b.priority).slice(0, 4);
  };

  // Role-based pending tasks
  const getPendingTasks = () => {
    const tasks = [];

    if (canAccess.approveAssociations) {
      tasks.push({
        title: "Pending Facility Requests",
        count: 3,
        type: "approval",
        path: "/facilities?tab=pending"
      });
    }

    if (canAccess.viewReports) {
      tasks.push({
        title: "Reports to Review",
        count: 7,
        type: "review",
        path: "/dashboard?tab=reports"
      });
    }

    if (canAccess.auditTrail) {
      tasks.push({
        title: "Audit Items",
        count: 2,
        type: "audit",
        path: "/facilities?tab=audit"
      });
    }

    return tasks;
  };

  // Recent activity based on role
  const getRecentActivity = () => {
    const activities = [
      {
        title: "Consumption Report Generated",
        time: "2 hours ago",
        type: "report",
        status: "completed"
      },
      {
        title: "Facility Data Updated",
        time: "5 hours ago",
        type: "data",
        status: "completed"
      }
    ];

    if (canAccess.dataAnalysis) {
      activities.unshift({
        title: "Analytics Model Updated",
        time: "1 hour ago",
        type: "analytics",
        status: "completed"
      });
    }

    if (canAccess.manageUsers) {
      activities.push({
        title: "User Role Assignment",
        time: "1 day ago",
        type: "user",
        status: "pending"
      });
    }

    return activities.slice(0, 3);
  };

  const quickActions = getQuickActions();
  const pendingTasks = getPendingTasks();
  const recentActivity = getRecentActivity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section with improved spacing */}
        <div className="text-center mb-16">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Welcome back, {profile?.full_name || 'User'}!
            </h1>
            <div className="flex items-center justify-center gap-3 mb-6">
              <p className="text-xl text-gray-600">
                You're logged in as
              </p>
              {profile?.role && (
                <Badge className="px-4 py-2 bg-blue-100 text-blue-800 text-base font-medium">
                  {getRoleDisplayName(profile.role)}
                </Badge>
              )}
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Access your pharmaceutical analytics dashboard and manage your supply chain data with confidence.
            </p>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Quick Actions</h2>
            <p className="text-gray-600 text-lg">Jump straight to your most-used features</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                      Go to {action.title}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  Pending Tasks
                </CardTitle>
                <CardDescription className="text-base">Items requiring your immediate attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingTasks.map((task, index) => (
                  <Link key={index} to={task.path}>
                    <div className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all duration-200">
                      <div className="flex items-center gap-4">
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                        <span className="font-medium text-base">{task.title}</span>
                      </div>
                      <Badge variant="secondary" className="px-3 py-1 text-sm">{task.count}</Badge>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                Recent Activity
              </CardTitle>
              <CardDescription className="text-base">Your latest actions and system updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-100">
                  <div className="flex items-center gap-4">
                    {activity.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-orange-500" />
                    )}
                    <div className="space-y-1">
                      <p className="font-medium text-base">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'} className="px-3 py-1">
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Stats & CTA Section */}
        <div className="text-center">
          <Card className="max-w-4xl mx-auto shadow-xl border-0">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                System Overview
              </CardTitle>
              <CardDescription className="text-lg">
                Get a comprehensive view of your pharmaceutical analytics platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-blue-600">24</div>
                  <div className="text-base text-gray-600">Active Facilities</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-green-600">98.5%</div>
                  <div className="text-base text-gray-600">System Uptime</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-purple-600">156</div>
                  <div className="text-base text-gray-600">Reports Generated</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/dashboard">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 px-8 text-base font-medium">
                    View Full Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                {canAccess.viewReports && (
                  <Link to="/dashboard?tab=reports">
                    <Button size="lg" variant="outline" className="h-12 px-8 text-base font-medium">
                      <FileText className="mr-2 h-5 w-5" />
                      Generate Report
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPreview;
