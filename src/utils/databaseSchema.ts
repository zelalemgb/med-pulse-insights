
export interface DatabaseSchema {
  facilities: FacilitySchema;
  users: UserSchema;
  products: ProductSchema;
  periods: PeriodSchema;
  forecasts: ForecastSchema;
  seasonality: SeasonalitySchema;
  import_logs: ImportLogSchema;
}

export interface FacilitySchema {
  id: string; // Primary key
  name: string;
  code: string;
  type: string;
  level: string;
  zone_id: string;
  region_id: string;
  latitude?: number;
  longitude?: number;
  created_at: Date;
  updated_at: Date;
}

export interface UserSchema {
  id: string; // Primary key
  name: string;
  email: string;
  role: string;
  facility_id?: string; // Foreign key
  zone_id?: string;
  region_id?: string;
  permissions: string[];
  created_at: Date;
  updated_at: Date;
}

export interface ProductSchema {
  id: string; // Primary key
  product_name: string;
  product_code?: string;
  unit: string;
  unit_price: number;
  ven_classification: 'V' | 'E' | 'N';
  facility_specific: boolean;
  procurement_source: string;
  frequency: string;
  facility_id: string; // Foreign key
  created_at: Date;
  updated_at: Date;
  created_by: string; // Foreign key to users
}

export interface PeriodSchema {
  id: string; // Primary key
  product_id: string; // Foreign key
  period: number;
  period_name: string;
  beginning_balance: number;
  received: number;
  positive_adj: number;
  negative_adj: number;
  ending_balance: number;
  stock_out_days: number;
  expired_damaged: number;
  consumption_issue: number;
  aamc: number;
  wastage_rate: number;
  calculated_at?: Date;
}

export interface ForecastSchema {
  id: string; // Primary key
  product_id: string; // Foreign key
  aamc_applied: number;
  wastage_rate_applied: number;
  program_expansion_contraction: number;
  projected_amc_adjusted: number;
  projected_annual_consumption: number;
  created_at: Date;
  updated_at: Date;
}

export interface SeasonalitySchema {
  id: string; // Primary key
  product_id: string; // Foreign key
  period_key: string;
  percentage: number;
  total: number;
  created_at: Date;
  updated_at: Date;
}

export interface ImportLogSchema {
  id: string; // Primary key
  filename: string;
  total_rows: number;
  successful_rows: number;
  error_rows: number;
  warnings: string[];
  mapping: any; // JSON field
  imported_by: string; // Foreign key to users
  imported_at: Date;
}

// Indexing strategy for performance
export const indexingStrategy = {
  facilities: [
    'CREATE INDEX idx_facilities_code ON facilities(code)',
    'CREATE INDEX idx_facilities_zone ON facilities(zone_id)',
    'CREATE INDEX idx_facilities_region ON facilities(region_id)'
  ],
  
  users: [
    'CREATE UNIQUE INDEX idx_users_email ON users(email)',
    'CREATE INDEX idx_users_facility ON users(facility_id)',
    'CREATE INDEX idx_users_role ON users(role)'
  ],
  
  products: [
    'CREATE INDEX idx_products_facility ON products(facility_id)',
    'CREATE INDEX idx_products_ven ON products(ven_classification)',
    'CREATE INDEX idx_products_frequency ON products(frequency)',
    'CREATE INDEX idx_products_created_at ON products(created_at)',
    'CREATE INDEX idx_products_name_search ON products(product_name)'
  ],
  
  periods: [
    'CREATE INDEX idx_periods_product ON periods(product_id)',
    'CREATE INDEX idx_periods_product_period ON periods(product_id, period)',
    'CREATE INDEX idx_periods_calculated_at ON periods(calculated_at)'
  ],
  
  forecasts: [
    'CREATE INDEX idx_forecasts_product ON forecasts(product_id)',
    'CREATE INDEX idx_forecasts_updated_at ON forecasts(updated_at)'
  ],
  
  seasonality: [
    'CREATE INDEX idx_seasonality_product ON seasonality(product_id)',
    'CREATE INDEX idx_seasonality_period ON seasonality(period_key)'
  ],
  
  import_logs: [
    'CREATE INDEX idx_import_logs_user ON import_logs(imported_by)',
    'CREATE INDEX idx_import_logs_date ON import_logs(imported_at)'
  ]
};

// Partitioning strategy for large datasets
export const partitioningStrategy = {
  periods: {
    type: 'RANGE',
    column: 'calculated_at',
    partitions: [
      'PARTITION p2023 VALUES LESS THAN (\'2024-01-01\')',
      'PARTITION p2024 VALUES LESS THAN (\'2025-01-01\')',
      'PARTITION p2025 VALUES LESS THAN (\'2026-01-01\')',
      'PARTITION p_future VALUES LESS THAN MAXVALUE'
    ]
  },
  
  import_logs: {
    type: 'RANGE',
    column: 'imported_at',
    partitions: [
      'PARTITION p_current_year VALUES LESS THAN (YEAR(NOW()) + 1)',
      'PARTITION p_previous_year VALUES LESS THAN (YEAR(NOW()))',
      'PARTITION p_archive VALUES LESS THAN (YEAR(NOW()) - 1)'
    ]
  }
};
