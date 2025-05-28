
// Database schema definitions and indexing strategies for scalable data storage

export interface DatabaseConfig {
  enableIndexing: boolean;
  partitionStrategy: 'none' | 'facility' | 'date' | 'both';
  archivalPolicy: 'none' | 'yearly' | 'monthly';
}

// Primary table structures optimized for pharmaceutical inventory analytics
export const DatabaseTables = {
  // Core product master data
  products: {
    tableName: 'products',
    primaryKey: 'id',
    indexes: [
      'product_name_idx',
      'ven_classification_idx',
      'facility_id_idx',
      'procurement_source_idx'
    ],
    partitions: ['facility_id'],
    schema: {
      id: 'varchar(36) PRIMARY KEY',
      product_name: 'varchar(255) NOT NULL',
      product_code: 'varchar(100)',
      unit: 'varchar(50) NOT NULL',
      unit_price: 'decimal(10,2) NOT NULL',
      ven_classification: 'enum("V","E","N") NOT NULL',
      facility_specific: 'boolean DEFAULT false',
      procurement_source: 'varchar(100)',
      frequency: 'enum("weekly","monthly","bimonthly","quarterly","yearly") NOT NULL',
      facility_id: 'varchar(36) NOT NULL',
      created_at: 'timestamp DEFAULT CURRENT_TIMESTAMP',
      updated_at: 'timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
      created_by: 'varchar(100)'
    }
  },

  // Time-series consumption data (most queried)
  period_data: {
    tableName: 'period_data',
    primaryKey: ['product_id', 'period'],
    indexes: [
      'product_period_idx',
      'facility_period_idx',
      'consumption_date_idx',
      'stock_out_idx'
    ],
    partitions: ['facility_id', 'calculated_at'],
    schema: {
      product_id: 'varchar(36) NOT NULL',
      period: 'int NOT NULL',
      period_name: 'varchar(50) NOT NULL',
      beginning_balance: 'decimal(15,3) DEFAULT 0',
      received: 'decimal(15,3) DEFAULT 0',
      positive_adj: 'decimal(15,3) DEFAULT 0',
      negative_adj: 'decimal(15,3) DEFAULT 0',
      ending_balance: 'decimal(15,3) DEFAULT 0',
      stock_out_days: 'int DEFAULT 0',
      expired_damaged: 'decimal(15,3) DEFAULT 0',
      consumption_issue: 'decimal(15,3) DEFAULT 0',
      aamc: 'decimal(15,3) DEFAULT 0',
      wastage_rate: 'decimal(8,4) DEFAULT 0',
      calculated_at: 'timestamp DEFAULT CURRENT_TIMESTAMP',
      facility_id: 'varchar(36) NOT NULL' // Denormalized for performance
    }
  },

  // Aggregated analytics (for fast dashboard queries)
  annual_averages: {
    tableName: 'annual_averages',
    primaryKey: 'product_id',
    indexes: [
      'facility_consumption_idx',
      'ven_performance_idx'
    ],
    schema: {
      product_id: 'varchar(36) PRIMARY KEY',
      annual_consumption: 'decimal(15,3) DEFAULT 0',
      aamc: 'decimal(15,3) DEFAULT 0',
      wastage_rate: 'decimal(8,4) DEFAULT 0',
      awamc: 'decimal(15,3) DEFAULT 0',
      calculated_at: 'timestamp DEFAULT CURRENT_TIMESTAMP',
      facility_id: 'varchar(36) NOT NULL'
    }
  },

  // Forecasting data
  forecasts: {
    tableName: 'forecasts',
    primaryKey: 'product_id',
    indexes: [
      'forecast_date_idx'
    ],
    schema: {
      product_id: 'varchar(36) PRIMARY KEY',
      aamc_applied: 'decimal(15,3) DEFAULT 0',
      wastage_rate_applied: 'decimal(8,4) DEFAULT 0',
      program_expansion_contraction: 'decimal(8,4) DEFAULT 0',
      projected_amc_adjusted: 'decimal(15,3) DEFAULT 0',
      projected_annual_consumption: 'decimal(15,3) DEFAULT 0',
      forecast_date: 'timestamp DEFAULT CURRENT_TIMESTAMP',
      facility_id: 'varchar(36) NOT NULL'
    }
  },

  // Facilities master data
  facilities: {
    tableName: 'facilities',
    primaryKey: 'id',
    indexes: [
      'zone_region_idx',
      'facility_type_idx'
    ],
    schema: {
      id: 'varchar(36) PRIMARY KEY',
      name: 'varchar(255) NOT NULL',
      code: 'varchar(50) UNIQUE NOT NULL',
      type: 'varchar(100) NOT NULL',
      level: 'varchar(50) NOT NULL',
      zone_id: 'varchar(36) NOT NULL',
      region_id: 'varchar(36) NOT NULL',
      latitude: 'decimal(10,8)',
      longitude: 'decimal(11,8)',
      created_at: 'timestamp DEFAULT CURRENT_TIMESTAMP'
    }
  }
};

// Optimized query patterns for million-record scalability
export const QueryPatterns = {
  // High-frequency dashboard queries
  dashboardQueries: {
    facilityConsumption: `
      SELECT p.product_name, aa.annual_consumption, aa.aamc, aa.wastage_rate
      FROM annual_averages aa
      JOIN products p ON aa.product_id = p.id
      WHERE aa.facility_id = ? AND p.ven_classification = ?
      ORDER BY aa.annual_consumption DESC
      LIMIT 20
    `,
    
    stockOutAlert: `
      SELECT p.product_name, pd.stock_out_days, pd.period_name, f.name as facility_name
      FROM period_data pd
      JOIN products p ON pd.product_id = p.id
      JOIN facilities f ON pd.facility_id = f.id
      WHERE pd.stock_out_days > 0 AND pd.calculated_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      ORDER BY pd.stock_out_days DESC
    `,

    aggregateConsumption: `
      SELECT 
        f.region_id,
        p.ven_classification,
        SUM(aa.annual_consumption) as total_consumption,
        AVG(aa.wastage_rate) as avg_wastage_rate,
        COUNT(DISTINCT aa.product_id) as product_count
      FROM annual_averages aa
      JOIN products p ON aa.product_id = p.id
      JOIN facilities f ON aa.facility_id = f.id
      WHERE f.region_id = ?
      GROUP BY f.region_id, p.ven_classification
    `
  },

  // Batch operations for data imports
  batchOperations: {
    insertProducts: `
      INSERT INTO products (id, product_name, unit, unit_price, ven_classification, 
                           facility_specific, procurement_source, frequency, facility_id, created_by)
      VALUES ? ON DUPLICATE KEY UPDATE
      updated_at = CURRENT_TIMESTAMP
    `,
    
    insertPeriodData: `
      INSERT INTO period_data (product_id, period, period_name, beginning_balance, received,
                              positive_adj, negative_adj, ending_balance, stock_out_days,
                              expired_damaged, consumption_issue, aamc, wastage_rate, facility_id)
      VALUES ? ON DUPLICATE KEY UPDATE
      ending_balance = VALUES(ending_balance),
      aamc = VALUES(aamc),
      wastage_rate = VALUES(wastage_rate),
      calculated_at = CURRENT_TIMESTAMP
    `
  }
};

// Database optimization recommendations
export const OptimizationStrategies = {
  indexing: {
    composite: [
      'CREATE INDEX idx_facility_product_period ON period_data(facility_id, product_id, period)',
      'CREATE INDEX idx_consumption_date ON period_data(consumption_issue, calculated_at)',
      'CREATE INDEX idx_ven_consumption ON products(ven_classification, facility_id)'
    ],
    
    partitioning: [
      'ALTER TABLE period_data PARTITION BY RANGE (YEAR(calculated_at))',
      'ALTER TABLE annual_averages PARTITION BY HASH(facility_id) PARTITIONS 10'
    ]
  },

  performanceTips: [
    'Use read replicas for analytics queries',
    'Implement data archival for records older than 3 years',
    'Use materialized views for complex aggregations',
    'Enable query cache for repeated dashboard queries',
    'Consider columnar storage for analytical workloads'
  ]
};

export const generateDatabaseMigrations = (config: DatabaseConfig): string[] => {
  const migrations: string[] = [];
  
  Object.values(DatabaseTables).forEach(table => {
    // Create table
    const columns = Object.entries(table.schema)
      .map(([col, def]) => `${col} ${def}`)
      .join(',\n  ');
    
    migrations.push(`
      CREATE TABLE ${table.tableName} (
        ${columns}
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create indexes
    if (config.enableIndexing && table.indexes) {
      table.indexes.forEach(indexName => {
        const indexCol = indexName.replace('_idx', '').replace('_', ', ');
        migrations.push(`
          CREATE INDEX ${indexName} ON ${table.tableName}(${indexCol});
        `);
      });
    }
  });

  return migrations;
};
