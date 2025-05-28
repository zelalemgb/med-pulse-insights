
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  usePendingAssociations, 
  useUpdateAssociationStatus 
} from '@/hooks/useHealthFacilities';
import { Loader2, CheckCircle, XCircle, User, Clock } from 'lucide-react';
import { useState } from 'react';

export const PendingAssociations = () => {
  const { data: associations, isLoading, error } = usePendingAssociations();
  const updateStatus = useUpdateAssociationStatus();
  const [notes, setNotes] = useState<Record<string, string>>({});

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-red-600">
            Error loading pending associations. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleStatusUpdate = async (
    associationId: string, 
    status: 'approved' | 'rejected'
  ) => {
    try {
      await updateStatus.mutateAsync({
        associationId,
        status,
        notes: notes[associationId],
      });
      // Clear the notes for this association
      setNotes(prev => {
        const newNotes = { ...prev };
        delete newNotes[associationId];
        return newNotes;
      });
    } catch (error) {
      // Error handled by the mutation
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center">
        <Clock className="h-5 w-5 mr-2" />
        Pending Association Requests
      </h3>

      {!associations || associations.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h4 className="text-lg font-semibold mb-2">No pending requests</h4>
              <p className="text-gray-600">
                There are no pending facility association requests at this time.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {associations.map((association) => (
            <Card key={association.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">
                      {(association as any).profiles?.full_name || 'Unknown User'}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {(association as any).profiles?.email}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {association.approval_status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm">Facility:</h4>
                    <p className="text-sm text-gray-600">
                      {(association as any).health_facilities?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(association as any).health_facilities?.facility_type} - {' '}
                      {(association as any).health_facilities?.region}, {' '}
                      {(association as any).health_facilities?.zone}
                    </p>
                  </div>

                  {association.notes && (
                    <div>
                      <h4 className="font-medium text-sm">Request Notes:</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {association.notes}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-sm mb-2">Response Notes (Optional):</h4>
                    <Textarea
                      placeholder="Add notes about your decision..."
                      value={notes[association.id] || ''}
                      onChange={(e) => setNotes(prev => ({
                        ...prev,
                        [association.id]: e.target.value
                      }))}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(association.id, 'approved')}
                      disabled={updateStatus.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleStatusUpdate(association.id, 'rejected')}
                      disabled={updateStatus.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500 border-t pt-2">
                    Requested: {new Date(association.requested_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
