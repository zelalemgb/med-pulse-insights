
export const getRoleBadgeColor = (role: string): string => {
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

export const getStatusBadgeColor = (isActive: boolean): string => {
  return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};
