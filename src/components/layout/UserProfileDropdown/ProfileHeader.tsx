
import React from 'react';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/types/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenuLabel } from '@/components/ui/dropdown-menu';

interface ProfileHeaderProps {
  user: User;
  profile: UserProfile;
  getInitials: (name: string) => string;
  getRoleBadgeColor: (role: string) => string;
  getStatusBadgeColor: (isActive: boolean) => string;
}

export const ProfileHeader = ({ 
  user, 
  profile, 
  getInitials, 
  getRoleBadgeColor, 
  getStatusBadgeColor 
}: ProfileHeaderProps) => {
  return (
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
  );
};
