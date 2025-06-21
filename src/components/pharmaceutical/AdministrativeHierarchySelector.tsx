
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdministrativeHierarchy } from '@/hooks/useAdministrativeHierarchy';

interface AdministrativeHierarchySelectorProps {
  selectedRegionId?: string;
  selectedZoneId?: string;
  selectedWoredaId?: string;
  onRegionChange: (regionId: string) => void;
  onZoneChange: (zoneId: string) => void;
  onWoredaChange: (woredaId: string) => void;
  showAllOption?: boolean;
}

const AdministrativeHierarchySelector: React.FC<AdministrativeHierarchySelectorProps> = ({
  selectedRegionId,
  selectedZoneId,
  selectedWoredaId,
  onRegionChange,
  onZoneChange,
  onWoredaChange,
  showAllOption = true
}) => {
  const { regions, zones, woredas, fetchZones, fetchWoredas } = useAdministrativeHierarchy();

  const handleRegionChange = (regionId: string) => {
    onRegionChange(regionId);
    onZoneChange(''); // Reset zone selection
    onWoredaChange(''); // Reset woreda selection
    if (regionId !== 'all') {
      fetchZones(regionId);
    }
  };

  const handleZoneChange = (zoneId: string) => {
    onZoneChange(zoneId);
    onWoredaChange(''); // Reset woreda selection
    if (zoneId !== 'all') {
      fetchWoredas(zoneId);
    }
  };

  const filteredZones = selectedRegionId ? zones.filter(z => z.region_id === selectedRegionId) : zones;
  const filteredWoredas = selectedZoneId ? woredas.filter(w => w.zone_id === selectedZoneId) : woredas;

  return (
    <>
      {/* Region Selector */}
      <Select value={selectedRegionId || 'all'} onValueChange={handleRegionChange}>
        <SelectTrigger>
          <SelectValue placeholder="All Regions" />
        </SelectTrigger>
        <SelectContent>
          {showAllOption && <SelectItem value="all">All Regions</SelectItem>}
          {regions.map(region => (
            <SelectItem key={region.id} value={region.id}>
              {region.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Zone Selector */}
      <Select 
        value={selectedZoneId || 'all'} 
        onValueChange={handleZoneChange}
        disabled={!selectedRegionId || selectedRegionId === 'all'}
      >
        <SelectTrigger>
          <SelectValue placeholder="All Zones" />
        </SelectTrigger>
        <SelectContent>
          {showAllOption && <SelectItem value="all">All Zones</SelectItem>}
          {filteredZones.map(zone => (
            <SelectItem key={zone.id} value={zone.id}>
              {zone.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Woreda Selector */}
      <Select 
        value={selectedWoredaId || 'all'} 
        onValueChange={onWoredaChange}
        disabled={!selectedZoneId || selectedZoneId === 'all'}
      >
        <SelectTrigger>
          <SelectValue placeholder="All Woredas" />
        </SelectTrigger>
        <SelectContent>
          {showAllOption && <SelectItem value="all">All Woredas</SelectItem>}
          {filteredWoredas.map(woreda => (
            <SelectItem key={woreda.id} value={woreda.id}>
              {woreda.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default AdministrativeHierarchySelector;
