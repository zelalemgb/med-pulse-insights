
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
import { useRequestFacilityAssociation } from '@/hooks/useHealthFacilities';
import { UserPlus } from 'lucide-react';

const requestSchema = z.object({
  facilityId: z.string().min(1, 'Facility ID is required'),
  notes: z.string().optional(),
});

type RequestForm = z.infer<typeof requestSchema>;

interface FacilityAssociationRequestProps {
  facilityId?: string;
  facilityName?: string;
}

export const FacilityAssociationRequest = ({ 
  facilityId, 
  facilityName 
}: FacilityAssociationRequestProps) => {
  const [open, setOpen] = React.useState(false);
  const requestAssociation = useRequestFacilityAssociation();

  const form = useForm<RequestForm>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      facilityId: facilityId || '',
      notes: '',
    },
  });

  const onSubmit = async (data: RequestForm) => {
    try {
      await requestAssociation.mutateAsync({
        facilityId: data.facilityId,
        notes: data.notes,
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      // Error handled by the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Request Access
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Facility Access</DialogTitle>
          <DialogDescription>
            Request access to {facilityName || 'this facility'}. Your request will be reviewed by the facility owner.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="facilityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facility ID</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter facility ID" 
                      {...field} 
                      disabled={!!facilityId}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Why do you need access to this facility?"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={requestAssociation.isPending}>
                {requestAssociation.isPending ? 'Requesting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
