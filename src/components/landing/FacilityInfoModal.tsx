
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, BarChart3, CheckCircle } from 'lucide-react';
import { Facility } from './InteractiveLandingPage';

interface FacilityInfoModalProps {
  facility: Facility;
  onClose: () => void;
}

const FacilityInfoModal: React.FC<FacilityInfoModalProps> = ({ facility, onClose }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'stockout':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'In Stock';
      case 'partial':
        return 'Partial Stock';
      case 'stockout':
        return 'Stock Out';
      default:
        return 'Unknown';
    }
  };

  const getFacilityTypeText = (type: string) => {
    switch (type) {
      case 'health_center':
        return 'Health Center';
      case 'hospital':
        return 'Hospital';
      case 'pharmacy':
        return 'Pharmacy';
      case 'regional_store':
        return 'Regional Store';
      case 'zonal_store':
        return 'Zonal Store';
      default:
        return type;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{facility.name}</h3>
              <p className="text-sm text-gray-600 font-normal">
                {getFacilityTypeText(facility.type)}
              </p>
            </div>
            <Badge className={getStatusColor(facility.status)}>
              {getStatusText(facility.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Location */}
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium">{facility.wereda}, {facility.zone}</div>
              <div className="text-gray-600">{facility.region} Region</div>
            </div>
          </div>

          {/* Last Reported */}
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div className="text-sm">
              <span className="font-medium">Last reported: </span>
              <span className="text-gray-600">
                {new Date(facility.lastReported).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Stock Availability */}
          <div className="flex items-center gap-3">
            <BarChart3 className="w-4 h-4 text-gray-500" />
            <div className="text-sm">
              <span className="font-medium">Stock availability: </span>
              <span className="text-gray-600">{facility.stockAvailability}%</span>
            </div>
          </div>

          {/* Tracer Items */}
          <div className="flex items-center gap-3">
            <CheckCircle className="w-4 h-4 text-gray-500" />
            <div className="text-sm">
              <span className="font-medium">Tracer items available: </span>
              <span className="text-gray-600">
                {facility.tracerItems.available}/{facility.tracerItems.total}
              </span>
            </div>
          </div>

          {/* Reporting Completeness */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm font-medium mb-2">Reporting Completeness</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${facility.reportingCompleteness}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">
                {facility.reportingCompleteness}%
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FacilityInfoModal;
