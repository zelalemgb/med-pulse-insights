
import { ProductData, PeriodData } from '@/types/pharmaceutical';
import { ForecastingEngine, ForecastResult } from './forecastingEngine';
import { ConsumptionAnalyzer } from './consumptionAnalysis';

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

export class InventoryManager {
  private static alerts: Map<string, StockAlert> = new Map();
  private static stockStatuses: Map<string, StockStatus> = new Map();

  /**
   * Update stock status for a product with real-time calculations
   */
  static updateStockStatus(product: ProductData, forecast?: ForecastResult): StockStatus {
    const currentPeriod = product.periods[product.periods.length - 1];
    const currentStock = currentPeriod?.endingBalance || 0;
    
    // Generate forecast if not provided
    const productForecast = forecast || ForecastingEngine.generateForecast(product);
    
    const avgConsumption = ConsumptionAnalyzer.calculateAAMC(product.periods);
    const daysOfStock = avgConsumption > 0 ? (currentStock / avgConsumption) * 30 : 0;
    
    let status: StockStatus['status'];
    if (daysOfStock === 0 || currentStock === 0) {
      status = 'critical';
    } else if (daysOfStock < 30) {
      status = 'low';
    } else if (daysOfStock > 180) {
      status = 'excess';
    } else {
      status = 'adequate';
    }

    const stockStatus: StockStatus = {
      productId: product.id,
      currentStock,
      safetyStock: productForecast.safetyStock,
      reorderPoint: productForecast.reorderPoint,
      maxStock: productForecast.maxStock,
      daysOfStock,
      status,
      lastUpdated: new Date()
    };

    this.stockStatuses.set(product.id, stockStatus);
    this.checkAndGenerateAlerts(product, stockStatus);
    
    return stockStatus;
  }

  /**
   * Generate and manage alerts based on stock status
   */
  private static checkAndGenerateAlerts(product: ProductData, stockStatus: StockStatus): void {
    const existingAlerts = Array.from(this.alerts.values())
      .filter(alert => alert.productId === product.id && !alert.acknowledged);

    // Clear existing alerts for this product
    existingAlerts.forEach(alert => this.alerts.delete(alert.id));

    const alerts: Omit<StockAlert, 'id' | 'timestamp' | 'acknowledged'>[] = [];

    // Stock out alert
    if (stockStatus.currentStock === 0) {
      alerts.push({
        productId: product.id,
        productName: product.productName,
        type: 'stockOut',
        level: 'critical',
        message: `${product.productName} is out of stock`,
        currentStock: stockStatus.currentStock,
        recommendation: 'Immediate procurement required - critical stock-out situation'
      });
    }
    // Low stock alert
    else if (stockStatus.status === 'critical' || stockStatus.currentStock <= stockStatus.reorderPoint) {
      alerts.push({
        productId: product.id,
        productName: product.productName,
        type: 'lowStock',
        level: 'critical',
        message: `${product.productName} has reached reorder point`,
        currentStock: stockStatus.currentStock,
        threshold: stockStatus.reorderPoint,
        recommendation: 'Place procurement order immediately'
      });
    }
    // Low stock warning
    else if (stockStatus.status === 'low') {
      alerts.push({
        productId: product.id,
        productName: product.productName,
        type: 'lowStock',
        level: 'warning',
        message: `${product.productName} stock is running low`,
        currentStock: stockStatus.currentStock,
        threshold: stockStatus.safetyStock,
        recommendation: 'Monitor closely and prepare for procurement'
      });
    }
    // Excess stock alert
    else if (stockStatus.status === 'excess') {
      alerts.push({
        productId: product.id,
        productName: product.productName,
        type: 'overStock',
        level: 'info',
        message: `${product.productName} has excess stock`,
        currentStock: stockStatus.currentStock,
        threshold: stockStatus.maxStock,
        recommendation: 'Review consumption patterns and adjust procurement'
      });
    }

    // Check for consumption anomalies
    const analysisResult = ConsumptionAnalyzer.analyzeProduct(product);
    if (analysisResult.metrics.variabilityCoefficient > 50) {
      alerts.push({
        productId: product.id,
        productName: product.productName,
        type: 'consumption',
        level: 'warning',
        message: `${product.productName} shows irregular consumption patterns`,
        currentStock: stockStatus.currentStock,
        recommendation: 'Review consumption data and adjust forecasting parameters'
      });
    }

    // Add alerts to the system
    alerts.forEach(alertData => {
      const alert: StockAlert = {
        ...alertData,
        id: `${product.id}-${alertData.type}-${Date.now()}`,
        timestamp: new Date(),
        acknowledged: false
      };
      this.alerts.set(alert.id, alert);
    });
  }

  /**
   * Get all active alerts with filtering options
   */
  static getAlerts(filters?: {
    level?: AlertLevel;
    type?: AlertType;
    acknowledged?: boolean;
  }): StockAlert[] {
    let alerts = Array.from(this.alerts.values());

    if (filters) {
      if (filters.level) {
        alerts = alerts.filter(alert => alert.level === filters.level);
      }
      if (filters.type) {
        alerts = alerts.filter(alert => alert.type === filters.type);
      }
      if (filters.acknowledged !== undefined) {
        alerts = alerts.filter(alert => alert.acknowledged === filters.acknowledged);
      }
    }

    return alerts.sort((a, b) => {
      // Sort by level priority (critical > warning > info) then by timestamp
      const levelPriority = { critical: 3, warning: 2, info: 1 };
      const levelDiff = levelPriority[b.level] - levelPriority[a.level];
      return levelDiff !== 0 ? levelDiff : b.timestamp.getTime() - a.timestamp.getTime();
    });
  }

  /**
   * Acknowledge an alert
   */
  static acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.acknowledged = true;
      this.alerts.set(alertId, alert);
      return true;
    }
    return false;
  }

  /**
   * Get inventory metrics for dashboard
   */
  static getInventoryMetrics(products: ProductData[]): InventoryMetrics {
    const stockStatuses = products.map(product => this.getStockStatus(product.id))
      .filter(status => status !== null) as StockStatus[];

    const criticalStockCount = stockStatuses.filter(s => s.status === 'critical').length;
    const lowStockCount = stockStatuses.filter(s => s.status === 'low').length;
    const adequateStockCount = stockStatuses.filter(s => s.status === 'adequate').length;
    const excessStockCount = stockStatuses.filter(s => s.status === 'excess').length;

    const totalInventoryValue = products.reduce((sum, product) => {
      const currentStock = product.periods[product.periods.length - 1]?.endingBalance || 0;
      return sum + (currentStock * product.unitPrice);
    }, 0);

    // Calculate turnover rate (annual consumption / average inventory)
    const totalAnnualConsumption = products.reduce((sum, product) => 
      sum + product.annualAverages.annualConsumption, 0
    );
    const averageInventoryValue = totalInventoryValue / 2; // Simplified calculation
    const turnoverRate = averageInventoryValue > 0 ? totalAnnualConsumption / averageInventoryValue : 0;

    // Calculate stock-out frequency
    const totalStockOuts = products.reduce((sum, product) => 
      sum + product.periods.filter(p => p.stockOutDays > 0).length, 0
    );
    const totalPeriods = products.reduce((sum, product) => sum + product.periods.length, 0);
    const stockOutFrequency = totalPeriods > 0 ? (totalStockOuts / totalPeriods) * 100 : 0;

    return {
      totalProducts: products.length,
      criticalStockCount,
      lowStockCount,
      adequateStockCount,
      excessStockCount,
      totalInventoryValue,
      turnoverRate,
      stockOutFrequency
    };
  }

  /**
   * Get stock status for a specific product
   */
  static getStockStatus(productId: string): StockStatus | null {
    return this.stockStatuses.get(productId) || null;
  }

  /**
   * Update multiple products' stock status efficiently
   */
  static updateMultipleStockStatuses(products: ProductData[]): StockStatus[] {
    return products.map(product => this.updateStockStatus(product));
  }

  /**
   * Get products requiring immediate attention
   */
  static getProductsRequiringAttention(products: ProductData[]): {
    criticalProducts: ProductData[];
    lowStockProducts: ProductData[];
    excessStockProducts: ProductData[];
  } {
    const statusMap = new Map<string, StockStatus>();
    
    // Update all stock statuses
    products.forEach(product => {
      const status = this.updateStockStatus(product);
      statusMap.set(product.id, status);
    });

    const criticalProducts = products.filter(p => 
      statusMap.get(p.id)?.status === 'critical'
    );
    const lowStockProducts = products.filter(p => 
      statusMap.get(p.id)?.status === 'low'
    );
    const excessStockProducts = products.filter(p => 
      statusMap.get(p.id)?.status === 'excess'
    );

    return {
      criticalProducts,
      lowStockProducts,
      excessStockProducts
    };
  }
}
