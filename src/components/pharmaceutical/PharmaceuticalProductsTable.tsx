import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Package, Building, MapPin, DollarSign } from 'lucide-react';
import { usePharmaceuticalProducts } from '@/hooks/usePharmaceuticalProducts';
import { PharmaceuticalProductFilters } from '@/types/pharmaceuticalProducts';
import BulkImportDialog from './BulkImportDialog';

const PharmaceuticalProductsTable = () => {
  const [filters, setFilters] = useState<PharmaceuticalProductFilters>({});
  const { products, isLoading, error, refetch } = usePharmaceuticalProducts(filters);

  // Get unique values for filter dropdowns and calculate real metrics
  const filterOptions = useMemo(() => {
    const facilities = [...new Set(products.map(p => p.facility))].filter(Boolean);
    const regions = [...new Set(products.map(p => p.region))].filter(Boolean);
    const zones = [...new Set(products.map(p => p.zone))].filter(Boolean);
    const woredas = [...new Set(products.map(p => p.woreda))].filter(Boolean);
    const categories = [...new Set(products.map(p => p.product_category))].filter(Boolean);
    const sources = [...new Set(products.map(p => p.procurement_source))].filter(Boolean);
    
    return { facilities, regions, zones, woredas, categories, sources };
  }, [products]);

  // Calculate real metrics from the data
  const calculatedMetrics = useMemo(() => {
    const totalProducts = products.length;
    const uniqueFacilities = filterOptions.facilities.length;
    const uniqueRegions = filterOptions.regions.length;
    
    // Calculate total value using only miazia_price column
    const totalValue = products.reduce((sum, product) => {
      const miaziaPriceValue = product.miazia_price || 0;
      return sum + miaziaPriceValue;
    }, 0);
    
    return {
      totalProducts,
      uniqueFacilities,
      uniqueRegions,
      totalValue
    };
  }, [products, filterOptions]);

  const handleFilterChange = (key: keyof PharmaceuticalProductFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatQuantity = (quantity?: number) => {
    if (quantity === undefined || quantity === null) return '-';
    return quantity.toLocaleString('en-US', { maximumFractionDigits: 6 });
  };

  const handleImportComplete = () => {
    refetch();
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Pharmaceutical Products
            </CardTitle>
            <CardDescription>
              Comprehensive pharmaceutical product inventory with pricing and availability data
            </CardDescription>
          </div>
          <BulkImportDialog onImportComplete={handleImportComplete} />
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filters.facility || 'all'} onValueChange={(value) => handleFilterChange('facility', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Facilities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Facilities</SelectItem>
              {filterOptions.facilities.map(facility => (
                <SelectItem key={facility} value={facility}>{facility}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filters.region || 'all'} onValueChange={(value) => handleFilterChange('region', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {filterOptions.regions.map(region => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filters.zone || 'all'} onValueChange={(value) => handleFilterChange('zone', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Zones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              {filterOptions.zones.map(zone => (
                <SelectItem key={zone} value={zone}>{zone}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filters.woreda || 'all'} onValueChange={(value) => handleFilterChange('woreda', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Woredas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Woredas</SelectItem>
              {filterOptions.woredas.map(woreda => (
                <SelectItem key={woreda} value={woreda}>{woreda}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filters.product_category || 'all'} onValueChange={(value) => handleFilterChange('product_category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {filterOptions.categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filters.procurement_source || 'all'} onValueChange={(value) => handleFilterChange('procurement_source', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {filterOptions.sources.map(source => (
                <SelectItem key={source} value={source}>{source}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {Object.values(filters).some(Boolean) && (
          <div className="mb-4">
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Updated Summary Stats with Real Calculations */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Total Products</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{calculatedMetrics.totalProducts.toLocaleString()}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Facilities</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{calculatedMetrics.uniqueFacilities.toLocaleString()}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Regions</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">{calculatedMetrics.uniqueRegions.toLocaleString()}</p>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-600">Total Miazia Value</span>
            </div>
            <p className="text-2xl font-bold text-orange-900">
              {formatCurrency(calculatedMetrics.totalValue)}
            </p>
          </div>
        </div>

        {/* Products Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Woreda</TableHead>
                <TableHead>Facility</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Miazia Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8">
                    Loading pharmaceutical products...
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                    No pharmaceutical products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.region ? (
                        <Badge variant="outline">{product.region}</Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.zone ? (
                        <Badge variant="outline">{product.zone}</Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.woreda ? (
                        <Badge variant="outline">{product.woreda}</Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate" title={product.facility}>
                        {product.facility}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate" title={product.product_name}>
                        {product.product_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.unit || '-'}
                    </TableCell>
                    <TableCell>
                      {product.product_category ? (
                        <Badge variant={product.product_category === 'Medicines' ? 'default' : 'secondary'}>
                          {product.product_category}
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(product.price)}
                    </TableCell>
                    <TableCell>
                      {product.procurement_source ? (
                        <Badge variant={product.procurement_source === 'EPSS' ? 'default' : 'outline'}>
                          {product.procurement_source}
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatQuantity(product.quantity)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {formatCurrency(product.miazia_price)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PharmaceuticalProductsTable;
