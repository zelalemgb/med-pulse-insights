
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface OSMMapProps {
  className?: string;
  height?: string;
}

const OSMMap: React.FC<OSMMapProps> = ({ className = '', height = '300px' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize the map with higher zoom for 1km radius view
    map.current = L.map(mapContainer.current, {
      zoomControl: false, // Remove zoom controls for cleaner look
      attributionControl: false, // Remove attribution for cleaner look
    }).setView([9.0, 38.7], 15); // Higher zoom level (15) for ~1km radius

    // Use a cleaner, minimal tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map.current);

    // Create a simple, clean pharmacy marker
    const pharmacyIcon = L.divIcon({
      html: '<div style="background-color: #10b981; width: 8px; height: 8px; border-radius: 50%; box-shadow: 0 0 0 2px white, 0 0 0 3px rgba(16, 185, 129, 0.3);"></div>',
      className: 'custom-marker',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

    // Fewer pharmacy locations within 1km radius for cleaner appearance
    const pharmacies = [
      { lat: 9.002, lng: 38.702, name: 'Central Pharmacy' },
      { lat: 8.998, lng: 38.698, name: 'Medical Plaza' },
      { lat: 9.001, lng: 38.705, name: 'Health Center' },
    ];

    pharmacies.forEach(pharmacy => {
      L.marker([pharmacy.lat, pharmacy.lng], { icon: pharmacyIcon })
        .addTo(map.current!)
        .bindPopup(`<div style="font-size: 12px; padding: 4px;"><b>${pharmacy.name}</b></div>`);
    });

    // Disable interactions for a cleaner, static-like appearance
    map.current.dragging.disable();
    map.current.touchZoom.disable();
    map.current.doubleClickZoom.disable();
    map.current.scrollWheelZoom.disable();
    map.current.boxZoom.disable();
    map.current.keyboard.disable();

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  return (
    <div 
      ref={mapContainer} 
      className={`rounded-lg shadow-md border ${className}`}
      style={{ height }}
    />
  );
};

export default OSMMap;
