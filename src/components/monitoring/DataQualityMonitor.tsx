
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { pharmaValidator } from '@/utils/dataValidationFramework';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

interface DataQualityMetrics {
  completeness: number;
  accuracy: number;
  consistency: number;
  timeliness: number;
  validity: number;
  overall: number;
}

interface DataQualityIssue {
  type: 'error' | 'warning' | 'info';
  field: string;
  message: string;
  count: number;
  severity: 'high' | 'medium' | 'low';
}

interface DataQualityMonitorProps {
  data: any[];
  onIssueDetected?: (issues: DataQualityIssue[]) => void;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function DataQualityMonitor({
  data,
  onIssueDetected,
  autoRefresh = true,
  refreshInterval = 30000
}: DataQualityMonitorProps) {
  const [metrics, setMetrics] = useState<DataQualityMetrics>({
    completeness: 0,
    accuracy: 0,
    consistency: 0,
    timeliness: 0,
    validity: 0,
    overall: 0
  });
  const [issues, setIssues] = useState<DataQualityIssue[]>([]);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  // Calculate data quality metrics
  const calculateMetrics = useMemo(() => {
    return async (dataSet: any[]): Promise<{
      metrics: DataQualityMetrics;
      issues: DataQualityIssue[];
    }> => {
      if (!dataSet || dataSet.length === 0) {
        return {
          metrics: { completeness: 0, accuracy: 0, consistency: 0, timeliness: 0, validity: 0, overall: 0 },
          issues: []
        };
      }

      const detectedIssues: DataQualityIssue[] = [];
      let totalRecords = dataSet.length;
      let validRecords = 0;
      let completeRecords = 0;
      let accurateRecords = 0;
      let consistentRecords = 0;
      let timelyRecords = 0;

      // Required fields for pharmaceutical data
      const requiredFields = ['productName', 'batchNumber', 'expiryDate', 'quantity'];
      
      for (const record of dataSet) {
        let recordValid = true;
        let recordComplete = true;
        let recordAccurate = true;
        let recordConsistent = true;
        let recordTimely = true;

        // Completeness check
        for (const field of requiredFields) {
          if (!record[field] || record[field] === '') {
            recordComplete = false;
            recordValid = false;
            
            const existingIssue = detectedIssues.find(i => 
              i.field === field && i.message.includes('missing')
            );
            if (existingIssue) {
              existingIssue.count++;
            } else {
              detectedIssues.push({
                type: 'error',
                field,
                message: `Missing required field: ${field}`,
                count: 1,
                severity: 'high'
              });
            }
          }
        }

        // Validity check using validation framework
        try {
          const validationResult = await pharmaValidator.validateObject(record);
          if (!validationResult.isValid) {
            recordValid = false;
            recordAccurate = false;

            validationResult.errors.forEach(error => {
              const existingIssue = detectedIssues.find(i => 
                i.field === error.field && i.message === error.message
              );
              if (existingIssue) {
                existingIssue.count++;
              } else {
                detectedIssues.push({
                  type: 'error',
                  field: error.field,
                  message: error.message,
                  count: 1,
                  severity: error.severity === 'error' ? 'high' : 'medium'
                });
              }
            });

            validationResult.warnings.forEach(warning => {
              const existingIssue = detectedIssues.find(i => 
                i.field === warning.field && i.message === warning.message
              );
              if (existingIssue) {
                existingIssue.count++;
              } else {
                detectedIssues.push({
                  type: 'warning',
                  field: warning.field,
                  message: warning.message,
                  count: 1,
                  severity: 'low'
                });
              }
            });
          }
        } catch (error) {
          recordValid = false;
          detectedIssues.push({
            type: 'error',
            field: '_validation',
            message: 'Validation framework error',
            count: 1,
            severity: 'high'
          });
        }

        // Consistency checks
        if (record.quantity && record.unitPrice) {
          const totalValue = record.quantity * record.unitPrice;
          if (totalValue <= 0) {
            recordConsistent = false;
            detectedIssues.push({
              type: 'warning',
              field: 'totalValue',
              message: 'Inconsistent quantity and price calculation',
              count: 1,
              severity: 'medium'
            });
          }
        }

        // Timeliness check
        if (record.expiryDate) {
          const expiryDate = new Date(record.expiryDate);
          const now = new Date();
          if (expiryDate < now) {
            recordTimely = false;
            detectedIssues.push({
              type: 'warning',
              field: 'expiryDate',
              message: 'Product has expired',
              count: 1,
              severity: 'high'
            });
          }
        }

        // Update counters
        if (recordValid) validRecords++;
        if (recordComplete) completeRecords++;
        if (recordAccurate) accurateRecords++;
        if (recordConsistent) consistentRecords++;
        if (recordTimely) timelyRecords++;
      }

      // Calculate metrics as percentages
      const completeness = (completeRecords / totalRecords) * 100;
      const accuracy = (accurateRecords / totalRecords) * 100;
      const consistency = (consistentRecords / totalRecords) * 100;
      const timeliness = (timelyRecords / totalRecords) * 100;
      const validity = (validRecords / totalRecords) * 100;
      const overall = (completeness + accuracy + consistency + timeliness + validity) / 5;

      return {
        metrics: {
          completeness,
          accuracy,
          consistency,
          timeliness,
          validity,
          overall
        },
        issues: detectedIssues
      };
    };
  }, []);

  // Perform quality check
  const performQualityCheck = async () => {
    const result = await calculateMetrics(data);
    setMetrics(result.metrics);
    setIssues(result.issues);
    setLastChecked(new Date());
    
    if (onIssueDetected) {
      onIssueDetected(result.issues);
    }
  };

  // Initial check and auto-refresh
  useEffect(() => {
    performQualityCheck();
    
    if (autoRefresh) {
      const interval = setInterval(performQualityCheck, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [data, autoRefresh, refreshInterval]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const criticalIssues = issues.filter(issue => issue.severity === 'high');
  const warningIssues = issues.filter(issue => issue.severity === 'medium');

  return (
    <div className="space-y-6">
      {/* Overall Quality Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Data Quality Overview
            <Badge variant="outline" className="text-xs">
              Last checked: {lastChecked.toLocaleTimeString()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className={`text-4xl font-bold ${getScoreColor(metrics.overall)}`}>
              {metrics.overall.toFixed(1)}%
            </div>
            <p className="text-muted-foreground">Overall Data Quality Score</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(metrics).slice(0, 5).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className={`text-lg font-semibold ${getScoreColor(value)}`}>
                  {value.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground capitalize mb-2">
                  {key}
                </div>
                <Progress 
                  value={value} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Critical Issues Alert */}
      {criticalIssues.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {criticalIssues.length} critical data quality issue(s) detected that require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Issues Breakdown */}
      {issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Data Quality Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {issues.slice(0, 10).map((issue, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {issue.type === 'error' ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : issue.type === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <Info className="h-4 w-4 text-blue-500" />
                    )}
                    <div>
                      <div className="font-medium">{issue.message}</div>
                      <div className="text-sm text-muted-foreground">
                        Field: {issue.field}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={issue.severity === 'high' ? 'destructive' : 'secondary'}>
                      {issue.count} records
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {issue.severity} priority
                    </div>
                  </div>
                </div>
              ))}
              
              {issues.length > 10 && (
                <div className="text-center text-muted-foreground">
                  ... and {issues.length - 10} more issues
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quality Metrics Detail */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Metrics Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Data Completeness</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Percentage of records with all required fields populated
              </p>
              <div className="flex items-center gap-2">
                <Progress value={metrics.completeness} className="flex-1" />
                <span className={`text-sm font-medium ${getScoreColor(metrics.completeness)}`}>
                  {metrics.completeness.toFixed(1)}%
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Data Accuracy</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Percentage of records that pass validation rules
              </p>
              <div className="flex items-center gap-2">
                <Progress value={metrics.accuracy} className="flex-1" />
                <span className={`text-sm font-medium ${getScoreColor(metrics.accuracy)}`}>
                  {metrics.accuracy.toFixed(1)}%
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Data Consistency</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Percentage of records with internally consistent values
              </p>
              <div className="flex items-center gap-2">
                <Progress value={metrics.consistency} className="flex-1" />
                <span className={`text-sm font-medium ${getScoreColor(metrics.consistency)}`}>
                  {metrics.consistency.toFixed(1)}%
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Data Timeliness</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Percentage of records with current, non-expired data
              </p>
              <div className="flex items-center gap-2">
                <Progress value={metrics.timeliness} className="flex-1" />
                <span className={`text-sm font-medium ${getScoreColor(metrics.timeliness)}`}>
                  {metrics.timeliness.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
