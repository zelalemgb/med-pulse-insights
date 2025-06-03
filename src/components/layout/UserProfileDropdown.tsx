
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { ProfileHeader } from './UserProfileDropdown/ProfileHeader';
import { ProfileActions } from './UserProfileDropdown/ProfileActions';
import { FacilityInfo } from './UserProfileDropdown/FacilityInfo';
import { AdditionalActions } from './UserProfileDropdown/AdditionalActions';
import { getRoleBadgeColor, getStatusBadgeColor, getInitials } from './UserProfileDropdown/utils';

export const UserProfileDropdown = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

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
        <ProfileHeader 
          user={user}
          profile={profile}
          getInitials={getInitials}
          getRoleBadgeColor={getRoleBadgeColor}
          getStatusBadgeColor={getStatusBadgeColor}
        />
        
        <DropdownMenuSeparator />

        <ProfileActions handleProfileNavigation={handleProfileNavigation} />

        <DropdownMenuSeparator />

        <FacilityInfo profile={profile} handleProfileNavigation={handleProfileNavigation} />

        <DropdownMenuSeparator />

        <AdditionalActions user={user} handleProfileNavigation={handleProfileNavigation} />

        <DropdownMenuSeparator />

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
