
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/pharmaceutical';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[]; // Made optional since we're removing role restrictions
  fallback?: React.ReactNode;
  requireAuth?: boolean; // New prop to only check for authentication
}

const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles, 
  fallback = null,
  requireAuth = false
}) => {
  const { profile, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If requireAuth is true, only check for authentication
  if (requireAuth && !user) {
    return fallback ? <>{fallback}</> : (
      <div className="text-center p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">
            Authentication Required
          </h3>
          <p className="text-yellow-600">
            Please sign in to access this feature.
          </p>
        </div>
      </div>
    );
  }

  // Legacy role check - kept for backward compatibility but not enforced
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    // Instead of blocking access, we just pass through
    // Data filtering will be handled at the component level
    console.log(`User with role ${profile.role} accessing feature that previously required ${allowedRoles.join(', ')}`);
  }

  return <>{children}</>;
};

export default RoleGuard;
