
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserAssociations } from '@/hooks/useHealthFacilities';
import { Loader2, Building, MapPin, Crown, CheckCircle, Clock, XCircle } from 'lucide-react';

export const UserAssociations = () => {
  const { data: associations, isLoading, error } = useUserAssociations();

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
            Error loading your facility associations. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getAssociationIcon = (type: string) => {
    switch (type) {
      case 'owner':
        return <Crown className="h-4 w-4 text-yellow-600" />;
      default:
        return <Building className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Facility Associations</h3>

      {!associations || associations.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Building className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h4 className="text-lg font-semibold mb-2">No facility associations</h4>
              <p className="text-gray-600">
                You don't have any facility associations yet. Create a facility or request access to an existing one.
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
                  <CardTitle className="text-base flex items-center">
                    {getAssociationIcon(association.association_type)}
                    <span className="ml-2">
                      {(association as any).health_facilities?.name}
                    </span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(association.approval_status)}
                    <Badge variant={getStatusColor(association.approval_status) as any}>
                      {association.approval_status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="h-4 w-4 mr-2" />
                    <span>
                      {(association as any).health_facilities?.facility_type} - {' '}
                      {association.association_type === 'owner' ? 'Owner' : 'User'}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>
                      {(association as any).health_facilities?.region}, {' '}
                      {(association as any).health_facilities?.zone}
                    </span>
                  </div>

                  {association.notes && (
                    <div className="text-sm">
                      <span className="font-medium">Notes: </span>
                      <span className="text-gray-600">{association.notes}</span>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 border-t pt-2">
                    Requested: {new Date(association.requested_at).toLocaleDateString()}
                    {association.approved_at && (
                      <span className="ml-4">
                        Approved: {new Date(association.approved_at).toLocaleDateString()}
                      </span>
                    )}
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
