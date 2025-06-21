
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Package, Building, MapPin, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePharmaceuticalProducts } from '@/hooks/usePharmaceuticalProducts';
import { PharmaceuticalProductFilters } from '@/types/pharmaceuticalProducts';
import BulkImportDialog from './BulkImportDialog';

const PharmaceuticalProductsTable = () => {
  const [filters, setFilters] = useState<PharmaceuticalProductFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  
  const { products, totalCount, allProductsMetrics, isLoading, error, refetch } = usePharmaceuticalProducts(
    filters, 
    { page: currentPage, pageSize, enablePagination: true }
  );

  // Get unique values for filter dropdowns from current page products
  const filterOptions = useMemo(() => {
    const facilities = [...new Set(products.map(p => p.facility))].filter(Boolean);
    const regions = [...new Set(products.map(p => p.region))].filter(Boolean);
    const zones = [...new Set(products.map(p => p.zone))].filter(Boolean);
    const woredas = [...new Set(products.map(p => p.woreda))].filter(Boolean);
    const categories = [...new Set(products.map(p => p.product_category))].filter(Boolean);
    const sources = [...new Set(products.map(p => p.procurement_source))].filter(Boolean);
    
    return { facilities, regions, zones, woredas, categories, sources };
  }, [products]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleFilterChange = (key: keyof PharmaceuticalProductFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(Number(newPageSize));
    setCurrentPage(1);
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
              Comprehensive pharmaceutical product inventory with pricing and availability data ({totalCount.toLocaleString()} total records)
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

        {/* Updated Summary Stats with All Data Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Total Products</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {allProductsMetrics?.totalProducts.toLocaleString() || '0'}
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Facilities</span>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {allProductsMetrics?.uniqueFacilities.toLocaleString() || '0'}
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Regions</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">
              {allProductsMetrics?.uniqueRegions.toLocaleString() || '0'}
            </p>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-600">Total Miazia Value</span>
            </div>
            <p className="text-2xl font-bold text-orange-900">
              {formatCurrency(allProductsMetrics?.totalValue || 0)}
            </p>
          </div>
        </div>

        {/* Pagination Controls - Top */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} of {totalCount.toLocaleString()}
            </span>
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="200">200</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">per page</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
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

        {/* Pagination Controls - Bottom */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages.toLocaleString()}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage <= 1}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm px-3 py-1 bg-gray-100 rounded">
              {currentPage} / {totalPages.toLocaleString()}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage >= totalPages}
            >
              Last
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PharmaceuticalProductsTable;
