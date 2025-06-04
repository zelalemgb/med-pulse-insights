import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Facility } from './types';

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

    // Initialize map
    map.current = L.map(mapContainer.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(userLocation, 12);

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

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [userLocation]);

  useEffect(() => {
    if (!map.current || !markersGroup.current) return;

    // Clear existing facility markers (keep user location)
    markersGroup.current.eachLayer((layer) => {
      if (layer instanceof L.Marker && !layer.getElement()?.classList.contains('user-location-marker')) {
        markersGroup.current?.removeLayer(layer);
      }
    });

    // Add facilities as markers
    mockFacilities.forEach(facility => {
      const marker = L.marker([facility.latitude, facility.longitude], {
        icon: getFacilityIcon(facility)
      });

      marker.on('click', () => {
        onFacilitySelect(facility);
      });

      markersGroup.current?.addLayer(marker);
    });
  }, [onFacilitySelect]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full z-0" />
      
      {/* Legend - Fixed position with high z-index */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-xl z-[1000] border border-gray-200 max-w-[200px] sm:max-w-none">
        <h4 className="font-semibold text-sm mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 border border-white flex-shrink-0"></div>
            <span className="truncate sm:text-clip">Your Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 flex-shrink-0"></div>
            <span className="truncate sm:text-clip">In Stock</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500 flex-shrink-0"></div>
            <span className="truncate sm:text-clip">Partial Stock</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0"></div>
            <span className="truncate sm:text-clip">Stock Out</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 flex-shrink-0"></div>
            <span className="truncate sm:text-clip">Hospital</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-500 flex-shrink-0"></div>
            <span className="truncate sm:text-clip">Store/Bureau</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
