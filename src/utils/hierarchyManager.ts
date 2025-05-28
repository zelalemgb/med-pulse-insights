
import { ProductData } from '@/types/pharmaceutical';
import { AggregationLevel } from '@/types/aggregation';

export class HierarchyManager {
  /**
   * Group products by aggregation level
   */
  static groupProductsByLevel(
    products: ProductData[], 
    levels: AggregationLevel[]
  ): Map<string, ProductData[]> {
    const grouped = new Map<string, ProductData[]>();
    
    levels.forEach(level => {
      // For this implementation, we'll simulate level grouping
      // In a real system, this would use facility hierarchy data
      const levelProducts = this.filterProductsForLevel(products, level);
      grouped.set(level.id, levelProducts);
    });

    return grouped;
  }

  /**
   * Filter products for a specific aggregation level
   */
  private static filterProductsForLevel(products: ProductData[], level: AggregationLevel): ProductData[] {
    // Simulate filtering based on level type
    // In production, this would use actual facility hierarchy
    switch (level.type) {
      case 'facility':
        return products.filter(p => p.facilityId === level.id);
      case 'zonal':
        // Simulate zonal grouping
        return products.filter((_, index) => index % 3 === 0);
      case 'regional':
        // Simulate regional grouping
        return products.filter((_, index) => index % 2 === 0);
      case 'national':
        return products;
      default:
        return [];
    }
  }
}
