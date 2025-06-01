
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { cn } from '@/lib/utils';
import { NavigationItems } from './NavigationItems';

export const MobileMenu = () => {
  const { user, loading } = useAuth();
  const { isMobileMenuOpen, closeMobileMenu } = useNavigation();

  const handleMobileNavClick = () => {
    closeMobileMenu();
  };

  if (!user || loading) return null;

  return (
    <div className={cn(
      "md:hidden border-t border-gray-200 transition-all duration-300 ease-in-out overflow-hidden",
      isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
    )}>
      <div className="px-2 pt-2 pb-3 space-y-1">
        <NavigationItems 
          className="space-y-1"
          onClick={handleMobileNavClick}
        />
      </div>
    </div>
  );
};
