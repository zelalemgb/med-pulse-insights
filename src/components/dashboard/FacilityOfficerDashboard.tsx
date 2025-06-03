
import React from 'react';
import KeyMetricsCards from './facility/KeyMetricsCards';
import AdditionalMetricsCards from './facility/AdditionalMetricsCards';
import SupplyChainPerformanceCard from './facility/SupplyChainPerformanceCard';
import CriticalActionsCard from './facility/CriticalActionsCard';
import ProductCategoriesCard from './facility/ProductCategoriesCard';
import RecentActivityCard from './facility/RecentActivityCard';

const FacilityOfficerDashboard = () => {
  // Mock data - would come from API based on facility
  const facilityMetrics = {
    totalProducts: 245,
    availableProducts: 221,
    stockOutProducts: 12,
    lowStockProducts: 24,
    criticalProducts: 8,
    averageStockLevel: 68,
    stockOutRate: 4.9,
    averageLeadTime: 14,
    orderFulfillmentRate: 92,
    wastePercentage: 2.3,
    avgDaysOfStock: 45,
    forecastAccuracy: 87.5,
    reportingRate: 92
  };

  return (
    <div className="space-y-6">
      {/* Key Supply Chain Metrics */}
      <KeyMetricsCards facilityMetrics={facilityMetrics} />

      {/* Additional Metrics Row */}
      <AdditionalMetricsCards facilityMetrics={facilityMetrics} />

      {/* Supply Chain Performance Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SupplyChainPerformanceCard facilityMetrics={facilityMetrics} />
        <CriticalActionsCard facilityMetrics={facilityMetrics} />
      </div>

      {/* Product Categories Overview */}
      <ProductCategoriesCard />

      {/* Recent Supply Chain Events */}
      <RecentActivityCard />
    </div>
  );
};

export default FacilityOfficerDashboard;
