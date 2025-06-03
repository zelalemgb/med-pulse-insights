import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Fullscreen, Minimize, Navigation, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface OSMMapProps {
  className?: string;
  height?: string;
}

const OSMMap: React.FC<OSMMapProps> = ({ className = '', height = '300px' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize the map with mobile-optimized settings
    map.current = L.map(mapContainer.current, {
      zoomControl: false, // We'll add custom controls
      attributionControl: false,
      touchZoom: true,
      doubleClickZoom: true,
      scrollWheelZoom: !isMobile, // Disable scroll zoom on mobile to prevent conflicts
      dragging: true,
      boxZoom: false,
      keyboard: true,
    }).setView([9.0, 38.7], 15);

    // Use a mobile-friendly tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map.current);

    // Create current location marker
    const currentLocationIcon = L.divIcon({
      html: `<div style="background-color: #3b82f6; width: ${isMobile ? '20' : '16'}px; height: ${isMobile ? '20' : '16'}px; border-radius: 50%; box-shadow: 0 0 0 4px white, 0 0 0 6px rgba(59, 130, 246, 0.4); position: relative;"><div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: ${isMobile ? '6' : '4'}px; height: ${isMobile ? '6' : '4'}px; background-color: white; border-radius: 50%;"></div></div>`,
      className: 'current-location-marker',
      iconSize: [isMobile ? 28 : 24, isMobile ? 28 : 24],
      iconAnchor: [isMobile ? 14 : 12, isMobile ? 14 : 12],
    });

    // Add current location marker
    L.marker([9.0, 38.7], { icon: currentLocationIcon })
      .addTo(map.current!)
      .bindPopup('<div style="font-size: 12px; padding: 4px; font-weight: bold;"><b>Your Location</b></div>');

    // Create pharmacy markers with mobile-optimized size
    const pharmacyIcon = L.divIcon({
      html: `<div style="background-color: #10b981; width: ${isMobile ? '12' : '8'}px; height: ${isMobile ? '12' : '8'}px; border-radius: 50%; box-shadow: 0 0 0 2px white, 0 0 0 3px rgba(16, 185, 129, 0.3);"></div>`,
      className: 'custom-marker',
      iconSize: [isMobile ? 18 : 14, isMobile ? 18 : 14],
      iconAnchor: [isMobile ? 9 : 7, isMobile ? 9 : 7],
    });

    // Add pharmacy locations
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

    // Mobile-specific optimizations
    if (isMobile) {
      // Add touch-friendly interactions
      map.current.on('touchstart', () => {
        map.current?.scrollWheelZoom.disable();
      });

      map.current.on('touchend', () => {
        setTimeout(() => {
          map.current?.scrollWheelZoom.enable();
        }, 100);
      });
    }

    // Try to get user's actual location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          
          if (map.current) {
            // Update map center to user's location
            map.current.setView([latitude, longitude], 15);
            
            // Update current location marker
            const userLocationIcon = L.divIcon({
              html: `<div style="background-color: #3b82f6; width: ${isMobile ? '20' : '16'}px; height: ${isMobile ? '20' : '16'}px; border-radius: 50%; box-shadow: 0 0 0 4px white, 0 0 0 6px rgba(59, 130, 246, 0.4); position: relative; animation: pulse 2s infinite;"><div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: ${isMobile ? '6' : '4'}px; height: ${isMobile ? '6' : '4'}px; background-color: white; border-radius: 50%;"></div></div>`,
              className: 'current-location-marker',
              iconSize: [isMobile ? 28 : 24, isMobile ? 28 : 24],
              iconAnchor: [isMobile ? 14 : 12, isMobile ? 14 : 12],
            });
            
            L.marker([latitude, longitude], { icon: userLocationIcon })
              .addTo(map.current)
              .bindPopup('<div style="font-size: 12px; padding: 4px; font-weight: bold;"><b>Your Current Location</b></div>');
          }
        },
        (error) => {
          console.log('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [isMobile]);

  // Resize map when fullscreen state changes
  useEffect(() => {
    if (map.current) {
      setTimeout(() => {
        map.current?.invalidateSize();
      }, 100);
    }
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const zoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  const zoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };

  const centerOnUserLocation = () => {
    if (map.current && userLocation) {
      map.current.setView(userLocation, 16);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          if (map.current) {
            map.current.setView([latitude, longitude], 16);
          }
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      <div 
        ref={mapContainer} 
        className={`w-full h-full rounded-lg shadow-md border ${className}`}
        style={{ 
          height: isFullscreen ? '100vh' : height,
          minHeight: isFullscreen ? '100vh' : height
        }}
      />
      
      {/* Mobile/Desktop Responsive Controls */}
      <div className={`absolute ${isMobile ? 'top-2 right-2' : 'top-4 right-4'} z-10 flex flex-col gap-2`}>
        {/* Fullscreen Toggle */}
        <Button
          onClick={toggleFullscreen}
          className={`bg-white hover:bg-gray-100 text-gray-700 shadow-lg border ${isMobile ? 'h-12 w-12 p-0' : ''}`}
          size={isMobile ? "lg" : "sm"}
          variant="outline"
        >
          {isFullscreen ? (
            <Minimize className={`${isMobile ? 'h-6 w-6' : 'h-4 w-4'}`} />
          ) : (
            <Fullscreen className={`${isMobile ? 'h-6 w-6' : 'h-4 w-4'}`} />
          )}
        </Button>

        {/* Location Center Button */}
        <Button
          onClick={centerOnUserLocation}
          className={`bg-white hover:bg-gray-100 text-gray-700 shadow-lg border ${isMobile ? 'h-12 w-12 p-0' : ''}`}
          size={isMobile ? "lg" : "sm"}
          variant="outline"
          title="Center on my location"
        >
          <Navigation className={`${isMobile ? 'h-6 w-6' : 'h-4 w-4'}`} />
        </Button>
      </div>

      {/* Mobile Zoom Controls */}
      {isMobile && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 flex flex-col gap-2">
          <Button
            onClick={zoomIn}
            className="bg-white hover:bg-gray-100 text-gray-700 shadow-lg border h-12 w-12 p-0"
            size="lg"
            variant="outline"
          >
            <ZoomIn className="h-6 w-6" />
          </Button>
          <Button
            onClick={zoomOut}
            className="bg-white hover:bg-gray-100 text-gray-700 shadow-lg border h-12 w-12 p-0"
            size="lg"
            variant="outline"
          >
            <ZoomOut className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default OSMMap;
