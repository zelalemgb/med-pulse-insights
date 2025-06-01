import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthFacilitiesService } from '@/services/healthFacilitiesService';
import { CreateFacilityRequest } from '@/types/healthFacilities';
import { useToast } from '@/hooks/use-toast';

export const useHealthFacilities = () => {
  return useQuery({
    queryKey: ['health-facilities'],
    queryFn: () => healthFacilitiesService.getUserFacilities(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useHealthFacility = (facilityId: string) => {
  return useQuery({
    queryKey: ['health-facility', facilityId],
    queryFn: () => healthFacilitiesService.getFacilityById(facilityId),
    enabled: !!facilityId,
  });
};

export const useCreateFacility = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (facilityData: CreateFacilityRequest) =>
      healthFacilitiesService.createFacility(facilityData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-facilities'] });
      queryClient.invalidateQueries({ queryKey: ['user-facility-associations'] });
      toast({
        title: 'Success',
        description: 'Health facility created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateFacility = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ facilityId, updates }: { facilityId: string; updates: Partial<CreateFacilityRequest> }) =>
      healthFacilitiesService.updateFacility(facilityId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-facilities'] });
      queryClient.invalidateQueries({ queryKey: ['user-facility-associations'] });
      toast({
        title: 'Success',
        description: 'Facility updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteFacility = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (facilityId: string) =>
      healthFacilitiesService.deleteFacility(facilityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-facilities'] });
      queryClient.invalidateQueries({ queryKey: ['user-facility-associations'] });
      toast({
        title: 'Success',
        description: 'Facility deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUserAssociations = () => {
  return useQuery({
    queryKey: ['user-facility-associations'],
    queryFn: () => healthFacilitiesService.getUserAssociations(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useRequestFacilityAssociation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ facilityId, notes }: { facilityId: string; notes?: string }) =>
      healthFacilitiesService.requestFacilityAssociation(facilityId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-facility-associations'] });
      queryClient.invalidateQueries({ queryKey: ['pending-facility-associations'] });
      toast({
        title: 'Success',
        description: 'Facility association request submitted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const usePendingAssociations = () => {
  return useQuery({
    queryKey: ['pending-facility-associations'],
    queryFn: () => healthFacilitiesService.getPendingAssociations(),
    staleTime: 1 * 60 * 1000, // 1 minute (shorter for pending items)
  });
};

export const useUpdateAssociationStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ 
      associationId, 
      status, 
      notes 
    }: { 
      associationId: string; 
      status: 'approved' | 'rejected'; 
      notes?: string; 
    }) => healthFacilitiesService.updateAssociationStatus(associationId, status, notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pending-facility-associations'] });
      queryClient.invalidateQueries({ queryKey: ['user-facility-associations'] });
      queryClient.invalidateQueries({ queryKey: ['health-facilities'] });
      toast({
        title: 'Success',
        description: `Association ${variables.status} successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useFacilityAccess = (facilityId: string, requiredType?: string) => {
  return useQuery({
    queryKey: ['facility-access', facilityId, requiredType],
    queryFn: () => healthFacilitiesService.checkFacilityAccess(facilityId, requiredType),
    enabled: !!facilityId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
