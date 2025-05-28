
interface ValidationRule<T = any> {
  name: string;
  validate: (value: T, context?: any) => boolean | Promise<boolean>;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  fieldResults: Map<string, FieldValidationResult>;
}

interface ValidationError {
  field: string;
  message: string;
  value: any;
  rule: string;
  severity: 'error' | 'warning' | 'info';
}

interface FieldValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export class DataValidationFramework {
  private rules: Map<string, ValidationRule[]> = new Map();
  private globalRules: ValidationRule[] = [];

  // Register validation rules for specific fields
  addFieldRule<T>(fieldName: string, rule: ValidationRule<T>): void {
    const existing = this.rules.get(fieldName) || [];
    existing.push(rule);
    this.rules.set(fieldName, existing);
  }

  // Register global validation rules
  addGlobalRule<T>(rule: ValidationRule<T>): void {
    this.globalRules.push(rule);
  }

  // Validate a single field
  async validateField(fieldName: string, value: any, context?: any): Promise<FieldValidationResult> {
    const fieldRules = this.rules.get(fieldName) || [];
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    for (const rule of fieldRules) {
      try {
        const isValid = await rule.validate(value, context);
        if (!isValid) {
          const error: ValidationError = {
            field: fieldName,
            message: rule.message,
            value,
            rule: rule.name,
            severity: rule.severity
          };

          if (rule.severity === 'error') {
            errors.push(error);
          } else {
            warnings.push(error);
          }
        }
      } catch (error) {
        errors.push({
          field: fieldName,
          message: `Validation rule "${rule.name}" failed: ${error.message}`,
          value,
          rule: rule.name,
          severity: 'error'
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Validate an entire object
  async validateObject(data: Record<string, any>, context?: any): Promise<ValidationResult> {
    const fieldResults = new Map<string, FieldValidationResult>();
    const allErrors: ValidationError[] = [];
    const allWarnings: ValidationError[] = [];

    // Validate each field
    for (const [fieldName, value] of Object.entries(data)) {
      const fieldResult = await this.validateField(fieldName, value, context);
      fieldResults.set(fieldName, fieldResult);
      allErrors.push(...fieldResult.errors);
      allWarnings.push(...fieldResult.warnings);
    }

    // Run global validation rules
    for (const rule of this.globalRules) {
      try {
        const isValid = await rule.validate(data, context);
        if (!isValid) {
          const error: ValidationError = {
            field: '_global',
            message: rule.message,
            value: data,
            rule: rule.name,
            severity: rule.severity
          };

          if (rule.severity === 'error') {
            allErrors.push(error);
          } else {
            allWarnings.push(error);
          }
        }
      } catch (error) {
        allErrors.push({
          field: '_global',
          message: `Global validation rule "${rule.name}" failed: ${error.message}`,
          value: data,
          rule: rule.name,
          severity: 'error'
        });
      }
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      fieldResults
    };
  }

  // Real-time validation for forms
  createRealTimeValidator(onValidation: (result: ValidationResult) => void) {
    let debounceTimer: NodeJS.Timeout;

    return (data: Record<string, any>, context?: any) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        const result = await this.validateObject(data, context);
        onValidation(result);
      }, 300); // 300ms debounce
    };
  }

  // Clear all rules
  clear(): void {
    this.rules.clear();
    this.globalRules.length = 0;
  }
}

// Predefined validation rules
export const CommonValidationRules = {
  required: <T>(message: string = 'This field is required'): ValidationRule<T> => ({
    name: 'required',
    validate: (value) => value !== null && value !== undefined && value !== '',
    message,
    severity: 'error'
  }),

  minLength: (min: number, message?: string): ValidationRule<string> => ({
    name: 'minLength',
    validate: (value) => typeof value === 'string' && value.length >= min,
    message: message || `Minimum length is ${min} characters`,
    severity: 'error'
  }),

  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    name: 'maxLength',
    validate: (value) => typeof value === 'string' && value.length <= max,
    message: message || `Maximum length is ${max} characters`,
    severity: 'error'
  }),

  email: (message: string = 'Invalid email format'): ValidationRule<string> => ({
    name: 'email',
    validate: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return typeof value === 'string' && emailRegex.test(value);
    },
    message,
    severity: 'error'
  }),

  numeric: (message: string = 'Must be a valid number'): ValidationRule<any> => ({
    name: 'numeric',
    validate: (value) => !isNaN(Number(value)) && isFinite(Number(value)),
    message,
    severity: 'error'
  }),

  positiveNumber: (message: string = 'Must be a positive number'): ValidationRule<number> => ({
    name: 'positiveNumber',
    validate: (value) => typeof value === 'number' && value > 0,
    message,
    severity: 'error'
  }),

  futureDate: (message: string = 'Date must be in the future'): ValidationRule<Date | string> => ({
    name: 'futureDate',
    validate: (value) => {
      const date = new Date(value);
      return date > new Date();
    },
    message,
    severity: 'warning'
  }),

  pastDate: (message: string = 'Date must be in the past'): ValidationRule<Date | string> => ({
    name: 'pastDate',
    validate: (value) => {
      const date = new Date(value);
      return date < new Date();
    },
    message,
    severity: 'warning'
  }),

  // Pharmaceutical-specific validations
  batchNumber: (message: string = 'Invalid batch number format'): ValidationRule<string> => ({
    name: 'batchNumber',
    validate: (value) => {
      // Example batch number format: YYYYMMDD-XXX
      const batchRegex = /^\d{8}-[A-Z0-9]{3,6}$/;
      return typeof value === 'string' && batchRegex.test(value);
    },
    message,
    severity: 'error'
  }),

  expiryDate: (message: string = 'Expiry date should be in the future'): ValidationRule<Date | string> => ({
    name: 'expiryDate',
    validate: (value) => {
      const date = new Date(value);
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
      return date > sixMonthsFromNow;
    },
    message,
    severity: 'warning'
  }),

  stockLevel: (min: number = 0, max: number = 999999): ValidationRule<number> => ({
    name: 'stockLevel',
    validate: (value) => {
      const num = Number(value);
      return !isNaN(num) && num >= min && num <= max;
    },
    message: `Stock level must be between ${min} and ${max}`,
    severity: 'error'
  })
};

// Pharmaceutical data validator instance
export const pharmaValidator = new DataValidationFramework();

// Setup common pharmaceutical validation rules
pharmaValidator.addFieldRule('productName', CommonValidationRules.required('Product name is required'));
pharmaValidator.addFieldRule('productName', CommonValidationRules.minLength(2, 'Product name must be at least 2 characters'));
pharmaValidator.addFieldRule('productName', CommonValidationRules.maxLength(100, 'Product name cannot exceed 100 characters'));

pharmaValidator.addFieldRule('batchNumber', CommonValidationRules.required('Batch number is required'));
pharmaValidator.addFieldRule('batchNumber', CommonValidationRules.batchNumber());

pharmaValidator.addFieldRule('expiryDate', CommonValidationRules.required('Expiry date is required'));
pharmaValidator.addFieldRule('expiryDate', CommonValidationRules.expiryDate());

pharmaValidator.addFieldRule('quantity', CommonValidationRules.required('Quantity is required'));
pharmaValidator.addFieldRule('quantity', CommonValidationRules.positiveNumber('Quantity must be positive'));

pharmaValidator.addFieldRule('unitPrice', CommonValidationRules.positiveNumber('Unit price must be positive'));

// Global validation rules
pharmaValidator.addGlobalRule({
  name: 'dataIntegrity',
  validate: (data) => {
    // Check for data consistency
    if (data.quantity && data.unitPrice) {
      const totalValue = data.quantity * data.unitPrice;
      return totalValue > 0;
    }
    return true;
  },
  message: 'Data integrity check failed',
  severity: 'error'
});
