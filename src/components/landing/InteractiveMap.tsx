
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Facility } from './types';
import MapFilters from './MapFilters';
import MapMarkers from './MapMarkers';
import { mockFacilities } from './mockData';
import { useGeolocation } from './useGeolocation';
import { setupGlobalPopupFunctions, cleanupGlobalPopupFunctions } from './mapUtils';

interface InteractiveMapProps {
  onFacilitySelect: (facility: Facility) => void;
  onReportIssue: () => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ onFacilitySelect, onReportIssue }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersGroup = useRef<L.LayerGroup | null>(null);
  const { userLocation } = useGeolocation();
  const [filters, setFilters] = useState({
    facilityType: 'all',
    region: 'all',
    zone: 'all',
    product: 'all'
  });

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !userLocation) return;

    console.log('Initializing map at location:', userLocation);

    // Initialize map with zoom level 16 for ~1km radius view
    map.current = L.map(mapContainer.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(userLocation, 16);

    // Add tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map.current);

    // Add zoom control to bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map.current);

    // Initialize markers group
    markersGroup.current = L.layerGroup().addTo(map.current);

    // Setup global functions for popup interactions
    setupGlobalPopupFunctions(onFacilitySelect, map, mockFacilities);

    return () => {
      cleanupGlobalPopupFunctions();
      
      if (map.current) {
        map.current.remove();
      }
    };
  }, [userLocation, onFacilitySelect]);

  // Filter facilities based on current filters
  const filteredFacilities = mockFacilities.filter(facility => {
    if (filters.facilityType !== 'all' && facility.type !== filters.facilityType) return false;
    if (filters.region !== 'all' && facility.region !== filters.region) return false;
    if (filters.zone !== 'all' && facility.zone !== filters.zone) return false;
    return true;
  });

  if (!userLocation) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div ref={mapContainer} className="w-full h-full z-0" />
      
      {/* Map Markers Component */}
      <MapMarkers
        map={map}
        markersGroup={markersGroup}
        userLocation={userLocation}
        facilities={filteredFacilities}
        onFacilitySelect={onFacilitySelect}
      />
      
      {/* Map Filters */}
      <MapFilters
        filters={filters}
        onFiltersChange={setFilters}
      />
      
      {/* Floating Report Button - positioned to be always visible */}
      <div className="fixed bottom-6 right-6 z-[1000]">
        <button
          onClick={onReportIssue}
          className="bg-red-600 hover:bg-red-700 text-white shadow-2xl rounded-full w-14 h-14 sm:w-16 sm:h-16 p-0 transition-all duration-200 hover:scale-110 border-3 border-white flex items-center justify-center group"
          title="Report drug issue"
        >
          <span className="text-2xl sm:text-3xl font-bold">+</span>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Report drug issue
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
          </div>
        </button>
      </div>

      {/* Custom styles for popup */}
      <style>
        {`
          .facility-popup .leaflet-popup-content-wrapper {
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
          }
          .facility-popup .leaflet-popup-content {
            margin: 0;
            padding: 0;
          }
          .facility-popup .leaflet-popup-tip {
            border-top-color: #e5e7eb;
          }
        `}
      </style>
    </div>
  );
};

export default InteractiveMap;
