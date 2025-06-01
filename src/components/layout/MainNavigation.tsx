import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { LogOut, User, Shield, Menu, X, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { useNavigationAnalytics } from '@/hooks/useNavigationAnalytics';
import { toast } from 'sonner';

const MainNavigation = () => {
  const { user, profile, signOut, loading } = useAuth();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useNavigation();
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize navigation analytics tracking
  useNavigationAnalytics();

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/facilities', label: 'Facilities' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/role-testing', label: 'Role Testing' },
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'national':
        return 'bg-purple-100 text-purple-800';
      case 'regional':
        return 'bg-blue-100 text-blue-800';
      case 'zonal':
        return 'bg-green-100 text-green-800';
      case 'facility_manager':
        return 'bg-orange-100 text-orange-800';
      case 'facility_officer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const handleMobileNavClick = () => {
    closeMobileMenu();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/auth', { replace: true });
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-80">
              <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xl font-semibold text-gray-900 hidden sm:block">
                Pharmaceutical Analytics
              </span>
              <span className="text-lg font-semibold text-gray-900 sm:hidden">
                PharmAnalytics
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {user && !loading && (
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 min-h-[44px] flex items-center",
                    isActiveRoute(item.path)
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
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

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-2 min-h-[44px] transition-colors duration-200"
                    >
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline max-w-[150px] truncate">
                        {profile?.full_name || user.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 transition-all duration-200">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-2">
                        <p className="text-sm font-medium truncate">
                          {profile?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        {profile?.role && (
                          <Badge className={`text-xs w-fit ${getRoleBadgeColor(profile.role)}`}>
                            {profile.role.charAt(0).toUpperCase() + profile.role.slice(1).replace('_', ' ')}
                          </Badge>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleSignOut} 
                      className="text-red-600 focus:text-red-700 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
        {user && !loading && (
          <div className={cn(
            "md:hidden border-t border-gray-200 transition-all duration-300 ease-in-out overflow-hidden",
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleMobileNavClick}
                  className={cn(
                    "block px-4 py-3 rounded-md text-base font-medium transition-all duration-200 min-h-[48px] flex items-center",
                    isActiveRoute(item.path)
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainNavigation;
