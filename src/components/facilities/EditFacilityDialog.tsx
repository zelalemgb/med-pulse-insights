
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateFacility } from '@/hooks/useHealthFacilities';
import { HealthFacility } from '@/types/healthFacilities';

const facilitySchema = z.object({
  name: z.string().min(2, 'Facility name must be at least 2 characters'),
  code: z.string().optional(),
  facility_type: z.string().min(1, 'Facility type is required'),
  level: z.string().min(1, 'Level is required'),
  region: z.string().min(1, 'Region is required'),
  zone: z.string().min(1, 'Zone is required'),
  wereda: z.string().optional(),
  capacity: z.number().min(1).optional(),
  staff_count: z.number().min(0).optional(),
  operational_status: z.enum(['active', 'inactive', 'under_maintenance']),
  services_offered: z.string().optional(),
});

type FacilityForm = z.infer<typeof facilitySchema>;

interface EditFacilityDialogProps {
  facility: HealthFacility;
  isOpen: boolean;
  onClose: () => void;
}

export const EditFacilityDialog = ({ facility, isOpen, onClose }: EditFacilityDialogProps) => {
  const updateFacility = useUpdateFacility();

  const form = useForm<FacilityForm>({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      name: facility.name,
      code: facility.code || '',
      facility_type: facility.facility_type,
      level: facility.level,
      region: facility.region,
      zone: facility.zone,
      wereda: facility.wereda || '',
      capacity: facility.capacity || undefined,
      staff_count: facility.staff_count || undefined,
      operational_status: facility.operational_status,
      services_offered: facility.services_offered?.join(', ') || '',
    },
  });

  const onSubmit = async (data: FacilityForm) => {
    try {
      const updateData = {
        ...data,
        capacity: data.capacity || null,
        staff_count: data.staff_count || null,
        services_offered: data.services_offered 
          ? data.services_offered.split(',').map(s => s.trim()).filter(Boolean)
          : [],
      };

      await updateFacility.mutateAsync({
        facilityId: facility.id,
        updates: updateData,
      });
      onClose();
    } catch (error) {
      // Error handled by the mutation
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Facility</DialogTitle>
          <DialogDescription>
            Update the facility information below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facility Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter facility name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facility Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter facility code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="facility_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facility Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select facility type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Hospital">Hospital</SelectItem>
                        <SelectItem value="Health Center">Health Center</SelectItem>
                        <SelectItem value="Health Post">Health Post</SelectItem>
                        <SelectItem value="Clinic">Clinic</SelectItem>
                        <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Primary">Primary</SelectItem>
                        <SelectItem value="Secondary">Secondary</SelectItem>
                        <SelectItem value="Tertiary">Tertiary</SelectItem>
                        <SelectItem value="Specialized">Specialized</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter region" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zone *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter zone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wereda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wereda</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter wereda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter capacity"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="staff_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Staff Count</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter staff count"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="operational_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="services_offered"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Services Offered</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter services separated by commas (e.g., OPD, IPD, Emergency)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateFacility.isPending}>
                {updateFacility.isPending ? 'Updating...' : 'Update Facility'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
