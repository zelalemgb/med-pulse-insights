import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useBulkImportPharmaceuticalProducts } from '@/hooks/useBulkImportPharmaceuticalProducts';

interface ImportResult {
  totalRows: number;
  successfulRows: number;
  errorRows: number;
  errors: string[];
  warnings: string[];
}

const BulkImportDialog = ({ onImportComplete }: { onImportComplete?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();
  const { 
    importData, 
    isImporting, 
    progress, 
    importResult, 
    reset 
  } = useBulkImportPharmaceuticalProducts();

  const handleFileSelect = (selectedFile: File) => {
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select an Excel (.xlsx, .xls) or CSV file",
        variant: "destructive",
      });
      return;
    }

    if (selectedFile.size > 200 * 1024 * 1024) { // 200MB limit
      toast({
        title: "File too large",
        description: "Please select a file smaller than 200MB",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleImport = async () => {
    if (!file) return;

    try {
      await importData(file);
      toast({
        title: "Import completed",
        description: `Successfully processed ${file.name}`,
      });
      onImportComplete?.();
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFile(null);
    reset();
  };

  const downloadTemplate = () => {
    const headers = [
      'region',
      'zone',
      'woreda',
      'facility',
      'product_name',
      'unit',
      'product_category',
      'price',
      'procurement_source',
      'quantity',
      'miazia_price'
    ];
    
    const csvContent = headers.join(',') + '\n' +
      'Addis Ababa,Addis Ababa Zone,Woreda 1,Sample Health Center,Paracetamol 500mg,100 tablets,Medicines,25.50,EPSS,50,1275.00\n' +
      'Oromia,East Shewa Zone,Woreda 2,Sample Hospital,Amoxicillin 250mg,50 capsules,Medicines,45.00,NON-EPSS,30,1350.00';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pharmaceutical_products_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Import Data
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Import Pharmaceutical Products</DialogTitle>
          <DialogDescription>
            Import pharmaceutical products from Excel or CSV files. Large files are processed in batches for optimal performance.
          </DialogDescription>
        </DialogHeader>

        {!importResult && (
          <div className="space-y-4">
            {/* Template Download */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Download Template</CardTitle>
                <CardDescription className="text-xs">
                  Download a sample CSV template with the correct column format (includes Region and Zone)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" onClick={downloadTemplate}>
                  <FileText className="h-4 w-4 mr-2" />
                  Download CSV Template
                </Button>
              </CardContent>
            </Card>

            {/* File Upload */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {file ? (
                <div className="space-y-2">
                  <FileText className="h-12 w-12 mx-auto text-green-600" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFile(null)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 mx-auto text-gray-400" />
                  <div>
                    <p className="text-lg font-medium">Drop your file here</p>
                    <p className="text-sm text-gray-500">or click to browse</p>
                  </div>
                  <Input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      if (selectedFile) handleFileSelect(selectedFile);
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer" asChild>
                      <span>Select File</span>
                    </Button>
                  </label>
                  <p className="text-xs text-gray-500">
                    Supports Excel (.xlsx, .xls) and CSV files up to 200MB
                  </p>
                </div>
              )}
            </div>

            {/* Progress */}
            {isImporting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </div>
        )}

        {/* Import Results */}
        {importResult && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{importResult.totalRows}</p>
                  <p className="text-sm text-gray-600">Total Rows</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{importResult.successfulRows}</p>
                  <p className="text-sm text-gray-600">Successful</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">{importResult.errorRows}</p>
                  <p className="text-sm text-gray-600">Errors</p>
                </CardContent>
              </Card>
            </div>

            {importResult.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-2">Errors encountered:</div>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {importResult.errors.slice(0, 5).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                    {importResult.errors.length > 5 && (
                      <li>... and {importResult.errors.length - 5} more errors</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {importResult.warnings.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-2">Warnings:</div>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {importResult.warnings.slice(0, 3).map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                    {importResult.warnings.length > 3 && (
                      <li>... and {importResult.warnings.length - 3} more warnings</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {importResult.successfulRows > 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Successfully imported {importResult.successfulRows} pharmaceutical products.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <DialogFooter>
          {!importResult ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleImport} 
                disabled={!file || isImporting}
              >
                {isImporting ? 'Importing...' : 'Import Data'}
              </Button>
            </>
          ) : (
            <Button onClick={handleClose}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkImportDialog;
