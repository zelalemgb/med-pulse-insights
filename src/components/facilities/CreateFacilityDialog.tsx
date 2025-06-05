
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CreateFacilityRequest, HealthFacility } from '@/types/healthFacilities';
import { facilityService } from '@/services/facilities/facilityService';

interface CreateFacilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (facility: HealthFacility) => void;
}

export const CreateFacilityDialog = ({ open, onOpenChange, onSuccess }: CreateFacilityDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateFacilityRequest>({
    defaultValues: {
      operational_status: 'active'
    }
  });

  const facilityType = watch('facility_type');
  const level = watch('level');

  const onSubmit = async (data: CreateFacilityRequest) => {
    try {
      setIsSubmitting(true);
      console.log('Creating facility with data:', data);

      const newFacility = await facilityService.createFacility(data);
      
      console.log('Facility created successfully:', newFacility);
      reset();
      onSuccess(newFacility);
      onOpenChange(false);
      
      toast({
        title: "Facility Created",
        description: `${data.name} has been created successfully.`,
      });
    } catch (error) {
      console.error('Error creating facility:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create facility. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Health Facility</DialogTitle>
          <DialogDescription>
            Register a new health facility in the Ethiopian healthcare system
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Basic Information</h3>
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
                  placeholder="Enter facility code (auto-generated if empty)"
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
                    <SelectItem value="primary_hospital">Primary Hospital</SelectItem>
                    <SelectItem value="general_hospital">General Hospital</SelectItem>
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
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="region">Region *</Label>
                <Select onValueChange={(value) => setValue('region', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="addis_ababa">Addis Ababa</SelectItem>
                    <SelectItem value="afar">Afar</SelectItem>
                    <SelectItem value="amhara">Amhara</SelectItem>
                    <SelectItem value="benishangul_gumuz">Benishangul-Gumuz</SelectItem>
                    <SelectItem value="dire_dawa">Dire Dawa</SelectItem>
                    <SelectItem value="gambela">Gambela</SelectItem>
                    <SelectItem value="harari">Harari</SelectItem>
                    <SelectItem value="oromia">Oromia</SelectItem>
                    <SelectItem value="sidama">Sidama</SelectItem>
                    <SelectItem value="snnp">SNNP</SelectItem>
                    <SelectItem value="somali">Somali</SelectItem>
                    <SelectItem value="tigray">Tigray</SelectItem>
                  </SelectContent>
                </Select>
                {errors.region && (
                  <p className="text-sm text-red-600 mt-1">Region is required</p>
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
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  {...register('latitude', { valueAsNumber: true })}
                  placeholder="e.g., 9.0307"
                />
              </div>

              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  {...register('longitude', { valueAsNumber: true })}
                  placeholder="e.g., 38.7406"
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
            </div>
          </div>

          {/* Capacity and Staffing */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Capacity & Staffing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="capacity">Bed Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  {...register('capacity', { valueAsNumber: true })}
                  placeholder="Number of beds"
                />
              </div>

              <div>
                <Label htmlFor="staff_count">Total Staff Count</Label>
                <Input
                  id="staff_count"
                  type="number"
                  {...register('staff_count', { valueAsNumber: true })}
                  placeholder="Number of staff members"
                />
              </div>

              <div>
                <Label htmlFor="catchment_area">Catchment Population</Label>
                <Input
                  id="catchment_area"
                  type="number"
                  {...register('catchment_area', { valueAsNumber: true })}
                  placeholder="Population served"
                />
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <Label htmlFor="services_offered">Services Offered</Label>
            <Textarea
              id="services_offered"
              placeholder="Enter services offered (comma-separated): e.g., Emergency Care, Maternity, Laboratory, Pharmacy, Surgery"
              rows={3}
              onChange={(e) => {
                const services = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                setValue('services_offered', services);
              }}
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple services with commas</p>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
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
              className="bg-blue-600 hover:bg-blue-700"
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
