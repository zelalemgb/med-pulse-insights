
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

interface AuditSearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateRange: { start?: Date; end?: Date };
  setDateRange: (range: { start?: Date; end?: Date }) => void;
}

export const AuditSearchFilters: React.FC<AuditSearchFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="h-5 w-5 mr-2" />
          Search & Filter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search">Search Users/Actions</Label>
            <Input
              id="search"
              placeholder="Search by email, action, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={dateRange.start?.toISOString().split('T')[0] || ''}
              onChange={(e) => setDateRange({ 
                ...dateRange, 
                start: e.target.value ? new Date(e.target.value) : undefined 
              })}
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={dateRange.end?.toISOString().split('T')[0] || ''}
              onChange={(e) => setDateRange({ 
                ...dateRange, 
                end: e.target.value ? new Date(e.target.value) : undefined 
              })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
