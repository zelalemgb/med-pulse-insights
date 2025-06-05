
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataEntryWizard } from './DataEntryWizard';
import { 
  Plus, 
  Upload, 
  Calendar, 
  CheckCircle, 
  Clock, 
  BarChart3,
  FileText,
  TrendingUp
} from 'lucide-react';

export const DataEntryPage = () => {
  const [wizardOpen, setWizardOpen] = useState(false);

  const handleWizardComplete = (data: any) => {
    console.log('Wizard completed with data:', data);
    // Handle the completed data submission
  };

  // Mock data for recent submissions
  const recentSubmissions = [
    { id: 1, period: 'Q1 2024', products: 12, status: 'completed', date: '2024-01-15' },
    { id: 2, period: 'Q4 2023', products: 15, status: 'completed', date: '2023-10-15' },
    { id: 3, period: 'Q3 2023', products: 11, status: 'completed', date: '2023-07-15' },
  ];

  const upcomingDeadlines = [
    { period: 'Q2 2024', deadline: '2024-04-15', daysLeft: 5 },
    { period: 'Annual Report 2023', deadline: '2024-03-31', daysLeft: 15 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Data Entry</h1>
          <p className="text-gray-600">Enter pharmaceutical consumption and stock data</p>
        </div>
        <Button onClick={() => setWizardOpen(true)} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          New Data Entry
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setWizardOpen(true)}>
          <CardContent className="p-6 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h3 className="font-semibold text-lg mb-2">Guided Entry Wizard</h3>
            <p className="text-gray-600 mb-4">Step-by-step pharmaceutical data entry</p>
            <Badge className="bg-blue-100 text-blue-800">Recommended</Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h3 className="font-semibold text-lg mb-2">Quick Upload</h3>
            <p className="text-gray-600 mb-4">Upload Excel or CSV files directly</p>
            <Badge variant="outline">Fast</Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-purple-600" />
            <h3 className="font-semibold text-lg mb-2">View Analytics</h3>
            <p className="text-gray-600 mb-4">Review submitted data and trends</p>
            <Badge variant="secondary">Insights</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Recent Submissions
            </CardTitle>
            <CardDescription>
              Your latest pharmaceutical data submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSubmissions.map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{submission.period}</p>
                    <p className="text-sm text-gray-600">{submission.products} products • {submission.date}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              Upcoming Deadlines
            </CardTitle>
            <CardDescription>
              Reports and submissions due soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-amber-50 rounded border border-amber-200">
                  <div>
                    <p className="font-medium">{deadline.period}</p>
                    <p className="text-sm text-gray-600">Due: {deadline.deadline}</p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">
                    {deadline.daysLeft} days left
                  </Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-3">
                <Calendar className="w-4 h-4 mr-2" />
                View All Deadlines
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Data Entry Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">What data should I enter?</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Beginning balance at start of period</li>
                <li>• Quantities received during period</li>
                <li>• Quantities issued to patients</li>
                <li>• Stock-out days (when medicine unavailable)</li>
                <li>• Expired or damaged quantities</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Data entry tips:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use the guided wizard for first-time entry</li>
                <li>• Upload files for bulk data import</li>
                <li>• Double-check calculations before submitting</li>
                <li>• Contact support if you need help</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Entry Wizard */}
      <DataEntryWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        onComplete={handleWizardComplete}
      />
    </div>
  );
};
