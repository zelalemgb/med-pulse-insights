
import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface AdminStatusDisplayProps {
  hasNationalUsers: boolean | null;
  user: any;
}

export const AdminStatusDisplay = ({ hasNationalUsers, user }: AdminStatusDisplayProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center">
        {hasNationalUsers === true ? (
          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
        ) : hasNationalUsers === false ? (
          <AlertCircle className="h-4 w-4 text-orange-600 mr-2" />
        ) : (
          <div className="h-4 w-4 mr-2 animate-pulse bg-gray-300 rounded-full" />
        )}
        <span className="font-medium">
          National Users Exist: {' '}
          {hasNationalUsers === null ? (
            <span className="text-gray-500">Checking...</span>
          ) : hasNationalUsers ? (
            <span className="text-green-600">Yes</span>
          ) : (
            <span className="text-orange-600">No - You can create the first admin!</span>
          )}
        </span>
      </div>

      {user && (
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <strong>Current User:</strong> {user.email}
          <br />
          <strong>User ID:</strong> <code className="text-xs">{user.id}</code>
        </div>
      )}

      {!user && (
        <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
          <strong>Not logged in:</strong> Please sign in to create the first admin.
        </div>
      )}
    </div>
  );
};
