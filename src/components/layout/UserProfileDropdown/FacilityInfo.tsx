
import React from 'react';
import { Building } from 'lucide-react';
import { UserProfile } from '@/types/auth';
import { DropdownMenuItem, DropdownMenuGroup } from '@/components/ui/dropdown-menu';

interface FacilityInfoProps {
  profile: UserProfile;
  handleProfileNavigation: (path: string) => void;
}

export const FacilityInfo = ({ profile, handleProfileNavigation }: FacilityInfoProps) => {
  return (
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
  );
};
