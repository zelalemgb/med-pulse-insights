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

  const parseFile = async (file: File): Promise<ParsedRow[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) {
            reject(new Error('No data found in file'));
            return;
          }
          
          let workbook: XLSX.WorkBook;
          
          try {
            if (file.type === 'text/csv') {
              workbook = XLSX.read(data, { type: 'string' });
            } else {
              workbook = XLSX.read(data, { type: 'array' });
            }
          } catch (parseError) {
            console.error('XLSX parsing error:', parseError);
            reject(new Error('Failed to parse Excel/CSV file. Please ensure the file is not corrupted and is in a supported format.'));
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
          
          let jsonData;
          try {
            jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
          } catch (sheetError) {
            console.error('Sheet conversion error:', sheetError);
            reject(new Error('Failed to convert worksheet to data. The file may be too large or corrupted.'));
            return;
          }
          
          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            reject(new Error('File appears to be empty or contains no valid data'));
            return;
          }
          
          // Filter out completely empty rows
          const filteredData = jsonData.filter(row => 
            Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined && String(cell).trim() !== '')
          );
          
          if (filteredData.length === 0) {
            reject(new Error('No valid data rows found in the file'));
            return;
          }
          
          const headers = filteredData[0] as string[];
          const rows = filteredData.slice(1) as any[][];
          
          if (!Array.isArray(headers) || headers.length === 0) {
            reject(new Error('No headers found in the file'));
            return;
          }
          
          // Map headers to expected columns (case-insensitive)
          const columnMap = new Map<string, number>();
          headers.forEach((header, index) => {
            if (header === null || header === undefined) return;
            
            const normalizedHeader = String(header).toLowerCase().trim();
            
            // Map various possible column names to our standard names
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
          
          // Validate required columns
          if (!columnMap.has('facility') || !columnMap.has('product_name')) {
            reject(new Error('Required columns missing: facility and product_name are mandatory'));
            return;
          }
          
          const parsedRows: ParsedRow[] = [];
          
          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            
            // Skip empty rows
            if (!Array.isArray(row) || !row.some(cell => cell != null && String(cell).trim() !== '')) {
              continue;
            }
            
            const parsedRow: ParsedRow = {
              facility: '',
              product_name: ''
            };
            
            columnMap.forEach((colIndex, field) => {
              const value = row[colIndex];
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
            
            // Only include rows with required fields
            if (parsedRow.facility && parsedRow.facility.trim() !== '' && 
                parsedRow.product_name && parsedRow.product_name.trim() !== '') {
              parsedRows.push(parsedRow);
            }
          }
          
          console.log('Successfully parsed rows:', parsedRows.length);
          resolve(parsedRows);
        } catch (error) {
          console.error('File parsing error:', error);
          reject(new Error(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown parsing error'}`));
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
      // Parse file
      setProgress(10);
      console.log('Starting file parse for:', file.name, 'Size:', file.size);
      const parsedRows = await parseFile(file);
      result.totalRows = parsedRows.length;
      
      if (parsedRows.length === 0) {
        throw new Error('No valid data rows found in the file');
      }
      
      console.log('File parsed successfully, rows:', parsedRows.length);
      
      // Validate data
      setProgress(20);
      const validRows: ParsedRow[] = [];
      
      parsedRows.forEach((row, index) => {
        const rowErrors = validateRow(row, index);
        if (rowErrors.length > 0) {
          result.errors.push(...rowErrors);
          result.errorRows++;
        } else {
          validRows.push(row);
        }
      });
      
      if (validRows.length === 0) {
        throw new Error('No valid rows found after validation');
      }
      
      console.log('Validation complete, valid rows:', validRows.length);
      
      // Process in batches of 100 rows
      const batchSize = 100;
      const totalBatches = Math.ceil(validRows.length / batchSize);
      
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
          const progressPercent = 20 + ((i + 1) / totalBatches) * 80;
          setProgress(Math.round(progressPercent));
          
          // Small delay to prevent overwhelming the database
          if (i < totalBatches - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
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
      
      setProgress(100);
      setImportResult(result);
      
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
