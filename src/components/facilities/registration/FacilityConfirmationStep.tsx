
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { CreateFacilityRequest } from '@/types/healthFacilities';

interface FacilityConfirmationStepProps {
  formData: Partial<CreateFacilityRequest>;
  onSubmit: () => void;
  onPrev: () => void;
  isSubmitting: boolean;
}

export const FacilityConfirmationStep = ({ 
  formData, 
  onSubmit, 
  onPrev, 
  isSubmitting 
}: FacilityConfirmationStepProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Review & Confirm
          </CardTitle>
          <CardDescription>
            Please review all the information before submitting your facility registration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Facility Name:</span>
                <p className="font-medium">{formData.name}</p>
              </div>
              {formData.code && (
                <div>
                  <span className="text-sm text-gray-600">Facility Code:</span>
                  <p className="font-medium">{formData.code}</p>
                </div>
              )}
              <div>
                <span className="text-sm text-gray-600">Type:</span>
                <p className="font-medium capitalize">{formData.facility_type?.replace('_', ' ')}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Care Level:</span>
                <p className="font-medium capitalize">{formData.level}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Location Information */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Location</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-600">Region:</span>
                <p className="font-medium">{formData.region}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Zone:</span>
                <p className="font-medium">{formData.zone}</p>
              </div>
              {formData.wereda && (
                <div>
                  <span className="text-sm text-gray-600">Wereda:</span>
                  <p className="font-medium">{formData.wereda}</p>
                </div>
              )}
            </div>
            {(formData.latitude || formData.longitude) && (
              <div className="mt-2">
                <span className="text-sm text-gray-600">Coordinates:</span>
                <p className="font-medium">
                  {formData.latitude && `Lat: ${formData.latitude}`}
                  {formData.latitude && formData.longitude && ', '}
                  {formData.longitude && `Lng: ${formData.longitude}`}
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Additional Details */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Additional Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formData.capacity && (
                <div>
                  <span className="text-sm text-gray-600">Capacity:</span>
                  <p className="font-medium">{formData.capacity} beds</p>
                </div>
              )}
              {formData.staff_count && (
                <div>
                  <span className="text-sm text-gray-600">Staff:</span>
                  <p className="font-medium">{formData.staff_count} people</p>
                </div>
              )}
              {formData.catchment_area && (
                <div>
                  <span className="text-sm text-gray-600">Catchment:</span>
                  <p className="font-medium">{formData.catchment_area} people</p>
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <span className="text-sm text-gray-600">Status:</span>
              <Badge variant="outline" className="ml-2">
                {formData.operational_status?.replace('_', ' ')}
              </Badge>
            </div>

            {formData.services_offered && formData.services_offered.length > 0 && (
              <div className="mt-4">
                <span className="text-sm text-gray-600">Services Offered:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.services_offered.map((service, index) => (
                    <Badge key={index} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} disabled={isSubmitting}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting} className="min-w-[140px]">
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isSubmitting ? 'Creating...' : 'Create Facility'}
        </Button>
      </div>
    </div>
  );
};
