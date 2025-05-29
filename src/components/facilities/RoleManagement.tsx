
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/pharmaceutical';
import { useToast } from '@/hooks/use-toast';
import { useLogRoleChange } from '@/hooks/useRoleAudit';
import { FacilityRoleManager } from './FacilityRoleManager';
import { AuditTrailTab } from './AuditTrailTab';
import { ConditionalPermissionsTab } from './ConditionalPermissionsTab';
import { Users, Shield, CheckCircle, AlertCircle, Building, History, Settings } from 'lucide-react';

export const RoleManagement = () => {
  const { updateUserRole, validateRole, profile } = useAuth();
  const { toast } = useToast();
  const logRoleChange = useLogRoleChange();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('facility_officer');
  const [changeReason, setChangeReason] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleGlobalRoleUpdate = async () => {
    if (!selectedUserId || !selectedRole) {
      toast({
        title: "Error",
        description: "Please select both user ID and role",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Get current role for audit logging
    const currentRole = profile?.role;
    
    const { error } = await updateUserRole(selectedUserId, selectedRole);
    
    if (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive"
      });
    } else {
      // Log the role change
      await logRoleChange.mutateAsync({
        targetUserId: selectedUserId,
        action: 'modify',
        roleType: 'global',
        oldRole: currentRole,
        newRole: selectedRole,
        reason: changeReason || 'Global role update',
        metadata: {
          interface: 'role_management',
          timestamp: new Date().toISOString()
        }
      });

      toast({
        title: "Success",
        description: `Global user role updated to ${selectedRole}`,
      });
      setSelectedUserId('');
      setSelectedRole('facility_officer');
      setChangeReason('');
    }
    setLoading(false);
  };

  const validateRoleInput = (role: string) => {
    return validateRole(role);
  };

  if (!canManageRoles) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h4 className="text-lg font-semibold mb-2">Access Denied</h4>
            <p className="text-gray-600">
              You don't have permission to manage user roles.
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
    <Tabs defaultValue="global" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="global" className="flex items-center">
          <Users className="h-4 w-4 mr-2" />
          Global Roles
        </TabsTrigger>
        <TabsTrigger value="facility" className="flex items-center">
          <Building className="h-4 w-4 mr-2" />
          Facility-Specific
        </TabsTrigger>
        <TabsTrigger value="audit" className="flex items-center">
          <History className="h-4 w-4 mr-2" />
          Audit Trail
        </TabsTrigger>
        <TabsTrigger value="conditional" className="flex items-center">
          <Settings className="h-4 w-4 mr-2" />
          Conditional Access
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center">
          <CheckCircle className="h-4 w-4 mr-2" />
          Analytics
        </TabsTrigger>
      </TabsList>

      <TabsContent value="global">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Global Role Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role Update Section */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Update Global User Role
                </h4>
                
                <div className="space-y-3">
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
                    <Label htmlFor="role">New Global Role</Label>
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

                  <div>
                    <Label htmlFor="reason">Reason for Change (Optional)</Label>
                    <Input
                      id="reason"
                      placeholder="Why is this role being changed?"
                      value={changeReason}
                      onChange={(e) => setChangeReason(e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={handleGlobalRoleUpdate} 
                    disabled={loading || !selectedUserId || !selectedRole}
                    className="w-full"
                  >
                    {loading ? "Updating..." : "Update Global Role"}
                  </Button>
                </div>
              </div>

              {/* Role Validation Section */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Role Validation
                </h4>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Valid roles in the system:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map((role) => (
                      <Badge 
                        key={role.value} 
                        variant={validateRoleInput(role.value) ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {role.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 mr-2" />
                    <div className="text-xs text-blue-800">
                      <p className="font-medium mb-1">Global Role Hierarchy:</p>
                      <p>National → Regional → Zonal → Facility Manager → Facility Officer</p>
                      <p className="mt-2 font-medium">Role Inheritance:</p>
                      <p>Higher-level roles inherit access to lower-level data and functions.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current User Info */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Your current global role:</span>
                <Badge variant="outline">
                  {profile?.role?.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="facility">
        <FacilityRoleManager />
      </TabsContent>

      <TabsContent value="audit">
        <AuditTrailTab />
      </TabsContent>

      <TabsContent value="conditional">
        <ConditionalPermissionsTab />
      </TabsContent>

      <TabsContent value="analytics">
        <Card>
          <CardHeader>
            <CardTitle>Permission Analytics Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-600">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Advanced permission analytics coming soon...</p>
              <p className="text-sm mt-2">This will include usage patterns, compliance reports, and security insights.</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
