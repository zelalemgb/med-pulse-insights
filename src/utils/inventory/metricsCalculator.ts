
import { ProductData } from '@/types/pharmaceutical';
import { InventoryMetrics, StockStatus } from './types';
import { StockManager } from './stockManager';

export class MetricsCalculator {
  /**
   * Calculate comprehensive inventory metrics for dashboard
   */
  static calculateInventoryMetrics(products: ProductData[]): InventoryMetrics {
    const stockStatuses = products.map(product => StockManager.getStockStatus(product.id))
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
}
