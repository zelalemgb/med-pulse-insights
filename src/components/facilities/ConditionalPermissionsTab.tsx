
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useConditionalPermissions } from '@/hooks/useConditionalPermissionsList';
import { useCreateConditionalPermission } from '@/hooks/useCreateConditionalPermission';
import { usePermissionUsageLog } from '@/hooks/usePermissionUsageLog';
import { useHealthFacilities } from '@/hooks/useHealthFacilities';
import { Clock, MapPin, Plus, Settings, BarChart3, User } from 'lucide-react';
import { format } from 'date-fns';

interface ConditionalPermissionsTabProps {
  facilityId?: string;
}

export const ConditionalPermissionsTab: React.FC<ConditionalPermissionsTabProps> = ({ facilityId }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPermission, setNewPermission] = useState({
    userId: '',
    facilityId: facilityId || '',
    permissionName: '',
    timeWindows: [{
      startHour: 9,
      endHour: 17,
      allowedDays: [1, 2, 3, 4, 5] // Monday to Friday
    }],
    locationConstraints: {
      requiredFacility: ''
    },
    expiresAt: ''
  });

  const { data: facilities } = useHealthFacilities();
  const { data: conditionalPermissions, isLoading: permissionsLoading } = useConditionalPermissions(facilityId);
  const { data: usageLog, isLoading: usageLoading } = usePermissionUsageLog(facilityId);
  const createPermissionMutation = useCreateConditionalPermission();

  const permissionTypes = [
    { value: 'view_data', label: 'View Data', description: 'Access to view facility data' },
    { value: 'edit_data', label: 'Edit Data', description: 'Modify facility information' },
    { value: 'export_data', label: 'Export Data', description: 'Download facility reports' },
    { value: 'manage_users', label: 'Manage Users', description: 'User administration' },
    { value: 'admin_access', label: 'Admin Access', description: 'Administrative functions' }
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleCreatePermission = async () => {
    if (!newPermission.userId || !newPermission.facilityId || !newPermission.permissionName) {
      return;
    }

    const conditions: any = {};
    
    if (newPermission.timeWindows.length > 0) {
      conditions.time_windows = newPermission.timeWindows;
    }
    
    if (newPermission.locationConstraints.requiredFacility) {
      conditions.location_constraints = newPermission.locationConstraints;
    }

    await createPermissionMutation.mutateAsync({
      userId: newPermission.userId,
      facilityId: newPermission.facilityId,
      permissionName: newPermission.permissionName,
      conditions,
      expiresAt: newPermission.expiresAt || undefined
    });

    setShowCreateForm(false);
    setNewPermission({
      userId: '',
      facilityId: facilityId || '',
      permissionName: '',
      timeWindows: [{
        startHour: 9,
        endHour: 17,
        allowedDays: [1, 2, 3, 4, 5]
      }],
      locationConstraints: {
        requiredFacility: ''
      },
      expiresAt: ''
    });
  };

  const formatTimeWindow = (window: any) => {
    const days = window.allowed_days?.map((d: number) => dayNames[d]).join(', ') || 'All days';
    return `${window.start_hour}:00 - ${window.end_hour}:00 (${days})`;
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Conditional Permissions</h3>
          <p className="text-sm text-gray-600">Manage time and location-based access controls</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Permission
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Create Conditional Permission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  placeholder="Enter user UUID"
                  value={newPermission.userId}
                  onChange={(e) => setNewPermission(prev => ({ ...prev, userId: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="facility">Facility</Label>
                <Select 
                  value={newPermission.facilityId} 
                  onValueChange={(value) => setNewPermission(prev => ({ ...prev, facilityId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select facility" />
                  </SelectTrigger>
                  <SelectContent>
                    {facilities?.map((facility) => (
                      <SelectItem key={facility.id} value={facility.id}>
                        {facility.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="permission">Permission Type</Label>
                <Select 
                  value={newPermission.permissionName} 
                  onValueChange={(value) => setNewPermission(prev => ({ ...prev, permissionName: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select permission" />
                  </SelectTrigger>
                  <SelectContent>
                    {permissionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div>{type.label}</div>
                          <div className="text-xs text-gray-500">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="expiresAt">Expires At (Optional)</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={newPermission.expiresAt}
                  onChange={(e) => setNewPermission(prev => ({ ...prev, expiresAt: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Time Constraints
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div>
                    <Label htmlFor="startHour">Start Hour</Label>
                    <Input
                      id="startHour"
                      type="number"
                      min="0"
                      max="23"
                      value={newPermission.timeWindows[0]?.startHour || 9}
                      onChange={(e) => setNewPermission(prev => ({
                        ...prev,
                        timeWindows: [{
                          ...prev.timeWindows[0],
                          startHour: parseInt(e.target.value)
                        }]
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endHour">End Hour</Label>
                    <Input
                      id="endHour"
                      type="number"
                      min="0"
                      max="23"
                      value={newPermission.timeWindows[0]?.endHour || 17}
                      onChange={(e) => setNewPermission(prev => ({
                        ...prev,
                        timeWindows: [{
                          ...prev.timeWindows[0],
                          endHour: parseInt(e.target.value)
                        }]
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Allowed Days</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dayNames.map((day, index) => (
                        <Badge
                          key={index}
                          variant={newPermission.timeWindows[0]?.allowedDays?.includes(index) ? "default" : "outline"}
                          className="cursor-pointer text-xs"
                          onClick={() => {
                            const currentDays = newPermission.timeWindows[0]?.allowedDays || [];
                            const newDays = currentDays.includes(index)
                              ? currentDays.filter(d => d !== index)
                              : [...currentDays, index];
                            
                            setNewPermission(prev => ({
                              ...prev,
                              timeWindows: [{
                                ...prev.timeWindows[0],
                                allowedDays: newDays
                              }]
                            }));
                          }}
                        >
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location Constraints (Optional)
                </Label>
                <Select 
                  value={newPermission.locationConstraints.requiredFacility} 
                  onValueChange={(value) => setNewPermission(prev => ({
                    ...prev,
                    locationConstraints: { requiredFacility: value }
                  }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Require access from specific facility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No location restriction</SelectItem>
                    {facilities?.map((facility) => (
                      <SelectItem key={facility.id} value={facility.id}>
                        {facility.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleCreatePermission} disabled={createPermissionMutation.isPending}>
                {createPermissionMutation.isPending ? 'Creating...' : 'Create Permission'}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Conditional Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          {permissionsLoading ? (
            <div className="text-center py-8">Loading permissions...</div>
          ) : conditionalPermissions && conditionalPermissions.length > 0 ? (
            <div className="space-y-4">
              {conditionalPermissions.map((permission) => (
                <div key={permission.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="default">
                          {permission.permission_name.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {permission.health_facilities && (
                          <Badge variant="outline">
                            {permission.health_facilities.name}
                          </Badge>
                        )}
                        {permission.expires_at && (
                          <Badge variant="secondary">
                            Expires {format(new Date(permission.expires_at), 'MMM d, yyyy')}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="font-medium">User:</span>{' '}
                          {permission.profiles?.full_name || permission.profiles?.email}
                        </div>
                        
                        {permission.conditions.time_windows && (
                          <div>
                            <span className="font-medium">Time Windows:</span>
                            <div className="ml-2">
                              {permission.conditions.time_windows.map((window, index) => (
                                <div key={index} className="text-xs text-gray-600">
                                  {formatTimeWindow(window)}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {permission.conditions.location_constraints?.required_facility && (
                          <div>
                            <span className="font-medium">Location:</span>{' '}
                            Must access from specified facility
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right text-xs text-gray-500">
                      <div>Created</div>
                      <div>{format(new Date(permission.created_at), 'MMM d, yyyy')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              No conditional permissions configured.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Permission Usage Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          {usageLoading ? (
            <div className="text-center py-8">Loading usage data...</div>
          ) : usageLog && usageLog.length > 0 ? (
            <div className="space-y-2">
              {usageLog.slice(0, 10).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center space-x-2">
                    <Badge variant={entry.access_granted ? "default" : "destructive"}>
                      {entry.access_granted ? "GRANTED" : "DENIED"}
                    </Badge>
                    <span className="text-sm">{entry.permission_name}</span>
                    <span className="text-xs text-gray-500">({entry.access_method})</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {format(new Date(entry.created_at), 'MMM d, h:mm a')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              No permission usage data available.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
