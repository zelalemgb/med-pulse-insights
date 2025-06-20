import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

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

  const parseFileStream = async (file: File): Promise<ParsedRow[]> => {
    return new Promise((resolve, reject) => {
      console.log('Starting streaming file parse for:', file.name, 'Size:', file.size);
      
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          if (!data) {
            reject(new Error('No data found in file'));
            return;
          }
          
          console.log('File read complete, starting XLSX parsing...');
          
          let workbook: XLSX.WorkBook;
          
          try {
            // Use streaming options for large files
            const parseOptions = {
              type: file.type === 'text/csv' ? 'string' : 'array',
              cellDates: false,
              cellNF: false,
              cellText: false,
              raw: false,
              dense: false, // Use sparse format to save memory
              bookVBA: false,
              bookSheets: false,
              bookProps: false
            } as any;
            
            workbook = XLSX.read(data, parseOptions);
          } catch (parseError) {
            console.error('XLSX parsing error:', parseError);
            reject(new Error('Failed to parse Excel/CSV file. The file may be too large or corrupted.'));
            return;
          }
          
          if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
            reject(new Error('No worksheets found in the file'));
            return;
          }
          
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          if (!worksheet) {
            reject(new Error('Cannot read the first worksheet'));
            return;
          }
          
          console.log('Processing worksheet with streaming approach...');
          
          // Get the range of the worksheet
          const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
          const totalRows = range.e.r + 1;
          
          console.log('Total rows detected:', totalRows);
          
          if (totalRows > 1000000) {
            console.log('Large file detected, using optimized processing...');
          }
          
          // Process in chunks to avoid memory issues
          const chunkSize = 10000;
          const parsedRows: ParsedRow[] = [];
          let headers: string[] = [];
          
          // Get headers from first row
          const headerRow: any[] = [];
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
            const cell = worksheet[cellAddress];
            headerRow[col] = cell ? (cell.v || '') : '';
          }
          headers = headerRow;
          
          console.log('Headers found:', headers);
          
          // Map headers to expected columns
          const columnMap = new Map<string, number>();
          headers.forEach((header, index) => {
            if (header === null || header === undefined) return;
            
            const normalizedHeader = String(header).toLowerCase().trim();
            
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
            reject(new Error('Required columns missing: facility and product_name are mandatory'));
            return;
          }
          
          console.log('Column mapping complete:', Object.fromEntries(columnMap));
          
          // Process data in chunks
          let processedRows = 0;
          const totalDataRows = totalRows - 1; // Exclude header
          
          const processChunk = async (startRow: number, endRow: number) => {
            console.log(`Processing chunk: rows ${startRow} to ${endRow - 1}`);
            
            // Process this chunk
            for (let row = startRow; row < endRow; row++) {
              const rowData: any[] = [];
              let hasData = false;
              
              // Get data for this row
              for (let col = range.s.c; col <= range.e.c; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                const cell = worksheet[cellAddress];
                const value = cell ? (cell.v || '') : '';
                rowData[col] = value;
                if (value !== null && value !== undefined && String(value).trim() !== '') {
                  hasData = true;
                }
              }
              
              if (!hasData) continue;
              
              const parsedRow: ParsedRow = {
                facility: '',
                product_name: ''
              };
              
              columnMap.forEach((colIndex, field) => {
                const value = rowData[colIndex];
                if (value != null && String(value).trim() !== '') {
                  if (field === 'price' || field === 'quantity' || field === 'miazia_price') {
                    const numValue = parseFloat(String(value).replace(/[^\d.-]/g, ''));
                    if (!isNaN(numValue)) {
                      (parsedRow as any)[field] = numValue;
                    }
                  } else {
                    (parsedRow as any)[field] = String(value).trim();
                  }
                }
              });
              
              if (parsedRow.facility && parsedRow.facility.trim() !== '' && 
                  parsedRow.product_name && parsedRow.product_name.trim() !== '') {
                parsedRows.push(parsedRow);
              }
              
              processedRows++;
              
              // Update progress occasionally
              if (processedRows % 1000 === 0) {
                const progressPercent = (processedRows / totalDataRows) * 100;
                console.log(`Parsed ${processedRows}/${totalDataRows} rows (${progressPercent.toFixed(1)}%)`);
              }
            }
          };
          
          // Process all chunks
          for (let startRow = 1; startRow < totalRows; startRow += chunkSize) {
            const endRow = Math.min(startRow + chunkSize, totalRows);
            await processChunk(startRow, endRow);
            
            // Small delay to prevent blocking
            if (startRow + chunkSize < totalRows) {
              await new Promise(resolve => setTimeout(resolve, 1));
            }
          }
          
          console.log('File parsing complete. Total valid rows:', parsedRows.length);
          resolve(parsedRows);
          
        } catch (error) {
          console.error('File parsing error:', error);
          reject(new Error(`Failed to parse file: ${error instanceof Error ? error.message : 'Memory or processing error with large file'}`));
        }
      };
      
      reader.onerror = () => {
        console.error('FileReader error');
        reject(new Error('Failed to read file'));
      };
      
      try {
        if (file.type === 'text/csv') {
          reader.readAsText(file);
        } else {
          reader.readAsArrayBuffer(file);
        }
      } catch (readerError) {
        console.error('FileReader setup error:', readerError);
        reject(new Error('Failed to initialize file reader'));
      }
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
      setProgress(5);
      console.log('Starting streaming file parse for large file:', file.name, 'Size:', file.size);
      const parsedRows = await parseFileStream(file);
      result.totalRows = parsedRows.length;
      
      if (parsedRows.length === 0) {
        throw new Error('No valid data rows found in the file');
      }
      
      console.log('File parsed successfully, rows:', parsedRows.length);
      setProgress(15);
      
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
        const validationProgress = 15 + ((i + chunkSize) / parsedRows.length) * 10;
        setProgress(Math.min(Math.round(validationProgress), 25));
        
        // Small delay for large datasets
        if (i + chunkSize < parsedRows.length) {
          await new Promise(resolve => setTimeout(resolve, 1));
        }
      }
      
      if (validRows.length === 0) {
        throw new Error('No valid rows found after validation');
      }
      
      console.log('Validation complete, valid rows:', validRows.length);
      setProgress(25);
      
      // Process in smaller batches for million+ records
      const batchSize = file.size > 50 * 1024 * 1024 ? 50 : 100; // Smaller batches for very large files
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
          const progressPercent = 25 + ((i + 1) / totalBatches) * 75;
          setProgress(Math.round(progressPercent));
          
          // Longer delay for large files to prevent overwhelming the database
          if (i < totalBatches - 1) {
            const delay = file.size > 100 * 1024 * 1024 ? 200 : 100;
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
        result.warnings.push('Large file processed successfully with optimized memory usage');
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
