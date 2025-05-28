
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MultiLevelAggregation from '@/components/analytics/MultiLevelAggregation';
import AdvancedAnalytics from '@/components/analytics/AdvancedAnalytics';
import SystemIntegration from '@/components/integration/SystemIntegration';
import ScenarioPlanning from '@/components/analytics/ScenarioPlanning';
import AuditTrail from '@/components/analytics/AuditTrail';
import PerformanceEvaluation from '@/components/analytics/PerformanceEvaluation';
import { usePermissions } from '@/hooks/usePermissions';
import { performanceOptimizer } from '@/utils/performanceOptimizer';
import { auditTrail } from '@/utils/auditTrail';
import { useToast } from '@/hooks/use-toast';

const AnalyticsDashboard = () => {
  const { canAccess, userRole } = usePermissions();
  const { toast } = useToast();

  useEffect(() => {
    // Start performance monitoring
    performanceOptimizer.startMonitoring(30000);

    // Log dashboard access
    auditTrail.logUserAction(
      'current-user-id',
      'Current User',
      'ACCESS',
      'system',
      'analytics-dashboard',
      { role: userRole }
    );

    // Show welcome toast
    toast({
      title: "Analytics Dashboard",
      description: "Advanced analytics features loaded successfully.",
    });

    return () => {
      performanceOptimizer.stopMonitoring();
    };
  }, [userRole, toast]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive analytics and insights for pharmaceutical supply chain management
        </p>
      </div>

      <Tabs defaultValue="advanced" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="advanced">ML Analytics</TabsTrigger>
          <TabsTrigger value="aggregation">Multi-Level Data</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Planning</TabsTrigger>
          <TabsTrigger value="integration">System Integration</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="advanced">
          <AdvancedAnalytics />
        </TabsContent>

        <TabsContent value="aggregation">
          <MultiLevelAggregation />
        </TabsContent>

        <TabsContent value="scenarios">
          {canAccess.scenarioPlanning ? (
            <ScenarioPlanning />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">You don't have permission to access scenario planning features.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="integration">
          {canAccess.systemIntegration ? (
            <SystemIntegration />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">You don't have permission to access system integration features.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="audit">
          {canAccess.auditTrail ? (
            <AuditTrail />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">You don't have permission to access audit trail.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="performance">
          {canAccess.dataAnalysis ? (
            <PerformanceEvaluation />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">You don't have permission to access performance evaluation.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
