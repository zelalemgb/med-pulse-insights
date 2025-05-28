
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Database, FileSpreadsheet, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pharmaceutical Supply Chain Analytics
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Analyze pharmaceutical consumption patterns, forecast demand, and optimize inventory management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Import Data
              </CardTitle>
              <CardDescription>
                Upload Excel files with pharmaceutical data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/import">
                <Button className="w-full">
                  Start Import
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                Data Entry
              </CardTitle>
              <CardDescription>
                Enter quarterly pharmaceutical usage data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/data-entry">
                <Button className="w-full">
                  Enter Data
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Dashboard
              </CardTitle>
              <CardDescription>
                View analytics and consumption insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/dashboard">
                <Button className="w-full">
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-orange-600" />
                Data Management
              </CardTitle>
              <CardDescription>
                Manage and export pharmaceutical data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">
                Comprehensive consumption analysis and forecasting
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileSpreadsheet className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Easy Data Entry</h3>
              <p className="text-gray-600">
                Intuitive interface for quarterly data management
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Smart Calculations</h3>
              <p className="text-gray-600">
                Automated metrics and inventory optimization
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
