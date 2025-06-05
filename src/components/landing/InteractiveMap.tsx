
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Facility } from './types';
import MapFilters from './MapFilters';
import ReportButton from './ReportButton';

// Mock data for demonstration
const mockFacilities: Facility[] = [
  {
    id: '1',
    name: 'Addis Ababa Health Center',
    type: 'health_center',
    status: 'in_stock',
    latitude: 9.0307,
    longitude: 38.7407,
    region: 'Addis Ababa',
    zone: 'Addis Ababa',
    wereda: 'Arada',
    lastReported: '2025-06-03',
    stockAvailability: 85,
    reportingCompleteness: 92,
    tracerItems: { available: 13, total: 15 }
  },
  {
    id: '2',
    name: 'Black Lion Hospital',
    type: 'hospital',
    status: 'partial',
    latitude: 9.0347,
    longitude: 38.7507,
    region: 'Addis Ababa',
    zone: 'Addis Ababa',
    wereda: 'Gulele',
    lastReported: '2025-06-04',
    stockAvailability: 65,
    reportingCompleteness: 88,
    tracerItems: { available: 10, total: 15 }
  },
  {
    id: '3',
    name: 'Merkato Pharmacy',
    type: 'pharmacy',
    status: 'stockout',
    latitude: 9.0147,
    longitude: 38.7247,
    region: 'Addis Ababa',
    zone: 'Addis Ababa',
    wereda: 'Addis Ketema',
    lastReported: '2025-06-02',
    stockAvailability: 45,
    reportingCompleteness: 75,
    tracerItems: { available: 7, total: 15 }
  },
  {
    id: '4',
    name: 'Regional Medical Store',
    type: 'regional_store',
    status: 'in_stock',
    latitude: 9.0427,
    longitude: 38.7607,
    region: 'Addis Ababa',
    zone: 'Addis Ababa',
    wereda: 'Bole',
    lastReported: '2025-06-04',
    stockAvailability: 95,
    reportingCompleteness: 98,
    tracerItems: { available: 15, total: 15 }
  }
];

interface InteractiveMapProps {
  onFacilitySelect: (facility: Facility) => void;
  onReportIssue: () => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ onFacilitySelect, onReportIssue }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersGroup = useRef<L.LayerGroup | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [filters, setFilters] = useState({
    facilityType: 'all',
    region: 'all',
    zone: 'all',
    product: 'all'
  });

  // Default fallback location (Addis Ababa)
  const defaultLocation: [number, number] = [9.0307, 38.7407];

  // Facility icon configurations
  const getFacilityIcon = (facility: Facility) => {
    let color = '#10b981'; // Green default
    let iconSymbol = '●';
    
    // Color based on status
    switch (facility.status) {
      case 'stockout':
        color = '#ef4444'; // Red
        break;
      case 'partial':
        color = '#f59e0b'; // Yellow
        break;
      case 'in_stock':
        color = '#10b981'; // Green
        break;
    }
    
    // Symbol based on type
    switch (facility.type) {
      case 'hospital':
        color = '#3b82f6'; // Blue for hospitals
        iconSymbol = '🏥';
        break;
      case 'pharmacy':
        iconSymbol = '💊';
        break;
      case 'regional_store':
      case 'zonal_store':
        color = '#8b5cf6'; // Purple
        iconSymbol = '📦';
        break;
      default:
        iconSymbol = '🏥';
    }

    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2); font-size: 12px;">${iconSymbol}</div>`,
      className: 'custom-facility-marker',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  };

  // Create facility popup content
  const createFacilityPopup = (facility: Facility) => {
    const statusColor = facility.status === 'in_stock' ? '#10b981' : 
                       facility.status === 'partial' ? '#f59e0b' : '#ef4444';
    
    const statusText = facility.status === 'in_stock' ? 'In Stock' :
                      facility.status === 'partial' ? 'Partial Stock' : 'Stock Out';

    return `
      <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 250px; max-width: 300px; border-radius: 8px; overflow: hidden;">
        <div style="border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 12px;">
          <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">${facility.name}</h3>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280; text-transform: capitalize;">${facility.type.replace('_', ' ')}</p>
        </div>
        
        <div style="margin-bottom: 12px;">
          <div style="display: flex; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 12px; font-weight: 500; color: #374151; margin-right: 8px;">Status:</span>
            <span style="background-color: ${statusColor}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">${statusText}</span>
          </div>
          
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">
            <strong>Location:</strong> ${facility.wereda}, ${facility.zone}
          </div>
          
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">
            <strong>Stock Availability:</strong> ${facility.stockAvailability}%
          </div>
          
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">
            <strong>Tracer Items:</strong> ${facility.tracerItems.available}/${facility.tracerItems.total} available
          </div>
          
          <div style="font-size: 12px; color: #6b7280;">
            <strong>Last Reported:</strong> ${new Date(facility.lastReported).toLocaleDateString()}
          </div>
        </div>
        
        <div style="display: flex; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
          <button 
            onclick="window.selectFacility('${facility.id}')"
            style="flex: 1; background-color: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; transition: background-color 0.2s;"
            onmouseover="this.style.backgroundColor='#2563eb'"
            onmouseout="this.style.backgroundColor='#3b82f6'"
          >
            View Details
          </button>
          <button 
            onclick="window.hidePopup()"
            style="background-color: #6b7280; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; transition: background-color 0.2s;"
            onmouseover="this.style.backgroundColor='#4b5563'"
            onmouseout="this.style.backgroundColor='#6b7280'"
          >
            Hide
          </button>
        </div>
      </div>
    `;
  };

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          console.log('User location obtained:', latitude, longitude);
        },
        (error) => {
          console.log('Geolocation error:', error.message);
          console.log('Using default location (Addis Ababa)');
          setUserLocation(defaultLocation);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 300000 // Cache for 5 minutes
        }
      );
    } else {
      console.log('Geolocation not supported, using default location');
      setUserLocation(defaultLocation);
    }
  }, []);

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

    // Add user location marker
    const userLocationIcon = L.divIcon({
      html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3); position: relative;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 4px; height: 4px; background-color: white; border-radius: 50%;"></div>
      </div>`,
      className: 'user-location-marker',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    L.marker(userLocation, { icon: userLocationIcon })
      .addTo(markersGroup.current)
      .bindPopup('<div style="font-size: 12px; padding: 4px; font-weight: bold;">Your Location</div>');

    // Add global functions for popup interactions
    (window as any).selectFacility = (facilityId: string) => {
      const facility = mockFacilities.find(f => f.id === facilityId);
      if (facility) {
        onFacilitySelect(facility);
      }
      map.current?.closePopup();
    };

    (window as any).hidePopup = () => {
      map.current?.closePopup();
    };

    return () => {
      // Clean up global functions
      delete (window as any).selectFacility;
      delete (window as any).hidePopup;
      
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

  useEffect(() => {
    if (!map.current || !markersGroup.current) return;

    // Clear existing facility markers (keep user location)
    markersGroup.current.eachLayer((layer) => {
      if (layer instanceof L.Marker && !layer.getElement()?.classList.contains('user-location-marker')) {
        markersGroup.current?.removeLayer(layer);
      }
    });

    // Add filtered facilities as markers
    filteredFacilities.forEach(facility => {
      const marker = L.marker([facility.latitude, facility.longitude], {
        icon: getFacilityIcon(facility)
      });

      // Bind popup with facility details
      marker.bindPopup(createFacilityPopup(facility), {
        maxWidth: 300,
        closeButton: false,
        autoClose: false,
        className: 'facility-popup'
      });

      // Keep the original click handler for backward compatibility
      marker.on('click', () => {
        // The popup will show automatically, but we can still trigger the callback
        // onFacilitySelect(facility);
      });

      markersGroup.current?.addLayer(marker);
    });
  }, [filteredFacilities, onFacilitySelect]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div ref={mapContainer} className="w-full h-full z-0" />
      
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
          padding: 0;
          overflow: hidden;
        }
        .facility-popup .leaflet-popup-content {
          margin: 0;
          padding: 16px;
          border-radius: 8px;
        }
        .facility-popup .leaflet-popup-tip {
          border-top-color: #e5e7eb;
        }
        .facility-popup .leaflet-popup-close-button {
          display: none;
        }
        `}
      </style>
    </div>
  );
};

export default InteractiveMap;
