
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowLeft, ArrowRight, Upload, Package, BarChart3, FileCheck } from 'lucide-react';
import { ProductSelectionStep } from './wizard/ProductSelectionStep';
import { DataInputMethodStep } from './wizard/DataInputMethodStep';
import { ManualEntryStep } from './wizard/ManualEntryStep';
import { ValidationStep } from './wizard/ValidationStep';
import { ConfirmationStep } from './wizard/ConfirmationStep';

interface DataEntryWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (data: any) => void;
}

const steps = [
  { id: 1, title: 'Select Products', description: 'Choose medicines to track', icon: Package },
  { id: 2, title: 'Input Method', description: 'Manual entry or file upload', icon: Upload },
  { id: 3, title: 'Enter Data', description: 'Consumption and stock data', icon: BarChart3 },
  { id: 4, title: 'Review & Validate', description: 'Check for errors', icon: FileCheck },
  { id: 5, title: 'Confirm & Submit', description: 'Final review', icon: CheckCircle }
];

export const DataEntryWizard = ({ open, onOpenChange, onComplete }: DataEntryWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    selectedProducts: [] as string[],
    inputMethod: 'manual' as 'manual' | 'upload',
    entryData: {} as Record<string, any>,
    validationResults: null as any,
  });

  const updateWizardData = (data: Partial<typeof wizardData>) => {
    setWizardData(prev => ({ ...prev, ...data }));
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

  const handleComplete = () => {
    onComplete(wizardData);
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep(1);
    setWizardData({
      selectedProducts: [],
      inputMethod: 'manual',
      entryData: {},
      validationResults: null,
    });
    onOpenChange(false);
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return wizardData.selectedProducts.length > 0;
      case 2:
        return !!wizardData.inputMethod;
      case 3:
        return Object.keys(wizardData.entryData).length > 0;
      case 4:
        return !!wizardData.validationResults;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProductSelectionStep
            selectedProducts={wizardData.selectedProducts}
            onUpdateProducts={(products) => updateWizardData({ selectedProducts: products })}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <DataInputMethodStep
            inputMethod={wizardData.inputMethod}
            onSelectMethod={(method) => updateWizardData({ inputMethod: method })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <ManualEntryStep
            selectedProducts={wizardData.selectedProducts}
            inputMethod={wizardData.inputMethod}
            entryData={wizardData.entryData}
            onUpdateData={(data) => updateWizardData({ entryData: data })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <ValidationStep
            entryData={wizardData.entryData}
            onValidationComplete={(results) => updateWizardData({ validationResults: results })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
        return (
          <ConfirmationStep
            wizardData={wizardData}
            onSubmit={handleComplete}
            onPrev={prevStep}
          />
        );
      default:
        return null;
    }
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Pharmaceutical Data Entry Wizard</DialogTitle>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Step {currentStep} of {steps.length}</span>
              <span className="text-sm text-gray-500">{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex justify-between items-center mb-6 overflow-x-auto pb-2">
          {steps.map((step) => {
            const StepIcon = step.icon;
            return (
              <div key={step.id} className="flex flex-col items-center flex-1 min-w-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  currentStep > step.id 
                    ? 'bg-green-500 text-white' 
                    : currentStep === step.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.id ? <CheckCircle className="w-6 h-6" /> : <StepIcon className="w-6 h-6" />}
                </div>
                <div className="text-center mt-2">
                  <div className="text-xs font-medium truncate">{step.title}</div>
                  <div className="text-xs text-gray-500 truncate">{step.description}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <div className="min-h-[500px]">
          {renderStepContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
