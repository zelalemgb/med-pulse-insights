
import { useState } from 'react';
import { CreateFacilityRequest, HealthFacility } from '@/types/healthFacilities';
import { useToast } from '@/hooks/use-toast';

export const useCreateFacility = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const mutateAsync = async (data: CreateFacilityRequest): Promise<HealthFacility> => {
    setIsLoading(true);
    try {
      console.log('Creating facility with data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newFacility: HealthFacility = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        code: data.code || `FAC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        facility_type: data.facility_type,
        level: data.level,
        region: data.region,
        zone: data.zone,
        wereda: data.wereda,
        latitude: data.latitude,
        longitude: data.longitude,
        catchment_area: data.catchment_area,
        capacity: data.capacity,
        staff_count: data.staff_count,
        services_offered: data.services_offered,
        operational_status: data.operational_status || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('Facility created successfully:', newFacility);
      
      toast({
        title: "Success",
        description: `Facility "${data.name}" created successfully`,
      });

      return newFacility;
    } catch (error) {
      console.error('Error creating facility:', error);
      toast({
        title: "Error",
        description: "Failed to create facility. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutateAsync,
    isLoading
  };
};

export const useFacilities = () => {
  // Mock facilities data for testing
  const facilities: HealthFacility[] = [
    {
      id: '1',
      name: 'Black Lion Hospital',
      code: 'BLH-001',
      facility_type: 'specialized_hospital',
      level: 'tertiary',
      region: 'addis_ababa',
      zone: 'addis_ababa',
      wereda: 'gulele',
      latitude: 9.0307,
      longitude: 38.7406,
      capacity: 800,
      staff_count: 1200,
      catchment_area: 500000,
      services_offered: ['Emergency Care', 'Surgery', 'ICU', 'Laboratory', 'Radiology'],
      operational_status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    }
  ];

  return {
    data: facilities,
    isLoading: false,
    error: null
  };
};
