
import { ProductData } from '@/types/pharmaceutical';
import { StockAlert, StockStatus, AlertLevel, AlertType } from './types';
import { ConsumptionAnalyzer } from '../consumptionAnalysis';

export class AlertsManager {
  private static alerts: Map<string, StockAlert> = new Map();

  /**
   * Generate and manage alerts based on stock status
   */
  static generateAlerts(product: ProductData, stockStatus: StockStatus): void {
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
}
