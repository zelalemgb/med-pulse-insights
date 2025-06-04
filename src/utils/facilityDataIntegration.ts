
import { ProductData } from '@/types/pharmaceutical';
import { HealthFacility } from '@/types/healthFacilities';
import { supabaseDataAccess as dataAccess } from './dataAccessLayer';
import { useAuth } from '@/contexts/AuthContext';

export interface FacilityProductData extends ProductData {
  facility: HealthFacility;
}

export interface FacilityAnalytics {
  facilityId: string;
  facilityName: string;
  totalProducts: number;
  totalConsumption: number;
  averageAAMC: number;
  stockOutRate: number;
  wastageRate: number;
  performanceScore: number;
  lastUpdated: Date;
}

export interface CrossFacilityAnalytics {
  totalFacilities: number;
  aggregatedMetrics: {
    totalProducts: number;
    totalConsumption: number;
    averageAAMC: number;
    overallStockOutRate: number;
    overallWastageRate: number;
    systemPerformanceScore: number;
  };
  facilityComparisons: FacilityAnalytics[];
  topPerformingFacilities: FacilityAnalytics[];
  facilitiesNeedingAttention: FacilityAnalytics[];
}

export class FacilityDataIntegration {
  /**
   * Get products for a specific facility
   */
  static async getFacilityProducts(facilityId: string): Promise<ProductData[]> {
    return dataAccess.getProductsByFacility(facilityId);
  }

  /**
   * Get analytics for a specific facility
   */
  static async getFacilityAnalytics(facilityId: string, facility: HealthFacility): Promise<FacilityAnalytics> {
    const products = await this.getFacilityProducts(facilityId);
    
    const totalProducts = products.length;
    const totalConsumption = products.reduce((sum, p) => sum + p.annualAverages.annualConsumption, 0);
    const averageAAMC = products.length > 0 ? 
      products.reduce((sum, p) => sum + p.annualAverages.aamc, 0) / products.length : 0;
    
    const productsWithStockOuts = products.filter(p => 
      p.periods.some(period => period.stockOutDays > 0)
    ).length;
    const stockOutRate = totalProducts > 0 ? (productsWithStockOuts / totalProducts) * 100 : 0;
    
    const wastageRate = products.length > 0 ?
      products.reduce((sum, p) => sum + p.annualAverages.wastageRate, 0) / products.length : 0;
    
    const performanceScore = this.calculateFacilityPerformanceScore(stockOutRate, wastageRate, facility);

    return {
      facilityId,
      facilityName: facility.name,
      totalProducts,
      totalConsumption,
      averageAAMC,
      stockOutRate,
      wastageRate,
      performanceScore,
      lastUpdated: new Date()
    };
  }

  /**
   * Get cross-facility analytics for super admins
   */
  static async getCrossFacilityAnalytics(facilities: HealthFacility[]): Promise<CrossFacilityAnalytics> {
    const facilityAnalytics = await Promise.all(
      facilities.map(facility => this.getFacilityAnalytics(facility.id, facility))
    );

    const aggregatedMetrics = this.calculateAggregatedMetrics(facilityAnalytics);
    
    // Sort facilities by performance score
    const sortedByPerformance = [...facilityAnalytics].sort((a, b) => b.performanceScore - a.performanceScore);
    
    return {
      totalFacilities: facilities.length,
      aggregatedMetrics,
      facilityComparisons: facilityAnalytics,
      topPerformingFacilities: sortedByPerformance.slice(0, 5),
      facilitiesNeedingAttention: sortedByPerformance.filter(f => f.performanceScore < 60)
    };
  }

  /**
   * Calculate facility-specific performance score considering facility characteristics
   */
  private static calculateFacilityPerformanceScore(
    stockOutRate: number, 
    wastageRate: number, 
    facility: HealthFacility
  ): number {
    let baseScore = Math.max(0, 100 - (stockOutRate * 2) - (wastageRate * 3));
    
    // Adjust based on facility characteristics
    if (facility.level === 'primary') {
      // Primary facilities get slight tolerance for stock management challenges
      baseScore += 5;
    } else if (facility.level === 'tertiary') {
      // Tertiary facilities expected to have better management
      baseScore -= 3;
    }
    
    // Consider facility capacity
    if (facility.capacity && facility.capacity > 200) {
      // Larger facilities expected to have better systems
      baseScore -= 2;
    }
    
    return Math.min(100, Math.max(0, baseScore));
  }

  /**
   * Calculate aggregated metrics across all facilities
   */
  private static calculateAggregatedMetrics(analytics: FacilityAnalytics[]) {
    const totalProducts = analytics.reduce((sum, a) => sum + a.totalProducts, 0);
    const totalConsumption = analytics.reduce((sum, a) => sum + a.totalConsumption, 0);
    const averageAAMC = analytics.length > 0 ?
      analytics.reduce((sum, a) => sum + a.averageAAMC, 0) / analytics.length : 0;
    
    const weightedStockOutRate = analytics.length > 0 ?
      analytics.reduce((sum, a) => sum + (a.stockOutRate * a.totalProducts), 0) / totalProducts : 0;
    
    const weightedWastageRate = analytics.length > 0 ?
      analytics.reduce((sum, a) => sum + (a.wastageRate * a.totalProducts), 0) / totalProducts : 0;
    
    const systemPerformanceScore = analytics.length > 0 ?
      analytics.reduce((sum, a) => sum + a.performanceScore, 0) / analytics.length : 0;

    return {
      totalProducts,
      totalConsumption,
      averageAAMC,
      overallStockOutRate: weightedStockOutRate,
      overallWastageRate: weightedWastageRate,
      systemPerformanceScore
    };
  }

  /**
   * Get supply chain optimization recommendations by facility type
   */
  static async getSupplyChainOptimization(facilities: HealthFacility[]): Promise<{
    byLevel: Record<string, { facilities: number; recommendations: string[] }>;
    byRegion: Record<string, { facilities: number; recommendations: string[] }>;
    systemWide: string[];
  }> {
    const analytics = await this.getCrossFacilityAnalytics(facilities);
    
    // Group by facility level
    const byLevel: Record<string, { facilities: number; recommendations: string[] }> = {};
    const byRegion: Record<string, { facilities: number; recommendations: string[] }> = {};
    
    facilities.forEach(facility => {
      const facilityAnalytic = analytics.facilityComparisons.find(a => a.facilityId === facility.id);
      if (!facilityAnalytic) return;
      
      // Level-based recommendations
      if (!byLevel[facility.level]) {
        byLevel[facility.level] = { facilities: 0, recommendations: [] };
      }
      byLevel[facility.level].facilities++;
      
      // Region-based recommendations
      if (!byRegion[facility.region]) {
        byRegion[facility.region] = { facilities: 0, recommendations: [] };
      }
      byRegion[facility.region].facilities++;
      
      // Generate recommendations based on performance
      if (facilityAnalytic.stockOutRate > 15) {
        byLevel[facility.level].recommendations.push('Improve inventory forecasting systems');
        byRegion[facility.region].recommendations.push('Strengthen regional supply coordination');
      }
      
      if (facilityAnalytic.wastageRate > 10) {
        byLevel[facility.level].recommendations.push('Implement FEFO (First Expire, First Out) practices');
        byRegion[facility.region].recommendations.push('Regional training on expiry management');
      }
    });
    
    // Deduplicate recommendations
    Object.keys(byLevel).forEach(level => {
      byLevel[level].recommendations = [...new Set(byLevel[level].recommendations)];
    });
    
    Object.keys(byRegion).forEach(region => {
      byRegion[region].recommendations = [...new Set(byRegion[region].recommendations)];
    });
    
    const systemWide = [
      'Standardize inventory management practices across facility levels',
      'Implement inter-facility stock transfer protocols',
      'Establish regional pharmaceutical distribution hubs',
      'Deploy real-time stock monitoring systems'
    ];
    
    return { byLevel, byRegion, systemWide };
  }
}
