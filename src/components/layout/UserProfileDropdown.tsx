
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Shield, Settings, Building, KeyRound, Bell, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

export const UserProfileDropdown = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

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

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
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

  const handleProfileNavigation = (path: string) => {
    navigate(path);
  };

  if (!user || !profile) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 min-h-[44px] transition-colors duration-200 p-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={profile?.full_name || 'User'} />
            <AvatarFallback className="text-sm">
              {getInitials(profile?.full_name || user.email || 'U')}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-sm font-medium max-w-[120px] truncate">
              {profile?.full_name || 'User'}
            </span>
            <span className="text-xs text-gray-500 max-w-[120px] truncate">
              {user.email}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 transition-all duration-200">
        {/* User Profile Header */}
        <DropdownMenuLabel>
          <div className="flex items-center space-x-3 p-2">
            <Avatar className="h-12 w-12">
              <AvatarImage src="" alt={profile?.full_name || 'User'} />
              <AvatarFallback className="text-lg">
                {getInitials(profile?.full_name || user.email || 'U')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <div className="flex items-center gap-2">
                {profile?.role && (
                  <Badge className={`text-xs ${getRoleBadgeColor(profile.role)}`}>
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1).replace('_', ' ')}
                  </Badge>
                )}
                <Badge className={`text-xs ${getStatusBadgeColor(profile?.is_active || false)}`}>
                  {profile?.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />

        {/* Profile Actions */}
        <DropdownMenuGroup>
          <DropdownMenuItem 
            onClick={() => handleProfileNavigation('/profile')}
            className="cursor-pointer"
          >
            <User className="w-4 h-4 mr-2" />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleProfileNavigation('/profile?tab=settings')}
            className="cursor-pointer"
          >
            <Settings className="w-4 h-4 mr-2" />
            Account Settings
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleProfileNavigation('/profile?tab=settings')}
            className="cursor-pointer"
          >
            <KeyRound className="w-4 h-4 mr-2" />
            Security & Password
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Facility Information */}
        <DropdownMenuGroup>
          <DropdownMenuItem 
            onClick={() => handleProfileNavigation('/profile?tab=facilities')}
            className="cursor-pointer"
          >
            <Building className="w-4 h-4 mr-2" />
            <div className="flex flex-col">
              <span>Linked Facilities</span>
              <span className="text-xs text-gray-500">
                {profile?.facility_id ? 'Primary facility assigned' : 'No primary facility'}
              </span>
            </div>
          </DropdownMenuItem>
          {profile?.department && (
            <DropdownMenuItem disabled>
              <div className="flex flex-col w-full">
                <span className="text-xs text-gray-500">Department</span>
                <span className="text-sm">{profile.department}</span>
              </div>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Additional Actions */}
        <DropdownMenuGroup>
          <DropdownMenuItem 
            onClick={() => handleProfileNavigation('/profile?tab=activity')}
            className="cursor-pointer"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Activity History
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Bell className="w-4 h-4 mr-2" />
            <div className="flex flex-col">
              <span>Member Since</span>
              <span className="text-xs text-gray-500">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Sign Out */}
        <DropdownMenuItem 
          onClick={handleSignOut} 
          className="text-red-600 focus:text-red-700 transition-colors duration-200 cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
