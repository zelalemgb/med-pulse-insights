
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <BrandLogo />
          </div>

          {/* Desktop Navigation */}
          {user && !loading && (
            <NavigationItems className="hidden md:flex items-center space-x-1" />
          )}

          {/* User Menu and Mobile Toggle */}
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="flex items-center gap-2 px-3 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline text-sm text-gray-600">Loading...</span>
              </div>
            ) : user ? (
              <>
                {/* Notification Bell */}
                <NotificationBell />

                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden min-h-[44px] min-w-[44px] p-2"
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
                  className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 min-h-[44px]"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Sign In
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
