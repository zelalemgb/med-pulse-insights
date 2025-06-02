
import { ProductData } from '@/types/pharmaceutical';
import { ForecastResult } from './forecastingEngine';
import { StockManager } from './inventory/stockManager';
import { AlertsManager } from './inventory/alertsManager';
import { MetricsCalculator } from './inventory/metricsCalculator';

// Re-export types for backward compatibility
export type { AlertLevel, AlertType, StockAlert, StockStatus, InventoryMetrics } from './inventory/types';

export class InventoryManager {
  /**
   * Update stock status for a product with real-time calculations
   */
  static updateStockStatus(product: ProductData, forecast?: ForecastResult) {
    return StockManager.updateStockStatus(product, forecast);
  }

  /**
   * Get all active alerts with filtering options
   */
  static getAlerts(filters?: {
    level?: any;
    type?: any;
    acknowledged?: boolean;
  }) {
    return AlertsManager.getAlerts(filters);
  }

  /**
   * Acknowledge an alert
   */
  static acknowledgeAlert(alertId: string): boolean {
    return AlertsManager.acknowledgeAlert(alertId);
  }

  /**
   * Get inventory metrics for dashboard
   */
  static getInventoryMetrics(products: ProductData[]) {
    return MetricsCalculator.calculateInventoryMetrics(products);
  }

  /**
   * Get stock status for a specific product
   */
  static getStockStatus(productId: string) {
    return StockManager.getStockStatus(productId);
  }

  /**
   * Update multiple products' stock status efficiently
   */
  static updateMultipleStockStatuses(products: ProductData[]) {
    return StockManager.updateMultipleStockStatuses(products);
  }

  /**
   * Get products requiring immediate attention
   */
  static getProductsRequiringAttention(products: ProductData[]) {
    return StockManager.getProductsRequiringAttention(products);
  }
}
