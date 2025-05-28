
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, Clock, ExternalLink, Settings, Sync } from 'lucide-react';
import { ExternalSystem } from '@/utils/apiClient';
import { syncManager, SyncStatus } from '@/utils/realTimeSync';

const SystemIntegration = () => {
  const [systems, setSystems] = useState<ExternalSystem[]>([
    {
      id: 'erp-001',
      name: 'SAP ERP',
      type: 'ERP',
      endpoint: 'https://api.example-erp.com',
      isActive: true,
      lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    },
    {
      id: 'wms-001',
      name: 'Warehouse Management',
      type: 'WMS',
      endpoint: 'https://api.example-wms.com',
      isActive: false,
      lastSync: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    },
    {
      id: 'lmis-001',
      name: 'Logistics MIS',
      type: 'LMIS',
      endpoint: 'https://api.example-lmis.com',
      isActive: true,
      lastSync: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    },
  ]);

  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isConnected: false,
    lastSync: null,
    pendingOperations: 0,
    errors: [],
  });

  const [newSystem, setNewSystem] = useState<Partial<ExternalSystem>>({
    name: '',
    type: 'ERP',
    endpoint: '',
    apiKey: '',
  });

  useEffect(() => {
    // Initialize sync manager with active systems
    systems.filter(sys => sys.isActive).forEach(sys => {
      syncManager.addSystem(sys);
    });

    // Start real-time sync
    syncManager.startRealTimeSync(30000); // 30 seconds

    // Get initial status
    setSyncStatus(syncManager.getStatus());

    return () => {
      syncManager.stopRealTimeSync();
    };
  }, [systems]);

  const handleSystemToggle = (systemId: string, isActive: boolean) => {
    setSystems(prevSystems =>
      prevSystems.map(sys =>
        sys.id === systemId
          ? { ...sys, isActive }
          : sys
      )
    );

    const system = systems.find(s => s.id === systemId);
    if (system) {
      if (isActive) {
        syncManager.addSystem({ ...system, isActive });
      } else {
        syncManager.removeSystem(systemId);
      }
    }
  };

  const handleManualSync = (systemId: string) => {
    const system = systems.find(s => s.id === systemId);
    if (system) {
      syncManager.queueOperation({
        type: 'UPDATE',
        entity: 'product',
        data: { systemId, timestamp: new Date() },
      });

      // Update last sync time
      setSystems(prevSystems =>
        prevSystems.map(sys =>
          sys.id === systemId
            ? { ...sys, lastSync: new Date() }
            : sys
        )
      );
    }
  };

  const handleAddSystem = () => {
    if (newSystem.name && newSystem.endpoint) {
      const system: ExternalSystem = {
        id: `sys-${Date.now()}`,
        name: newSystem.name,
        type: newSystem.type || 'ERP',
        endpoint: newSystem.endpoint,
        apiKey: newSystem.apiKey,
        isActive: false,
      };

      setSystems(prev => [...prev, system]);
      setNewSystem({ name: '', type: 'ERP', endpoint: '', apiKey: '' });
    }
  };

  const getStatusIcon = (system: ExternalSystem) => {
    if (!system.isActive) {
      return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
    
    const timeSinceSync = Date.now() - (system.lastSync?.getTime() || 0);
    if (timeSinceSync < 10 * 60 * 1000) { // Less than 10 minutes
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    
    return <Clock className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusText = (system: ExternalSystem) => {
    if (!system.isActive) return 'Inactive';
    
    const timeSinceSync = Date.now() - (system.lastSync?.getTime() || 0);
    if (timeSinceSync < 10 * 60 * 1000) return 'Connected';
    if (timeSinceSync < 60 * 60 * 1000) return 'Warning';
    return 'Disconnected';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Integration</h2>
        <div className="flex items-center gap-4">
          <Badge variant={syncStatus.isConnected ? 'default' : 'secondary'}>
            {syncStatus.isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
          {syncStatus.pendingOperations > 0 && (
            <Badge variant="outline">
              {syncStatus.pendingOperations} pending
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="systems" className="space-y-4">
        <TabsList>
          <TabsTrigger value="systems">Connected Systems</TabsTrigger>
          <TabsTrigger value="sync">Sync Status</TabsTrigger>
          <TabsTrigger value="add">Add System</TabsTrigger>
        </TabsList>

        <TabsContent value="systems" className="space-y-4">
          <div className="grid gap-4">
            {systems.map((system) => (
              <Card key={system.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(system)}
                    <div>
                      <CardTitle className="text-lg">{system.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{system.type} System</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{getStatusText(system)}</Badge>
                    <Switch
                      checked={system.isActive}
                      onCheckedChange={(checked) => handleSystemToggle(system.id, checked)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Endpoint</p>
                      <p className="text-muted-foreground flex items-center gap-1">
                        {system.endpoint}
                        <ExternalLink className="h-3 w-3" />
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Last Sync</p>
                      <p className="text-muted-foreground">
                        {system.lastSync 
                          ? system.lastSync.toLocaleString()
                          : 'Never'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleManualSync(system.id)}
                      disabled={!system.isActive}
                    >
                      <Sync className="h-4 w-4 mr-2" />
                      Sync Now
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Synchronization Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {systems.filter(s => s.isActive).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Systems</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {syncStatus.pendingOperations}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending Operations</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {syncStatus.errors.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Sync Errors</p>
                </div>
              </div>
              
              {syncStatus.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600">Recent Errors</h4>
                  {syncStatus.errors.map((error, index) => (
                    <p key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {error}
                    </p>
                  ))}
                </div>
              )}
              
              <div className="text-sm text-muted-foreground">
                Last sync: {syncStatus.lastSync ? syncStatus.lastSync.toLocaleString() : 'Never'}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="system-name">System Name</Label>
                  <Input
                    id="system-name"
                    value={newSystem.name || ''}
                    onChange={(e) => setNewSystem(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter system name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="system-type">System Type</Label>
                  <select
                    id="system-type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={newSystem.type || 'ERP'}
                    onChange={(e) => setNewSystem(prev => ({ ...prev, type: e.target.value as any }))}
                  >
                    <option value="ERP">ERP</option>
                    <option value="WMS">WMS</option>
                    <option value="LMIS">LMIS</option>
                    <option value="HMIS">HMIS</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="system-endpoint">API Endpoint</Label>
                <Input
                  id="system-endpoint"
                  value={newSystem.endpoint || ''}
                  onChange={(e) => setNewSystem(prev => ({ ...prev, endpoint: e.target.value }))}
                  placeholder="https://api.example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="system-apikey">API Key (Optional)</Label>
                <Input
                  id="system-apikey"
                  type="password"
                  value={newSystem.apiKey || ''}
                  onChange={(e) => setNewSystem(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Enter API key"
                />
              </div>
              
              <Button onClick={handleAddSystem} className="w-full">
                Add System
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemIntegration;
