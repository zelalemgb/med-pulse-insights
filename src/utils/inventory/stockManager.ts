
import { ProductData } from '@/types/pharmaceutical';
import { StockStatus } from './types';
import { ForecastingEngine, ForecastResult } from '../forecastingEngine';
import { ConsumptionAnalyzer } from '../consumptionAnalysis';
import { AlertsManager } from './alertsManager';

export class StockManager {
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
    AlertsManager.generateAlerts(product, stockStatus);
    
    return stockStatus;
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
