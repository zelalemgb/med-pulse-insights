
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Filter, X } from 'lucide-react';

interface MapFiltersProps {
  filters: {
    facilityType: string;
    region: string;
    zone: string;
    product: string;
  };
  onFiltersChange: (filters: any) => void;
}

const MapFilters: React.FC<MapFiltersProps> = ({ filters, onFiltersChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      facilityType: 'all',
      region: 'all',
      zone: 'all',
      product: 'all'
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== 'all');

  return (
    <>
      {/* Filter Toggle Button */}
      <div className="absolute top-20 right-2 sm:right-4 z-[1000]">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/95 hover:bg-white text-gray-700 border border-gray-200 shadow-xl"
          size="sm"
        >
          <Filter className="w-4 h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="ml-1 sm:ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-32 right-2 sm:right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-xl border border-gray-200 w-[280px] sm:w-72 max-w-[calc(100vw-1rem)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Filter Facilities</h3>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant="ghost"
                  size="sm"
                  className="text-xs h-auto p-1"
                >
                  Clear All
                </Button>
              )}
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="h-auto p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {/* Facility Type */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Facility Type
              </label>
              <Select
                value={filters.facilityType}
                onValueChange={(value) => handleFilterChange('facilityType', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[1001]">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="health_center">Health Centers</SelectItem>
                  <SelectItem value="hospital">Hospitals</SelectItem>
                  <SelectItem value="pharmacy">Pharmacies</SelectItem>
                  <SelectItem value="regional_store">Regional Stores</SelectItem>
                  <SelectItem value="zonal_store">Zonal Stores</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Region */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Region
              </label>
              <Select
                value={filters.region}
                onValueChange={(value) => handleFilterChange('region', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[1001]">
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="Addis Ababa">Addis Ababa</SelectItem>
                  <SelectItem value="Oromia">Oromia</SelectItem>
                  <SelectItem value="Amhara">Amhara</SelectItem>
                  <SelectItem value="Tigray">Tigray</SelectItem>
                  <SelectItem value="SNNP">SNNP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Specific Product
              </label>
              <Select
                value={filters.product}
                onValueChange={(value) => handleFilterChange('product', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[1001]">
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="amoxicillin">Amoxicillin</SelectItem>
                  <SelectItem value="insulin">Insulin</SelectItem>
                  <SelectItem value="paracetamol">Paracetamol</SelectItem>
                  <SelectItem value="ors">ORS</SelectItem>
                  <SelectItem value="artemether">Artemether</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Showing facilities matching selected criteria
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MapFilters;
