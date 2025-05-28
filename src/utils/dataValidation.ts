
import { ProductData, VENClassification, DataFrequency, ValidationResult } from '@/types/pharmaceutical';

export const validateProductData = (data: any[]): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  let validRowCount = 0;

  data.forEach((row, index) => {
    const rowNum = index + 1;
    let rowValid = true;

    // Required field validation
    if (!row.productName || typeof row.productName !== 'string') {
      errors.push(`Row ${rowNum}: Product name is required`);
      rowValid = false;
    }

    if (!row.unit || typeof row.unit !== 'string') {
      errors.push(`Row ${rowNum}: Unit is required`);
      rowValid = false;
    }

    if (row.unitPrice === undefined || isNaN(Number(row.unitPrice))) {
      errors.push(`Row ${rowNum}: Valid unit price is required`);
      rowValid = false;
    }

    // VEN Classification validation
    if (row.venClassification && !['V', 'E', 'N'].includes(row.venClassification.toUpperCase())) {
      warnings.push(`Row ${rowNum}: VEN classification should be V, E, or N. Using 'V' as default`);
    }

    // Numeric field validation
    const numericFields = [
      'beginningBalance', 'received', 'positiveAdj', 'negativeAdj', 
      'stockOutDays', 'expiredDamaged', 'aamcApplied', 'wastageRateApplied'
    ];

    numericFields.forEach(field => {
      if (row[field] !== undefined && isNaN(Number(row[field]))) {
        warnings.push(`Row ${rowNum}: ${field} should be a number, using 0 as default`);
      }
    });

    // Stock out days validation
    if (row.stockOutDays && Number(row.stockOutDays) > 90) {
      warnings.push(`Row ${rowNum}: Stock out days (${row.stockOutDays}) exceeds quarterly maximum (90 days)`);
    }

    if (rowValid) {
      validRowCount++;
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    rowCount: data.length,
    validRowCount
  };
};

export const cleanAndTransformData = (rawData: any[]): ProductData[] => {
  return rawData.map((row, index) => {
    const now = new Date();
    
    return {
      id: `product_${Date.now()}_${index}`,
      productName: String(row.productName || '').trim(),
      productCode: row.productCode ? String(row.productCode).trim() : undefined,
      unit: String(row.unit || '').trim(),
      unitPrice: Number(row.unitPrice) || 0,
      venClassification: (row.venClassification?.toUpperCase() || 'V') as VENClassification,
      facilitySpecific: Boolean(row.facilitySpecific),
      procurementSource: String(row.procurementSource || '').trim(),
      frequency: (row.frequency || 'quarterly') as DataFrequency,
      facilityId: row.facilityId || 'default_facility',
      periods: [],
      annualAverages: {
        annualConsumption: 0,
        aamc: 0,
        wastageRate: 0,
        awamc: 0
      },
      forecast: {
        aamcApplied: Number(row.aamcApplied) || 0,
        wastageRateApplied: Number(row.wastageRateApplied) || 0,
        programExpansionContraction: Number(row.programExpansionContraction) || 0,
        projectedAmcAdjusted: 0,
        projectedAnnualConsumption: 0
      },
      seasonality: {
        total: 0
      },
      createdAt: now,
      updatedAt: now,
      createdBy: 'import_system'
    };
  });
};

export const calculateMetrics = (product: ProductData): ProductData => {
  // Calculate ending balances and metrics for each period
  product.periods.forEach((period, index) => {
    // Calculate ending balance
    period.endingBalance = Math.max(0, 
      period.beginningBalance + period.received + period.positiveAdj - 
      period.negativeAdj - period.consumptionIssue - period.expiredDamaged
    );
    
    // Calculate AAMC (Average Monthly Consumption)
    if (period.stockOutDays < 90) {
      const monthsInPeriod = 3; // Assuming quarterly
      const availableDays = (monthsInPeriod * 30.5) - period.stockOutDays;
      if (availableDays > 0) {
        period.aamc = (period.consumptionIssue / availableDays) * 30.5;
      }
    }
    
    // Calculate wastage rate
    const totalAvailable = period.beginningBalance + period.received + period.positiveAdj;
    if (totalAvailable > 0) {
      period.wastageRate = (period.expiredDamaged / totalAvailable) * 100;
    }

    // Set calculation timestamp
    period.calculatedAt = new Date();
  });

  // Calculate annual averages
  const totalConsumption = product.periods.reduce((sum, p) => sum + p.consumptionIssue, 0);
  const avgAAMC = product.periods.reduce((sum, p) => sum + p.aamc, 0) / product.periods.length;
  const avgWastageRate = product.periods.reduce((sum, p) => sum + p.wastageRate, 0) / product.periods.length;

  product.annualAverages = {
    annualConsumption: totalConsumption,
    aamc: avgAAMC,
    wastageRate: avgWastageRate,
    awamc: avgAAMC // Adjusted WAMC can be more complex
  };

  // Calculate seasonality
  if (product.periods.length === 4) { // Quarterly data
    const total = totalConsumption;
    product.seasonality = {
      q1: total > 0 ? product.periods[0].consumptionIssue / total : 0,
      q2: total > 0 ? product.periods[1].consumptionIssue / total : 0,
      q3: total > 0 ? product.periods[2].consumptionIssue / total : 0,
      q4: total > 0 ? product.periods[3].consumptionIssue / total : 0,
      total: 1.0
    };
  }

  product.updatedAt = new Date();
  return product;
};
