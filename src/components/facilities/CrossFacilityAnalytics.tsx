
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useHealthFacilities } from '@/hooks/useHealthFacilities';
import { FacilityDataIntegration, CrossFacilityAnalytics as CrossAnalytics } from '@/utils/facilityDataIntegration';
import { Building, TrendingUp, AlertTriangle, Award, Target, Lightbulb } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export const CrossFacilityAnalytics = () => {
  const { data: facilities } = useHealthFacilities();

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['cross-facility-analytics'],
    queryFn: () => facilities ? FacilityDataIntegration.getCrossFacilityAnalytics(facilities) : null,
    enabled: !!facilities,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: optimization } = useQuery({
    queryKey: ['supply-chain-optimization'],
    queryFn: () => facilities ? FacilityDataIntegration.getSupplyChainOptimization(facilities) : null,
    enabled: !!facilities,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">Loading cross-facility analytics...</p>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">No facility data available</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = analytics.facilityComparisons.map(facility => ({
    name: facility.facilityName.length > 20 ? 
      facility.facilityName.substring(0, 17) + '...' : 
      facility.facilityName,
    performance: facility.performanceScore,
    stockOutRate: facility.stockOutRate,
    wastageRate: facility.wastageRate,
    products: facility.totalProducts
  }));

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facilities</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalFacilities}</div>
            <p className="text-xs text-muted-foreground">
              Active health facilities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.aggregatedMetrics.systemPerformanceScore.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average performance score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Stock Out Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.aggregatedMetrics.overallStockOutRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Weighted across all facilities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.aggregatedMetrics.totalProducts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all facilities
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="top-performers">Top Performers</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Facility</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="performance" fill="#3b82f6" name="Performance Score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stock Out vs Wastage Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="stockOutRate" stroke="#ef4444" name="Stock Out %" />
                    <Line type="monotone" dataKey="wastageRate" stroke="#f59e0b" name="Wastage %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Facility Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.facilityComparisons
                  .sort((a, b) => b.performanceScore - a.performanceScore)
                  .map((facility) => (
                  <div key={facility.facilityId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{facility.facilityName}</h4>
                      <p className="text-sm text-gray-600">
                        {facility.totalProducts} products • {facility.totalConsumption.toLocaleString()} units consumed
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm font-medium">{facility.performanceScore.toFixed(1)}%</p>
                        <p className="text-xs text-gray-600">Performance</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{facility.stockOutRate.toFixed(1)}%</p>
                        <p className="text-xs text-gray-600">Stock Outs</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{facility.wastageRate.toFixed(1)}%</p>
                        <p className="text-xs text-gray-600">Wastage</p>
                      </div>
                      <Badge variant={facility.performanceScore >= 80 ? 'default' : facility.performanceScore >= 60 ? 'secondary' : 'destructive'}>
                        {facility.performanceScore >= 80 ? 'Excellent' : facility.performanceScore >= 60 ? 'Good' : 'Needs Attention'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top-performers">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-green-600" />
                  Top Performing Facilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topPerformingFacilities.map((facility, index) => (
                    <div key={facility.facilityId} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mr-3">
                          <span className="text-sm font-bold text-green-800">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{facility.facilityName}</p>
                          <p className="text-sm text-gray-600">{facility.totalProducts} products</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{facility.performanceScore.toFixed(1)}%</p>
                        <p className="text-xs text-gray-600">Performance</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  Facilities Needing Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.facilitiesNeedingAttention.length > 0 ? (
                    analytics.facilitiesNeedingAttention.map((facility) => (
                      <div key={facility.facilityId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-medium">{facility.facilityName}</p>
                          <p className="text-sm text-gray-600">
                            {facility.stockOutRate.toFixed(1)}% stock outs • {facility.wastageRate.toFixed(1)}% wastage
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">{facility.performanceScore.toFixed(1)}%</p>
                          <p className="text-xs text-gray-600">Performance</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-600 py-4">
                      All facilities are performing well! 🎉
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization">
          {optimization && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                    Supply Chain Optimization Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">By Facility Level</h4>
                      <div className="space-y-3">
                        {Object.entries(optimization.byLevel).map(([level, data]) => (
                          <div key={level} className="border rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium capitalize">{level} Level</h5>
                              <Badge variant="outline">{data.facilities} facilities</Badge>
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {data.recommendations.slice(0, 3).map((rec, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="text-blue-500 mr-2">•</span>
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">By Region</h4>
                      <div className="space-y-3">
                        {Object.entries(optimization.byRegion).slice(0, 5).map(([region, data]) => (
                          <div key={region} className="border rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium">{region}</h5>
                              <Badge variant="outline">{data.facilities} facilities</Badge>
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {data.recommendations.slice(0, 2).map((rec, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="text-green-500 mr-2">•</span>
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">System-Wide Recommendations</h4>
                    <ul className="text-sm space-y-1">
                      {optimization.systemWide.map((rec, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
