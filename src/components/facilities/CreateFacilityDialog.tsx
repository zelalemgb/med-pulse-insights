
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateFacility } from '@/hooks/useHealthFacilities';
import { CreateFacilityRequest, HealthFacility } from '@/types/healthFacilities';
import { Loader2 } from 'lucide-react';

interface CreateFacilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (facility: HealthFacility) => void;
}

export const CreateFacilityDialog = ({ open, onOpenChange, onSuccess }: CreateFacilityDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createFacility = useCreateFacility();
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateFacilityRequest>({
    defaultValues: {
      operational_status: 'active'
    }
  });

  const onSubmit = async (data: CreateFacilityRequest) => {
    try {
      setIsSubmitting(true);
      const facility = await createFacility.mutateAsync(data);
      reset();
      onSuccess(facility);
    } catch (error) {
      console.error('Error creating facility:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Health Facility</DialogTitle>
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
              {errors.facility_type && (
                <p className="text-sm text-red-600 mt-1">Facility type is required</p>
              )}
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
              {errors.level && (
                <p className="text-sm text-red-600 mt-1">Level is required</p>
              )}
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
              <Select 
                defaultValue="active"
                onValueChange={(value) => setValue('operational_status', value as any)}
              >
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
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Facility
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
