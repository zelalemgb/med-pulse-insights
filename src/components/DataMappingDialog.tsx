
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface DataMappingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  excelColumns: string[];
  sampleData: any[];
  onConfirm: (mapping: Record<string, string>) => void;
}

const DataMappingDialog: React.FC<DataMappingDialogProps> = ({
  isOpen,
  onClose,
  excelColumns,
  sampleData,
  onConfirm
}) => {
  const requiredFields = [
    // Basic Product Information
    { key: 'productList', label: 'Product List', required: true, category: 'Product Information' },
    { key: 'unit', label: 'Unit', required: false, category: 'Product Information' },
    { key: 'unitPrice', label: 'Unit Price', required: false, category: 'Product Information' },
    { key: 'venClassification', label: 'VEN Classification', required: false, category: 'Product Information' },
    { key: 'facilitySpecific', label: 'Facility Specific', required: false, category: 'Product Information' },
    { key: 'procurementSource', label: 'Procurement Source', required: false, category: 'Product Information' },
    
    // Consumption Data
    { key: 'quarter1', label: 'Quarter 1', required: false, category: 'Consumption Data' },
    { key: 'quarter2', label: 'Quarter 2', required: false, category: 'Consumption Data' },
    { key: 'annualAverages', label: 'Annual Averages', required: false, category: 'Consumption Data' },
    { key: 'forecast', label: 'Forecast', required: false, category: 'Consumption Data' },
    { key: 'seasonality', label: 'Seasonality', required: false, category: 'Consumption Data' },
    { key: 'actions', label: 'Actions', required: false, category: 'Consumption Data' },
    
    // Inventory Data
    { key: 'beginningBalance', label: 'Beginning Balance', required: false, category: 'Inventory Data' },
    { key: 'received', label: 'Received', required: false, category: 'Inventory Data' },
    { key: 'positiveAdj', label: 'Positive Adj', required: false, category: 'Inventory Data' },
    { key: 'negativeAdj', label: 'Negative Adj', required: false, category: 'Inventory Data' },
    { key: 'endingBalance', label: 'Ending Balance', required: false, category: 'Inventory Data' },
    { key: 'stockOutDays', label: 'Stock Out Days', required: false, category: 'Inventory Data' },
    { key: 'expiredDamaged', label: 'Expired/Damaged', required: false, category: 'Inventory Data' },
    { key: 'amcApplied', label: 'AMC Applied', required: false, category: 'Inventory Data' },
    { key: 'wastageRateApplied', label: 'Wastage Rate Applied', required: false, category: 'Inventory Data' },
    { key: 'programExpansion', label: 'Program Expansion/Contraction', required: false, category: 'Inventory Data' }
  ];

  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>(() => {
    const initialMapping: Record<string, string> = {};
    
    requiredFields.forEach(field => {
      // Enhanced auto-matching logic
      const fieldKeyLower = field.key.toLowerCase();
      const fieldLabelLower = field.label.toLowerCase();
      
      // Create multiple possible match patterns
      const matchPatterns = [
        fieldKeyLower,
        fieldLabelLower,
        fieldKeyLower.replace(/([A-Z])/g, ' $1').toLowerCase(), // camelCase to words
        fieldLabelLower.replace(/\s+/g, ''), // remove spaces
        fieldLabelLower.replace(/\s+/g, '_'), // spaces to underscores
        fieldLabelLower.replace(/\s+/g, '-'), // spaces to hyphens
      ];

      // Add specific aliases for common variations
      const aliases: Record<string, string[]> = {
        'productList': ['product', 'item', 'medicine', 'drug', 'pharmaceutical'],
        'unitPrice': ['price', 'cost', 'rate'],
        'venClassification': ['ven', 'classification', 'category'],
        'facilitySpecific': ['facility', 'location', 'site'],
        'procurementSource': ['source', 'supplier', 'vendor'],
        'quarter1': ['q1', 'qtr1', 'quarter_1'],
        'quarter2': ['q2', 'qtr2', 'quarter_2'],
        'annualAverages': ['annual', 'yearly', 'average'],
        'beginningBalance': ['opening', 'initial', 'start'],
        'endingBalance': ['closing', 'final', 'end'],
        'positiveAdj': ['positive adjustment', 'pos adj', '+adj'],
        'negativeAdj': ['negative adjustment', 'neg adj', '-adj'],
        'stockOutDays': ['stockout', 'stock out', 'outage'],
        'expiredDamaged': ['expired', 'damaged', 'waste'],
        'amcApplied': ['amc', 'average monthly consumption'],
        'wastageRateApplied': ['wastage', 'waste rate'],
        'programExpansion': ['expansion', 'contraction', 'program change']
      };

      if (aliases[field.key]) {
        matchPatterns.push(...aliases[field.key]);
      }

      // Find the best match
      const possibleMatches = excelColumns.filter(col => {
        const colLower = col.toLowerCase();
        return matchPatterns.some(pattern => 
          colLower.includes(pattern) || 
          pattern.includes(colLower) ||
          colLower.replace(/[_\s-]/g, '') === pattern.replace(/[_\s-]/g, '')
        );
      });

      if (possibleMatches.length > 0) {
        // Prefer exact matches first, then partial matches
        const exactMatch = possibleMatches.find(col => 
          col.toLowerCase() === fieldLabelLower || 
          col.toLowerCase() === fieldKeyLower
        );
        initialMapping[field.key] = exactMatch || possibleMatches[0];
      }
    });
    
    return initialMapping;
  });

  const handleFieldChange = (fieldKey: string, columnName: string) => {
    setFieldMapping(prev => ({
      ...prev,
      [fieldKey]: columnName === "SKIP_FIELD" ? '' : columnName
    }));
  };

  const isValidMapping = () => {
    const requiredFieldsWithMapping = requiredFields.filter(field => field.required);
    return requiredFieldsWithMapping.every(field => fieldMapping[field.key]);
  };

  const handleConfirm = () => {
    onConfirm(fieldMapping);
    onClose();
  };

  // Group fields by category
  const groupedFields = requiredFields.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, typeof requiredFields>);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-500" />
            Map Excel Columns to Data Fields
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              Map the columns from your Excel file to the corresponding data fields. 
              Required fields are marked with an asterisk (*). The system has automatically 
              matched fields where possible based on column names.
            </p>
          </div>

          {Object.entries(groupedFields).map(([category, fields]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fields.map(field => (
                  <div key={field.key} className="space-y-2">
                    <Label className="flex items-center gap-1 text-sm">
                      {field.label}
                      {field.required && <span className="text-red-500">*</span>}
                      {fieldMapping[field.key] && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </Label>
                    <Select 
                      value={fieldMapping[field.key] || ''} 
                      onValueChange={(value) => handleFieldChange(field.key, value)}
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue placeholder="Select Excel column" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="SKIP_FIELD">-- Skip this field --</SelectItem>
                        {excelColumns.map(column => (
                          <SelectItem key={column} value={column}>
                            {column}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {sampleData.length > 0 && (
            <div className="space-y-2">
              <Label>Preview of Excel Data (First 3 rows):</Label>
              <div className="border rounded-lg overflow-auto max-h-60">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      {excelColumns.map(column => (
                        <TableHead key={column} className="text-xs whitespace-nowrap">
                          {column}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleData.slice(0, 3).map((row, index) => (
                      <TableRow key={index}>
                        {excelColumns.map(column => (
                          <TableCell key={column} className="text-xs whitespace-nowrap">
                            {row[column] || '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {!isValidMapping() && (
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Please map all required fields before proceeding.
              </p>
            </div>
          )}

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Mapped Fields:</strong> {Object.keys(fieldMapping).filter(key => fieldMapping[key]).length} of {requiredFields.length} fields mapped
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!isValidMapping()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Import Data ({Object.keys(fieldMapping).filter(key => fieldMapping[key]).length} fields mapped)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DataMappingDialog;
