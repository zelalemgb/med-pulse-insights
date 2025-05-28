
export interface PharmaceuticalProduct {
  id: string;
  productName: string;
  unit: string;
  unitPrice: number;
  venClassification: 'V' | 'E' | 'N';
  facilitySpecific: boolean;
  procurementSource: string;
  quarters: QuarterData[];
  annualAverages: AnnualAverages;
  seasonality: SeasonalityData;
}

export interface QuarterData {
  quarter: number;
  beginningBalance: number;
  received: number;
  positiveAdj: number;
  negativeAdj: number;
  endingBalance: number;
  stockOutDays: number;
  expiredDamaged: number;
  consumptionIssue: number;
  aamc: number;
  wastageRate: number;
}

export interface AnnualAverages {
  annualConsumption: number;
  aamc: number;
  wastageRate: number;
  awamc: number;
}

export interface SeasonalityData {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  total: number;
}

export const mockPharmaceuticalData: PharmaceuticalProduct[] = [
  {
    id: "1",
    productName: "Acyclovir - 40mg/ml - Oral Suspension",
    unit: "125ml",
    unitPrice: 105.27,
    venClassification: "V",
    facilitySpecific: true,
    procurementSource: "EPSS",
    quarters: [
      {
        quarter: 1,
        beginningBalance: 0,
        received: 0,
        positiveAdj: 0,
        negativeAdj: 0,
        endingBalance: 0,
        stockOutDays: 90,
        expiredDamaged: 0,
        consumptionIssue: 0,
        aamc: 0,
        wastageRate: 0
      },
      {
        quarter: 2,
        beginningBalance: 0,
        received: 0,
        positiveAdj: 0,
        negativeAdj: 0,
        endingBalance: 0,
        stockOutDays: 90,
        expiredDamaged: 0,
        consumptionIssue: 0,
        aamc: 0,
        wastageRate: 0
      },
      {
        quarter: 3,
        beginningBalance: 0,
        received: 0,
        positiveAdj: 0,
        negativeAdj: 0,
        endingBalance: 0,
        stockOutDays: 90,
        expiredDamaged: 0,
        consumptionIssue: 0,
        aamc: 0,
        wastageRate: 0
      },
      {
        quarter: 4,
        beginningBalance: 0,
        received: 0,
        positiveAdj: 0,
        negativeAdj: 0,
        endingBalance: 0,
        stockOutDays: 90,
        expiredDamaged: 0,
        consumptionIssue: 0,
        aamc: 0,
        wastageRate: 0
      }
    ],
    annualAverages: {
      annualConsumption: 0,
      aamc: 0,
      wastageRate: 0,
      awamc: 0
    },
    seasonality: {
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0,
      total: 0
    }
  },
  {
    id: "2",
    productName: "Amoxicillin + Clavulanic Acid - (500mg + 125mg) - Tablet",
    unit: "5x3",
    unitPrice: 360.00,
    venClassification: "N",
    facilitySpecific: true,
    procurementSource: "EPSS",
    quarters: [
      {
        quarter: 1,
        beginningBalance: 0,
        received: 2000,
        positiveAdj: 0,
        negativeAdj: 0,
        endingBalance: 1500,
        stockOutDays: 83,
        expiredDamaged: 0,
        consumptionIssue: 500,
        aamc: 1794.12,
        wastageRate: 0
      },
      {
        quarter: 2,
        beginningBalance: 1500,
        received: 640,
        positiveAdj: 0,
        negativeAdj: 0,
        endingBalance: 1970,
        stockOutDays: 0,
        expiredDamaged: 0,
        consumptionIssue: 170,
        aamc: 0,
        wastageRate: 0
      },
      {
        quarter: 3,
        beginningBalance: 1970,
        received: 456,
        positiveAdj: 0,
        negativeAdj: 0,
        endingBalance: 1329,
        stockOutDays: 0,
        expiredDamaged: 0,
        consumptionIssue: 1097,
        aamc: 365.67,
        wastageRate: 0
      },
      {
        quarter: 4,
        beginningBalance: 1329,
        received: 500,
        positiveAdj: 0,
        negativeAdj: 33,
        endingBalance: 1193,
        stockOutDays: 0,
        expiredDamaged: 0,
        consumptionIssue: 603,
        aamc: 201,
        wastageRate: 0
      }
    ],
    annualAverages: {
      annualConsumption: 2370,
      aamc: 590.20,
      wastageRate: 0,
      awamc: 590.20
    },
    seasonality: {
      q1: 0.21,
      q2: 0.07,
      q3: 0.46,
      q4: 0.25,
      total: 1.00
    }
  }
];

export const calculateMetrics = (data: PharmaceuticalProduct[]) => {
  const totalProducts = data.length;
  const totalConsumption = data.reduce((sum, product) => sum + product.annualAverages.annualConsumption, 0);
  const avgWastageRate = data.reduce((sum, product) => sum + product.annualAverages.wastageRate, 0) / totalProducts;
  const stockOutProducts = data.filter(product => 
    product.quarters.some(quarter => quarter.stockOutDays > 0)
  ).length;

  return {
    totalProducts,
    totalConsumption,
    avgWastageRate,
    stockOutProducts,
    stockOutRate: (stockOutProducts / totalProducts) * 100
  };
};
