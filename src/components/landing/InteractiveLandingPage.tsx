
import React, { useState } from 'react';
import TopNavigation from './TopNavigation';
import InteractiveMap from './InteractiveMap';
import MiniDashboard from './MiniDashboard';
import ReportButton from './ReportButton';
import MapFilters from './MapFilters';
import FacilityInfoModal from './FacilityInfoModal';

export interface Facility {
  id: string;
  name: string;
  type: 'health_center' | 'hospital' | 'pharmacy' | 'regional_store' | 'zonal_store';
  status: 'in_stock' | 'stockout' | 'partial';
  latitude: number;
  longitude: number;
  region: string;
  zone: string;
  wereda: string;
  lastReported: string;
  stockAvailability: number; // percentage
  reportingCompleteness: number; // percentage
  tracerItems: {
    available: number;
    total: number;
  };
}

const InteractiveLandingPage = () => {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [filters, setFilters] = useState({
    facilityType: 'all',
    region: 'all',
    zone: 'all',
    product: 'all'
  });

  const handleFacilityClick = (facility: Facility) => {
    setSelectedFacility(facility);
  };

  const handleCloseModal = () => {
    setSelectedFacility(null);
  };

  return (
    <div className="h-screen bg-gray-50 overflow-hidden relative">
      {/* Top Navigation */}
      <TopNavigation />
      
      {/* Mini Dashboard Overlay */}
      <MiniDashboard />
      
      {/* Map Filters */}
      <MapFilters 
        filters={filters} 
        onFiltersChange={setFilters} 
      />
      
      {/* Interactive Map - Full Width */}
      <div className="absolute inset-0 pt-16">
        <InteractiveMap 
          filters={filters}
          onFacilityClick={handleFacilityClick}
        />
      </div>
      
      {/* Floating Report Button */}
      <ReportButton />
      
      {/* Facility Info Modal */}
      {selectedFacility && (
        <FacilityInfoModal 
          facility={selectedFacility}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default InteractiveLandingPage;
