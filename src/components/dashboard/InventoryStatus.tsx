
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockPharmaceuticalData } from '@/data/pharmaceuticalData';
import { AlertTriangle, Package, TrendingDown, TrendingUp } from 'lucide-react';

export const InventoryStatus = () => {
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Inventory Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>VEN Class</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Stock Out Days (Q4)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quarterly Consumption</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPharmaceuticalData.map((product) => {
                const stockStatus = getStockStatus(product.quarters[3].endingBalance, product.annualAverages.aamc);
                const latestQuarter = product.quarters[3];
                
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.productName}</TableCell>
                    <TableCell>
                      <Badge variant={getVENBadgeColor(product.venClassification)}>
                        {product.venClassification}
                      </Badge>
                    </TableCell>
                    <TableCell>{latestQuarter.endingBalance} {product.unit}</TableCell>
                    <TableCell>${product.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>{latestQuarter.stockOutDays} days</TableCell>
                    <TableCell>
                      <Badge variant={stockStatus.variant}>{stockStatus.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {product.quarters.map((q, idx) => (
                        <div key={idx} className="text-sm">
                          Q{q.quarter}: {q.consumptionIssue}
                        </div>
                      ))}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
