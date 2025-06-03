
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { Menu, X, Loader2, Shield } from 'lucide-react';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { BrandLogo } from './BrandLogo';
import NavigationItems from './NavigationItems';
import { UserProfileDropdown } from './UserProfileDropdown';
import { MobileMenu } from './MobileMenu';

const MainNavigation = () => {
  const { user, loading } = useAuth();
  const { isMobileMenuOpen, toggleMobileMenu } = useNavigation();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo and Brand */}
          <div className="flex items-center flex-shrink-0 min-w-0">
            <BrandLogo />
          </div>

          {/* Desktop Navigation - Hidden on smaller screens to prevent overlap */}
          {user && !loading && (
            <div className="hidden lg:flex flex-1 justify-center max-w-md xl:max-w-lg">
              <NavigationItems className="flex items-center space-x-1 overflow-hidden" />
            </div>
          )}

          {/* User Menu and Mobile Toggle */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {loading ? (
              <div className="flex items-center gap-2 px-2 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline text-sm text-gray-600">Loading...</span>
              </div>
            ) : user ? (
              <>
                {/* Notification Bell */}
                <NotificationBell />

                {/* Mobile Menu Button - Show on lg and below */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden min-h-[40px] min-w-[40px] p-2"
                  onClick={toggleMobileMenu}
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>

                {/* Enhanced User Dropdown */}
                <UserProfileDropdown />
              </>
            ) : (
              <Link to="/auth">
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 min-h-[40px] text-xs sm:text-sm px-2 sm:px-4"
                >
                  <Shield className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                  <span className="sm:hidden">Sign</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <MobileMenu />
      </div>
    </nav>
  );
};

export default MainNavigation;
