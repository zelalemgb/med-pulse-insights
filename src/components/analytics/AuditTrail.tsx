
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Search, Download, Shield, User, Database, AlertTriangle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { auditTrail, AuditEntry, AuditFilter, AuditReport } from '@/utils/auditTrail';
import { useToast } from '@/hooks/use-toast';
import type { DateRange } from 'react-day-picker';

const AuditTrail = () => {
  const { toast } = useToast();
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [auditReport, setAuditReport] = useState<AuditReport | null>(null);
  const [filter, setFilter] = useState<AuditFilter>({
    page: 1,
    limit: 50,
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAuditEntries();
    generateAuditReport();
    
    // Simulate some audit entries for demonstration
    simulateAuditEntries();
  }, [filter]);

  const simulateAuditEntries = () => {
    // Add some sample audit entries for demonstration
    const sampleEntries = [
      { action: 'LOGIN', entity: 'user', entityId: 'user-001', userName: 'John Doe' },
      { action: 'CREATE', entity: 'product', entityId: 'prod-123', userName: 'Jane Smith' },
      { action: 'UPDATE', entity: 'facility', entityId: 'fac-456', userName: 'Mike Johnson' },
      { action: 'DELETE', entity: 'report', entityId: 'rep-789', userName: 'Sarah Wilson' },
      { action: 'SECURITY_EVENT', entity: 'system', entityId: 'security', userName: 'System' },
    ];

    sampleEntries.forEach((entry, index) => {
      auditTrail.log({
        userId: `user-${index + 1}`,
        userName: entry.userName,
        action: entry.action,
        entityType: entry.entity as any,
        entityId: entry.entityId,
        changes: entry.action === 'UPDATE' ? [
          { field: 'status', oldValue: 'inactive', newValue: 'active' },
          { field: 'quantity', oldValue: 100, newValue: 150 }
        ] : undefined,
      });
    });
  };

  const loadAuditEntries = () => {
    setIsLoading(true);
    try {
      const entries = auditTrail.getAuditEntries({
        ...filter,
        startDate: dateRange?.from,
        endDate: dateRange?.to,
      });
      setAuditEntries(entries);
    } catch (error) {
      console.error('Failed to load audit entries:', error);
      toast({
        title: "Error",
        description: "Failed to load audit entries.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAuditReport = () => {
    try {
      const report = auditTrail.generateAuditReport(dateRange?.from, dateRange?.to);
      setAuditReport(report);
    } catch (error) {
      console.error('Failed to generate audit report:', error);
    }
  };

  const handleFilterChange = (field: keyof AuditFilter, value: any) => {
    setFilter(prev => ({ ...prev, [field]: value, page: 1 }));
  };

  const handleSearch = () => {
    loadAuditEntries();
    generateAuditReport();
  };

  const handleExportAudit = () => {
    try {
      const csvContent = [
        ['Timestamp', 'User', 'Action', 'Entity Type', 'Entity ID', 'IP Address'].join(','),
        ...auditEntries.map(entry => [
          entry.timestamp.toISOString(),
          entry.userName,
          entry.action,
          entry.entityType,
          entry.entityId,
          entry.ipAddress || 'Unknown'
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-trail-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Audit trail has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export audit trail.",
        variant: "destructive",
      });
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'LOGIN':
      case 'LOGOUT':
        return <User className="h-4 w-4" />;
      case 'CREATE':
      case 'UPDATE':
      case 'DELETE':
        return <Database className="h-4 w-4" />;
      case 'SECURITY_EVENT':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      case 'SECURITY_EVENT':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityBadge = (severity: 'low' | 'medium' | 'high') => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };
    return <Badge className={colors[severity]}>{severity.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Audit Trail</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadAuditEntries} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleExportAudit} disabled={auditEntries.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export Audit Log
          </Button>
        </div>
      </div>

      <Tabs defaultValue="entries" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entries">Audit Entries</TabsTrigger>
          <TabsTrigger value="reports">Analytics</TabsTrigger>
          <TabsTrigger value="security">Security Events</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filter Audit Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>User ID</Label>
                  <Input
                    value={filter.userId || ''}
                    onChange={(e) => handleFilterChange('userId', e.target.value)}
                    placeholder="Filter by user"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Action</Label>
                  <Select value={filter.action || ''} onValueChange={(value) => handleFilterChange('action', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All actions</SelectItem>
                      <SelectItem value="CREATE">Create</SelectItem>
                      <SelectItem value="UPDATE">Update</SelectItem>
                      <SelectItem value="DELETE">Delete</SelectItem>
                      <SelectItem value="LOGIN">Login</SelectItem>
                      <SelectItem value="LOGOUT">Logout</SelectItem>
                      <SelectItem value="SECURITY_EVENT">Security Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Entity Type</Label>
                  <Select value={filter.entityType || ''} onValueChange={(value) => handleFilterChange('entityType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All entities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All entities</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="facility">Facility</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="report">Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        className="p-3"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSearch} disabled={isLoading}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" onClick={() => {
                  setFilter({ page: 1, limit: 50 });
                  setDateRange(undefined);
                }}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audit Entries ({auditEntries.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Loading audit entries...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Changes</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          {format(entry.timestamp, 'MMM dd, yyyy HH:mm:ss')}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{entry.userName}</p>
                            <p className="text-xs text-muted-foreground">{entry.userId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getActionColor(entry.action)}>
                            <div className="flex items-center gap-1">
                              {getActionIcon(entry.action)}
                              {entry.action}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{entry.entityType}</p>
                            <p className="text-xs text-muted-foreground">{entry.entityId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {entry.changes && entry.changes.length > 0 ? (
                            <div className="text-xs">
                              {entry.changes.slice(0, 2).map((change, index) => (
                                <div key={index}>
                                  <span className="font-medium">{change.field}:</span>{' '}
                                  <span className="text-red-600">{String(change.oldValue)}</span> →{' '}
                                  <span className="text-green-600">{String(change.newValue)}</span>
                                </div>
                              ))}
                              {entry.changes.length > 2 && (
                                <p className="text-muted-foreground">+{entry.changes.length - 2} more</p>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">No changes</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-mono">{entry.ipAddress || 'Unknown'}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          {auditReport && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{auditReport.totalEntries}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{auditReport.userActivity.length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Security Events</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {auditReport.securityEvents.reduce((sum, event) => sum + event.count, 0)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top User Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {auditReport.userActivity.slice(0, 10).map((user) => (
                        <div key={user.userId} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{user.userName}</p>
                            <p className="text-xs text-muted-foreground">
                              Last activity: {format(user.lastActivity, 'MMM dd, HH:mm')}
                            </p>
                          </div>
                          <Badge variant="outline">{user.actionCount} actions</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Entity Changes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {auditReport.entityChanges.slice(0, 10).map((entity, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{entity.entityType}</p>
                            <p className="text-xs text-muted-foreground">
                              ID: {entity.entityId}
                            </p>
                          </div>
                          <Badge variant="outline">{entity.changeCount} changes</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          {auditReport && (
            <Card>
              <CardHeader>
                <CardTitle>Security Events Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditReport.securityEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="font-medium">{event.type.replace('_', ' ').toUpperCase()}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.count} occurrence(s)
                          </p>
                        </div>
                      </div>
                      {getSeverityBadge(event.severity)}
                    </div>
                  ))}
                  
                  {auditReport.securityEvents.length === 0 && (
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 mx-auto text-green-500 mb-4" />
                      <p className="text-lg font-medium text-green-600">No Security Events</p>
                      <p className="text-muted-foreground">All systems are secure</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditTrail;
