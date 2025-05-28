
import { ProductData, ValidationResult } from '@/types/pharmaceutical';
import { validateProductData, cleanAndTransformData } from './dataValidation';

interface BatchProcessingOptions {
  batchSize: number;
  concurrent: boolean;
  onProgress?: (processed: number, total: number) => void;
  onError?: (error: Error, item: any) => void;
}

export class BatchProcessor {
  private options: BatchProcessingOptions;

  constructor(options: Partial<BatchProcessingOptions> = {}) {
    this.options = {
      batchSize: 100,
      concurrent: false,
      ...options
    };
  }

  async processLargeDataset<T, R>(
    data: T[],
    processor: (batch: T[]) => Promise<R[]>
  ): Promise<R[]> {
    const results: R[] = [];
    const totalBatches = Math.ceil(data.length / this.options.batchSize);

    for (let i = 0; i < totalBatches; i++) {
      const start = i * this.options.batchSize;
      const end = Math.min(start + this.options.batchSize, data.length);
      const batch = data.slice(start, end);

      try {
        const batchResults = await processor(batch);
        results.push(...batchResults);
        
        if (this.options.onProgress) {
          this.options.onProgress(end, data.length);
        }
      } catch (error) {
        if (this.options.onError) {
          this.options.onError(error as Error, batch);
        } else {
          throw error;
        }
      }
    }

    return results;
  }

  async processExcelData(rawData: any[]): Promise<{
    products: ProductData[];
    validation: ValidationResult;
  }> {
    const processedData = await this.processLargeDataset(
      rawData,
      async (batch) => cleanAndTransformData(batch)
    );

    const validation = validateProductData(processedData);
    
    return {
      products: processedData,
      validation
    };
  }

  async validateInBatches(data: any[]): Promise<ValidationResult> {
    const validationResults: ValidationResult[] = [];

    await this.processLargeDataset(
      data,
      async (batch) => {
        const result = validateProductData(batch);
        validationResults.push(result);
        return batch;
      }
    );

    // Combine all validation results
    return {
      isValid: validationResults.every(r => r.isValid),
      errors: validationResults.flatMap(r => r.errors),
      warnings: validationResults.flatMap(r => r.warnings),
      rowCount: validationResults.reduce((sum, r) => sum + r.rowCount, 0),
      validRowCount: validationResults.reduce((sum, r) => sum + r.validRowCount, 0)
    };
  }
}

export const batchProcessor = new BatchProcessor();
