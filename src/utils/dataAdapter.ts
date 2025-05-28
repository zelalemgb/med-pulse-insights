
import { PharmaceuticalProduct, QuarterData } from '@/data/pharmaceuticalData';
import { ProductData, PeriodData, DataFrequency } from '@/types/pharmaceutical';

/**
 * Converts PharmaceuticalProduct to ProductData format
 */
export const convertPharmaceuticalToProductData = (product: PharmaceuticalProduct): ProductData => {
  // Convert quarters to periods
  const periods: PeriodData[] = product.quarters.map((quarter, index) => ({
    period: quarter.quarter,
    periodName: `Quarter ${quarter.quarter}`,
    beginningBalance: quarter.beginningBalance,
    received: quarter.received,
    positiveAdj: quarter.positiveAdj,
    negativeAdj: quarter.negativeAdj,
    endingBalance: quarter.endingBalance,
    stockOutDays: quarter.stockOutDays,
    expiredDamaged: quarter.expiredDamaged,
    consumptionIssue: quarter.consumptionIssue,
    aamc: quarter.aamc,
    wastageRate: quarter.wastageRate,
    calculatedAt: new Date()
  }));

  // Convert to ProductData format
  const productData: ProductData = {
    id: product.id,
    productName: product.productName,
    productCode: product.id, // Use id as code if not available
    unit: product.unit,
    unitPrice: product.unitPrice,
    venClassification: product.venClassification,
    facilitySpecific: product.facilitySpecific,
    procurementSource: product.procurementSource,
    frequency: 'quarterly' as DataFrequency, // Default to quarterly since we have 4 quarters
    facilityId: 'default-facility', // Default facility ID
    periods,
    annualAverages: {
      annualConsumption: product.annualAverages.annualConsumption,
      aamc: product.annualAverages.aamc,
      wastageRate: product.annualAverages.wastageRate,
      awamc: product.annualAverages.awamc
    },
    forecast: {
      aamcApplied: product.annualAverages.aamc,
      wastageRateApplied: product.annualAverages.wastageRate,
      programExpansionContraction: 0, // Default value
      projectedAmcAdjusted: product.annualAverages.aamc,
      projectedAnnualConsumption: product.annualAverages.annualConsumption
    },
    seasonality: {
      'Q1': product.seasonality.q1,
      'Q2': product.seasonality.q2,
      'Q3': product.seasonality.q3,
      'Q4': product.seasonality.q4,
      total: product.seasonality.total
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'system'
  };

  return productData;
};

/**
 * Converts array of PharmaceuticalProduct to ProductData format
 */
export const convertPharmaceuticalArrayToProductData = (products: PharmaceuticalProduct[]): ProductData[] => {
  return products.map(convertPharmaceuticalToProductData);
};
