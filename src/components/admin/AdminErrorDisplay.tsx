
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface AdminErrorDisplayProps {
  error: string;
}

export const AdminErrorDisplay = ({ error }: AdminErrorDisplayProps) => {
  return (
    <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
      <AlertCircle className="h-4 w-4 text-red-600 mr-2 flex-shrink-0" />
      <span className="text-red-700 text-sm">{error}</span>
    </div>
  );
};
