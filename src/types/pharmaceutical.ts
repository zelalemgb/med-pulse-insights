
export type DataFrequency = 'weekly' | 'monthly' | 'bimonthly' | 'quarterly' | 'yearly';
export type VENClassification = 'V' | 'E' | 'N';
export type UserRole = 'facility_officer' | 'facility_manager' | 'zonal' | 'regional' | 'national' | 'procurement' | 'finance' | 'program_manager' | 'qa' | 'data_analyst';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  facilityId?: string;
  zoneId?: string;
  regionId?: string;
  permissions: string[];
}

export interface Facility {
  id: string;
  name: string;
  code: string;
  type: string;
  level: string;
  zoneId: string;
  regionId: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PeriodData {
  period: number;
  periodName: string;
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
  calculatedAt?: Date;
}

export interface ProductData {
  id: string;
  productName: string;
  productCode?: string;
  unit: string;
  unitPrice: number;
  venClassification: VENClassification;
  facilitySpecific: boolean;
  procurementSource: string;
  frequency: DataFrequency;
  facilityId: string;
  periods: PeriodData[];
  annualAverages: {
    annualConsumption: number;
    aamc: number;
    wastageRate: number;
    awamc: number;
  };
  forecast: {
    aamcApplied: number;
    wastageRateApplied: number;
    programExpansionContraction: number;
    projectedAmcAdjusted: number;
    projectedAnnualConsumption: number;
  };
  seasonality: {
    [key: string]: number;
    total: number;
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface ImportMapping {
  [fieldKey: string]: {
    sheet: string;
    column: string;
    transform?: (value: any) => any;
    required: boolean;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  rowCount: number;
  validRowCount: number;
}

export interface ImportSummary {
  totalRows: number;
  successfulRows: number;
  errorRows: number;
  warnings: string[];
  mapping: ImportMapping;
  timestamp: Date;
}

export const getPeriodsForFrequency = (frequency: DataFrequency): { count: number; names: string[]; maxStockOutDays: number } => {
  switch (frequency) {
    case 'weekly':
      return { 
        count: 52, 
        names: Array.from({ length: 52 }, (_, i) => `Week ${i + 1}`),
        maxStockOutDays: 7
      };
    case 'monthly':
      return { 
        count: 12, 
        names: [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ],
        maxStockOutDays: 30
      };
    case 'bimonthly':
      return { 
        count: 6, 
        names: ['Jan-Feb', 'Mar-Apr', 'May-Jun', 'Jul-Aug', 'Sep-Oct', 'Nov-Dec'],
        maxStockOutDays: 60
      };
    case 'quarterly':
      return { 
        count: 4, 
        names: ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'],
        maxStockOutDays: 90
      };
    case 'yearly':
      return { 
        count: 1, 
        names: ['Year 1'],
        maxStockOutDays: 365
      };
    default:
      return { 
        count: 4, 
        names: ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'],
        maxStockOutDays: 90
      };
  }
};

export const createEmptyPeriods = (frequency: DataFrequency): PeriodData[] => {
  const { count, names } = getPeriodsForFrequency(frequency);
  return Array.from({ length: count }, (_, i) => ({
    period: i + 1,
    periodName: names[i],
    beginningBalance: 0,
    received: 0,
    positiveAdj: 0,
    negativeAdj: 0,
    endingBalance: 0,
    stockOutDays: 0,
    expiredDamaged: 0,
    consumptionIssue: 0,
    aamc: 0,
    wastageRate: 0
  }));
};
