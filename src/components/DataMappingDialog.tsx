
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
    { key: 'productName', label: 'Product Name', required: true },
    { key: 'unit', label: 'Unit', required: false },
    { key: 'unitPrice', label: 'Unit Price', required: false },
    { key: 'venClassification', label: 'VEN Classification', required: false },
    { key: 'facilitySpecific', label: 'Facility Specific', required: false },
    { key: 'procurementSource', label: 'Procurement Source', required: false }
  ];

  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>(() => {
    const initialMapping: Record<string, string> = {};
    requiredFields.forEach(field => {
      // Try to auto-match common column names
      const possibleMatches = excelColumns.filter(col => 
        col.toLowerCase().includes(field.key.toLowerCase()) ||
        col.toLowerCase().includes(field.label.toLowerCase()) ||
        col.toLowerCase().replace(/\s+/g, '').includes(field.key.toLowerCase())
      );
      if (possibleMatches.length > 0) {
        initialMapping[field.key] = possibleMatches[0];
      }
    });
    return initialMapping;
  });

  const handleFieldChange = (fieldKey: string, columnName: string) => {
    setFieldMapping(prev => ({
      ...prev,
      [fieldKey]: columnName
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
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
              Required fields are marked with an asterisk (*).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requiredFields.map(field => (
              <div key={field.key} className="space-y-2">
                <Label className="flex items-center gap-1">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                  {fieldMapping[field.key] && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Label>
                <Select 
                  value={fieldMapping[field.key] || ''} 
                  onValueChange={(value) => handleFieldChange(field.key, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Excel column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">-- Skip this field --</SelectItem>
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

          {sampleData.length > 0 && (
            <div className="space-y-2">
              <Label>Preview of Excel Data (First 3 rows):</Label>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      {excelColumns.map(column => (
                        <TableHead key={column} className="text-xs">
                          {column}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleData.slice(0, 3).map((row, index) => (
                      <TableRow key={index}>
                        {excelColumns.map(column => (
                          <TableCell key={column} className="text-xs">
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
            Import Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DataMappingDialog;
