
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, MapPin, Globe } from 'lucide-react';

interface LevelSelectorProps {
  selectedLevel: 'zonal' | 'regional' | 'national';
  onLevelChange: (level: 'zonal' | 'regional' | 'national') => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ selectedLevel, onLevelChange }) => {
  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'zonal': return <MapPin className="h-4 w-4" />;
      case 'regional': return <Building2 className="h-4 w-4" />;
      case 'national': return <Globe className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getLevelIcon(selectedLevel)}
            Multi-Level Aggregation
          </CardTitle>
          <Select value={selectedLevel} onValueChange={onLevelChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="zonal">Zonal View</SelectItem>
              <SelectItem value="regional">Regional View</SelectItem>
              <SelectItem value="national">National View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
    </Card>
  );
};

export default LevelSelector;
