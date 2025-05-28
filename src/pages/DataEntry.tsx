
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Save, Plus, Trash2, Download, ChevronDown, ChevronRight, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProductData, DataFrequency, PeriodData, getPeriodsForFrequency, createEmptyPeriods } from '@/types/dataEntry';

const DataEntry = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [selectedFrequency, setSelectedFrequency] = useState<DataFrequency>('quarterly');
  const [openPeriods, setOpenPeriods] = useState<{[key: number]: boolean}>({});

  // Initialize open periods when frequency changes
  useEffect(() => {
    const { count } = getPeriodsForFrequency(selectedFrequency);
    const initialOpenPeriods: {[key: number]: boolean} = {};
    for (let i = 0; i < count; i++) {
      initialOpenPeriods[i] = i === 0; // Only first period open by default
    }
    setOpenPeriods(initialOpenPeriods);
  }, [selectedFrequency]);

  // Check if a period is complete for a product
  const isPeriodComplete = (product: ProductData, periodIndex: number) => {
    const period = product.periods[periodIndex];
    return period.beginningBalance > 0 || period.received > 0 || period.consumptionIssue > 0;
  };

  // Check if a period should be available (unlocked)
  const isPeriodAvailable = (product: ProductData, periodIndex: number) => {
    if (periodIndex === 0) return true; // First period always available
    
    // Check if previous period is complete
    for (let i = 0; i < periodIndex; i++) {
      if (!isPeriodComplete(product, i)) {
        return false;
      }
    }
    return true;
  };

  // Check if all products have completed a specific period
  const areAllProductsCompleteForPeriod = (periodIndex: number) => {
    if (products.length === 0) return false;
    return products.every(product => isPeriodComplete(product, periodIndex));
  };

  // Auto-unlock next period when all products complete current period
  useEffect(() => {
    const { count } = getPeriodsForFrequency(selectedFrequency);
    for (let p = 0; p < count - 1; p++) {
      if (areAllProductsCompleteForPeriod(p) && !openPeriods[p + 1]) {
        setOpenPeriods(prev => ({ ...prev, [p + 1]: false })); // Keep it closed but available
      }
    }
  }, [products, selectedFrequency]);

  const togglePeriod = (periodIndex: number) => {
    // Check if at least one product has this period available
    const hasAvailablePeriod = products.some(product => isPeriodAvailable(product, periodIndex));
    
    if (hasAvailablePeriod || periodIndex === 0) {
      setOpenPeriods(prev => ({
        ...prev,
        [periodIndex]: !prev[periodIndex]
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
      frequency: selectedFrequency,
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
      seasonality: (() => {
        const { names } = getPeriodsForFrequency(selectedFrequency);
        const seasonality: {[key: string]: number} = { total: 0 };
        names.forEach((name, index) => {
          seasonality[`p${index + 1}`] = 0;
        });
        return seasonality;
      })()
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
          const periodsPerYear = getPeriodsForFrequency(product.frequency).count;
          const periodMultiplier = product.frequency === 'yearly' ? 1 : periodsPerYear;
          updatedForecast.projectedAnnualConsumption = updatedForecast.projectedAmcAdjusted * periodMultiplier;
        }
        
        return { ...product, forecast: updatedForecast };
      }
      return product;
    }));
  };

  const updatePeriodData = (productId: string, periodIndex: number, field: keyof PeriodData, value: number) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const updatedPeriods = [...product.periods];
        updatedPeriods[periodIndex] = { ...updatedPeriods[periodIndex], [field]: value };
        
        // Auto-calculate ending balance
        if (['beginningBalance', 'received', 'positiveAdj', 'negativeAdj', 'consumptionIssue', 'expiredDamaged'].includes(field)) {
          const period = updatedPeriods[periodIndex];
          const endingBalance = period.beginningBalance + period.received + period.positiveAdj - period.negativeAdj - period.consumptionIssue - period.expiredDamaged;
          updatedPeriods[periodIndex].endingBalance = Math.max(0, endingBalance);
        }
        
        // Auto-calculate aamc
        if (['stockOutDays', 'consumptionIssue'].includes(field)) {
          const period = updatedPeriods[periodIndex];
          const { maxStockOutDays } = getPeriodsForFrequency(product.frequency);
          const periodsPerYear = getPeriodsForFrequency(product.frequency).count;
          
          if (period.stockOutDays < maxStockOutDays) {
            const daysInPeriod = maxStockOutDays;
            const adjustedDays = daysInPeriod - period.stockOutDays;
            period.aamc = period.consumptionIssue / (adjustedDays / (365 / periodsPerYear));
          }
        }
        
        // Auto-calculate wastage rate
        if (['expiredDamaged', 'beginningBalance', 'received', 'positiveAdj'].includes(field)) {
          const period = updatedPeriods[periodIndex];
          const totalAvailable = period.beginningBalance + period.received + period.positiveAdj;
          if (totalAvailable > 0) {
            period.wastageRate = (period.expiredDamaged / totalAvailable) * 100;
          }
        }
        
        return { ...product, periods: updatedPeriods };
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

  const changeFrequency = (newFrequency: DataFrequency) => {
    setSelectedFrequency(newFrequency);
    // Update existing products to new frequency
    setProducts(prev => prev.map(product => ({
      ...product,
      frequency: newFrequency,
      periods: createEmptyPeriods(newFrequency),
      seasonality: (() => {
        const { names } = getPeriodsForFrequency(newFrequency);
        const seasonality: {[key: string]: number} = { total: 0 };
        names.forEach((name, index) => {
          seasonality[`p${index + 1}`] = 0;
        });
        return seasonality;
      })()
    })));
  };

  const { count: periodCount, names: periodNames } = getPeriodsForFrequency(selectedFrequency);
  const periodColors = ['bg-blue-50', 'bg-green-50', 'bg-yellow-50', 'bg-red-50', 'bg-purple-50', 'bg-indigo-50'];

  // Check if a period button should be available globally
  const isPeriodGloballyAvailable = (periodIndex: number) => {
    if (periodIndex === 0) return true;
    if (products.length === 0) return false;
    return products.some(product => isPeriodAvailable(product, periodIndex));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-full mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dynamic Pharmaceutical Data Entry</h1>
          <p className="text-gray-600 mt-2">Enter pharmaceutical usage data with configurable frequency periods</p>
        </div>

        {/* Frequency Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data Entry Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Label htmlFor="frequency">Data Entry Frequency:</Label>
              <Select value={selectedFrequency} onValueChange={(value: DataFrequency) => changeFrequency(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly (52 periods)</SelectItem>
                  <SelectItem value="monthly">Monthly (12 periods)</SelectItem>
                  <SelectItem value="bimonthly">Bi-monthly (6 periods)</SelectItem>
                  <SelectItem value="quarterly">Quarterly (4 periods)</SelectItem>
                  <SelectItem value="yearly">Yearly (1 period)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

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

        {/* Period Toggle Buttons */}
        <div className="mb-4 flex gap-2 flex-wrap">
          {periodNames.slice(0, Math.min(12, periodCount)).map((name, index) => {
            const isAvailable = isPeriodGloballyAvailable(index);
            const colorClass = periodColors[index % periodColors.length];
            return (
              <Button
                key={index}
                variant={openPeriods[index] ? "default" : "outline"}
                size="sm"
                onClick={() => togglePeriod(index)}
                disabled={!isAvailable}
                className={`${colorClass} border ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {!isAvailable && <Lock className="w-4 h-4 mr-2" />}
                {isAvailable && (openPeriods[index] ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />)}
                {name}
                {!isAvailable && index > 0 && <span className="ml-2 text-xs">(Complete P{index} first)</span>}
              </Button>
            );
          })}
          {periodCount > 12 && (
            <span className="text-sm text-gray-500 self-center">
              ... and {periodCount - 12} more periods
            </span>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pharmaceutical Data Entry Table ({selectedFrequency.charAt(0).toUpperCase() + selectedFrequency.slice(1)})</CardTitle>
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
                    
                    {/* Period Data Headers - Only show if period is open */}
                    {periodNames.slice(0, Math.min(12, periodCount)).map((name, pIndex) => (
                      openPeriods[pIndex] && (
                        <TableHead key={pIndex} colSpan={10} className={`text-center font-bold border-r ${periodColors[pIndex % periodColors.length]}`}>
                          {name}
                        </TableHead>
                      )
                    ))}
                    
                    {/* Annual Averages */}
                    <TableHead colSpan={4} className="text-center font-bold border-r bg-purple-50">Annual Averages</TableHead>
                    
                    {/* Forecast */}
                    <TableHead colSpan={5} className="text-center font-bold border-r bg-teal-50">Forecast</TableHead>
                    
                    {/* Seasonality */}
                    <TableHead colSpan={Math.min(6, periodCount + 1)} className="text-center font-bold bg-orange-50">Seasonality</TableHead>
                    <TableHead className="font-bold">Actions</TableHead>
                  </TableRow>
                  <TableRow className="bg-gray-50 text-xs">
                    <TableHead className="sticky left-0 bg-gray-50"></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    
                    {/* Period Subheadings - Only show if period is open */}
                    {Array.from({ length: Math.min(12, periodCount) }, (_, pIndex) => (
                      openPeriods[pIndex] && (
                        <React.Fragment key={pIndex}>
                          <TableHead className={`${periodColors[pIndex % periodColors.length]} min-w-[100px]`}>Beginning Balance</TableHead>
                          <TableHead className={`${periodColors[pIndex % periodColors.length]} min-w-[100px]`}>Received</TableHead>
                          <TableHead className={`${periodColors[pIndex % periodColors.length]} min-w-[100px]`}>Positive Adj</TableHead>
                          <TableHead className={`${periodColors[pIndex % periodColors.length]} min-w-[100px]`}>Negative Adj</TableHead>
                          <TableHead className={`${periodColors[pIndex % periodColors.length]} min-w-[100px]`}>Ending Balance</TableHead>
                          <TableHead className={`${periodColors[pIndex % periodColors.length]} min-w-[100px]`}>Stock Out Days</TableHead>
                          <TableHead className={`${periodColors[pIndex % periodColors.length]} min-w-[100px]`}>Expired/Damaged</TableHead>
                          <TableHead className={`${periodColors[pIndex % periodColors.length]} min-w-[100px]`}>Consumption/Issue</TableHead>
                          <TableHead className={`${periodColors[pIndex % periodColors.length]} min-w-[100px]`}>aAMC</TableHead>
                          <TableHead className={`${periodColors[pIndex % periodColors.length]} min-w-[100px] border-r`}>Wastage Rate</TableHead>
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
                    {Array.from({ length: Math.min(5, periodCount) }, (_, i) => (
                      <TableHead key={i} className="bg-orange-50 min-w-[60px]">P{i + 1}</TableHead>
                    ))}
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
                      
                      {/* Period Data - Only show if period is open and available for this product */}
                      {product.periods.slice(0, Math.min(12, periodCount)).map((period, pIndex) => (
                        openPeriods[pIndex] && (
                          <React.Fragment key={pIndex}>
                            <TableCell className={periodColors[pIndex % periodColors.length]}>
                              <Input
                                type="number"
                                value={period.beginningBalance}
                                onChange={(e) => updatePeriodData(product.id, pIndex, 'beginningBalance', parseInt(e.target.value) || 0)}
                                disabled={!isPeriodAvailable(product, pIndex)}
                                className={`h-8 text-xs w-20 ${!isPeriodAvailable(product, pIndex) ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                              />
                            </TableCell>
                            <TableCell className={periodColors[pIndex % periodColors.length]}>
                              <Input
                                type="number"
                                value={period.received}
                                onChange={(e) => updatePeriodData(product.id, pIndex, 'received', parseInt(e.target.value) || 0)}
                                disabled={!isPeriodAvailable(product, pIndex)}
                                className={`h-8 text-xs w-20 ${!isPeriodAvailable(product, pIndex) ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                              />
                            </TableCell>
                            <TableCell className={periodColors[pIndex % periodColors.length]}>
                              <Input
                                type="number"
                                value={period.positiveAdj}
                                onChange={(e) => updatePeriodData(product.id, pIndex, 'positiveAdj', parseInt(e.target.value) || 0)}
                                disabled={!isPeriodAvailable(product, pIndex)}
                                className={`h-8 text-xs w-20 ${!isPeriodAvailable(product, pIndex) ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                              />
                            </TableCell>
                            <TableCell className={periodColors[pIndex % periodColors.length]}>
                              <Input
                                type="number"
                                value={period.negativeAdj}
                                onChange={(e) => updatePeriodData(product.id, pIndex, 'negativeAdj', parseInt(e.target.value) || 0)}
                                disabled={!isPeriodAvailable(product, pIndex)}
                                className={`h-8 text-xs w-20 ${!isPeriodAvailable(product, pIndex) ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                              />
                            </TableCell>
                            <TableCell className={periodColors[pIndex % periodColors.length]}>
                              <Input
                                type="number"
                                value={period.endingBalance}
                                readOnly
                                className="h-8 text-xs w-20 bg-gray-100"
                              />
                            </TableCell>
                            <TableCell className={periodColors[pIndex % periodColors.length]}>
                              <Input
                                type="number"
                                value={period.stockOutDays}
                                onChange={(e) => updatePeriodData(product.id, pIndex, 'stockOutDays', parseInt(e.target.value) || 0)}
                                disabled={!isPeriodAvailable(product, pIndex)}
                                className={`h-8 text-xs w-20 ${!isPeriodAvailable(product, pIndex) ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                                max={getPeriodsForFrequency(product.frequency).maxStockOutDays}
                              />
                            </TableCell>
                            <TableCell className={periodColors[pIndex % periodColors.length]}>
                              <Input
                                type="number"
                                value={period.expiredDamaged}
                                onChange={(e) => updatePeriodData(product.id, pIndex, 'expiredDamaged', parseInt(e.target.value) || 0)}
                                disabled={!isPeriodAvailable(product, pIndex)}
                                className={`h-8 text-xs w-20 ${!isPeriodAvailable(product, pIndex) ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                              />
                            </TableCell>
                            <TableCell className={periodColors[pIndex % periodColors.length]}>
                              <Input
                                type="number"
                                value={period.consumptionIssue}
                                onChange={(e) => updatePeriodData(product.id, pIndex, 'consumptionIssue', parseInt(e.target.value) || 0)}
                                disabled={!isPeriodAvailable(product, pIndex)}
                                className={`h-8 text-xs w-20 ${!isPeriodAvailable(product, pIndex) ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                              />
                            </TableCell>
                            <TableCell className={periodColors[pIndex % periodColors.length]}>
                              <Input
                                type="number"
                                value={period.aamc.toFixed(2)}
                                readOnly
                                className="h-8 text-xs w-20 bg-gray-100"
                              />
                            </TableCell>
                            <TableCell className={`${periodColors[pIndex % periodColors.length]} border-r`}>
                              <Input
                                value={`${period.wastageRate.toFixed(1)}%`}
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
                      {Array.from({ length: Math.min(5, periodCount) }, (_, i) => (
                        <TableCell key={i} className="bg-orange-25">
                          <span className="text-xs">{product.seasonality[`p${i + 1}`] || 0}%</span>
                        </TableCell>
                      ))}
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
