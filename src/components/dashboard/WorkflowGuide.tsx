
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, BarChart3, Home, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const WorkflowGuide = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const workflowSteps = [
    {
      id: 1,
      title: 'Import Your Data',
      description: 'Upload supply chain and forecast data from Excel files',
      icon: Upload,
      route: '/data-entry',
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      completed: false, // This could be dynamic based on user data
    },
    {
      id: 2,
      title: 'Analyze & Forecast',
      description: 'Use analytics tools to conduct forecasting and insights',
      icon: BarChart3,
      route: '/analytics',
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      completed: false,
    },
    {
      id: 3,
      title: 'Monitor Dashboard',
      description: 'Track performance and manage your supply chain',
      icon: Home,
      route: '/dashboard',
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      completed: false,
    },
  ];

  const getRoleDescription = () => {
    switch (profile?.role) {
      case 'facility_officer':
      case 'facility_manager':
        return 'Manage your facility\'s pharmaceutical supply chain data';
      case 'zonal':
        return 'Monitor and analyze data across facilities in your zone';
      case 'regional':
        return 'Oversee supply chain performance across your region';
      case 'national':
        return 'Access comprehensive national-level analytics and insights';
      default:
        return 'Welcome to the pharmaceutical supply chain management system';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Your Supply Chain Workflow
        </CardTitle>
        <CardDescription>
          {getRoleDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Workflow Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="relative">
                  <Card className={`border-2 hover:shadow-md transition-all cursor-pointer ${step.bgColor} border-gray-200 hover:border-gray-300`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`${step.color} p-2 rounded-lg flex-shrink-0`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold ${step.textColor}`}>
                              {step.title}
                            </h3>
                            {step.completed && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {step.description}
                          </p>
                          <Button
                            size="sm"
                            onClick={() => navigate(step.route)}
                            className={`w-full ${step.color} hover:opacity-90`}
                          >
                            {step.id === 1 ? 'Start Import' : 
                             step.id === 2 ? 'View Analytics' : 'Open Dashboard'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Arrow connector for larger screens */}
                  {index < workflowSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Access Buttons */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Access</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/data-entry')}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Upload className="h-4 w-4 mr-1" />
                Import Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/data-management')}
                className="text-gray-600 border-gray-200 hover:bg-gray-50"
              >
                Manage Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/analytics')}
                className="text-green-600 border-green-200 hover:bg-green-50"
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                Analytics
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowGuide;
