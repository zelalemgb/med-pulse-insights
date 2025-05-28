import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Save, Plus, Trash2, Download, ChevronDown, ChevronRight, Lock, Upload, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProductData, DataFrequency, PeriodData, getPeriodsForFrequency, createEmptyPeriods, ImportMapping } from '@/types/pharmaceutical';
import DataMappingDialog from '@/components/DataMappingDialog';
import * as XLSX from 'xlsx';

const DataEntry = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [selectedFrequency, setSelectedFrequency] = useState<DataFrequency>('quarterly');
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const [importFile, setImportFile] = useState<File | null>(null);
  const [showMappingDialog, setShowMappingDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const addNewProduct = () => {
    const now = new Date();
    const newProduct: ProductData = {
      id: `product-${Date.now()}`,
      productName: '',
      unit: '',
      unitPrice: 0,
      venClassification: 'V',
      facilitySpecific: false,
      procurementSource: '',
      frequency: selectedFrequency,
      facilityId: 'default_facility',
      periods: createEmptyPeriods(selectedFrequency),
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
        total: 0
      },
      createdAt: now,
      updatedAt: now,
      createdBy: 'data_entry_user'
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (productId: string, field: keyof ProductData, value: any) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, [field]: value, updatedAt: new Date() }
        : product
    ));
  };

  const deleteProduct = (productId: string) => {
    setProducts(products.filter(product => product.id !== productId));
    setExpandedProducts(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  const toggleExpanded = (productId: string) => {
    setExpandedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const updatePeriodData = (productId: string, periodIndex: number, field: keyof PeriodData, value: number) => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        const updatedPeriods = [...product.periods];
        updatedPeriods[periodIndex] = {
          ...updatedPeriods[periodIndex],
          [field]: value
        };
        return { ...product, periods: updatedPeriods, updatedAt: new Date() };
      }
      return product;
    }));
  };

  const calculateEndingBalance = (period: PeriodData): number => {
    return Math.max(0, 
      period.beginningBalance + period.received + period.positiveAdj - 
      period.negativeAdj - period.consumptionIssue - period.expiredDamaged
    );
  };

  const saveData = () => {
    // Here you would typically save to a database
    console.log('Saving products:', products);
    toast({
      title: "Data Saved",
      description: `${products.length} products saved successfully`,
    });
  };

  const exportToExcel = () => {
    if (products.length === 0) {
      toast({
        title: "No Data",
        description: "No products to export",
        variant: "destructive"
      });
      return;
    }

    const flatData = products.flatMap(product => 
      product.periods.map((period, index) => ({
        'Product Name': product.productName,
        'Unit': product.unit,
        'Unit Price': product.unitPrice,
        'VEN Classification': product.venClassification,
        'Procurement Source': product.procurementSource,
        'Period': period.periodName,
        'Beginning Balance': period.beginningBalance,
        'Received': period.received,
        'Positive Adj': period.positiveAdj,
        'Negative Adj': period.negativeAdj,
        'Ending Balance': calculateEndingBalance(period),
        'Stock Out Days': period.stockOutDays,
        'Expired/Damaged': period.expiredDamaged,
        'Consumption/Issue': period.consumptionIssue,
        'AAMC': period.aamc,
        'Wastage Rate': period.wastageRate
      }))
    );

    const ws = XLSX.utils.json_to_sheet(flatData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products Data');
    XLSX.writeFile(wb, `products_${selectedFrequency}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
      setShowMappingDialog(true);
    }
  };

  const handleMappingComplete = (mappedData: ProductData[], mapping: ImportMapping) => {
    try {
      setProducts(prev => [...prev, ...mappedData]);
      
      toast({
        title: "Import Successful",
        description: `${mappedData.length} products imported successfully`,
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: "Failed to import products",
        variant: "destructive"
      });
    } finally {
      setShowMappingDialog(false);
      setImportFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Data Entry</h1>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import Excel
          </Button>
          <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button onClick={saveData} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Data
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Product Data Entry
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label>Data Frequency:</Label>
                <Select value={selectedFrequency} onValueChange={setSelectedFrequency}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="bimonthly">Bimonthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addNewProduct} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No products added yet. Click "Add Product" to start.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <Card key={product.id} className="border">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-6 gap-4 items-center mb-4">
                      <div>
                        <Label>Product Name</Label>
                        <Input
                          value={product.productName}
                          onChange={(e) => updateProduct(product.id, 'productName', e.target.value)}
                          placeholder="Enter product name"
                        />
                      </div>
                      <div>
                        <Label>Unit</Label>
                        <Input
                          value={product.unit}
                          onChange={(e) => updateProduct(product.id, 'unit', e.target.value)}
                          placeholder="e.g., mg, ml, tablets"
                        />
                      </div>
                      <div>
                        <Label>Unit Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={product.unitPrice}
                          onChange={(e) => updateProduct(product.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>VEN Class</Label>
                        <Select 
                          value={product.venClassification} 
                          onValueChange={(value) => updateProduct(product.id, 'venClassification', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="V">V - Vital</SelectItem>
                            <SelectItem value="E">E - Essential</SelectItem>
                            <SelectItem value="N">N - Non-essential</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Procurement Source</Label>
                        <Input
                          value={product.procurementSource}
                          onChange={(e) => updateProduct(product.id, 'procurementSource', e.target.value)}
                          placeholder="e.g., EPSS, Local"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleExpanded(product.id)}
                          className="flex items-center gap-1"
                        >
                          {expandedProducts.has(product.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                          Periods
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {expandedProducts.has(product.id) && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Period Data ({getPeriodsForFrequency(product.frequency).names.length} periods)</h4>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Period</TableHead>
                                <TableHead>Beginning Balance</TableHead>
                                <TableHead>Received</TableHead>
                                <TableHead>Positive Adj</TableHead>
                                <TableHead>Negative Adj</TableHead>
                                <TableHead>Ending Balance</TableHead>
                                <TableHead>Stock Out Days</TableHead>
                                <TableHead>Expired/Damaged</TableHead>
                                <TableHead>Consumption/Issue</TableHead>
                                <TableHead>AAMC</TableHead>
                                <TableHead>Wastage Rate %</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {product.periods.map((period, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">{period.periodName}</TableCell>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      value={period.beginningBalance}
                                      onChange={(e) => updatePeriodData(product.id, index, 'beginningBalance', parseFloat(e.target.value) || 0)}
                                      className="w-24"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      value={period.received}
                                      onChange={(e) => updatePeriodData(product.id, index, 'received', parseFloat(e.target.value) || 0)}
                                      className="w-24"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      value={period.positiveAdj}
                                      onChange={(e) => updatePeriodData(product.id, index, 'positiveAdj', parseFloat(e.target.value) || 0)}
                                      className="w-24"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      value={period.negativeAdj}
                                      onChange={(e) => updatePeriodData(product.id, index, 'negativeAdj', parseFloat(e.target.value) || 0)}
                                      className="w-24"
                                    />
                                  </TableCell>
                                  <TableCell className="bg-gray-50">
                                    <div className="flex items-center gap-1">
                                      <Lock className="w-3 h-3 text-gray-400" />
                                      <span className="text-sm font-medium">
                                        {calculateEndingBalance(period)}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      value={period.stockOutDays}
                                      onChange={(e) => updatePeriodData(product.id, index, 'stockOutDays', parseFloat(e.target.value) || 0)}
                                      className="w-24"
                                      max={getPeriodsForFrequency(product.frequency).maxStockOutDays}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      value={period.expiredDamaged}
                                      onChange={(e) => updatePeriodData(product.id, index, 'expiredDamaged', parseFloat(e.target.value) || 0)}
                                      className="w-24"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      value={period.consumptionIssue}
                                      onChange={(e) => updatePeriodData(product.id, index, 'consumptionIssue', parseFloat(e.target.value) || 0)}
                                      className="w-24"
                                    />
                                  </TableCell>
                                  <TableCell className="bg-gray-50">
                                    <span className="text-sm font-medium">{period.aamc.toFixed(2)}</span>
                                  </TableCell>
                                  <TableCell className="bg-gray-50">
                                    <span className="text-sm font-medium">{period.wastageRate.toFixed(2)}%</span>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <DataMappingDialog
        open={showMappingDialog}
        onOpenChange={setShowMappingDialog}
        file={importFile}
        onMappingComplete={handleMappingComplete}
      />
    </div>
  );
};

export default DataEntry;
