
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Calendar, TrendingUp, FileText, Users, Download, Settings, Eye } from 'lucide-react';

export const ActivitySection = () => {
  const recentActivities = [
    {
      id: 1,
      type: 'login',
      description: 'Logged into the system',
      timestamp: '2024-01-20 09:15:30',
      icon: Activity,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 2,
      type: 'import',
      description: 'Imported pharmaceutical data file',
      timestamp: '2024-01-20 08:45:22',
      details: 'inventory_data_jan.xlsx',
      icon: FileText,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 3,
      type: 'forecast',
      description: 'Generated demand forecast report',
      timestamp: '2024-01-19 16:30:15',
      details: 'Q1 2024 Forecast',
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 4,
      type: 'analytics',
      description: 'Viewed analytics dashboard',
      timestamp: '2024-01-19 14:22:10',
      icon: Eye,
      color: 'text-orange-600 bg-orange-100'
    },
    {
      id: 5,
      type: 'export',
      description: 'Downloaded consumption report',
      timestamp: '2024-01-19 11:18:45',
      details: 'monthly_consumption.pdf',
      icon: Download,
      color: 'text-indigo-600 bg-indigo-100'
    },
    {
      id: 6,
      type: 'settings',
      description: 'Updated notification preferences',
      timestamp: '2024-01-18 15:30:00',
      icon: Settings,
      color: 'text-gray-600 bg-gray-100'
    },
    {
      id: 7,
      type: 'collaboration',
      description: 'Shared report with team member',
      timestamp: '2024-01-18 13:15:30',
      details: 'john.doe@pharma.com',
      icon: Users,
      color: 'text-cyan-600 bg-cyan-100'
    }
  ];

  const activityStats = [
    { label: 'Total Sessions', value: '124', period: 'This month' },
    { label: 'Data Imports', value: '8', period: 'This week' },
    { label: 'Reports Generated', value: '15', period: 'This month' },
    { label: 'Avg Session Time', value: '45m', period: 'Daily average' }
  ];

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'login': return 'Login';
      case 'import': return 'Data Import';
      case 'forecast': return 'Forecasting';
      case 'analytics': return 'Analytics';
      case 'export': return 'Export';
      case 'settings': return 'Settings';
      case 'collaboration': return 'Collaboration';
      default: return 'Activity';
    }
  };

  return (
    <div className="space-y-6">
      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {activityStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm font-medium text-gray-900">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.period}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`p-2 rounded-lg ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {getActivityTypeLabel(activity.type)}
                    </Badge>
                  </div>
                  
                  {activity.details && (
                    <p className="text-sm text-gray-600 mb-1">
                      {activity.details}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatTimestamp(activity.timestamp)}
                    </span>
                    <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All Activity
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Calendar/Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Activity calendar visualization would go here</p>
            <p className="text-sm">Shows daily activity levels over time</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
