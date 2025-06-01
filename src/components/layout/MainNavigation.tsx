import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { LogOut, User, Shield, Menu, X } from 'lucide-react';
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

const MainNavigation = () => {
  const { user, profile, signOut } = useAuth();
  const { isMobileMenuOpen, toggleMobileMenu } = useNavigation();
  const location = useLocation();

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

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
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
          {user && (
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActiveRoute(item.path)
                      ? "bg-blue-100 text-blue-700"
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
            {user ? (
              <>
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={toggleMobileMenu}
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
                    <Button variant="ghost" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        {profile?.full_name || user.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">
                          {profile?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        {profile?.role && (
                          <Badge className={`text-xs w-fit ${getRoleBadgeColor(profile.role)}`}>
                            {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                          </Badge>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Shield className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {user && isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                    isActiveRoute(item.path)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
