
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
              <Badge className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium">
                {getRoleDisplayName(profile.role)}
              </Badge>
            )}
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access your pharmaceutical analytics dashboard and manage your supply chain data.
          </p>
        </div>

        {/* Quick Actions */}
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

        {/* Pending Tasks & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  Pending Tasks
                </CardTitle>
                <CardDescription>Items requiring your attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingTasks.map((task, index) => (
                  <Link key={index} to={task.path}>
                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">{task.title}</span>
                      </div>
                      <Badge variant="secondary">{task.count}</Badge>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    {activity.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-orange-500" />
                    )}
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats & Action Button */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Quick Stats Overview
              </CardTitle>
              <CardDescription>
                Get a quick overview of your key metrics and recent activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6">
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
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/dashboard">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    View Full Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                {canAccess.viewReports && (
                  <Link to="/dashboard?tab=reports">
                    <Button size="lg" variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
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
