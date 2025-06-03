
import React from 'react';
import { Calendar, Bell } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { DropdownMenuItem, DropdownMenuGroup } from '@/components/ui/dropdown-menu';

interface AdditionalActionsProps {
  user: User;
  handleProfileNavigation: (path: string) => void;
}

export const AdditionalActions = ({ user, handleProfileNavigation }: AdditionalActionsProps) => {
  return (
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
  );
};
