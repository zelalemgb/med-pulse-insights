
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  BarChart3,
  TrendingUp,
  Package,
  AlertTriangle
} from 'lucide-react';

const ReportGenerator = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    {
      id: 'consumption',
      name: 'Consumption Report',
      description: 'Monthly/quarterly consumption analysis',
      icon: BarChart3,
      category: 'Analytics'
    },
    {
      id: 'inventory',
      name: 'Inventory Status Report',
      description: 'Current stock levels and status',
      icon: Package,
      category: 'Inventory'
    },
    {
      id: 'wastage',
      name: 'Wastage Analysis',
      description: 'Expired and damaged products analysis',
      icon: AlertTriangle,
      category: 'Quality'
    },
    {
      id: 'forecast',
      name: 'Demand Forecast',
      description: 'Predictive analysis for procurement',
      icon: TrendingUp,
      category: 'Planning'
    },
    {
      id: 'compliance',
      name: 'Compliance Report',
      description: 'Regulatory compliance status',
      icon: FileText,
      category: 'Compliance'
    }
  ];

  const periods = [
    { value: 'current-month', label: 'Current Month' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'current-quarter', label: 'Current Quarter' },
    { value: 'last-quarter', label: 'Last Quarter' },
    { value: 'current-year', label: 'Current Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleGenerateReport = async () => {
    if (!selectedReport || !selectedPeriod) return;
    
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      // In real implementation, this would trigger the actual report generation
      console.log(`Generating ${selectedReport} report for ${selectedPeriod}`);
    }, 2000);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Analytics': 'bg-blue-100 text-blue-800',
      'Inventory': 'bg-green-100 text-green-800',
      'Quality': 'bg-amber-100 text-amber-800',
      'Planning': 'bg-purple-100 text-purple-800',
      'Compliance': 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report Selection */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Report Type</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {reportTypes.map((report) => {
                    const IconComponent = report.icon;
                    return (
                      <div
                        key={report.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedReport === report.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedReport(report.id)}
                      >
                        <div className="flex items-start gap-3">
                          <IconComponent className="h-5 w-5 mt-0.5 text-gray-600" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-sm">{report.name}</h3>
                              <Badge className={`text-xs ${getCategoryColor(report.category)}`}>
                                {report.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">{report.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Time Period</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Report Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span>{selectedReport ? reportTypes.find(r => r.id === selectedReport)?.name : 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Period:</span>
                    <span>{selectedPeriod ? periods.find(p => p.value === selectedPeriod)?.label : 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Format:</span>
                    <span>PDF, Excel</span>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={handleGenerateReport}
                disabled={!selectedReport || !selectedPeriod || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>

              <div className="text-xs text-gray-500 text-center">
                Reports are generated in PDF and Excel formats
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Monthly Consumption Report', date: '2024-01-15', type: 'consumption', size: '2.4 MB' },
              { name: 'Inventory Status Report', date: '2024-01-14', type: 'inventory', size: '1.8 MB' },
              { name: 'Wastage Analysis Q4', date: '2024-01-10', type: 'wastage', size: '3.1 MB' },
              { name: 'Compliance Report', date: '2024-01-08', type: 'compliance', size: '1.2 MB' }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    <h4 className="font-medium text-sm">{report.name}</h4>
                    <p className="text-xs text-gray-500">Generated on {report.date} • {report.size}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGenerator;
