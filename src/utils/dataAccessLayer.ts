import { ProductData, PeriodData } from '@/types/pharmaceutical';
import { performanceOptimizer } from './performanceOptimizer';
import { auditTrail } from './auditTrail';
import { supabase } from '@/integrations/supabase/client';

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

// Supabase-backed implementation
export class SupabaseDataAccess implements DataAccessLayer {
  async createProduct(product: Omit<ProductData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductData> {
    const { data, error } = await supabase
      .from('products')
      .insert({
        product_name: product.productName,
        product_code: product.productCode,
        unit: product.unit,
        unit_price: product.unitPrice,
        ven_classification: product.venClassification,
        facility_specific: product.facilitySpecific,
        procurement_source: product.procurementSource,
        frequency: product.frequency,
        facility_id: product.facilityId,
        annual_consumption: product.annualAverages.annualConsumption,
        aamc: product.annualAverages.aamc,
        wastage_rate: product.annualAverages.wastageRate,
        awamc: product.annualAverages.awamc,
        forecast: product.forecast,
        seasonality: product.seasonality,
        created_by: product.createdBy
      })
      .select()
      .single();
    if (error || !data) {
      throw error || new Error('Failed to create product');
    }

    if (product.periods?.length) {
      const periods = product.periods.map(p => ({
        product_id: data.id,
        period: p.period,
        period_name: p.periodName,
        beginning_balance: p.beginningBalance,
        received: p.received,
        positive_adj: p.positiveAdj,
        negative_adj: p.negativeAdj,
        ending_balance: p.endingBalance,
        stock_out_days: p.stockOutDays,
        expired_damaged: p.expiredDamaged,
        consumption_issue: p.consumptionIssue,
        aamc: p.aamc,
        wastage_rate: p.wastageRate,
        calculated_at: p.calculatedAt
      }));
      await supabase.from('period_data').insert(periods);
    }

    auditTrail.logUserAction(
      product.createdBy || 'system',
      'Unknown User',
      'CREATE',
      'product',
      data.id,
      { productName: data.product_name }
    );

    return this.getProduct(data.id) as Promise<ProductData>;
  }

  async getProduct(id: string): Promise<ProductData | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      return null;
    }

    const { data: periods } = await supabase
      .from('period_data')
      .select('*')
      .eq('product_id', id)
      .order('period');

    return {
      id: data.id,
      productName: data.product_name,
      productCode: data.product_code || undefined,
      unit: data.unit,
      unitPrice: data.unit_price,
      venClassification: data.ven_classification,
      facilitySpecific: data.facility_specific,
      procurementSource: data.procurement_source,
      frequency: data.frequency,
      facilityId: data.facility_id,
      periods: (periods || []).map(p => ({
        period: p.period,
        periodName: p.period_name,
        beginningBalance: p.beginning_balance,
        received: p.received,
        positiveAdj: p.positive_adj,
        negativeAdj: p.negative_adj,
        endingBalance: p.ending_balance,
        stockOutDays: p.stock_out_days,
        expiredDamaged: p.expired_damaged,
        consumptionIssue: p.consumption_issue,
        aamc: p.aamc,
        wastageRate: p.wastage_rate,
        calculatedAt: p.calculated_at ? new Date(p.calculated_at) : undefined
      })),
      annualAverages: {
        annualConsumption: data.annual_consumption,
        aamc: data.aamc,
        wastageRate: data.wastage_rate,
        awamc: data.awamc
      },
      forecast: data.forecast,
      seasonality: data.seasonality,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      createdBy: data.created_by
    };
  }

  async getProductsByFacility(facilityId: string): Promise<ProductData[]> {
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .eq('facility_id', facilityId);
    if (error || !data) {
      return [];
    }

    const products: ProductData[] = [];
    for (const row of data) {
      const product = await this.getProduct(row.id);
      if (product) products.push(product);
    }
    return products;
  }

  async updateProduct(id: string, updates: Partial<ProductData>): Promise<ProductData> {
    const { error } = await supabase
      .from('products')
      .update({
        product_name: updates.productName,
        product_code: updates.productCode,
        unit: updates.unit,
        unit_price: updates.unitPrice,
        ven_classification: updates.venClassification,
        facility_specific: updates.facilitySpecific,
        procurement_source: updates.procurementSource,
        frequency: updates.frequency,
        facility_id: updates.facilityId,
        annual_consumption: updates.annualAverages?.annualConsumption,
        aamc: updates.annualAverages?.aamc,
        wastage_rate: updates.annualAverages?.wastageRate,
        awamc: updates.annualAverages?.awamc,
        forecast: updates.forecast,
        seasonality: updates.seasonality,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    if (error) throw error;

    return (await this.getProduct(id))!;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  async createProductsBatch(products: Omit<ProductData, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<ProductData[]> {
    const created: ProductData[] = [];
    for (const p of products) {
      const prod = await this.createProduct(p);
      created.push(prod);
    }
    return created;
  }

  async getProductsWithFilters(filters: ProductFilters): Promise<PaginatedResult<ProductData>> {
    let query = supabase.from('products').select('id', { count: 'exact' });
    if (filters.facilityId) query = query.eq('facility_id', filters.facilityId);
    if (filters.venClassification?.length) query = query.in('ven_classification', filters.venClassification);
    if (filters.frequency?.length) query = query.in('frequency', filters.frequency);
    if (filters.searchTerm) query = query.ilike('product_name', `%${filters.searchTerm}%`);

    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error || !data) {
      return { data: [], total: 0, page, limit, hasNext: false, hasPrevious: false };
    }

    const products: ProductData[] = [];
    for (const row of data) {
      const product = await this.getProduct(row.id);
      if (product) products.push(product);
    }

    return {
      data: products,
      total: count || 0,
      page,
      limit,
      hasNext: count ? to + 1 < count : false,
      hasPrevious: page > 1
    };
  }

  async updatePeriodData(productId: string, periodIndex: number, data: Partial<PeriodData>): Promise<boolean> {
    const { data: existing } = await supabase
      .from('period_data')
      .select('id')
      .eq('product_id', productId)
      .eq('period', periodIndex)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('period_data')
        .update({
          period_name: data.periodName,
          beginning_balance: data.beginningBalance,
          received: data.received,
          positive_adj: data.positiveAdj,
          negative_adj: data.negativeAdj,
          ending_balance: data.endingBalance,
          stock_out_days: data.stockOutDays,
          expired_damaged: data.expiredDamaged,
          consumption_issue: data.consumptionIssue,
          aamc: data.aamc,
          wastage_rate: data.wastageRate,
          calculated_at: data.calculatedAt
        })
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('period_data').insert({
        product_id: productId,
        period: periodIndex,
        period_name: data.periodName,
        beginning_balance: data.beginningBalance,
        received: data.received,
        positive_adj: data.positiveAdj,
        negative_adj: data.negativeAdj,
        ending_balance: data.endingBalance,
        stock_out_days: data.stockOutDays,
        expired_damaged: data.expiredDamaged,
        consumption_issue: data.consumptionIssue,
        aamc: data.aamc,
        wastage_rate: data.wastageRate,
        calculated_at: data.calculatedAt
      });
      if (error) throw error;
    }
    return true;
  }

  async getPeriodData(productId: string, periodIndex?: number): Promise<PeriodData[]> {
    let query = supabase.from('period_data').select('*').eq('product_id', productId);
    if (periodIndex !== undefined) query = query.eq('period', periodIndex);
    const { data, error } = await query;
    if (error || !data) return [];
    return data.map(p => ({
      period: p.period,
      periodName: p.period_name,
      beginningBalance: p.beginning_balance,
      received: p.received,
      positiveAdj: p.positive_adj,
      negativeAdj: p.negative_adj,
      endingBalance: p.ending_balance,
      stockOutDays: p.stock_out_days,
      expiredDamaged: p.expired_damaged,
      consumptionIssue: p.consumption_issue,
      aamc: p.aamc,
      wastageRate: p.wastage_rate,
      calculatedAt: p.calculated_at ? new Date(p.calculated_at) : undefined
    }));
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
      consumptionTrend: [],
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
      wastageByCategory: []
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
    const { data, error } = await supabase
      .from('import_logs')
      .insert({
        filename: summary.filename,
        total_rows: summary.totalRows,
        successful_rows: summary.successfulRows,
        error_rows: summary.errorRows,
        warnings: summary.warnings,
        mapping: summary.mapping,
        imported_by: summary.userId,
        imported_at: summary.timestamp
      })
      .select('id')
      .single();
    if (error || !data) throw error || new Error('failed to log import');
    return data.id;
  }

  async getImportHistory(userId: string): Promise<ImportSummary[]> {
    const { data, error } = await supabase
      .from('import_logs')
      .select('*')
      .eq('imported_by', userId)
      .order('imported_at', { ascending: false });
    if (error || !data) return [];
    return data.map(d => ({
      id: d.id,
      totalRows: d.total_rows,
      successfulRows: d.successful_rows,
      errorRows: d.error_rows,
      warnings: d.warnings,
      mapping: d.mapping,
      timestamp: new Date(d.imported_at),
      userId: d.imported_by,
      filename: d.filename
    }));
  }
}

export const supabaseDataAccess = new SupabaseDataAccess();
