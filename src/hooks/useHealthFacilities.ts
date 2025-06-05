
import { useState } from 'react';
import { CreateFacilityRequest, HealthFacility } from '@/types/healthFacilities';
import { useToast } from '@/hooks/use-toast';
import { healthFacilitiesService } from '@/services/healthFacilitiesService';

export const useCreateFacility = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const mutateAsync = async (data: CreateFacilityRequest): Promise<HealthFacility> => {
    setIsLoading(true);
    try {
      console.log('Creating facility with data:', data);
      
      // Use the actual Supabase service instead of simulation
      const newFacility = await healthFacilitiesService.createFacility(data);
      
      console.log('Facility created successfully in database:', newFacility);
      
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
  const [facilities, setFacilities] = useState<HealthFacility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFacilities = async () => {
    setIsLoading(true);
    try {
      const data = await healthFacilitiesService.getUserFacilities();
      setFacilities(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching facilities:', err);
      setError('Failed to fetch facilities');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data: facilities,
    isLoading,
    error,
    refetch: fetchFacilities
  };
};

// Export useHealthFacilities as an alias for useFacilities for backward compatibility
export const useHealthFacilities = useFacilities;

// Hook for updating facilities - now using actual service
export const useUpdateFacility = () => {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  
  return {
    mutateAsync: async (data: { facilityId: string; updates: Partial<CreateFacilityRequest> }) => {
      setIsPending(true);
      try {
        console.log('Updating facility:', data);
        const result = await healthFacilitiesService.updateFacility(data.facilityId, data.updates);
        
        toast({
          title: "Success",
          description: "Facility updated successfully",
        });
        return result;
      } catch (error) {
        console.error('Error updating facility:', error);
        toast({
          title: "Error",
          description: "Failed to update facility",
          variant: "destructive",
        });
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    isPending
  };
};

// Hook for facility association requests - using actual service
export const useRequestFacilityAssociation = () => {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  
  return {
    mutateAsync: async (data: { facilityId: string; notes?: string }) => {
      setIsPending(true);
      try {
        console.log('Requesting facility association:', data);
        const result = await healthFacilitiesService.requestFacilityAssociation(data.facilityId, data.notes);
        
        toast({
          title: "Request Sent",
          description: "Your facility access request has been submitted",
        });
        return result;
      } catch (error) {
        console.error('Error requesting facility association:', error);
        toast({
          title: "Error",
          description: "Failed to send association request",
          variant: "destructive",
        });
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    isPending
  };
};

// Hook for pending associations - using actual service
export const usePendingAssociations = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingAssociations = async () => {
    setIsLoading(true);
    try {
      const result = await healthFacilitiesService.getPendingAssociations();
      setData(result);
      setError(null);
    } catch (err) {
      console.error('Error fetching pending associations:', err);
      setError('Failed to fetch pending associations');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch: fetchPendingAssociations
  };
};

// Hook for updating association status - using actual service
export const useUpdateAssociationStatus = () => {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  
  return {
    mutateAsync: async (data: { associationId: string; status: string; notes?: string }) => {
      setIsPending(true);
      try {
        console.log('Updating association status:', data);
        const result = await healthFacilitiesService.updateAssociationStatus(data.associationId, data.status as 'approved' | 'rejected', data.notes);
        
        toast({
          title: "Status Updated",
          description: `Association ${data.status} successfully`,
        });
        return result;
      } catch (error) {
        console.error('Error updating association status:', error);
        toast({
          title: "Error",
          description: "Failed to update association status",
          variant: "destructive",
        });
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    isPending
  };
};

// Hook for user associations - using actual service
export const useUserAssociations = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserAssociations = async () => {
    setIsLoading(true);
    try {
      const result = await healthFacilitiesService.getUserAssociations();
      setData(result);
      setError(null);
    } catch (err) {
      console.error('Error fetching user associations:', err);
      setError('Failed to fetch user associations');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch: fetchUserAssociations
  };
};
