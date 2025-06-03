
import React from 'react';
import { User, Settings, KeyRound } from 'lucide-react';
import { DropdownMenuItem, DropdownMenuGroup } from '@/components/ui/dropdown-menu';

interface ProfileActionsProps {
  handleProfileNavigation: (path: string) => void;
}

export const ProfileActions = ({ handleProfileNavigation }: ProfileActionsProps) => {
  return (
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
  );
};
