import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Save, Plus, Trash2, Download, ChevronDown, ChevronRight, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductData {
  id: string;
  productName: string;
  unit: string;
  unitPrice: number;
  venClassification: 'V' | 'E' | 'N';
  facilitySpecific: boolean;
  procurementSource: string;
  quarters: QuarterData[];
  annualAverages: {
    annualConsumption: number;
    aamc: number;
    wastageRate: number;
    awamc: number;
  };
  forecast: {
    aamcApplied: number;
    wastageRateApplied: number;
    programExpansionContraction: number;
    projectedAmcAdjusted: number;
    projectedAnnualConsumption: number;
  };
  seasonality: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
    total: number;
  };
}

interface QuarterData {
  quarter: number;
  beginningBalance: number;
  received: number;
  positiveAdj: number;
  negativeAdj: number;
  endingBalance: number;
  stockOutDays: number;
  expiredDamaged: number;
  consumptionIssue: number;
  aamc: number;
  wastageRate: number;
}

const DataEntry = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [openQuarters, setOpenQuarters] = useState<{[key: number]: boolean}>({
    0: true, // Quarter 1 open by default
    1: false,
    2: false,
    3: false
  });

  // Check if a quarter is complete for a product
  const isQuarterComplete = (product: ProductData, quarterIndex: number) => {
    const quarter = product.quarters[quarterIndex];
    return quarter.beginningBalance > 0 || quarter.received > 0 || quarter.consumptionIssue > 0;
  };

  // Check if a quarter should be available (unlocked)
  const isQuarterAvailable = (product: ProductData, quarterIndex: number) => {
    if (quarterIndex === 0) return true; // Q1 always available
    
    // Check if previous quarter is complete
    for (let i = 0; i < quarterIndex; i++) {
      if (!isQuarterComplete(product, i)) {
        return false;
      }
    }
    return true;
  };

  // Check if all products have completed a specific quarter
  const areAllProductsCompleteForQuarter = (quarterIndex: number) => {
    if (products.length === 0) return false;
    return products.every(product => isQuarterComplete(product, quarterIndex));
  };

  // Auto-unlock next quarter when all products complete current quarter
  useEffect(() => {
    for (let q = 0; q < 3; q++) {
      if (areAllProductsCompleteForQuarter(q) && !openQuarters[q + 1]) {
        setOpenQuarters(prev => ({ ...prev, [q + 1]: false })); // Keep it closed but available
      }
    }
  }, [products]);

  const toggleQuarter = (quarterIndex: number) => {
    // Check if at least one product has this quarter available
    const hasAvailableQuarter = products.some(product => isQuarterAvailable(product, quarterIndex));
    
    if (hasAvailableQuarter || quarterIndex === 0) {
      setOpenQuarters(prev => ({
        ...prev,
        [quarterIndex]: !prev[quarterIndex]
      }));
    }
  };

  const addNewProduct = () => {
    const newProduct: ProductData = {
      id: Date.now().toString(),
      productName: '',
      unit: '',
      unitPrice: 0,
      venClassification: 'V',
      facilitySpecific: false,
      procurementSource: '',
      quarters: [
        { quarter: 1, beginningBalance: 0, received: 0, positiveAdj: 0, negativeAdj: 0, endingBalance: 0, stockOutDays: 0, expiredDamaged: 0, consumptionIssue: 0, aamc: 0, wastageRate: 0 },
        { quarter: 2, beginningBalance: 0, received: 0, positiveAdj: 0, negativeAdj: 0, endingBalance: 0, stockOutDays: 0, expiredDamaged: 0, consumptionIssue: 0, aamc: 0, wastageRate: 0 },
        { quarter: 3, beginningBalance: 0, received: 0, positiveAdj: 0, negativeAdj: 0, endingBalance: 0, stockOutDays: 0, expiredDamaged: 0, consumptionIssue: 0, aamc: 0, wastageRate: 0 },
        { quarter: 4, beginningBalance: 0, received: 0, positiveAdj: 0, negativeAdj: 0, endingBalance: 0, stockOutDays: 0, expiredDamaged: 0, consumptionIssue: 0, aamc: 0, wastageRate: 0 }
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
    
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProductField = (productId: string, field: keyof ProductData, value: any) => {
    setProducts(prev => prev.map(product => 
      product.id === productId ? { ...product, [field]: value } : product
    ));
  };

  const updateForecastField = (productId: string, field: keyof ProductData['forecast'], value: number) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const updatedForecast = { ...product.forecast, [field]: value };
        
        // Auto-calculate projected AMC adjusted for wastage
        if (['aamcApplied', 'wastageRateApplied', 'programExpansionContraction'].includes(field)) {
          const expansionFactor = 1 + (updatedForecast.programExpansionContraction / 100);
          const adjustedAmc = updatedForecast.aamcApplied * expansionFactor;
          const wastageAdjustment = 1 + (updatedForecast.wastageRateApplied / 100);
          updatedForecast.projectedAmcAdjusted = adjustedAmc * wastageAdjustment;
          
          // Auto-calculate projected annual consumption
          updatedForecast.projectedAnnualConsumption = updatedForecast.projectedAmcAdjusted * 12;
        }
        
        return { ...product, forecast: updatedForecast };
      }
      return product;
    }));
  };

  const updateQuarterData = (productId: string, quarterIndex: number, field: keyof QuarterData, value: number) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const updatedQuarters = [...product.quarters];
        updatedQuarters[quarterIndex] = { ...updatedQuarters[quarterIndex], [field]: value };
        
        // Auto-calculate ending balance
        if (['beginningBalance', 'received', 'positiveAdj', 'negativeAdj', 'consumptionIssue', 'expiredDamaged'].includes(field)) {
          const quarter = updatedQuarters[quarterIndex];
          const endingBalance = quarter.beginningBalance + quarter.received + quarter.positiveAdj - quarter.negativeAdj - quarter.consumptionIssue - quarter.expiredDamaged;
          updatedQuarters[quarterIndex].endingBalance = Math.max(0, endingBalance);
        }
        
        // Auto-calculate aamc
        if (['stockOutDays', 'consumptionIssue'].includes(field)) {
          const quarter = updatedQuarters[quarterIndex];
          if (quarter.stockOutDays < 90) {
            quarter.aamc = quarter.consumptionIssue / (3 - (quarter.stockOutDays / 30.5));
          }
        }
        
        // Auto-calculate wastage rate
        if (['expiredDamaged', 'beginningBalance', 'received', 'positiveAdj'].includes(field)) {
          const quarter = updatedQuarters[quarterIndex];
          const totalAvailable = quarter.beginningBalance + quarter.received + quarter.positiveAdj;
          if (totalAvailable > 0) {
            quarter.wastageRate = (quarter.expiredDamaged / totalAvailable) * 100;
          }
        }
        
        return { ...product, quarters: updatedQuarters };
      }
      return product;
    }));
  };

  const removeProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    toast({
      title: "Product Removed",
      description: "Product has been removed from the list",
    });
  };

  const saveData = () => {
    console.log('Saving data:', products);
    toast({
      title: "Data Saved",
      description: `${products.length} products saved successfully`,
    });
  };

  const quarterColors = ['bg-blue-50', 'bg-green-50', 'bg-yellow-50', 'bg-red-50'];
  const quarterNames = ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'];

  // Check if a quarter button should be available globally
  const isQuarterGloballyAvailable = (quarterIndex: number) => {
    if (quarterIndex === 0) return true;
    if (products.length === 0) return false;
    return products.some(product => isQuarterAvailable(product, quarterIndex));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-full mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Quarterly Pharmaceutical Data Entry</h1>
          <p className="text-gray-600 mt-2">Enter quarterly pharmaceutical usage data with progressive quarter unlocking</p>
        </div>

        <div className="flex gap-4 mb-6">
          <Button onClick={addNewProduct} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
          <Button onClick={saveData} className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Save All Data
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export to Excel
          </Button>
        </div>

        {/* Quarter Toggle Buttons */}
        <div className="mb-4 flex gap-2 flex-wrap">
          {quarterNames.map((name, index) => {
            const isAvailable = isQuarterGloballyAvailable(index);
            return (
              <Button
                key={index}
                variant={openQuarters[index] ? "default" : "outline"}
                size="sm"
                onClick={() => toggleQuarter(index)}
                disabled={!isAvailable}
                className={`${quarterColors[index]} border ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {!isAvailable && <Lock className="w-4 h-4 mr-2" />}
                {isAvailable && (openQuarters[index] ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />)}
                {name}
                {!isAvailable && <span className="ml-2 text-xs">(Complete Q{index} first)</span>}
              </Button>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pharmaceutical Data Entry Table</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="sticky left-0 bg-gray-100 font-bold border-r min-w-[200px]">Product List</TableHead>
                    <TableHead className="font-bold border-r min-w-[100px]">Unit</TableHead>
                    <TableHead className="font-bold border-r min-w-[100px]">Unit Price</TableHead>
                    <TableHead className="font-bold border-r min-w-[120px]">VEN Classification</TableHead>
                    <TableHead className="font-bold border-r min-w-[150px]">Facility Specific</TableHead>
                    <TableHead className="font-bold border-r min-w-[150px]">Procurement Source</TableHead>
                    
                    {/* Quarterly Data Headers - Only show if quarter is open */}
                    {quarterNames.map((name, qIndex) => (
                      openQuarters[qIndex] && (
                        <TableHead key={qIndex} colSpan={10} className={`text-center font-bold border-r ${quarterColors[qIndex]}`}>
                          {name}
                        </TableHead>
                      )
                    ))}
                    
                    {/* Annual Averages */}
                    <TableHead colSpan={4} className="text-center font-bold border-r bg-purple-50">Annual Averages</TableHead>
                    
                    {/* Forecast */}
                    <TableHead colSpan={5} className="text-center font-bold border-r bg-teal-50">Forecast</TableHead>
                    
                    {/* Seasonality */}
                    <TableHead colSpan={5} className="text-center font-bold bg-orange-50">Seasonality</TableHead>
                    <TableHead className="font-bold">Actions</TableHead>
                  </TableRow>
                  <TableRow className="bg-gray-50 text-xs">
                    <TableHead className="sticky left-0 bg-gray-50"></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    
                    {/* Quarter Subheadings - Only show if quarter is open */}
                    {[0, 1, 2, 3].map((qIndex) => (
                      openQuarters[qIndex] && (
                        <React.Fragment key={qIndex}>
                          <TableHead className={`${quarterColors[qIndex]} min-w-[100px]`}>Beginning Balance</TableHead>
                          <TableHead className={`${quarterColors[qIndex]} min-w-[100px]`}>Received</TableHead>
                          <TableHead className={`${quarterColors[qIndex]} min-w-[100px]`}>Positive Adj</TableHead>
                          <TableHead className={`${quarterColors[qIndex]} min-w-[100px]`}>Negative Adj</TableHead>
                          <TableHead className={`${quarterColors[qIndex]} min-w-[100px]`}>Ending Balance</TableHead>
                          <TableHead className={`${quarterColors[qIndex]} min-w-[100px]`}>Stock Out Days</TableHead>
                          <TableHead className={`${quarterColors[qIndex]} min-w-[100px]`}>Expired/Damaged</TableHead>
                          <TableHead className={`${quarterColors[qIndex]} min-w-[100px]`}>Consumption/Issue</TableHead>
                          <TableHead className={`${quarterColors[qIndex]} min-w-[100px]`}>aAMC</TableHead>
                          <TableHead className={`${quarterColors[qIndex]} min-w-[100px] border-r`}>Wastage Rate</TableHead>
                        </React.Fragment>
                      )
                    ))}
                    
                    {/* Annual Averages Subheadings */}
                    <TableHead className="bg-purple-50 min-w-[120px]">Annual Consumption</TableHead>
                    <TableHead className="bg-purple-50 min-w-[100px]">aAMC</TableHead>
                    <TableHead className="bg-purple-50 min-w-[100px]">Wastage Rate</TableHead>
                    <TableHead className="bg-purple-50 min-w-[100px] border-r">awAMC</TableHead>
                    
                    {/* Forecast Subheadings */}
                    <TableHead className="bg-teal-50 min-w-[100px]">aAMC Applied</TableHead>
                    <TableHead className="bg-teal-50 min-w-[120px]">Wastage Rate Applied</TableHead>
                    <TableHead className="bg-teal-50 min-w-[150px]">Program Expansion/Contraction %</TableHead>
                    <TableHead className="bg-teal-50 min-w-[150px]">Projected AMC Adjusted</TableHead>
                    <TableHead className="bg-teal-50 min-w-[150px] border-r">Projected Annual Consumption</TableHead>
                    
                    {/* Seasonality Subheadings */}
                    <TableHead className="bg-orange-50 min-w-[60px]">Q1</TableHead>
                    <TableHead className="bg-orange-50 min-w-[60px]">Q2</TableHead>
                    <TableHead className="bg-orange-50 min-w-[60px]">Q3</TableHead>
                    <TableHead className="bg-orange-50 min-w-[60px]">Q4</TableHead>
                    <TableHead className="bg-orange-50 min-w-[80px]">Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} className="hover:bg-gray-50">
                      {/* Product Information */}
                      <TableCell className="sticky left-0 bg-white border-r">
                        <Input
                          value={product.productName}
                          onChange={(e) => updateProductField(product.id, 'productName', e.target.value)}
                          placeholder="Product name"
                          className="h-8 text-xs"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={product.unit}
                          onChange={(e) => updateProductField(product.id, 'unit', e.target.value)}
                          placeholder="Unit"
                          className="h-8 text-xs w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={product.unitPrice}
                          onChange={(e) => updateProductField(product.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="h-8 text-xs w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Select value={product.venClassification} onValueChange={(value) => updateProductField(product.id, 'venClassification', value)}>
                          <SelectTrigger className="h-8 text-xs w-16">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="V">V</SelectItem>
                            <SelectItem value="E">E</SelectItem>
                            <SelectItem value="N">N</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={product.facilitySpecific}
                          onChange={(e) => updateProductField(product.id, 'facilitySpecific', e.target.checked)}
                          className="h-4 w-4"
                        />
                      </TableCell>
                      <TableCell className="border-r">
                        <Input
                          value={product.procurementSource}
                          onChange={(e) => updateProductField(product.id, 'procurementSource', e.target.value)}
                          placeholder="Source"
                          className="h-8 text-xs w-24"
                        />
                      </TableCell>
                      
                      {/* Quarter Data - Only show if quarter is open and available for this product */}
                      {product.quarters.map((quarter, qIndex) => (
                        openQuarters[qIndex] && (
                          <React.Fragment key={qIndex}>
                            <TableCell className={quarterColors[qIndex]}>
                              <Input
                                type="number"
                                value={quarter.beginningBalance}
                                onChange={(e) => updateQuarterData(product.id, qIndex, 'beginningBalance', parseInt(e.target.value) || 0)}
                                disabled={!isQuarterAvailable(product, qIndex)}
                                className={`h-8 text-xs w-20 ${!isQuarterAvailable(product, qIndex) ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                              />
                            </TableCell>
                            <TableCell className={quarterColors[qIndex]}>
                              <Input
                                type="number"
                                value={quarter.received}
                                onChange={(e) => updateQuarterData(product.id, qIndex, 'received', parseInt(e.target.value) || 0)}
                                disabled={!isQuarterAvailable(product, qIndex)}
                                className={`h-8 text-xs w-20 ${!isQuarterAvailable(product, qIndex) ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                              />
                            </TableCell>
                            <TableCell className={quarterColors[qIndex]}>
                              <Input
                                type="number"
                                value={quarter.positiveAdj}
                                onChange={(e) => updateQuarterData(product.id, qIndex, 'positiveAdj', parseInt(e.target.value) || 0)}
                                disabled={!isQuarterAvailable(product, qIndex)}
                                className={`h-8 text-xs w-20 ${!isQuarterAvailable(product, qIndex) ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                              />
                            </TableCell>
                            <TableCell className={quarterColors[qIndex]}>
                              <Input
                                type="number"
                                value={quarter.negativeAdj}
                                onChange={(e) => updateQuarterData(product.id, qIndex, 'negativeAdj', parseInt(e.target.value) || 0)}
                                disabled={!isQuarterAvailable(product, qIndex)}
                                className={`h-8 text-xs w-20 ${!isQuarterAvailable(product, qIndex) ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                              />
                            </TableCell>
                            <TableCell className={quarterColors[qIndex]}>
                              <Input
                                type="number"
                                value={quarter.endingBalance}
                                readOnly
                                className="h-8 text-xs w-20 bg-gray-100"
                              />
                            </TableCell>
                            <TableCell className={quarterColors[qIndex]}>
                              <Input
                                type="number"
                                value={quarter.stockOutDays}
                                onChange={(e) => updateQuarterData(product.id, qIndex, 'stockOutDays', parseInt(e.target.value) || 0)}
                                disabled={!isQuarterAvailable(product, qIndex)}
                                className={`h-8 text-xs w-20 ${!isQuarterAvailable(product, qIndex) ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                                max="90"
                              />
                            </TableCell>
                            <TableCell className={quarterColors[qIndex]}>
                              <Input
                                type="number"
                                value={quarter.expiredDamaged}
                                onChange={(e) => updateQuarterData(product.id, qIndex, 'expiredDamaged', parseInt(e.target.value) || 0)}
                                disabled={!isQuarterAvailable(product, qIndex)}
                                className={`h-8 text-xs w-20 ${!isQuarterAvailable(product, qIndex) ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                              />
                            </TableCell>
                            <TableCell className={quarterColors[qIndex]}>
                              <Input
                                type="number"
                                value={quarter.consumptionIssue}
                                onChange={(e) => updateQuarterData(product.id, qIndex, 'consumptionIssue', parseInt(e.target.value) || 0)}
                                disabled={!isQuarterAvailable(product, qIndex)}
                                className={`h-8 text-xs w-20 ${!isQuarterAvailable(product, qIndex) ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                              />
                            </TableCell>
                            <TableCell className={quarterColors[qIndex]}>
                              <Input
                                type="number"
                                value={quarter.aamc.toFixed(2)}
                                readOnly
                                className="h-8 text-xs w-20 bg-gray-100"
                              />
                            </TableCell>
                            <TableCell className={`${quarterColors[qIndex]} border-r`}>
                              <Input
                                value={`${quarter.wastageRate.toFixed(1)}%`}
                                readOnly
                                className="h-8 text-xs w-20 bg-gray-100"
                              />
                            </TableCell>
                          </React.Fragment>
                        )
                      ))}
                      
                      {/* Annual Averages */}
                      <TableCell className="bg-purple-25">
                        <span className="text-xs">{product.annualAverages.annualConsumption}</span>
                      </TableCell>
                      <TableCell className="bg-purple-25">
                        <span className="text-xs">{product.annualAverages.aamc.toFixed(2)}</span>
                      </TableCell>
                      <TableCell className="bg-purple-25">
                        <span className="text-xs">{product.annualAverages.wastageRate.toFixed(1)}%</span>
                      </TableCell>
                      <TableCell className="bg-purple-25 border-r">
                        <span className="text-xs">{product.annualAverages.awamc.toFixed(2)}</span>
                      </TableCell>
                      
                      {/* Forecast */}
                      <TableCell className="bg-teal-25">
                        <Input
                          type="number"
                          value={product.forecast.aamcApplied}
                          onChange={(e) => updateForecastField(product.id, 'aamcApplied', parseFloat(e.target.value) || 0)}
                          className="h-8 text-xs w-20"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell className="bg-teal-25">
                        <Input
                          type="number"
                          value={product.forecast.wastageRateApplied}
                          onChange={(e) => updateForecastField(product.id, 'wastageRateApplied', parseFloat(e.target.value) || 0)}
                          className="h-8 text-xs w-20"
                          step="0.1"
                        />
                      </TableCell>
                      <TableCell className="bg-teal-25">
                        <Input
                          type="number"
                          value={product.forecast.programExpansionContraction}
                          onChange={(e) => updateForecastField(product.id, 'programExpansionContraction', parseFloat(e.target.value) || 0)}
                          className="h-8 text-xs w-20"
                          step="0.1"
                        />
                      </TableCell>
                      <TableCell className="bg-teal-25">
                        <span className="text-xs">{product.forecast.projectedAmcAdjusted.toFixed(2)}</span>
                      </TableCell>
                      <TableCell className="bg-teal-25 border-r">
                        <span className="text-xs">{product.forecast.projectedAnnualConsumption.toFixed(2)}</span>
                      </TableCell>
                      
                      {/* Seasonality */}
                      <TableCell className="bg-orange-25">
                        <span className="text-xs">{product.seasonality.q1}%</span>
                      </TableCell>
                      <TableCell className="bg-orange-25">
                        <span className="text-xs">{product.seasonality.q2}%</span>
                      </TableCell>
                      <TableCell className="bg-orange-25">
                        <span className="text-xs">{product.seasonality.q3}%</span>
                      </TableCell>
                      <TableCell className="bg-orange-25">
                        <span className="text-xs">{product.seasonality.q4}%</span>
                      </TableCell>
                      <TableCell className="bg-orange-25">
                        <span className="text-xs">{product.seasonality.total}%</span>
                      </TableCell>
                      
                      {/* Actions */}
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProduct(product.id)}
                          className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No products added yet. Click "Add Product" to start entering data.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataEntry;
