
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import { CreateFacilityRequest } from '@/types/healthFacilities';

interface FacilityLocationStepProps {
  formData: Partial<CreateFacilityRequest>;
  updateFormData: (data: Partial<CreateFacilityRequest>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const FacilityLocationStep = ({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrev 
}: FacilityLocationStepProps) => {
  const handleNext = () => {
    if (formData.region && formData.zone) {
      onNext();
    }
  };

  const isValid = formData.region && formData.zone;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location Information
          </CardTitle>
          <CardDescription>
            Provide the geographic location details for your facility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="region">Region *</Label>
              <Input
                id="region"
                value={formData.region || ''}
                onChange={(e) => updateFormData({ region: e.target.value })}
                placeholder="Enter region name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="zone">Zone *</Label>
              <Input
                id="zone"
                value={formData.zone || ''}
                onChange={(e) => updateFormData({ zone: e.target.value })}
                placeholder="Enter zone name"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="wereda">Wereda (Optional)</Label>
            <Input
              id="wereda"
              value={formData.wereda || ''}
              onChange={(e) => updateFormData({ wereda: e.target.value })}
              placeholder="Enter wereda name"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude (Optional)</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude || ''}
                onChange={(e) => updateFormData({ latitude: parseFloat(e.target.value) || undefined })}
                placeholder="e.g., 9.1450"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="longitude">Longitude (Optional)</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude || ''}
                onChange={(e) => updateFormData({ longitude: parseFloat(e.target.value) || undefined })}
                placeholder="e.g., 40.4897"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <Button onClick={handleNext} disabled={!isValid}>
          Next <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
