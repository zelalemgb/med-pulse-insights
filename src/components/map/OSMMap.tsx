
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

    // Initialize the map
    map.current = L.map(mapContainer.current).setView([9.0, 38.7], 6); // Ethiopia coordinates

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Add some sample pharmacy markers
    const pharmacyIcon = L.divIcon({
      html: '<div style="background-color: #22c55e; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
      className: 'custom-marker',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    // Sample pharmacy locations
    const pharmacies = [
      { lat: 9.03, lng: 38.74, name: 'City Pharmacy' },
      { lat: 9.02, lng: 38.76, name: 'Health Plus Pharmacy' },
      { lat: 9.04, lng: 38.72, name: 'Medical Center Pharmacy' },
      { lat: 9.01, lng: 38.75, name: 'Community Pharmacy' },
    ];

    pharmacies.forEach(pharmacy => {
      L.marker([pharmacy.lat, pharmacy.lng], { icon: pharmacyIcon })
        .addTo(map.current!)
        .bindPopup(`<b>${pharmacy.name}</b><br>Medicine availability: Available`);
    });

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
      className={`rounded-lg shadow-md ${className}`}
      style={{ height }}
    />
  );
};

export default OSMMap;
