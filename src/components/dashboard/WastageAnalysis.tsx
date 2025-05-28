
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { mockPharmaceuticalData } from '@/data/pharmaceuticalData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const WastageAnalysis = () => {
  // Mock wastage data (since current data shows 0% wastage)
  const wastageData = [
    { product: 'Amoxicillin + Clavulanic Acid', expiry: 0, damage: 0, total: 0, value: 0 },
    { product: 'Paracetamol 500mg', expiry: 25, damage: 5, total: 30, value: 150 },
    { product: 'Ibuprofen 400mg', expiry: 15, damage: 8, total: 23, value: 230 },
    { product: 'Omeprazole 20mg', expiry: 40, damage: 10, total: 50, value: 500 },
    { product: 'Metformin 500mg', expiry: 12, damage: 3, total: 15, value: 75 }
  ];

  const wastageReasons = [
    { name: 'Expiry', value: 92, color: '#FF8042' },
    { name: 'Damage', value: 26, color: '#00C49F' },
    { name: 'Contamination', value: 8, color: '#FFBB28' },
    { name: 'Recalled', value: 4, color: '#8884D8' }
  ];

  const monthlyWastage = [
    { month: 'Jan', wastage: 1200, value: 4500, percentage: 2.1 },
    { month: 'Feb', wastage: 950, value: 3200, percentage: 1.8 },
    { month: 'Mar', wastage: 1450, value: 5800, percentage: 2.5 },
    { month: 'Apr', wastage: 800, value: 2900, percentage: 1.4 },
    { month: 'May', wastage: 1100, value: 4100, percentage: 1.9 },
    { month: 'Jun', wastage: 1350, value: 5200, percentage: 2.3 }
  ];

  const totalWastageValue = wastageData.reduce((sum, item) => sum + item.value, 0);
  const totalWastageUnits = wastageData.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wastage Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalWastageValue}</div>
            <p className="text-xs text-muted-foreground">Current quarter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wastage Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">2.1%</div>
            <p className="text-xs text-muted-foreground">Of total inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Units Wasted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalWastageUnits}</div>
            <p className="text-xs text-muted-foreground">Total units lost</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">High</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Wastage by Reason</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={wastageReasons}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {wastageReasons.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Wastage Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyWastage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="wastage" fill="#FF8042" name="Wasted Units" />
                <Bar yAxisId="right" dataKey="percentage" fill="#8884D8" name="Wastage %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Wastage Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product-wise Wastage Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Product</th>
                  <th className="text-center p-3">Expired</th>
                  <th className="text-center p-3">Damaged</th>
                  <th className="text-center p-3">Total Wasted</th>
                  <th className="text-center p-3">Value Lost</th>
                  <th className="text-center p-3">Action Required</th>
                </tr>
              </thead>
              <tbody>
                {wastageData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{item.product}</td>
                    <td className="text-center p-3">{item.expiry}</td>
                    <td className="text-center p-3">{item.damage}</td>
                    <td className="text-center p-3 font-bold">{item.total}</td>
                    <td className="text-center p-3 text-red-600 font-bold">${item.value}</td>
                    <td className="text-center p-3">
                      {item.total > 30 ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">High Priority</span>
                      ) : item.total > 10 ? (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">Monitor</span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Good</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Wastage Reduction Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4 text-red-700">Immediate Actions</h3>
              <div className="space-y-3">
                <div className="p-3 border-l-4 border-red-500 bg-red-50">
                  <h4 className="font-medium">FIFO Implementation</h4>
                  <p className="text-sm text-gray-600">Implement First-In-First-Out system to reduce expiry wastage</p>
                </div>
                <div className="p-3 border-l-4 border-orange-500 bg-orange-50">
                  <h4 className="font-medium">Storage Conditions</h4>
                  <p className="text-sm text-gray-600">Review and improve storage conditions to prevent damage</p>
                </div>
                <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
                  <h4 className="font-medium">Expiry Monitoring</h4>
                  <p className="text-sm text-gray-600">Set up automated alerts for products nearing expiry</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-blue-700">Long-term Improvements</h3>
              <div className="space-y-3">
                <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                  <h4 className="font-medium">Demand Forecasting</h4>
                  <p className="text-sm text-gray-600">Improve forecasting to order optimal quantities</p>
                </div>
                <div className="p-3 border-l-4 border-green-500 bg-green-50">
                  <h4 className="font-medium">Supplier Coordination</h4>
                  <p className="text-sm text-gray-600">Work with suppliers on smaller, more frequent deliveries</p>
                </div>
                <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
                  <h4 className="font-medium">Staff Training</h4>
                  <p className="text-sm text-gray-600">Train staff on proper handling and storage procedures</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
