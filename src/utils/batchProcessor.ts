
import { ProductData, ValidationResult } from '@/types/pharmaceutical';
import { validateProductData, cleanAndTransformData, calculateMetrics } from './dataValidation';

interface BatchProcessingOptions {
  batchSize: number;
  enableProgress?: boolean;
  validateOnly?: boolean;
}

interface BatchResult {
  processed: ProductData[];
  errors: string[];
  warnings: string[];
  totalProcessed: number;
  processingTimeMs: number;
}

export class BatchProcessor {
  private options: BatchProcessingOptions;
  
  constructor(options: BatchProcessingOptions = { batchSize: 1000 }) {
    this.options = options;
  }

  async processLargeDataset(
    rawData: any[],
    onProgress?: (progress: number, processedCount: number) => void
  ): Promise<BatchResult> {
    const startTime = Date.now();
    const result: BatchResult = {
      processed: [],
      errors: [],
      warnings: [],
      totalProcessed: 0,
      processingTimeMs: 0
    };

    console.log(`Starting batch processing of ${rawData.length} records`);

    try {
      // Process data in chunks to avoid memory issues
      for (let i = 0; i < rawData.length; i += this.options.batchSize) {
        const chunk = rawData.slice(i, i + this.options.batchSize);
        
        // Validate chunk
        const validation = validateProductData(chunk);
        result.errors.push(...validation.errors);
        result.warnings.push(...validation.warnings);

        if (!this.options.validateOnly && validation.isValid) {
          // Transform and calculate metrics for valid data
          const transformedChunk = cleanAndTransformData(chunk);
          const processedChunk = transformedChunk.map(product => calculateMetrics(product));
          
          result.processed.push(...processedChunk);
        }

        result.totalProcessed += chunk.length;

        // Report progress
        if (onProgress && this.options.enableProgress) {
          const progress = (result.totalProcessed / rawData.length) * 100;
          onProgress(progress, result.totalProcessed);
        }

        // Yield control to prevent UI freezing
        await new Promise(resolve => setTimeout(resolve, 0));
      }

    } catch (error) {
      console.error('Batch processing error:', error);
      result.errors.push(`Critical processing error: ${error}`);
    }

    result.processingTimeMs = Date.now() - startTime;
    console.log(`Batch processing completed in ${result.processingTimeMs}ms`);
    
    return result;
  }

  async validateLargeDataset(rawData: any[]): Promise<ValidationResult> {
    const batchResult = await this.processLargeDataset(rawData, undefined);
    
    return {
      isValid: batchResult.errors.length === 0,
      errors: batchResult.errors,
      warnings: batchResult.warnings,
      rowCount: batchResult.totalProcessed,
      validRowCount: batchResult.processed.length
    };
  }
}

// Utility functions for performance optimization
export const optimizeForLargeDatasets = (data: any[]): any[] => {
  // Remove duplicate entries based on product name and facility
  const seen = new Map();
  const deduplicated = data.filter(item => {
    const key = `${item.productName}_${item.facilityId || 'default'}`;
    if (seen.has(key)) {
      return false;
    }
    seen.set(key, true);
    return true;
  });

  console.log(`Deduplication: ${data.length} -> ${deduplicated.length} records`);
  return deduplicated;
};

export const createIndexedData = (products: ProductData[]): Map<string, ProductData> => {
  return new Map(products.map(product => [product.id, product]));
};

export const estimateMemoryUsage = (dataCount: number): { estimatedMB: number; recommended: string } => {
  // Rough estimation: each product record ~2KB
  const estimatedMB = (dataCount * 2) / 1024;
  
  let recommended = 'Proceed normally';
  if (estimatedMB > 100) {
    recommended = 'Use batch processing';
  }
  if (estimatedMB > 500) {
    recommended = 'Consider server-side processing';
  }

  return { estimatedMB, recommended };
};
