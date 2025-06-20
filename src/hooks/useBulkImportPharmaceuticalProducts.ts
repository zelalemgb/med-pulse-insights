
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImportResult {
  totalRows: number;
  successfulRows: number;
  errorRows: number;
  errors: string[];
  warnings: string[];
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

  const streamParseFile = async (file: File): Promise<ParsedRow[]> => {
    console.log('Starting streaming parse for large file:', file.name, 'Size:', file.size);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const parsedRows: ParsedRow[] = [];
      let headers: string[] = [];
      let columnMap = new Map<string, number>();
      let buffer = '';
      let lineCount = 0;
      const chunkSize = 64 * 1024; // 64KB chunks
      let position = 0;
      
      const processChunk = () => {
        const chunk = file.slice(position, position + chunkSize);
        position += chunkSize;
        
        if (chunk.size === 0) {
          // End of file, process remaining buffer
          if (buffer.trim()) {
            processLine(buffer);
          }
          console.log('Streaming parse complete. Total valid rows:', parsedRows.length);
          resolve(parsedRows);
          return;
        }
        
        const chunkReader = new FileReader();
        chunkReader.onload = (e) => {
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
          const progressPercent = Math.min((position / file.size) * 50, 50); // First 50% for parsing
          setProgress(Math.round(progressPercent));
          
          // Continue with next chunk
          setTimeout(processChunk, 1); // Small delay to prevent UI blocking
        };
        
        chunkReader.onerror = () => {
          reject(new Error('Failed to read file chunk'));
        };
        
        chunkReader.readAsText(chunk);
      };
      
      const processLine = (line: string) => {
        lineCount++;
        
        if (lineCount === 1) {
          // Process headers
          headers = parseCSVLine(line);
          setupColumnMapping();
          return;
        }
        
        if (lineCount % 10000 === 0) {
          console.log(`Processed ${lineCount} lines, found ${parsedRows.length} valid rows`);
        }
        
        const values = parseCSVLine(line);
        const parsedRow = parseRowData(values);
        
        if (parsedRow && parsedRow.facility && parsedRow.product_name) {
          parsedRows.push(parsedRow);
        }
      };
      
      const setupColumnMapping = () => {
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
          reject(new Error('Required columns missing: facility and product_name are mandatory'));
          return;
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
      
      // Start processing
      processChunk();
    });
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

  const processBatch = async (batch: ParsedRow[]): Promise<{ success: number; errors: string[] }> => {
    try {
      const { data, error } = await supabase
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
        console.error('Batch insert error:', error);
        return {
          success: 0,
          errors: [`Database error: ${error.message}`]
        };
      }
      
      return {
        success: batch.length,
        errors: []
      };
    } catch (error) {
      console.error('Batch processing error:', error);
      return {
        success: 0,
        errors: [`Batch processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  };

  const importData = async (file: File) => {
    setIsImporting(true);
    setProgress(0);
    setImportResult(null);
    
    const result: ImportResult = {
      totalRows: 0,
      successfulRows: 0,
      errorRows: 0,
      errors: [],
      warnings: []
    };
    
    try {
      // Parse file with streaming approach
      console.log('Starting streaming file parse for large file:', file.name, 'Size:', file.size);
      const parsedRows = await streamParseFile(file);
      result.totalRows = parsedRows.length;
      
      if (parsedRows.length === 0) {
        throw new Error('No valid data rows found in the file');
      }
      
      console.log('File parsed successfully, rows:', parsedRows.length);
      setProgress(50);
      
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
        
        // Update progress
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
      
      // Process in smaller batches for large files
      const batchSize = file.size > 50 * 1024 * 1024 ? 25 : 50; // Smaller batches for very large files
      const totalBatches = Math.ceil(validRows.length / batchSize);
      
      console.log(`Processing ${validRows.length} rows in ${totalBatches} batches of ${batchSize}`);
      
      for (let i = 0; i < totalBatches; i++) {
        const start = i * batchSize;
        const end = Math.min(start + batchSize, validRows.length);
        const batch = validRows.slice(start, end);
        
        try {
          console.log(`Processing batch ${i + 1}/${totalBatches}, rows: ${start}-${end}`);
          const batchResult = await processBatch(batch);
          result.successfulRows += batchResult.success;
          result.errors.push(...batchResult.errors);
          
          // Update progress
          const progressPercent = 65 + ((i + 1) / totalBatches) * 35;
          setProgress(Math.round(progressPercent));
          
          // Longer delay for large files to prevent overwhelming the database
          if (i < totalBatches - 1) {
            const delay = file.size > 100 * 1024 * 1024 ? 300 : 150;
            await new Promise(resolve => setTimeout(resolve, delay));
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
      
      if (result.successfulRows > 0) {
        result.warnings.push(`Successfully imported ${result.successfulRows} products`);
      }
      
      if (file.size > 100 * 1024 * 1024) {
        result.warnings.push('Large file processed successfully with streaming approach');
      }
      
      setProgress(100);
      setImportResult(result);
      
      toast({
        title: "Import completed",
        description: `Successfully processed ${result.successfulRows} out of ${result.totalRows} rows`,
      });
      
    } catch (error) {
      console.error('Import failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Import failed';
      result.errors.push(errorMessage);
      setImportResult(result);
      
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
  };

  return {
    importData,
    isImporting,
    progress,
    importResult,
    reset
  };
};
