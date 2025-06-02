
import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import LevelOverviewHeader from './manager/LevelOverviewHeader';
import KPICards from './manager/KPICards';
import CoverageMetrics from './manager/CoverageMetrics';
import SupplyChainInsights from './manager/SupplyChainInsights';
import StrategicActions from './manager/StrategicActions';
import PerformanceTrends from './manager/PerformanceTrends';

const FacilityManagerDashboard = () => {
  const { userRole } = usePermissions();
  
  // Mock data based on user level
  const getDashboardData = () => {
    switch (userRole) {
      case 'national':
        return {
          totalFacilities: 1250,
          activeFacilities: 1180,
          avgAvailabilityRate: 89.5,
          criticalStockOuts: 45,
          totalBudget: 12500000,
          budgetUtilized: 8750000,
          performanceScore: 87,
          levelName: 'National Level',
          coverageArea: 'All Regions',
          keyMetrics: {
            regions: 11,
            zones: 68,
            facilities: 1250,
            population: 115000000
          }
        };
      case 'regional':
        return {
          totalFacilities: 180,
          activeFacilities: 172,
          avgAvailabilityRate: 91.2,
          criticalStockOuts: 8,
          totalBudget: 1800000,
          budgetUtilized: 1260000,
          performanceScore: 91,
          levelName: 'Regional Level',
          coverageArea: 'Oromia Region',
          keyMetrics: {
            zones: 12,
            facilities: 180,
            population: 12500000,
            districts: 45
          }
        };
      case 'zonal':
        return {
          totalFacilities: 35,
          activeFacilities: 34,
          avgAvailabilityRate: 92.8,
          criticalStockOuts: 2,
          totalBudget: 350000,
          budgetUtilized: 245000,
          performanceScore: 93,
          levelName: 'Zonal Level',
          coverageArea: 'West Arsi Zone',
          keyMetrics: {
            facilities: 35,
            population: 2100000,
            districts: 8,
            healthPosts: 120
          }
        };
      default:
        return {
          totalFacilities: 1,
          activeFacilities: 1,
          avgAvailabilityRate: 94.5,
          criticalStockOuts: 0,
          totalBudget: 75000,
          budgetUtilized: 52000,
          performanceScore: 95,
          levelName: 'Facility Level',
          coverageArea: 'Central Medical Store',
          keyMetrics: {
            staff: 25,
            products: 450,
            population: 85000,
            departments: 8
          }
        };
    }
  };

  const data = getDashboardData();
  const budgetUtilization = ((data.budgetUtilized / data.totalBudget) * 100).toFixed(1);
  const facilityPerformance = ((data.activeFacilities / data.totalFacilities) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <LevelOverviewHeader 
        levelName={data.levelName}
        coverageArea={data.coverageArea}
        performanceScore={data.performanceScore}
      />

      <KPICards 
        facilityPerformance={facilityPerformance}
        activeFacilities={data.activeFacilities}
        totalFacilities={data.totalFacilities}
        avgAvailabilityRate={data.avgAvailabilityRate}
        criticalStockOuts={data.criticalStockOuts}
        budgetUtilization={budgetUtilization}
        budgetUtilized={data.budgetUtilized}
      />

      <CoverageMetrics keyMetrics={data.keyMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SupplyChainInsights userRole={userRole} />
        <StrategicActions criticalStockOuts={data.criticalStockOuts} />
      </div>

      <PerformanceTrends avgAvailabilityRate={data.avgAvailabilityRate} />
    </div>
  );
};

export default FacilityManagerDashboard;
