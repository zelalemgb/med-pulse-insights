
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

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
  onMappingComplete: (mappedData: any[], mapping: Record<string, string>) => void;
}

const REQUIRED_FIELDS: MappingField[] = [
  // Product Information
  { key: 'productName', label: 'Product List', required: true, category: 'Product Information', aliases: ['product', 'product name', 'item', 'medicine', 'drug', 'product list'] },
  { key: 'unit', label: 'Unit', required: true, category: 'Product Information', aliases: ['unit', 'uom', 'unit of measure', 'measurement'] },
  { key: 'unitPrice', label: 'Unit Price', required: true, category: 'Product Information', aliases: ['price', 'cost', 'unit price', 'unit cost'] },
  { key: 'venClassification', label: 'VEN Classification', required: true, category: 'Product Information', aliases: ['ven', 'classification', 'category', 'ven class', 'ven classification'] },
  { key: 'facilitySpecific', label: 'Facility Specific', required: true, category: 'Product Information', aliases: ['facility', 'specific', 'facility specific'] },
  { key: 'procurementSource', label: 'Procurement Source', required: true, category: 'Product Information', aliases: ['source', 'procurement', 'supplier', 'vendor', 'procurement source'] },
  
  // Consumption Data
  { key: 'beginningBalance', label: 'Beginning Balance', required: true, category: 'Consumption Data', aliases: ['beginning', 'start balance', 'opening balance', 'initial', 'beginning balance'] },
  { key: 'received', label: 'Received', required: true, category: 'Consumption Data', aliases: ['received', 'receipts', 'incoming', 'delivered'] },
  { key: 'positiveAdj', label: 'Positive Adjustment', required: true, category: 'Consumption Data', aliases: ['positive adj', 'positive adjustment', 'add adjustment', 'positive'] },
  { key: 'negativeAdj', label: 'Negative Adjustment', required: true, category: 'Consumption Data', aliases: ['negative adj', 'negative adjustment', 'minus adjustment', 'negative'] },
  { key: 'endingBalance', label: 'Ending Balance', required: true, category: 'Consumption Data', aliases: ['ending', 'final balance', 'closing balance', 'ending balance'] },
  { key: 'stockOutDays', label: 'Stock Out Days', required: true, category: 'Consumption Data', aliases: ['stockout', 'stock out', 'outage days', 'shortage days', 'stock out days'] },
  { key: 'expiredDamaged', label: 'Expired/Damaged', required: true, category: 'Consumption Data', aliases: ['expired', 'damaged', 'wastage', 'loss', 'expired/damaged'] },
  
  // Forecast Data
  { key: 'aamcApplied', label: 'aAMC Applied', required: true, category: 'Forecast Data', aliases: ['aamc', 'average monthly consumption', 'amc', 'aamc applied'] },
  { key: 'wastageRateApplied', label: 'Wastage Rate Applied', required: true, category: 'Forecast Data', aliases: ['wastage rate', 'loss rate', 'waste percentage', 'wastage rate applied'] },
  { key: 'programExpansionContraction', label: 'Program Expansion/Contraction', required: true, category: 'Forecast Data', aliases: ['expansion', 'contraction', 'program change', 'growth rate', 'program expansion', 'program contraction'] }
];

const DataMappingDialog: React.FC<DataMappingDialogProps> = ({
  open,
  onOpenChange,
  file,
  onMappingComplete
}) => {
  const [availableColumns, setAvailableColumns] = useState<ExcelColumn[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [excelData, setExcelData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      
      const columns: ExcelColumn[] = [];
      const sheets: Record<string, any[]> = {};
      
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length > 0) {
          const headers = jsonData[0] as string[];
          sheets[sheetName] = XLSX.utils.sheet_to_json(worksheet);
          
          headers.forEach(header => {
            if (header && typeof header === 'string') {
              columns.push({
                sheet: sheetName,
                column: header,
                fullPath: `${sheetName} → ${header}`
              });
            }
          });
        }
      });
      
      setAvailableColumns(columns);
      setExcelData(sheets);
      
      // Auto-map obvious matches
      const autoMapping: Record<string, string> = {};
      REQUIRED_FIELDS.forEach(field => {
        const match = columns.find(col => 
          field.aliases.some(alias => 
            col.column.toLowerCase().includes(alias.toLowerCase()) ||
            alias.toLowerCase().includes(col.column.toLowerCase())
          )
        );
        if (match) {
          autoMapping[field.key] = match.fullPath;
        }
      });
      setMapping(autoMapping);
      
    } catch (error) {
      console.error('Error parsing Excel file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMappingChange = (fieldKey: string, columnPath: string) => {
    setMapping(prev => ({
      ...prev,
      [fieldKey]: columnPath
    }));
  };

  const getRequiredFieldsCount = () => REQUIRED_FIELDS.filter(f => f.required).length;
  const getMappedRequiredFieldsCount = () => 
    REQUIRED_FIELDS.filter(f => f.required && mapping[f.key]).length;

  const canProceed = () => {
    const requiredFields = REQUIRED_FIELDS.filter(f => f.required);
    return requiredFields.every(field => mapping[field.key]);
  };

  const handleImport = () => {
    if (!excelData || !canProceed()) return;
    
    try {
      const mappedData: any[] = [];
      
      // Process each sheet and extract mapped data
      Object.entries(excelData).forEach(([sheetName, data]) => {
        // Type check: ensure data is an array before using forEach
        if (Array.isArray(data)) {
          data.forEach((row: any) => {
            const mappedRow: any = {};
            
            Object.entries(mapping).forEach(([fieldKey, columnPath]) => {
              const [targetSheet, targetColumn] = columnPath.split(' → ');
              if (targetSheet === sheetName && row[targetColumn] !== undefined) {
                mappedRow[fieldKey] = row[targetColumn];
              }
            });
            
            // Only add rows that have at least the product name
            if (mappedRow.productName) {
              mappedData.push(mappedRow);
            }
          });
        }
      });
      
      onMappingComplete(mappedData, mapping);
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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
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
              <p className="text-sm text-gray-600">
                Map your Excel columns to the required fields below. All fields are required for forecast calculation.
              </p>
            </div>

            <div className="space-y-6">
              {Object.entries(groupedFields).map(([category, fields]) => (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {fields.map(field => (
                      <div key={field.key} className="grid grid-cols-2 gap-4 items-center">
                        <div className="flex items-center gap-2">
                          <Label className="font-medium">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </Label>
                          {mapping[field.key] && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <Select
                          value={mapping[field.key] || ''}
                          onValueChange={(value) => handleMappingChange(field.key, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Excel column..." />
                          </SelectTrigger>
                          <SelectContent className="bg-white border shadow-lg max-h-64 overflow-y-auto z-50">
                            <SelectItem value="">-- Not mapped --</SelectItem>
                            {availableColumns.map(col => (
                              <SelectItem key={col.fullPath} value={col.fullPath}>
                                {col.fullPath}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
            disabled={!canProceed() || isLoading}
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
