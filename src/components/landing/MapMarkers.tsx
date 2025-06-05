import React, { useEffect } from 'react';
import L from 'leaflet';
import { Facility } from './types';
import { getFacilityIcon, getUserLocationIcon } from './mapUtils';
import { createFacilityPopup } from './facilityPopup';

interface MapMarkersProps {
  map: React.RefObject<L.Map | null>;
  markersGroup: React.RefObject<L.LayerGroup | null>;
  userLocation: [number, number];
  facilities: Facility[];
  onFacilitySelect: (facility: Facility) => void;
}

const MapMarkers: React.FC<MapMarkersProps> = ({
  map,
  markersGroup,
  userLocation,
  facilities,
  onFacilitySelect
}) => {
  // Add user location marker
  useEffect(() => {
    if (!map.current || !markersGroup.current || !userLocation) return;

    const userLocationIcon = getUserLocationIcon();

    L.marker(userLocation, { icon: userLocationIcon })
      .addTo(markersGroup.current)
      .bindPopup('<div style="font-size: 12px; padding: 4px; font-weight: bold;">Your Location</div>');
  }, [map, markersGroup, userLocation]);

  // Add facility markers
  useEffect(() => {
    if (!map.current || !markersGroup.current) return;

    // Clear existing facility markers (keep user location)
    markersGroup.current.eachLayer((layer) => {
      if (layer instanceof L.Marker && !layer.getElement()?.classList.contains('user-location-marker')) {
        markersGroup.current?.removeLayer(layer);
      }
    });

    // Add filtered facilities as markers
    facilities.forEach(facility => {
      const marker = L.marker([facility.latitude, facility.longitude], {
        icon: getFacilityIcon(facility)
      });

      // Bind popup with facility details and open by default
      marker.bindPopup(createFacilityPopup(facility), {
        maxWidth: 300,
        closeButton: false,
        autoClose: false,
        className: 'facility-popup'
      });

      // Open popup by default when marker is clicked
      marker.on('click', () => {
        marker.openPopup();
      });

      markersGroup.current?.addLayer(marker);
    });
  }, [map, markersGroup, facilities, onFacilitySelect]);

  return null; // This component doesn't render anything directly
};

export default MapMarkers;
