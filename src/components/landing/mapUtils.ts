
import L from 'leaflet';
import { Facility } from './types';

// Facility icon configurations
export const getFacilityIcon = (facility: Facility) => {
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

export const getUserLocationIcon = () => {
  return L.divIcon({
    html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3); position: relative;">
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 4px; height: 4px; background-color: white; border-radius: 50%;"></div>
    </div>`,
    className: 'user-location-marker',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
};

// Setup global popup functions
export const setupGlobalPopupFunctions = (
  onFacilitySelect: (facility: Facility) => void,
  map: React.RefObject<L.Map | null>,
  facilities: Facility[]
) => {
  (window as any).selectFacility = (facilityId: string) => {
    const facility = facilities.find(f => f.id === facilityId);
    if (facility) {
      onFacilitySelect(facility);
    }
    map.current?.closePopup();
  };

  (window as any).hidePopup = () => {
    map.current?.closePopup();
  };
};

// Cleanup global popup functions
export const cleanupGlobalPopupFunctions = () => {
  delete (window as any).selectFacility;
  delete (window as any).hidePopup;
};
