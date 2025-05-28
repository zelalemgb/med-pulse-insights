
import { ProductData, Facility, User, PeriodData } from '@/types/pharmaceutical';
import { saveProductsToStorage, loadProductsFromStorage, addProductsToStorage } from './dataStorage';

// Data Access Layer - abstraction for different storage backends
export interface DataAccessInterface {
  // Product operations
  createProduct(product: ProductData): Promise<ProductData>;
  updateProduct(id: string, updates: Partial<ProductData>): Promise<ProductData>;
  deleteProduct(id: string): Promise<boolean>;
  getProduct(id: string): Promise<ProductData | null>;
  getProductsByFacility(facilityId: string): Promise<ProductData[]>;
  
  // Batch operations
  createProductsBatch(products: ProductData[]): Promise<ProductData[]>;
  updateProductsBatch(updates: Array<{id: string, data: Partial<ProductData>}>): Promise<ProductData[]>;
  
  // Analytics queries
  getConsumptionTrends(facilityId: string, startDate: Date, endDate: Date): Promise<any[]>;
  getStockOutProducts(facilityId: string): Promise<ProductData[]>;
  getWastageAnalysis(facilityId: string): Promise<any[]>;
}

// Local Storage implementation (current)
export class LocalStorageDataAccess implements DataAccessInterface {
  async createProduct(product: ProductData): Promise<ProductData> {
    const products = loadProductsFromStorage();
    const newProduct = { ...product, id: product.id || `product_${Date.now()}` };
    products.push(newProduct);
    saveProductsToStorage(products);
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<ProductData>): Promise<ProductData> {
    const products = loadProductsFromStorage();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Product ${id} not found`);
    
    products[index] = { ...products[index], ...updates, updatedAt: new Date() };
    saveProductsToStorage(products);
    return products[index];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const products = loadProductsFromStorage();
    const filtered = products.filter(p => p.id !== id);
    saveProductsToStorage(filtered);
    return filtered.length < products.length;
  }

  async getProduct(id: string): Promise<ProductData | null> {
    const products = loadProductsFromStorage();
    return products.find(p => p.id === id) || null;
  }

  async getProductsByFacility(facilityId: string): Promise<ProductData[]> {
    const products = loadProductsFromStorage();
    return products.filter(p => p.facilityId === facilityId);
  }

  async createProductsBatch(products: ProductData[]): Promise<ProductData[]> {
    const existing = loadProductsFromStorage();
    const newProducts = products.map(p => ({ ...p, id: p.id || `product_${Date.now()}_${Math.random()}` }));
    const combined = [...existing, ...newProducts];
    saveProductsToStorage(combined);
    return newProducts;
  }

  async updateProductsBatch(updates: Array<{id: string, data: Partial<ProductData>}>): Promise<ProductData[]> {
    const products = loadProductsFromStorage();
    const updated: ProductData[] = [];
    
    updates.forEach(({ id, data }) => {
      const index = products.findIndex(p => p.id === id);
      if (index !== -1) {
        products[index] = { ...products[index], ...data, updatedAt: new Date() };
        updated.push(products[index]);
      }
    });
    
    saveProductsToStorage(products);
    return updated;
  }

  async getConsumptionTrends(facilityId: string, startDate: Date, endDate: Date): Promise<any[]> {
    const products = await this.getProductsByFacility(facilityId);
    
    return products.map(product => {
      const relevantPeriods = product.periods.filter(period => {
        return period.calculatedAt && 
               period.calculatedAt >= startDate && 
               period.calculatedAt <= endDate;
      });
      
      return {
        productId: product.id,
        productName: product.productName,
        totalConsumption: relevantPeriods.reduce((sum, p) => sum + p.consumptionIssue, 0),
        avgAAMC: relevantPeriods.reduce((sum, p) => sum + p.aamc, 0) / (relevantPeriods.length || 1),
        avgWastageRate: relevantPeriods.reduce((sum, p) => sum + p.wastageRate, 0) / (relevantPeriods.length || 1)
      };
    });
  }

  async getStockOutProducts(facilityId: string): Promise<ProductData[]> {
    const products = await this.getProductsByFacility(facilityId);
    
    return products.filter(product => 
      product.periods.some(period => period.stockOutDays > 0)
    );
  }

  async getWastageAnalysis(facilityId: string): Promise<any[]> {
    const products = await this.getProductsByFacility(facilityId);
    
    return products.map(product => ({
      productId: product.id,
      productName: product.productName,
      venClassification: product.venClassification,
      totalExpiredDamaged: product.periods.reduce((sum, p) => sum + p.expiredDamaged, 0),
      avgWastageRate: product.annualAverages.wastageRate,
      unitPrice: product.unitPrice,
      estimatedLoss: product.periods.reduce((sum, p) => sum + p.expiredDamaged, 0) * product.unitPrice
    })).sort((a, b) => b.estimatedLoss - a.estimatedLoss);
  }
}

// Future database implementation placeholder
export class DatabaseDataAccess implements DataAccessInterface {
  private connectionString: string;
  
  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  // Implementation would use actual database queries
  async createProduct(product: ProductData): Promise<ProductData> {
    throw new Error('Database implementation not yet available');
  }

  async updateProduct(id: string, updates: Partial<ProductData>): Promise<ProductData> {
    throw new Error('Database implementation not yet available');
  }

  async deleteProduct(id: string): Promise<boolean> {
    throw new Error('Database implementation not yet available');
  }

  async getProduct(id: string): Promise<ProductData | null> {
    throw new Error('Database implementation not yet available');
  }

  async getProductsByFacility(facilityId: string): Promise<ProductData[]> {
    throw new Error('Database implementation not yet available');
  }

  async createProductsBatch(products: ProductData[]): Promise<ProductData[]> {
    throw new Error('Database implementation not yet available');
  }

  async updateProductsBatch(updates: Array<{id: string, data: Partial<ProductData>}>): Promise<ProductData[]> {
    throw new Error('Database implementation not yet available');
  }

  async getConsumptionTrends(facilityId: string, startDate: Date, endDate: Date): Promise<any[]> {
    throw new Error('Database implementation not yet available');
  }

  async getStockOutProducts(facilityId: string): Promise<ProductData[]> {
    throw new Error('Database implementation not yet available');
  }

  async getWastageAnalysis(facilityId: string): Promise<any[]> {
    throw new Error('Database implementation not yet available');
  }
}

// Factory for creating appropriate data access layer
export class DataAccessFactory {
  static create(type: 'localStorage' | 'database' = 'localStorage', config?: any): DataAccessInterface {
    switch (type) {
      case 'localStorage':
        return new LocalStorageDataAccess();
      case 'database':
        return new DatabaseDataAccess(config?.connectionString || '');
      default:
        throw new Error(`Unknown data access type: ${type}`);
    }
  }
}

// Service layer for business logic
export class ProductService {
  private dataAccess: DataAccessInterface;

  constructor(dataAccess: DataAccessInterface) {
    this.dataAccess = dataAccess;
  }

  async importProducts(products: ProductData[]): Promise<{ success: ProductData[], errors: string[] }> {
    const success: ProductData[] = [];
    const errors: string[] = [];

    try {
      // Batch create for performance
      const result = await this.dataAccess.createProductsBatch(products);
      success.push(...result);
    } catch (error) {
      errors.push(`Batch import failed: ${error}`);
      
      // Fallback to individual creates
      for (const product of products) {
        try {
          const created = await this.dataAccess.createProduct(product);
          success.push(created);
        } catch (err) {
          errors.push(`Failed to import ${product.productName}: ${err}`);
        }
      }
    }

    return { success, errors };
  }

  async calculateFacilityMetrics(facilityId: string): Promise<{
    totalProducts: number;
    totalConsumption: number;
    avgWastageRate: number;
    stockOutProducts: number;
  }> {
    const [products, stockOutProducts, wastageAnalysis] = await Promise.all([
      this.dataAccess.getProductsByFacility(facilityId),
      this.dataAccess.getStockOutProducts(facilityId),
      this.dataAccess.getWastageAnalysis(facilityId)
    ]);

    return {
      totalProducts: products.length,
      totalConsumption: products.reduce((sum, p) => sum + p.annualAverages.annualConsumption, 0),
      avgWastageRate: wastageAnalysis.reduce((sum, w) => sum + w.avgWastageRate, 0) / (wastageAnalysis.length || 1),
      stockOutProducts: stockOutProducts.length
    };
  }
}

// Global service instance
export const productService = new ProductService(DataAccessFactory.create('localStorage'));
