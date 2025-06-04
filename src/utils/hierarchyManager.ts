import { ProductData } from '@/types/pharmaceutical';
import { AggregationLevel } from '@/types/aggregation';
import { UserRole } from '@/types/pharmaceutical';

export class HierarchyManager {
  /**
   * Group products by aggregation level based on user role and hierarchy
   */
  static groupProductsByLevel(
    products: ProductData[], 
    levels: AggregationLevel[],
    userRole: UserRole,
    userFacilityId?: string,
    userZone?: string,
    userRegion?: string
  ): Map<string, ProductData[]> {
    const grouped = new Map<string, ProductData[]>();
    
    levels.forEach(level => {
      const levelProducts = this.filterProductsForLevel(
        products, 
        level, 
        userRole, 
        userFacilityId, 
        userZone, 
        userRegion
      );
      grouped.set(level.id, levelProducts);
    });

    return grouped;
  }

  /**
   * Filter products based on user role hierarchy
   */
  private static filterProductsForLevel(
    products: ProductData[], 
    level: AggregationLevel,
    userRole: UserRole,
    userFacilityId?: string,
    userZone?: string,
    userRegion?: string
  ): ProductData[] {
    // Apply hierarchical filtering based on user role
    let filteredProducts = products;

    switch (userRole) {
      case 'facility_officer':
      case 'facility_manager':
        // Facility users can only see their own facility data
        if (userFacilityId) {
          filteredProducts = products.filter(p => p.facilityId === userFacilityId);
        }
        break;
      
      case 'zonal':
        // Zonal users can see all facilities in their zone
        if (userZone) {
          filteredProducts = products.filter(p => {
            // In a real system, you'd have facility zone mapping
            // For now, simulate zonal filtering
            return p.facilityId?.includes(userZone) || Math.random() > 0.3;
          });
        }
        break;
      
      case 'regional':
        // Regional users can see all facilities in their region
        if (userRegion) {
          filteredProducts = products.filter(p => {
            // In a real system, you'd have facility region mapping
            // For now, simulate regional filtering
            return p.facilityId?.includes(userRegion) || Math.random() > 0.5;
          });
        }
        break;
      
      case 'national':
        // National users can see all data
        filteredProducts = products;
        break;
      
      default:
        // Other roles get facility-level access by default
        if (userFacilityId) {
          filteredProducts = products.filter(p => p.facilityId === userFacilityId);
        }
        break;
    }

    // Apply level-specific filtering on the already role-filtered data
    switch (level.type) {
      case 'facility':
        return filteredProducts.filter(p => level.id === 'all' || p.facilityId === level.id);
      case 'zonal':
        return filteredProducts.filter((_, index) => index % 3 === 0);
      case 'regional':
        return filteredProducts.filter((_, index) => index % 2 === 0);
      case 'national':
        return filteredProducts;
      default:
        return filteredProducts;
    }
  }

  /**
   * Get user's data scope based on their role
   */
  static getUserDataScope(userRole: UserRole): string {
    switch (userRole) {
      case 'facility_officer':
      case 'facility_manager':
        return 'facility';
      case 'zonal':
        return 'zone';
      case 'regional':
        return 'region';
      case 'national':
        return 'national';
      default:
        return 'facility';
    }
  }

  /**
   * Check if user can access data at a specific level
   */
  static canAccessLevel(userRole: UserRole, dataLevel: string): boolean {
    const userScope = this.getUserDataScope(userRole);
    const scopeHierarchy = ['facility', 'zone', 'region', 'national'];
    
    const userScopeIndex = scopeHierarchy.indexOf(userScope);
    const dataLevelIndex = scopeHierarchy.indexOf(dataLevel);
    
    // User can access data at their level and below
    return userScopeIndex >= dataLevelIndex;
  }
}
