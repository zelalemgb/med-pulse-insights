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
      console.log('Starting file import for:', file.name, 'Size:', file.size);
      
      // Parse file with streaming approach for large files
      const parsedRows = await parseFileStream(file);
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
      const batchSize = file.size > 50 * 1024 * 1024 ? 25 : 50;
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
          
          // Longer delay for large files
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
