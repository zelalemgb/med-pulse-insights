
import React from 'react';
import { Button } from '@/components/ui/button';

interface AdminActionButtonsProps {
  loading: boolean;
  showCreateButton: boolean;
  onRefresh: () => void;
  onCreateFirstAdmin: () => void;
}

export const AdminActionButtons = ({ 
  loading, 
  showCreateButton, 
  onRefresh, 
  onCreateFirstAdmin 
}: AdminActionButtonsProps) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <Button onClick={onRefresh} disabled={loading}>
        {loading ? 'Checking...' : 'Refresh Status'}
      </Button>
      
      {showCreateButton && (
        <Button 
          onClick={onCreateFirstAdmin} 
          disabled={loading} 
          variant="outline"
          className="bg-green-50 hover:bg-green-100 border-green-200"
        >
          {loading ? 'Creating...' : 'Create First Admin'}
        </Button>
      )}
    </div>
  );
};
