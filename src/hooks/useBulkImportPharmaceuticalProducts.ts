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

  const parseFileStream = async (file: File): Promise<ParsedRow[]> => {
    console.log('Starting streaming parse for:', file.name, 'Size:', file.size);
    
    // For very large files, use streaming approach
    if (file.size > 50 * 1024 * 1024) { // 50MB threshold
      return parseCSVStream(file);
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
          
          const parsedRows = parseCSVText(text);
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

  const parseCSVStream = async (file: File): Promise<ParsedRow[]> => {
    const parsedRows: ParsedRow[] = [];
    let headers: string[] = [];
    let columnMap = new Map<string, number>();
    let buffer = '';
    let lineCount = 0;
    const chunkSize = 1024 * 1024; // 1MB chunks
    let position = 0;
    
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
    
    const parseRowData = (values: string[]): ParsedRow | null => {
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
      
      return parsedRow.facility && parsedRow.product_name ? parsedRow : null;
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
          console.log('Streaming parse complete. Total valid rows:', parsedRows.length);
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
          
          // Update progress
          const progressPercent = Math.min((position / file.size) * 50, 50);
          setProgress(Math.round(progressPercent));
          
          position += chunkSize;
          
          // Continue processing next chunk
          setTimeout(processNextChunk, 10);
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
        
        if (lineCount % 10000 === 0) {
          console.log(`Processed ${lineCount} lines, found ${parsedRows.length} valid rows`);
        }
        
        try {
          const values = parseCSVLine(line);
          const parsedRow = parseRowData(values);
          
          if (parsedRow && parsedRow.facility && parsedRow.product_name) {
            parsedRows.push(parsedRow);
          }
        } catch (error) {
          console.warn(`Error parsing line ${lineCount}:`, error);
        }
      };
      
      processNextChunk();
    });
  };

  const parseCSVText = (text: string): ParsedRow[] => {
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
    
    // Process data rows
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
        
        if (parsedRow.facility && parsedRow.product_name) {
          parsedRows.push(parsedRow);
        }
      } catch (error) {
        console.warn(`Error parsing line ${i + 1}:`, error);
      }
    }
    
    return parsedRows;
  };

  const validateRow = (row: ParsedRow, rowIndex: number): string[] => {
    const errors: string[] = [];
    
    if (!row.facility || row.facility.trim() === '') {
      errors.push(`Row ${rowIndex + 1}: Facility is required`);
    }
    
    if (!row.product_name || row.product_name.trim() === '') {
      errors.push(`Row ${rowIndex + 1}: Product name is required`);
    }
    
    if (row.price !== undefined && (isNaN(row.price) || row.price < 0)) {
      errors.push(`Row ${rowIndex + 1}: Price must be a valid positive number`);
    }
    
    if (row.quantity !== undefined && (isNaN(row.quantity) || row.quantity < 0)) {
      errors.push(`Row ${rowIndex + 1}: Quantity must be a valid positive number`);
    }
    
    if (row.miazia_price !== undefined && (isNaN(row.miazia_price) || row.miazia_price < 0)) {
      errors.push(`Row ${rowIndex + 1}: Miazia price must be a valid positive number`);
    }
    
    return errors;
  };

  const checkExistingRecordsOptimized = async (batch: ParsedRow[], batchIndex: number, totalBatches: number): Promise<{ existingKeys: Set<string>; error?: string }> => {
    try {
      const existingKeys = new Set<string>();
      
      setImportProgress({
        phase: 'Checking for duplicates',
        details: `Batch ${batchIndex + 1}/${totalBatches}: Preparing batch query for ${batch.length} records`,
        currentBatch: batchIndex + 1,
        totalBatches: totalBatches,
        totalRecords: batch.length
      });

      // Create arrays of unique facilities and products for batch query
      const facilities = [...new Set(batch.map(row => row.facility))];
      const products = [...new Set(batch.map(row => row.product_name))];

      // Single database query to get all potentially matching records
      const { data: existingRecords, error } = await supabase
        .from('pharmaceutical_products')
        .select('facility, product_name')
        .in('facility', facilities)
        .in('product_name', products);

      if (error) {
        console.error('Error in batch duplicate check:', error);
        return { 
          existingKeys: new Set(), 
          error: `Database error during duplicate check: ${error.message}` 
        };
      }

      // Create a hash map from existing records for O(1) lookup
      const existingRecordsMap = new Set<string>();
      if (existingRecords) {
        existingRecords.forEach(record => {
          const key = `${record.facility.toLowerCase().trim()}|${record.product_name.toLowerCase().trim()}`;
          existingRecordsMap.add(key);
        });
      }

      // Check each batch record against the hash map
      batch.forEach((row, index) => {
        const key = `${row.facility.toLowerCase().trim()}|${row.product_name.toLowerCase().trim()}`;
        if (existingRecordsMap.has(key)) {
          existingKeys.add(key);
        }

        // Update progress periodically
        if (index % 100 === 0 || index === batch.length - 1) {
          setImportProgress({
            phase: 'Checking for duplicates',
            details: `Batch ${batchIndex + 1}/${totalBatches}: Processed ${index + 1}/${batch.length} records`,
            currentBatch: batchIndex + 1,
            totalBatches: totalBatches,
            currentRecord: index + 1,
            totalRecords: batch.length
          });

          // Update progress within the 65-70% range for duplicate checking
          const baseProgress = 65;
          const duplicateCheckRange = 5; // 65% to 70%
          const batchProgressPercent = ((batchIndex) / totalBatches) * duplicateCheckRange;
          const recordProgressPercent = ((index + 1) / batch.length) * (duplicateCheckRange / totalBatches);
          const currentProgress = Math.min(baseProgress + batchProgressPercent + recordProgressPercent, 70);
          setProgress(Math.round(currentProgress));
        }
      });

      console.log(`Batch ${batchIndex + 1} duplicate check complete. Found ${existingKeys.size} duplicates out of ${batch.length} records`);
      
      return { existingKeys };
    } catch (error) {
      console.error('Error in optimized duplicate checking:', error);
      return { 
        existingKeys: new Set(), 
        error: error instanceof Error ? error.message : 'Unknown error during duplicate checking' 
      };
    }
  };

  const processBatch = async (batch: ParsedRow[], batchIndex: number, totalBatches: number): Promise<{ success: number; skipped: number; errors: string[] }> => {
    try {
      setImportProgress({
        phase: 'Processing batch',
        details: `Preparing batch ${batchIndex + 1} of ${totalBatches}`,
        currentBatch: batchIndex + 1,
        totalBatches: totalBatches
      });

      // Use optimized duplicate checking
      const { existingKeys, error: checkError } = await checkExistingRecordsOptimized(batch, batchIndex, totalBatches);
      
      if (checkError) {
        return {
          success: 0,
          skipped: 0,
          errors: [`Error checking existing records: ${checkError}`]
        };
      }

      // Filter out existing records
      const newRecords = batch.filter(row => {
        const key = `${row.facility.toLowerCase().trim()}|${row.product_name.toLowerCase().trim()}`;
        return !existingKeys.has(key);
      });

      const skippedCount = batch.length - newRecords.length;

      if (newRecords.length === 0) {
        setImportProgress({
          phase: 'Batch completed',
          details: `Batch ${batchIndex + 1}: All ${batch.length} records already exist (skipped)`,
          currentBatch: batchIndex + 1,
          totalBatches: totalBatches
        });
        
        return {
          success: 0,
          skipped: skippedCount,
          errors: []
        };
      }

      setImportProgress({
        phase: 'Inserting data',
        details: `Batch ${batchIndex + 1}: Inserting ${newRecords.length} new records (skipping ${skippedCount} duplicates)`,
        currentBatch: batchIndex + 1,
        totalBatches: totalBatches
      });

      // Insert only new records in smaller sub-batches for better performance
      const subBatchSize = 25;
      let totalInserted = 0;
      const insertErrors: string[] = [];

      for (let i = 0; i < newRecords.length; i += subBatchSize) {
        const subBatch = newRecords.slice(i, i + subBatchSize);
        
        try {
          const { error } = await supabase
            .from('pharmaceutical_products')
            .insert(subBatch.map(row => ({
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
            console.error(`Sub-batch insert error (${i}-${i + subBatch.length}):`, error);
            insertErrors.push(`Sub-batch ${Math.floor(i/subBatchSize) + 1}: ${error.message}`);
          } else {
            totalInserted += subBatch.length;
          }
        } catch (error) {
          console.error(`Sub-batch processing error:`, error);
          insertErrors.push(`Sub-batch ${Math.floor(i/subBatchSize) + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        // Update progress for insertion
        const insertProgress = ((i + subBatch.length) / newRecords.length) * 100;
        setImportProgress({
          phase: 'Inserting data',
          details: `Batch ${batchIndex + 1}: Inserted ${Math.min(i + subBatch.length, newRecords.length)}/${newRecords.length} records`,
          currentBatch: batchIndex + 1,
          totalBatches: totalBatches
        });
      }
      
      setImportProgress({
        phase: 'Batch completed',
        details: `Batch ${batchIndex + 1}: Successfully inserted ${totalInserted} records${insertErrors.length > 0 ? ` with ${insertErrors.length} errors` : ''}`,
        currentBatch: batchIndex + 1,
        totalBatches: totalBatches
      });
      
      return {
        success: totalInserted,
        skipped: skippedCount,
        errors: insertErrors
      };
    } catch (error) {
      console.error('Batch processing error:', error);
      return {
        success: 0,
        skipped: 0,
        errors: [`Batch processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  };

  const importData = async (file: File) => {
    setIsImporting(true);
    setProgress(0);
    setImportResult(null);
    setImportProgress({
      phase: 'Starting import',
      details: 'Initializing file processing...'
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
      console.log('Starting optimized file import for:', file.name, 'Size:', file.size);
      
      setImportProgress({
        phase: 'Reading file',
        details: `Processing ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)...`
      });

      // Parse file with streaming approach for large files
      const parsedRows = await parseFileStream(file);
      result.totalRows = parsedRows.length;
      
      if (parsedRows.length === 0) {
        throw new Error('No valid data rows found in the file');
      }
      
      console.log('File parsed successfully, rows:', parsedRows.length);
      setProgress(50);
      
      setImportProgress({
        phase: 'Validating data',
        details: `Validating ${parsedRows.length} rows...`
      });

      // Validate data in chunks
      const validRows: ParsedRow[] = [];
      const chunkSize = 5000;
      
      for (let i = 0; i < parsedRows.length; i += chunkSize) {
        const chunk = parsedRows.slice(i, i + chunkSize);
        
        chunk.forEach((row, index) => {
          const rowErrors = validateRow(row, i + index);
          if (rowErrors.length > 0) {
            result.errors.push(...rowErrors);
            result.errorRows++;
          } else {
            validRows.push(row);
          }
        });
        
        // Update progress for validation phase (50% to 65%)
        const validationProgress = 50 + ((i + chunkSize) / parsedRows.length) * 15;
        setProgress(Math.min(Math.round(validationProgress), 65));
        
        // Small delay for large datasets
        if (i + chunkSize < parsedRows.length) {
          await new Promise(resolve => setTimeout(resolve, 1));
        }
      }
      
      if (validRows.length === 0) {
        throw new Error('No valid rows found after validation');
      }
      
      console.log('Validation complete, valid rows:', validRows.length);
      setProgress(65);
      
      // Process in larger batches for better performance
      const batchSize = 2000; // Increased batch size for better performance
      const totalBatches = Math.ceil(validRows.length / batchSize);
      
      console.log(`Processing ${validRows.length} rows in ${totalBatches} batches of ${batchSize}`);
      
      // Processing phase (70% to 100%)
      for (let i = 0; i < totalBatches; i++) {
        const start = i * batchSize;
        const end = Math.min(start + batchSize, validRows.length);
        const batch = validRows.slice(start, end);
        
        try {
          console.log(`Processing batch ${i + 1}/${totalBatches}, rows: ${start}-${end}`);
          const batchResult = await processBatch(batch, i, totalBatches);
          result.successfulRows += batchResult.success;
          result.skippedRows += batchResult.skipped;
          result.errors.push(...batchResult.errors);
          
          // Update progress from 70% to 100%
          const processingProgress = 70 + ((i + 1) / totalBatches) * 30;
          setProgress(Math.round(processingProgress));
          
          // Shorter delay between batches for faster processing
          if (i < totalBatches - 1) {
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        } catch (error) {
          console.error(`Batch ${i + 1} failed:`, error);
          result.errors.push(`Batch ${i + 1} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          result.errorRows += batch.length;
        }
      }
      
      // Add warnings for common issues
      if (result.errorRows > 0) {
        result.warnings.push(`${result.errorRows} rows were skipped due to validation errors`);
      }
      
      if (result.skippedRows > 0) {
        result.warnings.push(`${result.skippedRows} rows were skipped because they already exist in the database`);
      }
      
      if (result.successfulRows > 0) {
        result.warnings.push(`Successfully imported ${result.successfulRows} new products`);
      }
      
      if (file.size > 100 * 1024 * 1024) {
        result.warnings.push('Large file processed successfully with optimized streaming approach');
      }
      
      setProgress(100);
      setImportResult(result);
      setImportProgress(null);
      
      toast({
        title: "Import completed",
        description: `Successfully imported ${result.successfulRows} new rows, skipped ${result.skippedRows} duplicates out of ${result.totalRows} total rows`,
      });
      
    } catch (error) {
      console.error('Import failed:', error);
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
