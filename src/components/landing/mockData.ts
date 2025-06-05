
import { Facility } from './types';

// Mock data for demonstration
export const mockFacilities: Facility[] = [
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
