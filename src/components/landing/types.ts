
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
