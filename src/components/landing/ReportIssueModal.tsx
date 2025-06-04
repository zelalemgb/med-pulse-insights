
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Camera, MapPin, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportIssueModal: React.FC<ReportIssueModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'permission' | 'form' | 'success'>('permission');
  const [formData, setFormData] = useState({
    location: '',
    drugName: '',
    comment: '',
    photo: null as File | null
  });

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
          }));
          setStep('form');
        },
        (error) => {
          console.error('Location error:', error);
          setStep('form'); // Continue without location
        }
      );
    } else {
      setStep('form'); // Continue without location
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally submit the report
    console.log('Submitting report:', formData);
    setStep('success');
  };

  const resetForm = () => {
    setFormData({
      location: '',
      drugName: '',
      comment: '',
      photo: null
    });
    setStep('permission');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        {step === 'permission' && (
          <>
            <DialogHeader>
              <DialogTitle>Report a Drug Issue</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Help your community by reporting medicine availability issues. 
                We'll ask for your location to provide better assistance.
              </p>
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={requestLocation}
                  className="flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Allow Location & Continue
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setStep('form')}
                  className="text-sm"
                >
                  Continue Without Location
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle>Report Drug Issue</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {formData.location && (
                <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                  📍 Location detected: {formData.location}
                </div>
              )}

              <div>
                <Label htmlFor="drugName">Medicine Name (Optional)</Label>
                <Input
                  id="drugName"
                  placeholder="e.g. Amoxicillin, Insulin"
                  value={formData.drugName}
                  onChange={(e) => setFormData(prev => ({ ...prev, drugName: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="comment">Describe the Issue</Label>
                <Textarea
                  id="comment"
                  placeholder="e.g. No insulin available at 3 pharmacies I visited"
                  value={formData.comment}
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="photo">Attach Prescription Photo (Optional)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('photo')?.click()}
                    className="flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    {formData.photo ? 'Photo Selected' : 'Add Photo'}
                  </Button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1 flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Submit Report
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Want to track your reports? 
                <Link to="/auth" className="text-blue-600 hover:underline ml-1">
                  Sign up here
                </Link>
              </div>
            </form>
          </>
        )}

        {step === 'success' && (
          <>
            <DialogHeader>
              <DialogTitle>Report Submitted!</DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-4">
              <div className="text-4xl">✅</div>
              <p className="text-sm text-gray-600">
                Thank you for helping your community. Your report has been submitted 
                and will help improve medicine availability.
              </p>
              <div className="flex gap-3">
                <Button onClick={resetForm} className="flex-1">
                  Submit Another Report
                </Button>
                <Link to="/auth" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Join MediLink
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportIssueModal;
