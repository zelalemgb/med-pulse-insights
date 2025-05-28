
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockPharmaceuticalData } from '@/data/pharmaceuticalData';
import { AlertTriangle, Package, TrendingDown, TrendingUp, Bell, CheckCircle, RefreshCw } from 'lucide-react';
import { InventoryManager, StockAlert, InventoryMetrics } from '@/utils/inventoryManager';
import { ConsumptionAnalyzer } from '@/utils/consumptionAnalysis';
import { ForecastingEngine } from '@/utils/forecastingEngine';
import { convertPharmaceuticalArrayToProductData } from '@/utils/dataAdapter';

export const InventoryStatus = () => {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [metrics, setMetrics] = useState<InventoryMetrics | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  // Convert pharmaceutical data to ProductData format
  const productData = convertPharmaceuticalArrayToProductData(mockPharmaceuticalData);

  // Initialize inventory analysis
  useEffect(() => {
    refreshInventoryData();
  }, []);

  const refreshInventoryData = async () => {
    setIsRefreshing(true);
    
    // Update all stock statuses
    InventoryManager.updateMultipleStockStatuses(productData);
    
    // Get current alerts and metrics
    const currentAlerts = InventoryManager.getAlerts({ acknowledged: showAcknowledged });
    const currentMetrics = InventoryManager.getInventoryMetrics(productData);
    
    setAlerts(currentAlerts);
    setMetrics(currentMetrics);
    setIsRefreshing(false);
  };

  const acknowledgeAlert = (alertId: string) => {
    InventoryManager.acknowledgeAlert(alertId);
    refreshInventoryData();
  };

  const getStockStatus = (endingBalance: number, aamc: number) => {
    if (aamc === 0) return { status: 'No Data', variant: 'secondary' as const };
    const monthsOfStock = endingBalance / aamc;
    if (monthsOfStock < 1) return { status: 'Critical', variant: 'destructive' as const };
    if (monthsOfStock < 3) return { status: 'Low', variant: 'outline' as const };
    return { status: 'Adequate', variant: 'default' as const };
  };

  const getVENBadgeColor = (classification: string) => {
    switch (classification) {
      case 'V': return 'destructive'; // Vital - Red
      case 'E': return 'secondary'; // Essential - Yellow
      case 'N': return 'default'; // Non-essential - Gray
      default: return 'default';
    }
  };

  const getAlertBadgeColor = (level: StockAlert['level']) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      case 'info': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Metrics Dashboard */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical Stock</p>
                  <p className="text-2xl font-bold text-red-600">{metrics.criticalStockCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-orange-600">{metrics.lowStockCount}</p>
                </div>
                <Package className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Adequate Stock</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.adequateStockCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                  <p className="text-2xl font-bold">${metrics.totalInventoryValue.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active Alerts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Active Alerts ({alerts.filter(a => !a.acknowledged).length})
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowAcknowledged(!showAcknowledged);
                  refreshInventoryData();
                }}
              >
                {showAcknowledged ? 'Hide Acknowledged' : 'Show Acknowledged'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshInventoryData}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.slice(0, 10).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 border rounded-lg ${
                    alert.acknowledged ? 'bg-gray-50 opacity-60' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getAlertBadgeColor(alert.level)}>
                          {alert.level.toUpperCase()}
                        </Badge>
                        <span className="text-sm font-medium">{alert.productName}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                      <p className="text-xs text-blue-600">{alert.recommendation}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <div className="text-right text-xs text-gray-500">
                        <div>Stock: {alert.currentStock}</div>
                        <div>{alert.timestamp.toLocaleTimeString()}</div>
                      </div>
                      {!alert.acknowledged && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {alerts.length > 10 && (
                <p className="text-center text-sm text-gray-500">
                  ... and {alerts.length - 10} more alerts
                </p>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              No active alerts
            </p>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Inventory Status with Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>VEN Class</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Days of Stock</TableHead>
                <TableHead>aAMC</TableHead>
                <TableHead>Consumption Pattern</TableHead>
                <TableHead>Forecast (Next Period)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recommendations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productData.map((product) => {
                const stockStatus = InventoryManager.getStockStatus(product.id);
                const consumptionAnalysis = ConsumptionAnalyzer.analyzeProduct(product);
                const forecast = ForecastingEngine.generateForecast(product);
                const latestPeriod = product.periods[product.periods.length - 1];
                
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.productName}</TableCell>
                    <TableCell>
                      <Badge variant={getVENBadgeColor(product.venClassification)}>
                        {product.venClassification}
                      </Badge>
                    </TableCell>
                    <TableCell>{latestPeriod.endingBalance} {product.unit}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {stockStatus ? Math.round(stockStatus.daysOfStock) : 0} days
                      </div>
                    </TableCell>
                    <TableCell>{consumptionAnalysis.metrics.aamc.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={
                        consumptionAnalysis.metrics.consumptionPattern === 'stable' ? 'default' :
                        consumptionAnalysis.metrics.consumptionPattern === 'increasing' ? 'secondary' :
                        'outline'
                      }>
                        {consumptionAnalysis.metrics.consumptionPattern}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {forecast.predictedConsumption[0]?.toFixed(0) || 0}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        stockStatus?.status === 'critical' ? 'destructive' :
                        stockStatus?.status === 'low' ? 'secondary' :
                        stockStatus?.status === 'excess' ? 'outline' : 'default'
                      }>
                        {stockStatus?.status || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1">
                        {consumptionAnalysis.recommendations.slice(0, 2).map((rec, index) => (
                          <div key={index} className="text-blue-600">{rec}</div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ... keep existing code (other cards and sections) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Critical Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockPharmaceuticalData.filter(product => 
                getStockStatus(product.quarters[3].endingBalance, product.annualAverages.aamc).status === 'Critical'
              ).map(product => (
                <div key={product.id} className="flex justify-between items-center p-2 border rounded">
                  <span className="text-sm font-medium">{product.productName}</span>
                  <Badge variant="destructive">Critical</Badge>
                </div>
              ))}
              {mockPharmaceuticalData.filter(product => 
                getStockStatus(product.quarters[3].endingBalance, product.annualAverages.aamc).status === 'Critical'
              ).length === 0 && (
                <p className="text-muted-foreground">No critical stock items</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>High Value Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockPharmaceuticalData
                .filter(product => product.unitPrice > 300)
                .map(product => (
                  <div key={product.id} className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm font-medium">{product.productName.substring(0, 30)}...</span>
                    <span className="text-sm font-bold">${product.unitPrice}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Procurement Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Total Inventory Value</h4>
                <p className="text-2xl font-bold">
                  $
                  {mockPharmaceuticalData.reduce((sum, product) => 
                    sum + (product.quarters[3].endingBalance * product.unitPrice), 0
                  ).toLocaleString()}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Items Requiring Reorder</h4>
                <p className="text-2xl font-bold text-red-600">
                  {mockPharmaceuticalData.filter(product => 
                    getStockStatus(product.quarters[3].endingBalance, product.annualAverages.aamc).status !== 'Adequate'
                  ).length}
                </p>
              </div>
              {metrics && (
                <>
                  <div>
                    <h4 className="font-medium">Inventory Turnover Rate</h4>
                    <p className="text-lg font-bold text-blue-600">
                      {metrics.turnoverRate.toFixed(2)}x
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Stock-out Frequency</h4>
                    <p className="text-lg font-bold text-orange-600">
                      {metrics.stockOutFrequency.toFixed(1)}%
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
