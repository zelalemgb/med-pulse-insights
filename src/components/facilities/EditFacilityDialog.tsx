
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateFacility } from '@/hooks/useHealthFacilities';
import { CreateFacilityRequest, HealthFacility } from '@/types/healthFacilities';
import { Loader2 } from 'lucide-react';

interface EditFacilityDialogProps {
  facility: HealthFacility | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditFacilityDialog = ({ facility, isOpen, onClose }: EditFacilityDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateFacility = useUpdateFacility();
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateFacilityRequest>();

  // Reset form when facility changes
  useEffect(() => {
    if (facility) {
      reset({
        name: facility.name,
        code: facility.code || '',
        facility_type: facility.facility_type,
        level: facility.level,
        region: facility.region,
        zone: facility.zone,
        wereda: facility.wereda || '',
        operational_status: facility.operational_status,
        capacity: facility.capacity || undefined,
        staff_count: facility.staff_count || undefined,
        catchment_area: facility.catchment_area || undefined,
        latitude: facility.latitude || undefined,
        longitude: facility.longitude || undefined,
        services_offered: facility.services_offered || []
      });

      // Set select values
      setValue('facility_type', facility.facility_type);
      setValue('level', facility.level);
      setValue('operational_status', facility.operational_status);
    }
  }, [facility, reset, setValue]);

  const onSubmit = async (data: CreateFacilityRequest) => {
    if (!facility) return;
    
    try {
      setIsSubmitting(true);
      await updateFacility.mutateAsync({
        facilityId: facility.id,
        updates: data
      });
      onClose();
    } catch (error) {
      console.error('Error updating facility:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!facility) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Facility: {facility.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Facility Name *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Facility name is required' })}
                placeholder="Enter facility name"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="code">Facility Code</Label>
              <Input
                id="code"
                {...register('code')}
                placeholder="Enter facility code"
              />
            </div>

            <div>
              <Label htmlFor="facility_type">Facility Type *</Label>
              <Select onValueChange={(value) => setValue('facility_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select facility type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hospital">Hospital</SelectItem>
                  <SelectItem value="health_center">Health Center</SelectItem>
                  <SelectItem value="health_post">Health Post</SelectItem>
                  <SelectItem value="clinic">Clinic</SelectItem>
                  <SelectItem value="specialized_hospital">Specialized Hospital</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="level">Level *</Label>
              <Select onValueChange={(value) => setValue('level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="tertiary">Tertiary</SelectItem>
                  <SelectItem value="quaternary">Quaternary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="region">Region *</Label>
              <Input
                id="region"
                {...register('region', { required: 'Region is required' })}
                placeholder="Enter region"
              />
              {errors.region && (
                <p className="text-sm text-red-600 mt-1">{errors.region.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="zone">Zone *</Label>
              <Input
                id="zone"
                {...register('zone', { required: 'Zone is required' })}
                placeholder="Enter zone"
              />
              {errors.zone && (
                <p className="text-sm text-red-600 mt-1">{errors.zone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="wereda">Wereda</Label>
              <Input
                id="wereda"
                {...register('wereda')}
                placeholder="Enter wereda"
              />
            </div>

            <div>
              <Label htmlFor="operational_status">Operational Status</Label>
              <Select onValueChange={(value) => setValue('operational_status', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                {...register('capacity', { valueAsNumber: true })}
                placeholder="Enter capacity"
              />
            </div>

            <div>
              <Label htmlFor="staff_count">Staff Count</Label>
              <Input
                id="staff_count"
                type="number"
                {...register('staff_count', { valueAsNumber: true })}
                placeholder="Enter staff count"
              />
            </div>

            <div>
              <Label htmlFor="catchment_area">Catchment Area</Label>
              <Input
                id="catchment_area"
                type="number"
                {...register('catchment_area', { valueAsNumber: true })}
                placeholder="Enter catchment area"
              />
            </div>

            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                {...register('latitude', { valueAsNumber: true })}
                placeholder="Enter latitude"
              />
            </div>

            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                {...register('longitude', { valueAsNumber: true })}
                placeholder="Enter longitude"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="services_offered">Services Offered</Label>
            <Textarea
              id="services_offered"
              placeholder="Enter services offered (comma-separated)"
              defaultValue={facility.services_offered?.join(', ') || ''}
              onChange={(e) => {
                const services = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                setValue('services_offered', services);
              }}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Facility
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
