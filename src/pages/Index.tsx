
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Pharmaceutical Usage Dashboard
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Monitor consumption patterns, forecast demand, and optimize inventory management for health facilities
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📊 Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Track consumption patterns and seasonal trends across all pharmaceutical products
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🔮 Forecasting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Predict future demand and optimize procurement planning with AI-driven insights
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📦 Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Monitor stock levels, prevent wastage, and ensure continuous availability
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Button 
          onClick={() => navigate('/dashboard')} 
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
        >
          Launch Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Index;
