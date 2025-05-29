
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/pharmaceutical';
import { useToast } from '@/hooks/use-toast';
import { useFacilityRoles, useAssignFacilityRole, useBulkAssignRoles, useRevokeFacilityRole } from '@/hooks/useFacilityRoles';
import { useHealthFacilities } from '@/hooks/useHealthFacilities';
import { Users, Shield, UserPlus, UserMinus, Trash2 } from 'lucide-react';

export const FacilityRoleManager = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const { data: facilities } = useHealthFacilities();
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('facility_officer');
  const [bulkUserIds, setBulkUserIds] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: facilityRoles } = useFacilityRoles(selectedFacilityId);
  const assignRoleMutation = useAssignFacilityRole();
  const bulkAssignMutation = useBulkAssignRoles();
  const revokeRoleMutation = useRevokeFacilityRole();

  const roles: { value: UserRole; label: string; description: string }[] = [
    { value: 'facility_officer', label: 'Facility Officer', description: 'Basic facility operations' },
    { value: 'facility_manager', label: 'Facility Manager', description: 'Full facility management' },
    { value: 'zonal', label: 'Zonal', description: 'Zone-level oversight' },
    { value: 'regional', label: 'Regional', description: 'Regional administration' },
    { value: 'national', label: 'National', description: 'National oversight' },
    { value: 'data_analyst', label: 'Data Analyst', description: 'Advanced analytics access' },
    { value: 'program_manager', label: 'Program Manager', description: 'Program oversight' },
    { value: 'procurement', label: 'Procurement', description: 'Procurement operations' },
    { value: 'finance', label: 'Finance', description: 'Financial oversight' },
    { value: 'qa', label: 'Quality Assurance', description: 'Quality control' },
    { value: 'viewer', label: 'Viewer', description: 'Read-only access' }
  ];

  const canManageRoles = profile?.role && ['national', 'regional', 'zonal'].includes(profile.role);

  const handleSingleAssignment = async () => {
    if (!selectedUserId || !selectedRole || !selectedFacilityId) {
      toast({
        title: "Error",
        description: "Please select facility, user ID, and role",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    await assignRoleMutation.mutateAsync({
      userId: selectedUserId,
      facilityId: selectedFacilityId,
      role: selectedRole
    });
    setLoading(false);
    setSelectedUserId('');
  };

  const handleBulkAssignment = async () => {
    if (!bulkUserIds.trim() || !selectedRole || !selectedFacilityId) {
      toast({
        title: "Error",
        description: "Please select facility, enter user IDs, and select role",
        variant: "destructive"
      });
      return;
    }

    const userIds = bulkUserIds.split('\n').map(id => id.trim()).filter(id => id);
    if (userIds.length === 0) {
      toast({
        title: "Error",
        description: "Please enter valid user IDs",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    await bulkAssignMutation.mutateAsync({
      userIds,
      facilityId: selectedFacilityId,
      role: selectedRole
    });
    setLoading(false);
    setBulkUserIds('');
  };

  const handleRevokeRole = async (roleId: string) => {
    await revokeRoleMutation.mutateAsync(roleId);
  };

  if (!canManageRoles) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h4 className="text-lg font-semibold mb-2">Access Denied</h4>
            <p className="text-gray-600">
              You don't have permission to manage facility-specific roles.
            </p>
            <Badge variant="secondary" className="mt-2">
              Current Role: {profile?.role}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Facility Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Facility-Specific Role Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="facility">Select Facility</Label>
              <Select value={selectedFacilityId} onValueChange={setSelectedFacilityId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a facility" />
                </SelectTrigger>
                <SelectContent>
                  {facilities?.map((facility) => (
                    <SelectItem key={facility.id} value={facility.id}>
                      {facility.name} ({facility.facility_type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedFacilityId && (
        <>
          {/* Role Assignment */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Single Assignment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign Single Role
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    placeholder="Enter user UUID"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex flex-col">
                            <span>{role.label}</span>
                            <span className="text-xs text-gray-500">{role.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleSingleAssignment} 
                  disabled={loading || !selectedUserId || !selectedRole}
                  className="w-full"
                >
                  {loading ? "Assigning..." : "Assign Role"}
                </Button>
              </CardContent>
            </Card>

            {/* Bulk Assignment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Bulk Role Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bulkUsers">User IDs (one per line)</Label>
                  <Textarea
                    id="bulkUsers"
                    placeholder="Enter user UUIDs, one per line..."
                    value={bulkUserIds}
                    onChange={(e) => setBulkUserIds(e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="bulkRole">Role for All Users</Label>
                  <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleBulkAssignment} 
                  disabled={loading || !bulkUserIds.trim() || !selectedRole}
                  className="w-full"
                >
                  {loading ? "Assigning..." : "Bulk Assign Roles"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Current Facility Roles */}
          <Card>
            <CardHeader>
              <CardTitle>Current Facility Roles</CardTitle>
            </CardHeader>
            <CardContent>
              {facilityRoles && facilityRoles.length > 0 ? (
                <div className="space-y-3">
                  {facilityRoles.map((roleAssignment) => (
                    <div key={roleAssignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="font-medium">
                              {roleAssignment.profiles?.full_name || 'Unknown User'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {roleAssignment.profiles?.email}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {roles.find(r => r.value === roleAssignment.role)?.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Granted on {new Date(roleAssignment.granted_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevokeRole(roleAssignment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserMinus className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No facility-specific roles assigned yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
