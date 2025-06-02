
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, ArrowRight } from 'lucide-react';
import { CreateFacilityRequest } from '@/types/healthFacilities';

interface FacilityBasicInfoStepProps {
  formData: Partial<CreateFacilityRequest>;
  updateFormData: (data: Partial<CreateFacilityRequest>) => void;
  onNext: () => void;
}

export const FacilityBasicInfoStep = ({ 
  formData, 
  updateFormData, 
  onNext 
}: FacilityBasicInfoStepProps) => {
  const handleNext = () => {
    if (formData.name && formData.facility_type && formData.level) {
      onNext();
    }
  };

  const isValid = formData.name && formData.facility_type && formData.level;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Basic Facility Information
          </CardTitle>
          <CardDescription>
            Start by providing the essential details about your health facility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Facility Name *</Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => updateFormData({ name: e.target.value })}
              placeholder="Enter the full facility name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="code">Facility Code (Optional)</Label>
            <Input
              id="code"
              value={formData.code || ''}
              onChange={(e) => updateFormData({ code: e.target.value })}
              placeholder="Enter unique facility code"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="facility_type">Facility Type *</Label>
              <Select 
                value={formData.facility_type || ''} 
                onValueChange={(value) => updateFormData({ facility_type: value })}
              >
                <SelectTrigger className="mt-1">
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
              <Label htmlFor="level">Care Level *</Label>
              <Select 
                value={formData.level || ''} 
                onValueChange={(value) => updateFormData({ level: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select care level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="tertiary">Tertiary</SelectItem>
                  <SelectItem value="quaternary">Quaternary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!isValid} className="min-w-[120px]">
          Next <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
