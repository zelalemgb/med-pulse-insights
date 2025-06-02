
export type AlertLevel = 'critical' | 'warning' | 'info';
export type AlertType = 'stockOut' | 'lowStock' | 'overStock' | 'expiring' | 'forecast' | 'consumption';

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  type: AlertType;
  level: AlertLevel;
  message: string;
  currentStock: number;
  threshold?: number;
  recommendation: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface StockStatus {
  productId: string;
  currentStock: number;
  safetyStock: number;
  reorderPoint: number;
  maxStock: number;
  daysOfStock: number;
  status: 'critical' | 'low' | 'adequate' | 'excess';
  lastUpdated: Date;
}

export interface InventoryMetrics {
  totalProducts: number;
  criticalStockCount: number;
  lowStockCount: number;
  adequateStockCount: number;
  excessStockCount: number;
  totalInventoryValue: number;
  turnoverRate: number;
  stockOutFrequency: number;
}
