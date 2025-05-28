
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateFacility } from '@/hooks/useHealthFacilities';
import { Plus } from 'lucide-react';

const createFacilitySchema = z.object({
  name: z.string().min(1, 'Facility name is required'),
  code: z.string().optional(),
  facility_type: z.string().min(1, 'Facility type is required'),
  level: z.string().min(1, 'Level is required'),
  region: z.string().min(1, 'Region is required'),
  zone: z.string().min(1, 'Zone is required'),
  wereda: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  catchment_area: z.number().optional(),
  capacity: z.number().optional(),
  staff_count: z.number().optional(),
  operational_status: z.enum(['active', 'inactive', 'under_maintenance']).default('active'),
});

type CreateFacilityForm = z.infer<typeof createFacilitySchema>;

export const CreateFacilityDialog = () => {
  const [open, setOpen] = React.useState(false);
  const createFacility = useCreateFacility();

  const form = useForm<CreateFacilityForm>({
    resolver: zodResolver(createFacilitySchema),
    defaultValues: {
      operational_status: 'active',
    },
  });

  const onSubmit = async (data: CreateFacilityForm) => {
    try {
      await createFacility.mutateAsync(data);
      setOpen(false);
      form.reset();
    } catch (error) {
      // Error handled by the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Facility
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Health Facility</DialogTitle>
          <DialogDescription>
            Create a new health facility and become its owner.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
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
                        <SelectItem value="hospital">Hospital</SelectItem>
                        <SelectItem value="health_center">Health Center</SelectItem>
                        <SelectItem value="health_post">Health Post</SelectItem>
                        <SelectItem value="clinic">Clinic</SelectItem>
                        <SelectItem value="pharmacy">Pharmacy</SelectItem>
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
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                        <SelectItem value="tertiary">Tertiary</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
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

            <div className="grid grid-cols-3 gap-4">
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
                name="catchment_area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catchment Area</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter catchment area"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createFacility.isPending}>
                {createFacility.isPending ? 'Creating...' : 'Create Facility'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
