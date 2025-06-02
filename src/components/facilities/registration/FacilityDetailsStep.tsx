
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, ArrowLeft, ArrowRight } from 'lucide-react';
import { CreateFacilityRequest } from '@/types/healthFacilities';

interface FacilityDetailsStepProps {
  formData: Partial<CreateFacilityRequest>;
  updateFormData: (data: Partial<CreateFacilityRequest>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const FacilityDetailsStep = ({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrev 
}: FacilityDetailsStepProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Additional Details
          </CardTitle>
          <CardDescription>
            Provide additional information about capacity, staff, and services (all optional)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="capacity">Bed Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity || ''}
                onChange={(e) => updateFormData({ capacity: parseInt(e.target.value) || undefined })}
                placeholder="Number of beds"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="staff_count">Staff Count</Label>
              <Input
                id="staff_count"
                type="number"
                value={formData.staff_count || ''}
                onChange={(e) => updateFormData({ staff_count: parseInt(e.target.value) || undefined })}
                placeholder="Total staff"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="catchment_area">Catchment Area</Label>
              <Input
                id="catchment_area"
                type="number"
                value={formData.catchment_area || ''}
                onChange={(e) => updateFormData({ catchment_area: parseInt(e.target.value) || undefined })}
                placeholder="Population served"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="operational_status">Operational Status</Label>
            <Select 
              value={formData.operational_status || 'active'} 
              onValueChange={(value) => updateFormData({ operational_status: value as any })}
            >
              <SelectTrigger className="mt-1">
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
            <Label htmlFor="services_offered">Services Offered</Label>
            <Textarea
              id="services_offered"
              value={formData.services_offered?.join(', ') || ''}
              onChange={(e) => {
                const services = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                updateFormData({ services_offered: services.length > 0 ? services : undefined });
              }}
              placeholder="Enter services separated by commas (e.g., Emergency Care, Outpatient Services, Laboratory)"
              className="mt-1"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              List the main services your facility provides, separated by commas
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <Button onClick={onNext}>
          Review <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
