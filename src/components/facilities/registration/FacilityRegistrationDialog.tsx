
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { FacilityBasicInfoStep } from './FacilityBasicInfoStep';
import { FacilityLocationStep } from './FacilityLocationStep';
import { FacilityDetailsStep } from './FacilityDetailsStep';
import { FacilityConfirmationStep } from './FacilityConfirmationStep';
import { useCreateFacility } from '@/hooks/useHealthFacilities';
import { CreateFacilityRequest, HealthFacility } from '@/types/healthFacilities';

interface FacilityRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (facility: HealthFacility) => void;
}

const steps = [
  { id: 1, title: 'Basic Information', description: 'Facility name and type' },
  { id: 2, title: 'Location Details', description: 'Geographic information' },
  { id: 3, title: 'Additional Details', description: 'Capacity and services' },
  { id: 4, title: 'Review & Submit', description: 'Confirm your information' }
];

export const FacilityRegistrationDialog = ({ 
  open, 
  onOpenChange, 
  onSuccess 
}: FacilityRegistrationDialogProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateFacilityRequest>>({
    operational_status: 'active'
  });
  
  const createFacility = useCreateFacility();

  const updateFormData = (data: Partial<CreateFacilityRequest>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const facility = await createFacility.mutateAsync(formData as CreateFacilityRequest);
      onSuccess(facility);
      handleClose();
    } catch (error) {
      console.error('Error creating facility:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({ operational_status: 'active' });
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.facility_type && formData.level);
      case 2:
        return !!(formData.region && formData.zone);
      case 3:
        return true; // Optional step
      case 4:
        return true; // Review step
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <FacilityBasicInfoStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <FacilityLocationStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <FacilityDetailsStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <FacilityConfirmationStep
            formData={formData}
            onSubmit={handleSubmit}
            onPrev={prevStep}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Register New Health Facility</DialogTitle>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Step {currentStep} of {steps.length}</span>
              <span className="text-sm text-gray-500">{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex justify-between items-center mb-6">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                currentStep > step.id 
                  ? 'bg-green-500 text-white' 
                  : currentStep === step.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
              </div>
              <div className="text-center mt-2">
                <div className="text-xs font-medium">{step.title}</div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
