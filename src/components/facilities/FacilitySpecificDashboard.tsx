
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useHealthFacilities } from '@/hooks/useHealthFacilities';
import { FacilityDataIntegration, FacilityAnalytics } from '@/utils/facilityDataIntegration';
import { Building, TrendingUp, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface FacilitySpecificDashboardProps {
  facilityId: string;
}

export const FacilitySpecificDashboard = ({ facilityId }: FacilitySpecificDashboardProps) => {
  const { data: facilities } = useHealthFacilities();
  const facility = facilities?.find(f => f.id === facilityId);

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['facility-analytics', facilityId],
    queryFn: () => facility ? FacilityDataIntegration.getFacilityAnalytics(facilityId, facility) : null,
    enabled: !!facility,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (!facility) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">Facility not found</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">Loading facility analytics...</p>
        </CardContent>
      </Card>
    );
  }

  const getPerformanceBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-500">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-500">Good</Badge>;
    return <Badge variant="destructive">Needs Attention</Badge>;
  };

  const getStatusIcon = (rate: number, threshold: number) => {
    if (rate <= threshold) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (rate <= threshold * 1.5) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Facility Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                {facility.name}
              </CardTitle>
              <p className="text-gray-600 mt-2">
                {facility.facility_type} • {facility.level} • {facility.region}, {facility.zone}
              </p>
            </div>
            <div className="text-right">
              {analytics && getPerformanceBadge(analytics.performanceScore)}
              <p className="text-sm text-gray-600 mt-1">
                Performance Score: {analytics?.performanceScore.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active pharmaceutical products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Consumption</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.totalConsumption.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total units consumed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Out Rate</CardTitle>
            {analytics && getStatusIcon(analytics.stockOutRate, 10)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.stockOutRate.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Products experiencing stock outs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wastage Rate</CardTitle>
            {analytics && getStatusIcon(analytics.wastageRate, 5)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.wastageRate.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average wastage across products
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Facility Details */}
      <Card>
        <CardHeader>
          <CardTitle>Facility Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium">Facility Code</p>
              <p className="text-gray-600">{facility.code || 'Not assigned'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Operational Status</p>
              <Badge variant={facility.operational_status === 'active' ? 'default' : 'secondary'}>
                {facility.operational_status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Capacity</p>
              <p className="text-gray-600">{facility.capacity || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Staff Count</p>
              <p className="text-gray-600">{facility.staff_count || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Catchment Area</p>
              <p className="text-gray-600">{facility.catchment_area || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-gray-600">
                {analytics?.lastUpdated.toLocaleDateString() || 'Never'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Offered */}
      {facility.services_offered && facility.services_offered.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Services Offered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {facility.services_offered.map((service, index) => (
                <Badge key={index} variant="outline">
                  {service}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
