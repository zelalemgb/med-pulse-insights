
import { ProductData, Facility, User, PeriodData, ValidationResult } from '@/types/pharmaceutical';

// Abstract data access layer for future database integration
export interface DataAccessLayer {
  // Product operations
  createProduct(product: Omit<ProductData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductData>;
  getProduct(id: string): Promise<ProductData | null>;
  getProductsByFacility(facilityId: string): Promise<ProductData[]>;
  updateProduct(id: string, updates: Partial<ProductData>): Promise<ProductData>;
  deleteProduct(id: string): Promise<boolean>;
  
  // Batch operations
  createProductsBatch(products: Omit<ProductData, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<ProductData[]>;
  getProductsWithFilters(filters: ProductFilters): Promise<PaginatedResult<ProductData>>;
  
  // Period operations
  updatePeriodData(productId: string, periodIndex: number, data: Partial<PeriodData>): Promise<boolean>;
  getPeriodData(productId: string, periodIndex?: number): Promise<PeriodData[]>;
  
  // Analytics operations
  getConsumptionAnalytics(facilityId: string, dateRange: DateRange): Promise<ConsumptionAnalytics>;
  getWastageAnalytics(facilityId: string, dateRange: DateRange): Promise<WastageAnalytics>;
  getStockOutAnalytics(facilityId: string, dateRange: DateRange): Promise<StockOutAnalytics>;
  
  // Import operations
  logImport(summary: ImportSummary): Promise<string>;
  getImportHistory(userId: string): Promise<ImportSummary[]>;
}

export interface ProductFilters {
  facilityId?: string;
  venClassification?: string[];
  frequency?: string[];
  searchTerm?: string;
  dateRange?: DateRange;
  page?: number;
  limit?: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ConsumptionAnalytics {
  totalConsumption: number;
  averageMonthlyConsumption: number;
  consumptionTrend: TrendData[];
  topConsumingProducts: ProductConsumption[];
}

export interface WastageAnalytics {
  totalWastage: number;
  wastageRate: number;
  wastageByProduct: ProductWastage[];
  wastageByCategory: CategoryWastage[];
}

export interface StockOutAnalytics {
  totalStockOuts: number;
  stockOutRate: number;
  stockOutsByProduct: ProductStockOut[];
  averageStockOutDuration: number;
}

export interface TrendData {
  period: string;
  value: number;
}

export interface ProductConsumption {
  productId: string;
  productName: string;
  consumption: number;
  percentage: number;
}

export interface ProductWastage {
  productId: string;
  productName: string;
  wastage: number;
  wastageRate: number;
}

export interface CategoryWastage {
  category: string;
  wastage: number;
  percentage: number;
}

export interface ProductStockOut {
  productId: string;
  productName: string;
  stockOutDays: number;
  frequency: number;
}

export interface ImportSummary {
  id?: string;
  totalRows: number;
  successfulRows: number;
  errorRows: number;
  warnings: string[];
  mapping: any;
  timestamp: Date;
  userId?: string;
  filename?: string;
}

// In-memory implementation for development
export class InMemoryDataAccess implements DataAccessLayer {
  private products: Map<string, ProductData> = new Map();
  private importLogs: ImportSummary[] = [];

  async createProduct(product: Omit<ProductData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductData> {
    const newProduct: ProductData = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.products.set(newProduct.id, newProduct);
    return newProduct;
  }

  async getProduct(id: string): Promise<ProductData | null> {
    return this.products.get(id) || null;
  }

  async getProductsByFacility(facilityId: string): Promise<ProductData[]> {
    return Array.from(this.products.values()).filter(p => p.facilityId === facilityId);
  }

  async updateProduct(id: string, updates: Partial<ProductData>): Promise<ProductData> {
    const existing = this.products.get(id);
    if (!existing) {
      throw new Error(`Product ${id} not found`);
    }

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };

    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async createProductsBatch(products: Omit<ProductData, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<ProductData[]> {
    const createdProducts: ProductData[] = [];
    
    for (const product of products) {
      const created = await this.createProduct(product);
      createdProducts.push(created);
    }
    
    return createdProducts;
  }

  async getProductsWithFilters(filters: ProductFilters): Promise<PaginatedResult<ProductData>> {
    let filtered = Array.from(this.products.values());

    if (filters.facilityId) {
      filtered = filtered.filter(p => p.facilityId === filters.facilityId);
    }

    if (filters.venClassification?.length) {
      filtered = filtered.filter(p => filters.venClassification!.includes(p.venClassification));
    }

    if (filters.frequency?.length) {
      filtered = filtered.filter(p => filters.frequency!.includes(p.frequency));
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.productName.toLowerCase().includes(term) ||
        p.productCode?.toLowerCase().includes(term)
      );
    }

    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      page,
      limit,
      hasNext: end < filtered.length,
      hasPrevious: page > 1
    };
  }

  async updatePeriodData(productId: string, periodIndex: number, data: Partial<PeriodData>): Promise<boolean> {
    const product = this.products.get(productId);
    if (!product || !product.periods[periodIndex]) {
      return false;
    }

    product.periods[periodIndex] = {
      ...product.periods[periodIndex],
      ...data
    };

    product.updatedAt = new Date();
    this.products.set(productId, product);
    return true;
  }

  async getPeriodData(productId: string, periodIndex?: number): Promise<PeriodData[]> {
    const product = this.products.get(productId);
    if (!product) {
      return [];
    }

    if (periodIndex !== undefined) {
      return product.periods[periodIndex] ? [product.periods[periodIndex]] : [];
    }

    return product.periods;
  }

  async getConsumptionAnalytics(facilityId: string, dateRange: DateRange): Promise<ConsumptionAnalytics> {
    const products = await this.getProductsByFacility(facilityId);
    
    const totalConsumption = products.reduce((sum, p) => 
      sum + p.annualAverages.annualConsumption, 0
    );

    const averageMonthlyConsumption = totalConsumption / 12;

    const topConsumingProducts = products
      .map(p => ({
        productId: p.id,
        productName: p.productName,
        consumption: p.annualAverages.annualConsumption,
        percentage: (p.annualAverages.annualConsumption / totalConsumption) * 100
      }))
      .sort((a, b) => b.consumption - a.consumption)
      .slice(0, 10);

    return {
      totalConsumption,
      averageMonthlyConsumption,
      consumptionTrend: [], // Would be calculated from period data
      topConsumingProducts
    };
  }

  async getWastageAnalytics(facilityId: string, dateRange: DateRange): Promise<WastageAnalytics> {
    const products = await this.getProductsByFacility(facilityId);
    
    const wastageByProduct = products.map(p => ({
      productId: p.id,
      productName: p.productName,
      wastage: p.periods.reduce((sum, period) => sum + period.expiredDamaged, 0),
      wastageRate: p.annualAverages.wastageRate
    }));

    const totalWastage = wastageByProduct.reduce((sum, w) => sum + w.wastage, 0);
    const averageWastageRate = wastageByProduct.reduce((sum, w) => sum + w.wastageRate, 0) / wastageByProduct.length;

    return {
      totalWastage,
      wastageRate: averageWastageRate,
      wastageByProduct,
      wastageByCategory: [] // Would be calculated by VEN classification
    };
  }

  async getStockOutAnalytics(facilityId: string, dateRange: DateRange): Promise<StockOutAnalytics> {
    const products = await this.getProductsByFacility(facilityId);
    
    const stockOutsByProduct = products.map(p => ({
      productId: p.id,
      productName: p.productName,
      stockOutDays: p.periods.reduce((sum, period) => sum + period.stockOutDays, 0),
      frequency: p.periods.filter(period => period.stockOutDays > 0).length
    }));

    const totalStockOuts = stockOutsByProduct.reduce((sum, s) => sum + s.frequency, 0);
    const totalProducts = products.length;
    const stockOutRate = totalProducts > 0 ? (totalStockOuts / totalProducts) * 100 : 0;

    const totalStockOutDays = stockOutsByProduct.reduce((sum, s) => sum + s.stockOutDays, 0);
    const averageStockOutDuration = totalStockOuts > 0 ? totalStockOutDays / totalStockOuts : 0;

    return {
      totalStockOuts,
      stockOutRate,
      stockOutsByProduct,
      averageStockOutDuration
    };
  }

  async logImport(summary: ImportSummary): Promise<string> {
    const logEntry = {
      ...summary,
      id: Date.now().toString()
    };
    
    this.importLogs.push(logEntry);
    return logEntry.id!;
  }

  async getImportHistory(userId: string): Promise<ImportSummary[]> {
    return this.importLogs.filter(log => log.userId === userId);
  }
}

// Export singleton instance
export const dataAccess = new InMemoryDataAccess();
