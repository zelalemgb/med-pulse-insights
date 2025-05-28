
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthFacilitiesService } from '@/services/healthFacilitiesService';
import { CreateFacilityRequest } from '@/types/healthFacilities';
import { useToast } from '@/hooks/use-toast';

export const useHealthFacilities = () => {
  return useQuery({
    queryKey: ['health-facilities'],
    queryFn: () => healthFacilitiesService.getUserFacilities(),
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

export const useUserAssociations = () => {
  return useQuery({
    queryKey: ['user-facility-associations'],
    queryFn: () => healthFacilitiesService.getUserAssociations(),
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
      toast({
        title: 'Success',
        description: 'Facility association request submitted',
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-facility-associations'] });
      queryClient.invalidateQueries({ queryKey: ['user-facility-associations'] });
      toast({
        title: 'Success',
        description: 'Association status updated successfully',
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
