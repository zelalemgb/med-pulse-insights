import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

interface ExcelData {
  [key: string]: any;
}

interface FieldMapping {
  productName: string;
  unit: string;
  unitPrice: string;
  venClassification: string;
  facilitySpecific: string;
  procurementSource: string;
  q1BeginningBalance: string;
  q1Received: string;
  q1PositiveAdj: string;
  q1NegativeAdj: string;
  q1StockOutDays: string;
  q1ExpiredDamaged: string;
  q1ConsumptionIssue: string;
  q2BeginningBalance: string;
  q2Received: string;
  q2PositiveAdj: string;
  q2NegativeAdj: string;
  q2StockOutDays: string;
  q2ExpiredDamaged: string;
  q2ConsumptionIssue: string;
  q3BeginningBalance: string;
  q3Received: string;
  q3PositiveAdj: string;
  q3NegativeAdj: string;
  q3StockOutDays: string;
  q3ExpiredDamaged: string;
  q3ConsumptionIssue: string;
  q4BeginningBalance: string;
  q4Received: string;
  q4PositiveAdj: string;
  q4NegativeAdj: string;
  q4StockOutDays: string;
  q4ExpiredDamaged: string;
  q4ConsumptionIssue: string;
}

const requiredFields = [
  { key: 'productName', label: 'Product Name', required: true },
  { key: 'unit', label: 'Unit', required: true },
  { key: 'unitPrice', label: 'Unit Price', required: true },
  { key: 'venClassification', label: 'VEN Classification', required: true },
  { key: 'facilitySpecific', label: 'Facility Specific', required: false },
  { key: 'procurementSource', label: 'Procurement Source', required: false },
];

const quarterFields = [
  { quarter: 1, fields: [
    { key: 'q1BeginningBalance', label: 'Q1 Beginning Balance' },
    { key: 'q1Received', label: 'Q1 Received' },
    { key: 'q1PositiveAdj', label: 'Q1 Positive Adjustment' },
    { key: 'q1NegativeAdj', label: 'Q1 Negative Adjustment' },
    { key: 'q1StockOutDays', label: 'Q1 Stock Out Days' },
    { key: 'q1ExpiredDamaged', label: 'Q1 Expired/Damaged' },
    { key: 'q1ConsumptionIssue', label: 'Q1 Consumption/Issue' },
  ]},
  { quarter: 2, fields: [
    { key: 'q2BeginningBalance', label: 'Q2 Beginning Balance' },
    { key: 'q2Received', label: 'Q2 Received' },
    { key: 'q2PositiveAdj', label: 'Q2 Positive Adjustment' },
    { key: 'q2NegativeAdj', label: 'Q2 Negative Adjustment' },
    { key: 'q2StockOutDays', label: 'Q2 Stock Out Days' },
    { key: 'q2ExpiredDamaged', label: 'Q2 Expired/Damaged' },
    { key: 'q2ConsumptionIssue', label: 'Q2 Consumption/Issue' },
  ]},
  { quarter: 3, fields: [
    { key: 'q3BeginningBalance', label: 'Q3 Beginning Balance' },
    { key: 'q3Received', label: 'Q3 Received' },
    { key: 'q3PositiveAdj', label: 'Q3 Positive Adjustment' },
    { key: 'q3NegativeAdj', label: 'Q3 Negative Adjustment' },
    { key: 'q3StockOutDays', label: 'Q3 Stock Out Days' },
    { key: 'q3ExpiredDamaged', label: 'Q3 Expired/Damaged' },
    { key: 'q3ConsumptionIssue', label: 'Q3 Consumption/Issue' },
  ]},
  { quarter: 4, fields: [
    { key: 'q4BeginningBalance', label: 'Q4 Beginning Balance' },
    { key: 'q4Received', label: 'Q4 Received' },
    { key: 'q4PositiveAdj', label: 'Q4 Positive Adjustment' },
    { key: 'q4NegativeAdj', label: 'Q4 Negative Adjustment' },
    { key: 'q4StockOutDays', label: 'Q4 Stock Out Days' },
    { key: 'q4ExpiredDamaged', label: 'Q4 Expired/Damaged' },
    { key: 'q4ConsumptionIssue', label: 'Q4 Consumption/Issue' },
  ]},
];

const Import = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<ExcelData[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fieldMapping, setFieldMapping] = useState<Partial<FieldMapping>>({});
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-mapping function
  const autoMapFields = (excelHeaders: string[]) => {
    const mapping: Partial<FieldMapping> = {};
    let matchCount = 0;

    // Define field mappings with possible variations
    const fieldMappings = {
      productName: ['Product Name', 'ProductName', 'product_name', 'product name'],
      unit: ['Unit', 'unit'],
      unitPrice: ['Unit Price', 'UnitPrice', 'unit_price', 'unit price'],
      venClassification: ['VEN Classification', 'VENClassification', 'ven_classification', 'ven classification', 'VEN'],
      facilitySpecific: ['Facility Specific', 'FacilitySpecific', 'facility_specific', 'facility specific'],
      procurementSource: ['Procurement Source', 'ProcurementSource', 'procurement_source', 'procurement source'],
      q1BeginningBalance: ['Q1 Beginning Balance', 'Q1BeginningBalance', 'q1_beginning_balance', 'q1 beginning balance'],
      q1Received: ['Q1 Received', 'Q1Received', 'q1_received', 'q1 received'],
      q1PositiveAdj: ['Q1 Positive Adjustment', 'Q1 Positive Adj', 'Q1PositiveAdj', 'q1_positive_adj', 'q1 positive adj'],
      q1NegativeAdj: ['Q1 Negative Adjustment', 'Q1 Negative Adj', 'Q1NegativeAdj', 'q1_negative_adj', 'q1 negative adj'],
      q1StockOutDays: ['Q1 Stock Out Days', 'Q1StockOutDays', 'q1_stock_out_days', 'q1 stock out days'],
      q1ExpiredDamaged: ['Q1 Expired/Damaged', 'Q1 Expired Damaged', 'Q1ExpiredDamaged', 'q1_expired_damaged', 'q1 expired damaged'],
      q1ConsumptionIssue: ['Q1 Consumption/Issue', 'Q1 Consumption Issue', 'Q1ConsumptionIssue', 'q1_consumption_issue', 'q1 consumption issue'],
      q2BeginningBalance: ['Q2 Beginning Balance', 'Q2BeginningBalance', 'q2_beginning_balance', 'q2 beginning balance'],
      q2Received: ['Q2 Received', 'Q2Received', 'q2_received', 'q2 received'],
      q2PositiveAdj: ['Q2 Positive Adjustment', 'Q2 Positive Adj', 'Q2PositiveAdj', 'q2_positive_adj', 'q2 positive adj'],
      q2NegativeAdj: ['Q2 Negative Adjustment', 'Q2 Negative Adj', 'Q2NegativeAdj', 'q2_negative_adj', 'q2 negative adj'],
      q2StockOutDays: ['Q2 Stock Out Days', 'Q2StockOutDays', 'q2_stock_out_days', 'q2 stock out days'],
      q2ExpiredDamaged: ['Q2 Expired/Damaged', 'Q2 Expired Damaged', 'Q2ExpiredDamaged', 'q2_expired_damaged', 'q2 expired damaged'],
      q2ConsumptionIssue: ['Q2 Consumption/Issue', 'Q2 Consumption Issue', 'Q2ConsumptionIssue', 'q2_consumption_issue', 'q2 consumption issue'],
      q3BeginningBalance: ['Q3 Beginning Balance', 'Q3BeginningBalance', 'q3_beginning_balance', 'q3 beginning balance'],
      q3Received: ['Q3 Received', 'Q3Received', 'q3_received', 'q3 received'],
      q3PositiveAdj: ['Q3 Positive Adjustment', 'Q3 Positive Adj', 'Q3PositiveAdj', 'q3_positive_adj', 'q3 positive adj'],
      q3NegativeAdj: ['Q3 Negative Adjustment', 'Q3 Negative Adj', 'Q3NegativeAdj', 'q3_negative_adj', 'q3 negative adj'],
      q3StockOutDays: ['Q3 Stock Out Days', 'Q3StockOutDays', 'q3_stock_out_days', 'q3 stock out days'],
      q3ExpiredDamaged: ['Q3 Expired/Damaged', 'Q3 Expired Damaged', 'Q3ExpiredDamaged', 'q3_expired_damaged', 'q3 expired damaged'],
      q3ConsumptionIssue: ['Q3 Consumption/Issue', 'Q3 Consumption Issue', 'Q3ConsumptionIssue', 'q3_consumption_issue', 'q3 consumption issue'],
      q4BeginningBalance: ['Q4 Beginning Balance', 'Q4BeginningBalance', 'q4_beginning_balance', 'q4 beginning balance'],
      q4Received: ['Q4 Received', 'Q4Received', 'q4_received', 'q4 received'],
      q4PositiveAdj: ['Q4 Positive Adjustment', 'Q4 Positive Adj', 'Q4PositiveAdj', 'q4_positive_adj', 'q4 positive adj'],
      q4NegativeAdj: ['Q4 Negative Adjustment', 'Q4 Negative Adj', 'Q4NegativeAdj', 'q4_negative_adj', 'q4 negative adj'],
      q4StockOutDays: ['Q4 Stock Out Days', 'Q4StockOutDays', 'q4_stock_out_days', 'q4 stock out days'],
      q4ExpiredDamaged: ['Q4 Expired/Damaged', 'Q4 Expired Damaged', 'Q4ExpiredDamaged', 'q4_expired_damaged', 'q4 expired damaged'],
      q4ConsumptionIssue: ['Q4 Consumption/Issue', 'Q4 Consumption Issue', 'Q4ConsumptionIssue', 'q4_consumption_issue', 'q4 consumption issue']
    };

    // Check each field for matches
    Object.entries(fieldMappings).forEach(([fieldKey, possibleNames]) => {
      const matchedHeader = excelHeaders.find(header => 
        possibleNames.some(name => 
          header.toLowerCase().trim() === name.toLowerCase().trim()
        )
      );
      
      if (matchedHeader) {
        mapping[fieldKey as keyof FieldMapping] = matchedHeader;
        matchCount++;
      }
    });

    return { mapping, matchCount };
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.match(/\.(xlsx|xls)$/i)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an Excel file (.xlsx or .xls)",
        variant: "destructive",
      });
      return;
    }

    setFile(uploadedFile);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length > 0) {
          const headerRow = jsonData[0] as string[];
          const dataRows = jsonData.slice(1) as any[][];
          
          setHeaders(headerRow);
          
          const formattedData = dataRows.map(row => {
            const obj: ExcelData = {};
            headerRow.forEach((header, index) => {
              obj[header] = row[index] || '';
            });
            return obj;
          });
          
          setExcelData(formattedData);
          
          // Auto-map fields
          const { mapping, matchCount } = autoMapFields(headerRow);
          setFieldMapping(mapping);
          
          if (matchCount > 0) {
            toast({
              title: "Auto-mapping Applied",
              description: `${matchCount} fields were automatically mapped based on column names`,
            });
          }
          
          setStep('mapping');
        }
      } catch (error) {
        toast({
          title: "Error Reading File",
          description: "Failed to parse the Excel file. Please check the file format.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };
    
    reader.readAsArrayBuffer(uploadedFile);
  }, [toast]);

  const updateFieldMapping = (field: string, column: string) => {
    setFieldMapping(prev => ({
      ...prev,
      [field]: column === 'none' ? '' : column
    }));
  };

  const validateMapping = () => {
    const requiredMapped = requiredFields.filter(field => field.required);
    const missingRequired = requiredMapped.filter(field => !fieldMapping[field.key as keyof FieldMapping]);
    
    if (missingRequired.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please map the following required fields: ${missingRequired.map(f => f.label).join(', ')}`,
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const previewData = () => {
    if (!validateMapping()) return;
    setStep('preview');
  };

  const importData = () => {
    // Transform Excel data to the required format
    const transformedData = excelData.map((row, index) => {
      const productData = {
        id: Date.now() + index,
        productName: row[fieldMapping.productName || ''] || '',
        unit: row[fieldMapping.unit || ''] || '',
        unitPrice: parseFloat(row[fieldMapping.unitPrice || '']) || 0,
        venClassification: (row[fieldMapping.venClassification || ''] || 'V').toUpperCase() as 'V' | 'E' | 'N',
        facilitySpecific: row[fieldMapping.facilitySpecific || ''] === 'true' || row[fieldMapping.facilitySpecific || ''] === '1',
        procurementSource: row[fieldMapping.procurementSource || ''] || '',
        quarters: [
          {
            quarter: 1,
            beginningBalance: parseInt(row[fieldMapping.q1BeginningBalance || '']) || 0,
            received: parseInt(row[fieldMapping.q1Received || '']) || 0,
            positiveAdj: parseInt(row[fieldMapping.q1PositiveAdj || '']) || 0,
            negativeAdj: parseInt(row[fieldMapping.q1NegativeAdj || '']) || 0,
            endingBalance: 0,
            stockOutDays: parseInt(row[fieldMapping.q1StockOutDays || '']) || 0,
            expiredDamaged: parseInt(row[fieldMapping.q1ExpiredDamaged || '']) || 0,
            consumptionIssue: parseInt(row[fieldMapping.q1ConsumptionIssue || '']) || 0,
            aamc: 0,
            wastageRate: 0
          },
          {
            quarter: 2,
            beginningBalance: parseInt(row[fieldMapping.q2BeginningBalance || '']) || 0,
            received: parseInt(row[fieldMapping.q2Received || '']) || 0,
            positiveAdj: parseInt(row[fieldMapping.q2PositiveAdj || '']) || 0,
            negativeAdj: parseInt(row[fieldMapping.q2NegativeAdj || '']) || 0,
            endingBalance: 0,
            stockOutDays: parseInt(row[fieldMapping.q2StockOutDays || '']) || 0,
            expiredDamaged: parseInt(row[fieldMapping.q2ExpiredDamaged || '']) || 0,
            consumptionIssue: parseInt(row[fieldMapping.q2ConsumptionIssue || '']) || 0,
            aamc: 0,
            wastageRate: 0
          },
          {
            quarter: 3,
            beginningBalance: parseInt(row[fieldMapping.q3BeginningBalance || '']) || 0,
            received: parseInt(row[fieldMapping.q3Received || '']) || 0,
            positiveAdj: parseInt(row[fieldMapping.q3PositiveAdj || '']) || 0,
            negativeAdj: parseInt(row[fieldMapping.q3NegativeAdj || '']) || 0,
            endingBalance: 0,
            stockOutDays: parseInt(row[fieldMapping.q3StockOutDays || '']) || 0,
            expiredDamaged: parseInt(row[fieldMapping.q3ExpiredDamaged || '']) || 0,
            consumptionIssue: parseInt(row[fieldMapping.q3ConsumptionIssue || '']) || 0,
            aamc: 0,
            wastageRate: 0
          },
          {
            quarter: 4,
            beginningBalance: parseInt(row[fieldMapping.q4BeginningBalance || '']) || 0,
            received: parseInt(row[fieldMapping.q4Received || '']) || 0,
            positiveAdj: parseInt(row[fieldMapping.q4PositiveAdj || '']) || 0,
            negativeAdj: parseInt(row[fieldMapping.q4NegativeAdj || '']) || 0,
            endingBalance: 0,
            stockOutDays: parseInt(row[fieldMapping.q4StockOutDays || '']) || 0,
            expiredDamaged: parseInt(row[fieldMapping.q4ExpiredDamaged || '']) || 0,
            consumptionIssue: parseInt(row[fieldMapping.q4ConsumptionIssue || '']) || 0,
            aamc: 0,
            wastageRate: 0
          }
        ],
        annualAverages: {
          annualConsumption: 0,
          aamc: 0,
          wastageRate: 0,
          awamc: 0
        },
        forecast: {
          aamcApplied: 0,
          wastageRateApplied: 0,
          programExpansionContraction: 0,
          projectedAmcAdjusted: 0,
          projectedAnnualConsumption: 0
        },
        seasonality: {
          q1: 0,
          q2: 0,
          q3: 0,
          q4: 0,
          total: 0
        }
      };
      
      // Calculate ending balances and metrics for each quarter
      productData.quarters.forEach(quarter => {
        quarter.endingBalance = Math.max(0, 
          quarter.beginningBalance + quarter.received + quarter.positiveAdj - 
          quarter.negativeAdj - quarter.consumptionIssue - quarter.expiredDamaged
        );
        
        if (quarter.stockOutDays < 90) {
          quarter.aamc = quarter.consumptionIssue / (3 - (quarter.stockOutDays / 30.5));
        }
        
        const totalAvailable = quarter.beginningBalance + quarter.received + quarter.positiveAdj;
        if (totalAvailable > 0) {
          quarter.wastageRate = (quarter.expiredDamaged / totalAvailable) * 100;
        }
      });
      
      return productData;
    });

    // Store the data (you can implement localStorage or pass to parent component)
    localStorage.setItem('importedPharmaceuticalData', JSON.stringify(transformedData));
    
    toast({
      title: "Data Imported Successfully",
      description: `${transformedData.length} products imported successfully`,
    });
    
    // Navigate to data entry page
    navigate('/data-entry');
  };

  const downloadTemplate = () => {
    const templateData = [
      [
        'Product Name', 'Unit', 'Unit Price', 'VEN Classification', 'Facility Specific', 'Procurement Source',
        'Q1 Beginning Balance', 'Q1 Received', 'Q1 Positive Adj', 'Q1 Negative Adj', 'Q1 Stock Out Days', 'Q1 Expired/Damaged', 'Q1 Consumption/Issue',
        'Q2 Beginning Balance', 'Q2 Received', 'Q2 Positive Adj', 'Q2 Negative Adj', 'Q2 Stock Out Days', 'Q2 Expired/Damaged', 'Q2 Consumption/Issue',
        'Q3 Beginning Balance', 'Q3 Received', 'Q3 Positive Adj', 'Q3 Negative Adj', 'Q3 Stock Out Days', 'Q3 Expired/Damaged', 'Q3 Consumption/Issue',
        'Q4 Beginning Balance', 'Q4 Received', 'Q4 Positive Adj', 'Q4 Negative Adj', 'Q4 Stock Out Days', 'Q4 Expired/Damaged', 'Q4 Consumption/Issue'
      ],
      [
        'Acyclovir - 40mg/ml - Oral Suspension', '125ml', '105.27', 'V', 'true', 'EPSS',
        '0', '0', '0', '0', '90', '0', '0',
        '0', '0', '0', '0', '90', '0', '0',
        '0', '0', '0', '0', '90', '0', '0',
        '0', '0', '0', '0', '90', '0', '0'
      ]
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pharmaceutical Data Template');
    XLSX.writeFile(wb, 'pharmaceutical_data_template.xlsx');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Import Pharmaceutical Data</h1>
          <p className="text-gray-600 mt-2">Upload Excel files and map fields to import pharmaceutical data</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${step === 'upload' ? 'text-blue-600' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'upload' ? 'bg-blue-100 border-2 border-blue-600' : 'bg-green-100'}`}>
                {step === 'upload' ? '1' : <CheckCircle className="w-5 h-5" />}
              </div>
              <span className="font-medium">Upload File</span>
            </div>
            <div className={`w-16 h-0.5 ${step === 'mapping' || step === 'preview' ? 'bg-green-600' : 'bg-gray-300'}`} />
            <div className={`flex items-center space-x-2 ${step === 'mapping' ? 'text-blue-600' : step === 'preview' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'mapping' ? 'bg-blue-100 border-2 border-blue-600' : step === 'preview' ? 'bg-green-100' : 'bg-gray-100'}`}>
                {step === 'preview' ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <span className="font-medium">Map Fields</span>
            </div>
            <div className={`w-16 h-0.5 ${step === 'preview' ? 'bg-green-600' : 'bg-gray-300'}`} />
            <div className={`flex items-center space-x-2 ${step === 'preview' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'preview' ? 'bg-blue-100 border-2 border-blue-600' : 'bg-gray-100'}`}>
                3
              </div>
              <span className="font-medium">Preview & Import</span>
            </div>
          </div>
        </div>

        {/* Upload Step */}
        {step === 'upload' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Excel File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <div className="text-lg font-medium text-gray-900">
                        {file ? file.name : 'Click to upload Excel file'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Supports .xlsx and .xls files
                      </div>
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={downloadTemplate}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Template
                  </Button>
                  
                  {isProcessing && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      Processing file...
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mapping Step */}
        {step === 'mapping' && (
          <Card>
            <CardHeader>
              <CardTitle>Map Excel Columns to Required Fields</CardTitle>
              <p className="text-sm text-gray-600">
                Map your Excel columns to the required pharmaceutical data fields. Required fields are marked with an asterisk (*).
                {Object.keys(fieldMapping).length > 0 && (
                  <span className="block mt-1 text-green-600 font-medium">
                    Some fields have been automatically mapped based on column names.
                  </span>
                )}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {requiredFields.map(field => (
                      <div key={field.key} className="space-y-2">
                        <Label className="flex items-center gap-1">
                          {field.label}
                          {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        <Select
                          value={fieldMapping[field.key as keyof FieldMapping] || 'none'}
                          onValueChange={(value) => updateFieldMapping(field.key, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select column" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">-- Select Column --</SelectItem>
                            {headers.map(header => (
                              <SelectItem key={header} value={header}>{header}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quarter Data */}
                {quarterFields.map(({ quarter, fields }) => (
                  <div key={quarter}>
                    <h3 className="text-lg font-semibold mb-3">Quarter {quarter} Data</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {fields.map(field => (
                        <div key={field.key} className="space-y-2">
                          <Label>{field.label}</Label>
                          <Select
                            value={fieldMapping[field.key as keyof FieldMapping] || 'none'}
                            onValueChange={(value) => updateFieldMapping(field.key, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select column" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">-- Select Column --</SelectItem>
                              {headers.map(header => (
                                <SelectItem key={header} value={header}>{header}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep('upload')}>
                    Back
                  </Button>
                  <Button onClick={previewData}>
                    Preview Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preview Step */}
        {step === 'preview' && (
          <Card>
            <CardHeader>
              <CardTitle>Preview Imported Data</CardTitle>
              <p className="text-sm text-gray-600">
                Review the first 5 rows of your data before importing. Check that the mapping is correct.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>VEN</TableHead>
                        <TableHead>Q1 Beginning</TableHead>
                        <TableHead>Q1 Received</TableHead>
                        <TableHead>Q1 Consumption</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {excelData.slice(0, 5).map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row[fieldMapping.productName || ''] || '-'}</TableCell>
                          <TableCell>{row[fieldMapping.unit || ''] || '-'}</TableCell>
                          <TableCell>{row[fieldMapping.unitPrice || ''] || '-'}</TableCell>
                          <TableCell>{row[fieldMapping.venClassification || ''] || '-'}</TableCell>
                          <TableCell>{row[fieldMapping.q1BeginningBalance || ''] || '-'}</TableCell>
                          <TableCell>{row[fieldMapping.q1Received || ''] || '-'}</TableCell>
                          <TableCell>{row[fieldMapping.q1ConsumptionIssue || ''] || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Ready to Import</p>
                      <p className="text-sm text-blue-700">
                        {excelData.length} rows will be imported. All calculations will be performed automatically.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep('mapping')}>
                    Back to Mapping
                  </Button>
                  <Button onClick={importData} className="bg-green-600 hover:bg-green-700">
                    Import Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Import;
