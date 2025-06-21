import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImportResult {
  totalRows: number;
  successfulRows: number;
  errorRows: number;
  skippedRows: number;
  errors: string[];
  warnings: string[];
}

interface ImportProgress {
  phase: string;
  details: string;
  currentBatch?: number;
  totalBatches?: number;
  currentRecord?: number;
  totalRecords?: number;
  processingItem?: string;
  errors?: string[];
}

interface ParsedRow {
  region?: string;
  zone?: string;
  woreda?: string;
  facility: string;
  product_name: string;
  unit?: string;
  product_category?: string;
  price?: number;
  procurement_source?: string;
  quantity?: number;
  miazia_price?: number;
}

export const useBulkImportPharmaceuticalProducts = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(null);
  const { toast } = useToast();

  // Throttled progress update using requestAnimationFrame
  let progressUpdateQueued = false;
  const throttledProgressUpdate = (newProgress: number, phase: string, details: string) => {
    if (!progressUpdateQueued) {
      progressUpdateQueued = true;
      requestAnimationFrame(() => {
        setProgress(Math.round(newProgress));
        setImportProgress({ phase, details });
        progressUpdateQueued = false;
      });
    }
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const validateRow = (row: ParsedRow): string[] => {
    const errors: string[] = [];
    
    if (!row.facility || row.facility.trim() === '') {
      errors.push('Facility is required');
    }
    
    if (!row.product_name || row.product_name.trim() === '') {
      errors.push('Product name is required');
    }
    
    if (row.price !== undefined && (isNaN(row.price) || row.price < 0)) {
      errors.push('Price must be a valid positive number');
    }
    
    if (row.quantity !== undefined && (isNaN(row.quantity) || row.quantity < 0)) {
      errors.push('Quantity must be a valid positive number');
    }
    
    if (row.miazia_price !== undefined && (isNaN(row.miazia_price) || row.miazia_price < 0)) {
      errors.push('Miazia price must be a valid positive number');
    }
    
    return errors;
  };

  const parseFileStream = async (file: File): Promise<ParsedRow[]> => {
    console.log('Starting optimized streaming parse for:', file.name, 'Size:', file.size);
    
    // For very large files, use streaming approach
    if (file.size > 50 * 1024 * 1024) { // 50MB threshold
      return parseCSVStreamOptimized(file);
    }
    
    // For smaller files, use standard text reading
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          if (!text) {
            reject(new Error('Failed to read file content'));
            return;
          }
          
          const parsedRows = parseCSVTextOptimized(text);
          resolve(parsedRows);
        } catch (error) {
          console.error('File parsing error:', error);
          reject(new Error('Failed to parse file content'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  };

  const parseCSVStreamOptimized = async (file: File): Promise<ParsedRow[]> => {
    const parsedRows: ParsedRow[] = [];
    let headers: string[] = [];
    let columnMap = new Map<string, number>();
    let buffer = '';
    let lineCount = 0;
    const chunkSize = 5 * 1024 * 1024; // 5MB chunks for better performance
    let position = 0;
    let lastProgressUpdate = 0;
    
    const setupColumnMapping = (headerRow: string[]) => {
      headers = headerRow;
      headers.forEach((header, index) => {
        if (!header) return;
        
        const normalizedHeader = header.toLowerCase().trim();
        
        if (normalizedHeader.includes('region')) {
          columnMap.set('region', index);
        } else if (normalizedHeader.includes('zone')) {
          columnMap.set('zone', index);
        } else if (normalizedHeader.includes('woreda') || normalizedHeader.includes('ward')) {
          columnMap.set('woreda', index);
        } else if (normalizedHeader.includes('facility') || normalizedHeader.includes('health center') || normalizedHeader.includes('hospital')) {
          columnMap.set('facility', index);
        } else if (normalizedHeader.includes('product') && normalizedHeader.includes('name')) {
          columnMap.set('product_name', index);
        } else if (normalizedHeader.includes('unit') && !normalizedHeader.includes('price')) {
          columnMap.set('unit', index);
        } else if (normalizedHeader.includes('category') || normalizedHeader.includes('type')) {
          columnMap.set('product_category', index);
        } else if (normalizedHeader.includes('price') && !normalizedHeader.includes('miazia')) {
          columnMap.set('price', index);
        } else if (normalizedHeader.includes('procurement') || normalizedHeader.includes('source')) {
          columnMap.set('procurement_source', index);
        } else if (normalizedHeader.includes('quantity') || normalizedHeader.includes('qty')) {
          columnMap.set('quantity', index);
        } else if (normalizedHeader.includes('miazia') && normalizedHeader.includes('price')) {
          columnMap.set('miazia_price', index);
        }
      });
      
      console.log('Column mapping:', Object.fromEntries(columnMap));
      
      if (!columnMap.has('facility') || !columnMap.has('product_name')) {
        throw new Error('Required columns missing: facility and product_name are mandatory');
      }
    };
    
    const parseAndValidateRow = (values: string[]): ParsedRow | null => {
      const parsedRow: ParsedRow = {
        facility: '',
        product_name: ''
      };
      
      columnMap.forEach((colIndex, field) => {
        const value = values[colIndex];
        if (value != null && value.trim() !== '') {
          if (field === 'price' || field === 'quantity' || field === 'miazia_price') {
            const numValue = parseFloat(value.replace(/[^\d.-]/g, ''));
            if (!isNaN(numValue)) {
              (parsedRow as any)[field] = numValue;
            }
          } else {
            (parsedRow as any)[field] = value.trim();
          }
        }
      });
      
      // Validate during parsing to eliminate separate validation step
      if (!parsedRow.facility || !parsedRow.product_name) {
        return null;
      }
      
      const errors = validateRow(parsedRow);
      return errors.length === 0 ? parsedRow : null;
    };

    return new Promise((resolve, reject) => {
      const processNextChunk = () => {
        if (position >= file.size) {
          // Process remaining buffer
          if (buffer.trim()) {
            const lines = buffer.split('\n').filter(line => line.trim());
            for (const line of lines) {
              processLine(line);
            }
          }
          console.log('Optimized streaming parse complete. Total valid rows:', parsedRows.length);
          resolve(parsedRows);
          return;
        }
        
        const chunk = file.slice(position, position + chunkSize);
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const text = e.target?.result as string || '';
          buffer += text;
          
          // Process complete lines
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer
          
          for (const line of lines) {
            if (line.trim()) {
              processLine(line);
            }
          }
          
          // Throttled progress updates - only update every 5000 rows or significant file progress
          const currentProgress = Math.min((position / file.size) * 50, 50);
          if (parsedRows.length - lastProgressUpdate >= 5000 || currentProgress - progress >= 5) {
            throttledProgressUpdate(currentProgress, 'Reading file', `Processed ${lineCount} lines, found ${parsedRows.length} valid rows`);
            lastProgressUpdate = parsedRows.length;
          }
          
          position += chunkSize;
          
          // Continue processing next chunk
          setTimeout(processNextChunk, 1);
        };
        
        reader.onerror = () => {
          reject(new Error('Failed to read file chunk'));
        };
        
        reader.readAsText(chunk);
      };
      
      const processLine = (line: string) => {
        lineCount++;
        
        if (lineCount === 1) {
          // Process headers
          const headerValues = parseCSVLine(line);
          setupColumnMapping(headerValues);
          return;
        }
        
        try {
          const values = parseCSVLine(line);
          const parsedRow = parseAndValidateRow(values);
          
          if (parsedRow) {
            parsedRows.push(parsedRow);
          }
        } catch (error) {
          console.warn(`Error parsing line ${lineCount}:`, error);
        }
      };
      
      processNextChunk();
    });
  };

  const parseCSVTextOptimized = (text: string): ParsedRow[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];
    
    const headers = parseCSVLine(lines[0]);
    const columnMap = new Map<string, number>();
    
    // Set up column mapping
    headers.forEach((header, index) => {
      if (!header) return;
      
      const normalizedHeader = header.toLowerCase().trim();
      
      if (normalizedHeader.includes('region')) {
        columnMap.set('region', index);
      } else if (normalizedHeader.includes('zone')) {
        columnMap.set('zone', index);
      } else if (normalizedHeader.includes('woreda') || normalizedHeader.includes('ward')) {
        columnMap.set('woreda', index);
      } else if (normalizedHeader.includes('facility') || normalizedHeader.includes('health center') || normalizedHeader.includes('hospital')) {
        columnMap.set('facility', index);
      } else if (normalizedHeader.includes('product') && normalizedHeader.includes('name')) {
        columnMap.set('product_name', index);
      } else if (normalizedHeader.includes('unit') && !normalizedHeader.includes('price')) {
        columnMap.set('unit', index);
      } else if (normalizedHeader.includes('category') || normalizedHeader.includes('type')) {
        columnMap.set('product_category', index);
      } else if (normalizedHeader.includes('price') && !normalizedHeader.includes('miazia')) {
        columnMap.set('price', index);
      } else if (normalizedHeader.includes('procurement') || normalizedHeader.includes('source')) {
        columnMap.set('procurement_source', index);
      } else if (normalizedHeader.includes('quantity') || normalizedHeader.includes('qty')) {
        columnMap.set('quantity', index);
      } else if (normalizedHeader.includes('miazia') && normalizedHeader.includes('price')) {
        columnMap.set('miazia_price', index);
      }
    });
    
    if (!columnMap.has('facility') || !columnMap.has('product_name')) {
      throw new Error('Required columns missing: facility and product_name are mandatory');
    }
    
    const parsedRows: ParsedRow[] = [];
    
    // Process data rows with validation during parsing
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);
        const parsedRow: ParsedRow = {
          facility: '',
          product_name: ''
        };
        
        columnMap.forEach((colIndex, field) => {
          const value = values[colIndex];
          if (value != null && value.trim() !== '') {
            if (field === 'price' || field === 'quantity' || field === 'miazia_price') {
              const numValue = parseFloat(value.replace(/[^\d.-]/g, ''));
              if (!isNaN(numValue)) {
                (parsedRow as any)[field] = numValue;
              }
            } else {
              (parsedRow as any)[field] = value.trim();
            }
          }
        });
        
        // Validate and add only valid rows
        if (parsedRow.facility && parsedRow.product_name) {
          const errors = validateRow(parsedRow);
          if (errors.length === 0) {
            parsedRows.push(parsedRow);
          }
        }
      } catch (error) {
        console.warn(`Error parsing line ${i + 1}:`, error);
      }
    }
    
    return parsedRows;
  };

  // Optimized bulk duplicate detection with chunked queries
  const checkAllDuplicatesOptimized = async (rows: ParsedRow[]): Promise<Set<string>> => {
    try {
      throttledProgressUpdate(65, 'Checking for duplicates', 'Preparing optimized duplicate detection...');

      // Collect all unique facility/product combinations
      const uniqueCombinations = new Set<string>();
      rows.forEach(row => {
        const key = `${row.facility.toLowerCase().trim()}|${row.product_name.toLowerCase().trim()}`;
        uniqueCombinations.add(key);
      });

      console.log(`Checking ${uniqueCombinations.size} unique facility/product combinations for duplicates`);

      // Convert to arrays for chunked processing
      const combinationsArray = Array.from(uniqueCombinations);
      const existingKeys = new Set<string>();
      
      // Process in chunks to avoid query size limits
      const chunkSize = 1000; // Process 1000 combinations at a time
      const totalChunks = Math.ceil(combinationsArray.length / chunkSize);
      
      for (let i = 0; i < totalChunks; i++) {
        const chunk = combinationsArray.slice(i * chunkSize, (i + 1) * chunkSize);
        
        // Extract facilities and products for this chunk
        const facilities: string[] = [];
        const products: string[] = [];
        const chunkKeys = new Set<string>();
        
        chunk.forEach(combination => {
          const [facility, product] = combination.split('|');
          facilities.push(facility);
          products.push(product);
          chunkKeys.add(combination);
        });

        // Query for this chunk
        const { data: existingRecords, error } = await supabase
          .from('pharmaceutical_products')
          .select('facility, product_name')
          .in('facility', facilities)
          .in('product_name', products);

        if (error) {
          console.error(`Error in duplicate check chunk ${i + 1}:`, error);
          throw new Error(`Database error during duplicate check: ${error.message}`);
        }

        // Add found duplicates to the set
        if (existingRecords) {
          existingRecords.forEach(record => {
            const key = `${record.facility.toLowerCase().trim()}|${record.product_name.toLowerCase().trim()}`;
            if (chunkKeys.has(key)) {
              existingKeys.add(key);
            }
          });
        }

        // Update progress
        const progressPercent = 65 + ((i + 1) / totalChunks) * 5;
        throttledProgressUpdate(
          progressPercent, 
          'Checking for duplicates', 
          `Processed ${i + 1}/${totalChunks} duplicate check batches`
        );
      }

      console.log(`Found ${existingKeys.size} existing duplicates out of ${uniqueCombinations.size} unique combinations`);
      throttledProgressUpdate(70, 'Duplicates checked', `Found ${existingKeys.size} existing records to skip`);
      
      return existingKeys;
    } catch (error) {
      console.error('Error in optimized duplicate checking:', error);
      throw error;
    }
  };

  // Optimized batch processing with concurrent inserts
  const processBatchesConcurrently = async (validRows: ParsedRow[], existingKeys: Set<string>): Promise<ImportResult> => {
    const result: ImportResult = {
      totalRows: validRows.length,
      successfulRows: 0,
      errorRows: 0,
      skippedRows: 0,
      errors: [],
      warnings: []
    };

    // Filter out existing records upfront
    const newRecords = validRows.filter(row => {
      const key = `${row.facility.toLowerCase().trim()}|${row.product_name.toLowerCase().trim()}`;
      const isDuplicate = existingKeys.has(key);
      if (isDuplicate) {
        result.skippedRows++;
      }
      return !isDuplicate;
    });

    if (newRecords.length === 0) {
      throttledProgressUpdate(100, 'Import completed', 'All records were duplicates - no new data to import');
      return result;
    }

    console.log(`Processing ${newRecords.length} new records (${result.skippedRows} duplicates skipped)`);

    // Process in optimized batches with concurrent inserts
    const batchSize = 500; // Optimized batch size for Supabase
    const maxConcurrent = 3; // Limit concurrent requests
    const batches: ParsedRow[][] = [];
    
    for (let i = 0; i < newRecords.length; i += batchSize) {
      batches.push(newRecords.slice(i, i + batchSize));
    }

    console.log(`Created ${batches.length} batches of up to ${batchSize} records each`);

    // Process batches concurrently
    const processBatch = async (batch: ParsedRow[], batchIndex: number): Promise<{ success: number; errors: string[] }> => {
      try {
        const { error } = await supabase
          .from('pharmaceutical_products')
          .insert(batch.map(row => ({
            region: row.region || null,
            zone: row.zone || null,
            woreda: row.woreda || null,
            facility: row.facility,
            product_name: row.product_name,
            unit: row.unit || null,
            product_category: row.product_category || null,
            price: row.price || null,
            procurement_source: row.procurement_source || null,
            quantity: row.quantity || null,
            miazia_price: row.miazia_price || null
          })));
        
        if (error) {
          console.error(`Batch ${batchIndex + 1} insert error:`, error);
          return { success: 0, errors: [`Batch ${batchIndex + 1}: ${error.message}`] };
        }
        
        return { success: batch.length, errors: [] };
      } catch (error) {
        console.error(`Batch ${batchIndex + 1} processing error:`, error);
        return { success: 0, errors: [`Batch ${batchIndex + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`] };
      }
    };

    // Process batches with controlled concurrency
    for (let i = 0; i < batches.length; i += maxConcurrent) {
      const currentBatches = batches.slice(i, i + maxConcurrent);
      const batchPromises = currentBatches.map((batch, index) => 
        processBatch(batch, i + index)
      );

      try {
        const batchResults = await Promise.allSettled(batchPromises);
        
        batchResults.forEach((promiseResult, index) => {
          if (promiseResult.status === 'fulfilled') {
            result.successfulRows += promiseResult.value.success;
            result.errors.push(...promiseResult.value.errors);
          } else {
            const batchNum = i + index + 1;
            result.errors.push(`Batch ${batchNum} failed: ${promiseResult.reason}`);
            result.errorRows += currentBatches[index].length;
          }
        });

        // Update progress every few batches
        const progressPercent = 70 + ((i + maxConcurrent) / batches.length) * 30;
        throttledProgressUpdate(
          Math.min(progressPercent, 100), 
          'Inserting data', 
          `Processed ${Math.min(i + maxConcurrent, batches.length)}/${batches.length} batches`
        );

      } catch (error) {
        console.error('Error in concurrent batch processing:', error);
        result.errors.push(`Concurrent processing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return result;
  };

  const importData = async (file: File) => {
    setIsImporting(true);
    setProgress(0);
    setImportResult(null);
    setImportProgress({
      phase: 'Starting import',
      details: 'Initializing optimized file processing...'
    });
    
    const result: ImportResult = {
      totalRows: 0,
      successfulRows: 0,
      errorRows: 0,
      skippedRows: 0,
      errors: [],
      warnings: []
    };
    
    try {
      console.log('Starting optimized bulk import for:', file.name, 'Size:', file.size);
      
      throttledProgressUpdate(5, 'Reading file', `Processing ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)...`);

      // Parse and validate file in one pass
      const validRows = await parseFileStream(file);
      result.totalRows = validRows.length;
      
      if (validRows.length === 0) {
        throw new Error('No valid data rows found in the file');
      }
      
      console.log('File parsed and validated successfully, valid rows:', validRows.length);
      throttledProgressUpdate(60, 'File processed', `Found ${validRows.length} valid rows`);
      
      // Chunked duplicate detection to avoid query size limits
      const existingKeys = await checkAllDuplicatesOptimized(validRows);
      
      // Process all batches concurrently
      const importResults = await processBatchesConcurrently(validRows, existingKeys);
      
      // Merge results
      Object.assign(result, importResults);
      
      // Add summary warnings
      if (result.errorRows > 0) {
        result.warnings.push(`${result.errorRows} rows failed to import due to errors`);
      }
      
      if (result.skippedRows > 0) {
        result.warnings.push(`${result.skippedRows} rows were skipped because they already exist in the database`);
      }
      
      if (result.successfulRows > 0) {
        result.warnings.push(`Successfully imported ${result.successfulRows} new products`);
      }
      
      if (file.size > 100 * 1024 * 1024) {
        result.warnings.push('Large file processed successfully with optimized algorithms');
      }
      
      setProgress(100);
      setImportResult(result);
      setImportProgress(null);
      
      toast({
        title: "Import completed",
        description: `Successfully imported ${result.successfulRows} new rows, skipped ${result.skippedRows} duplicates out of ${result.totalRows} total rows`,
      });
      
    } catch (error) {
      console.error('Optimized import failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Import failed';
      result.errors.push(errorMessage);
      setImportResult(result);
      setImportProgress({
        phase: 'Import failed',
        details: errorMessage,
        errors: [errorMessage]
      });
      
      toast({
        title: "Import failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const reset = () => {
    setIsImporting(false);
    setProgress(0);
    setImportResult(null);
    setImportProgress(null);
  };

  return {
    importData,
    isImporting,
    progress,
    importResult,
    importProgress,
    reset
  };
};
