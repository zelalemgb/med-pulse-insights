import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { validateProductData, cleanAndTransformData, calculateMetrics } from '@/utils/dataValidation';
import { saveImportSummary, addProductsToStorage } from '@/utils/dataStorage';
import { ProductData, ImportMapping, ImportSummary } from '@/types/pharmaceutical';
import { createEmptyPeriods } from '@/types/pharmaceutical';

interface ExcelColumn {
  sheet: string;
  column: string;
  fullPath: string;
}

interface MappingField {
  key: string;
  label: string;
  required: boolean;
  category: string;
  aliases: string[];
}

interface DataMappingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: File | null;
  onMappingComplete: (mappedData: ProductData[], mapping: ImportMapping) => void;
}

const REQUIRED_FIELDS: MappingField[] = [
  // Product Information
  { key: 'productName', label: 'Product Name', required: true, category: 'Product Information', aliases: ['product', 'product name', 'item', 'medicine', 'drug', 'product list'] },
  { key: 'unit', label: 'Unit', required: true, category: 'Product Information', aliases: ['unit', 'uom', 'unit of measure', 'measurement'] },
  { key: 'unitPrice', label: 'Unit Price', required: true, category: 'Product Information', aliases: ['price', 'cost', 'unit price', 'unit cost'] },
  { key: 'venClassification', label: 'VEN Classification', required: true, category: 'Product Information', aliases: ['ven', 'classification', 'category', 'ven class', 'ven classification'] },
  { key: 'facilitySpecific', label: 'Facility Specific', required: false, category: 'Product Information', aliases: ['facility', 'specific', 'facility specific'] },
  { key: 'procurementSource', label: 'Procurement Source', required: false, category: 'Product Information', aliases: ['source', 'procurement', 'supplier', 'vendor', 'procurement source'] },
  
  // Consumption Data
  { key: 'beginningBalance', label: 'Beginning Balance', required: true, category: 'Consumption Data', aliases: ['beginning', 'start balance', 'opening balance', 'initial', 'beginning balance'] },
  { key: 'received', label: 'Received', required: true, category: 'Consumption Data', aliases: ['received', 'receipts', 'incoming', 'delivered'] },
  { key: 'positiveAdj', label: 'Positive Adjustment', required: false, category: 'Consumption Data', aliases: ['positive adj', 'positive adjustment', 'add adjustment', 'positive'] },
  { key: 'negativeAdj', label: 'Negative Adjustment', required: false, category: 'Consumption Data', aliases: ['negative adj', 'negative adjustment', 'minus adjustment', 'negative'] },
  { key: 'endingBalance', label: 'Ending Balance', required: false, category: 'Consumption Data', aliases: ['ending', 'final balance', 'closing balance', 'ending balance'] },
  { key: 'stockOutDays', label: 'Stock Out Days', required: false, category: 'Consumption Data', aliases: ['stockout', 'stock out', 'outage days', 'shortage days', 'stock out days'] },
  { key: 'expiredDamaged', label: 'Expired/Damaged', required: false, category: 'Consumption Data', aliases: ['expired', 'damaged', 'wastage', 'loss', 'expired/damaged'] },
  { key: 'consumptionIssue', label: 'Consumption/Issue', required: true, category: 'Consumption Data', aliases: ['consumption', 'issue', 'issued', 'consumed', 'consumption/issue'] },
  
  // Forecast Data
  { key: 'aamcApplied', label: 'aAMC Applied', required: false, category: 'Forecast Data', aliases: ['aamc', 'average monthly consumption', 'amc', 'aamc applied'] },
  { key: 'wastageRateApplied', label: 'Wastage Rate Applied', required: false, category: 'Forecast Data', aliases: ['wastage rate', 'loss rate', 'waste percentage', 'wastage rate applied'] },
  { key: 'programExpansionContraction', label: 'Program Expansion/Contraction', required: false, category: 'Forecast Data', aliases: ['expansion', 'contraction', 'program change', 'growth rate', 'program expansion', 'program contraction'] }
];

const NOT_MAPPED_VALUE = '__NOT_MAPPED__';

const DataMappingDialog: React.FC<DataMappingDialogProps> = ({
  open,
  onOpenChange,
  file,
  onMappingComplete
}) => {
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [sheetColumns, setSheetColumns] = useState<Record<string, string[]>>({});
  const [sheetMapping, setSheetMapping] = useState<Record<string, string>>({});
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [excelData, setExcelData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  useEffect(() => {
    if (file && open) {
      parseExcelFile(file);
    }
  }, [file, open]);

  const parseExcelFile = async (file: File) => {
    setIsLoading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      
      const sheets: string[] = [];
      const columnsPerSheet: Record<string, string[]> = {};
      const sheetsData: Record<string, any[]> = {};
      
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length > 0) {
          const headers = jsonData[0] as string[];
          sheets.push(sheetName);
          columnsPerSheet[sheetName] = headers.filter(header => header && typeof header === 'string');
          sheetsData[sheetName] = XLSX.utils.sheet_to_json(worksheet);
        }
      });
      
      setAvailableSheets(sheets);
      setSheetColumns(columnsPerSheet);
      setExcelData(sheetsData);
      
      // Auto-map obvious matches
      const autoSheetMapping: Record<string, string> = {};
      const autoColumnMapping: Record<string, string> = {};
      
      REQUIRED_FIELDS.forEach(field => {
        for (const sheetName of sheets) {
          const columns = columnsPerSheet[sheetName];
          const match = columns.find(col => 
            field.aliases.some(alias => 
              col.toLowerCase().includes(alias.toLowerCase()) ||
              alias.toLowerCase().includes(col.toLowerCase())
            )
          );
          if (match) {
            autoSheetMapping[field.key] = sheetName;
            autoColumnMapping[field.key] = match;
            break;
          }
        }
      });
      
      setSheetMapping(autoSheetMapping);
      setColumnMapping(autoColumnMapping);
      
    } catch (error) {
      console.error('Error parsing Excel file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSheetChange = (fieldKey: string, sheetName: string) => {
    setSheetMapping(prev => ({
      ...prev,
      [fieldKey]: sheetName === NOT_MAPPED_VALUE ? '' : sheetName
    }));
    
    if (sheetName === NOT_MAPPED_VALUE) {
      setColumnMapping(prev => ({
        ...prev,
        [fieldKey]: ''
      }));
    }
  };

  const handleColumnChange = (fieldKey: string, columnName: string) => {
    setColumnMapping(prev => ({
      ...prev,
      [fieldKey]: columnName === NOT_MAPPED_VALUE ? '' : columnName
    }));
  };

  const getAvailableColumns = (fieldKey: string): string[] => {
    const selectedSheet = sheetMapping[fieldKey];
    return selectedSheet ? sheetColumns[selectedSheet] || [] : [];
  };

  const getRequiredFieldsCount = () => REQUIRED_FIELDS.filter(f => f.required).length;
  const getMappedRequiredFieldsCount = () => 
    REQUIRED_FIELDS.filter(f => f.required && sheetMapping[f.key] && columnMapping[f.key]).length;

  const canProceed = () => {
    const requiredFields = REQUIRED_FIELDS.filter(f => f.required);
    return requiredFields.every(field => sheetMapping[field.key] && columnMapping[field.key]);
  };

  const validateAndPreviewData = () => {
    if (!excelData || !canProceed()) return;
    
    try {
      // Extract mapped data from Excel
      const rawMappedData: any[] = [];
      
      Object.entries(sheetMapping).forEach(([fieldKey, sheetName]) => {
        const columnName = columnMapping[fieldKey];
        if (sheetName && columnName && excelData[sheetName]) {
          const data = excelData[sheetName];
          if (Array.isArray(data)) {
            data.forEach((row: any, index: number) => {
              if (!rawMappedData[index]) {
                rawMappedData[index] = {};
              }
              if (row[columnName] !== undefined) {
                rawMappedData[index][fieldKey] = row[columnName];
              }
            });
          }
        }
      });

      // Validate the data
      const validation = validateProductData(rawMappedData.filter(row => row.productName));
      setValidationResult(validation);
      
    } catch (error) {
      console.error('Error validating data:', error);
    }
  };

  useEffect(() => {
    if (canProceed() && excelData) {
      validateAndPreviewData();
    }
  }, [sheetMapping, columnMapping, excelData]);

  const handleImport = () => {
    if (!excelData || !canProceed()) return;
    
    try {
      // Extract and transform data
      const rawMappedData: any[] = [];
      
      Object.entries(sheetMapping).forEach(([fieldKey, sheetName]) => {
        const columnName = columnMapping[fieldKey];
        if (sheetName && columnName && excelData[sheetName]) {
          const data = excelData[sheetName];
          if (Array.isArray(data)) {
            data.forEach((row: any, index: number) => {
              if (!rawMappedData[index]) {
                rawMappedData[index] = {};
              }
              if (row[columnName] !== undefined) {
                rawMappedData[index][fieldKey] = row[columnName];
              }
            });
          }
        }
      });

      // Filter valid rows and clean data
      const validData = rawMappedData.filter(row => row.productName);
      const transformedProducts = cleanAndTransformData(validData);
      
      // Add period data and calculate metrics
      const finalProducts = transformedProducts.map(product => {
        // Create periods based on available data
        const periods = createEmptyPeriods('quarterly');
        
        // Map the data to the first period (assuming single period import)
        if (periods.length > 0) {
          periods[0] = {
            ...periods[0],
            beginningBalance: Number(validData.find(d => d.productName === product.productName)?.beginningBalance) || 0,
            received: Number(validData.find(d => d.productName === product.productName)?.received) || 0,
            positiveAdj: Number(validData.find(d => d.productName === product.productName)?.positiveAdj) || 0,
            negativeAdj: Number(validData.find(d => d.productName === product.productName)?.negativeAdj) || 0,
            stockOutDays: Number(validData.find(d => d.productName === product.productName)?.stockOutDays) || 0,
            expiredDamaged: Number(validData.find(d => d.productName === product.productName)?.expiredDamaged) || 0,
            consumptionIssue: Number(validData.find(d => d.productName === product.productName)?.consumptionIssue) || 0
          };
        }
        
        product.periods = periods;
        return calculateMetrics(product);
      });
      
      // Create import mapping for compatibility
      const finalMapping: ImportMapping = {};
      Object.keys(sheetMapping).forEach(fieldKey => {
        const sheet = sheetMapping[fieldKey];
        const column = columnMapping[fieldKey];
        if (sheet && column) {
          finalMapping[fieldKey] = {
            sheet,
            column,
            required: REQUIRED_FIELDS.find(f => f.key === fieldKey)?.required || false
          };
        }
      });

      // Save import summary
      const importSummary: ImportSummary = {
        totalRows: validData.length,
        successfulRows: finalProducts.length,
        errorRows: validData.length - finalProducts.length,
        warnings: validationResult?.warnings || [],
        mapping: finalMapping,
        timestamp: new Date()
      };

      saveImportSummary(importSummary);
      addProductsToStorage(finalProducts);
      
      onMappingComplete(finalProducts, finalMapping);
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error processing mapped data:', error);
    }
  };

  const groupedFields = REQUIRED_FIELDS.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, MappingField[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Map Excel Data to Required Fields
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Analyzing Excel file...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {canProceed() ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                )}
                <span className="font-medium">
                  Mapping Progress: {getMappedRequiredFieldsCount()}/{getRequiredFieldsCount()} required fields
                </span>
              </div>
              {validationResult && (
                <div className="text-sm text-gray-600 mt-2">
                  <p>Data validation: {validationResult.validRowCount}/{validationResult.rowCount} valid rows</p>
                  {validationResult.warnings.length > 0 && (
                    <p className="text-orange-600">{validationResult.warnings.length} warnings found</p>
                  )}
                  {validationResult.errors.length > 0 && (
                    <p className="text-red-600">{validationResult.errors.length} errors found</p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-6">
              {Object.entries(groupedFields).map(([category, fields]) => (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {fields.map(field => (
                      <div key={field.key} className="grid grid-cols-4 gap-4 items-center">
                        <div className="flex items-center gap-2">
                          <Label className="font-medium">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </Label>
                          {sheetMapping[field.key] && columnMapping[field.key] && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        
                        <Select
                          value={sheetMapping[field.key] || NOT_MAPPED_VALUE}
                          onValueChange={(value) => handleSheetChange(field.key, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select sheet..." />
                          </SelectTrigger>
                          <SelectContent className="bg-white border shadow-lg max-h-64 overflow-y-auto z-50">
                            <SelectItem value={NOT_MAPPED_VALUE}>-- Select sheet --</SelectItem>
                            {availableSheets.map(sheet => (
                              <SelectItem key={sheet} value={sheet}>
                                {sheet}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={columnMapping[field.key] || NOT_MAPPED_VALUE}
                          onValueChange={(value) => handleColumnChange(field.key, value)}
                          disabled={!sheetMapping[field.key]}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select column..." />
                          </SelectTrigger>
                          <SelectContent className="bg-white border shadow-lg max-h-64 overflow-y-auto z-50">
                            <SelectItem value={NOT_MAPPED_VALUE}>-- Select column --</SelectItem>
                            {getAvailableColumns(field.key).map(column => (
                              <SelectItem key={column} value={column}>
                                {column}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="text-sm text-gray-500">
                          {sheetMapping[field.key] && columnMapping[field.key] ? (
                            <span className="text-green-600 font-medium">
                              {sheetMapping[field.key]} → {columnMapping[field.key]}
                            </span>
                          ) : (
                            <span>Not mapped</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport}
            disabled={!canProceed() || isLoading || (validationResult && !validationResult.isValid)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Import Mapped Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DataMappingDialog;
