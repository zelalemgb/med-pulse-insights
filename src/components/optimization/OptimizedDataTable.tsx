
import React, { useMemo, useState, useCallback } from 'react';
import { VirtualizedTable } from '@/components/virtualization/VirtualizedTable';
import { usePagination } from '@/hooks/usePagination';
import { useOptimizedHandlers } from '@/hooks/useOptimizedComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface OptimizedDataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  searchableFields?: (keyof T)[];
  filterableFields?: (keyof T)[];
  onRowClick?: (item: T, index: number) => void;
  enableVirtualization?: boolean;
  enablePagination?: boolean;
  defaultPageSize?: number;
  className?: string;
}

interface TableColumn<T> {
  key: string;
  header: string;
  width?: number;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
}

export function OptimizedDataTable<T>({
  data,
  columns,
  searchableFields = [],
  filterableFields = [],
  onRowClick,
  enableVirtualization = true,
  enablePagination = false,
  defaultPageSize = 50,
  className
}: OptimizedDataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (searchTerm && searchableFields.length > 0) {
      const lowercaseSearch = searchTerm.toLowerCase();
      result = result.filter(item =>
        searchableFields.some(field => {
          const value = String((item as any)[field] || '').toLowerCase();
          return value.includes(lowercaseSearch);
        })
      );
    }

    // Apply field filters
    Object.entries(filters).forEach(([field, filterValue]) => {
      if (filterValue) {
        result = result.filter(item => {
          const value = String((item as any)[field] || '').toLowerCase();
          return value.includes(filterValue.toLowerCase());
        });
      }
    });

    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        const aValue = (a as any)[sortField];
        const bValue = (b as any)[sortField];
        
        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        else if (aValue > bValue) comparison = 1;
        
        return sortDirection === 'desc' ? -comparison : comparison;
      });
    }

    return result;
  }, [data, searchTerm, searchableFields, filters, sortField, sortDirection]);

  // Pagination hook
  const pagination = usePagination(processedData, {
    totalItems: processedData.length,
    initialPageSize: defaultPageSize
  });

  // Optimized event handlers
  const handlers = useOptimizedHandlers({
    handleSearch: (value: string) => setSearchTerm(value),
    handleSort: (field: string) => {
      if (sortField === field) {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    },
    handleFilter: (field: string, value: string) => {
      setFilters(prev => ({ ...prev, [field]: value }));
    },
    handleRowClick: onRowClick || (() => {})
  });

  // Enhanced columns with sorting
  const enhancedColumns = useMemo(() => {
    return columns.map(column => ({
      ...column,
      header: column.sortable ? (
        <Button
          variant="ghost"
          onClick={() => handlers.handleSort(column.key)}
          className="p-0 h-auto font-medium"
        >
          {column.header}
          {sortField === column.key && (
            <span className="ml-1">
              {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </Button>
      ) : column.header
    }));
  }, [columns, sortField, sortDirection, handlers.handleSort]);

  const displayData = enablePagination ? pagination.paginatedData : processedData;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Filter Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        {searchableFields.length > 0 && (
          <div className="relative min-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => handlers.handleSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        )}

        {filterableFields.map(field => (
          <div key={String(field)} className="min-w-[150px]">
            <Select
              value={filters[String(field)] || ''}
              onValueChange={(value) => handlers.handleFilter(String(field), value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Filter by ${String(field)}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All {String(field)}</SelectItem>
                {/* Add dynamic filter options based on data */}
              </SelectContent>
            </Select>
          </div>
        ))}

        {enablePagination && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Showing {pagination.startIndex + 1}-{pagination.endIndex} of {pagination.totalItems}
            </span>
            <Select
              value={String(pagination.pageSize)}
              onValueChange={(value) => pagination.setPageSize(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Data Table */}
      {enableVirtualization ? (
        <VirtualizedTable
          data={displayData}
          columns={enhancedColumns}
          onRowClick={handlers.handleRowClick}
          height={600}
        />
      ) : (
        <div className="border rounded-lg">
          {/* Fallback to regular table if virtualization is disabled */}
          <div className="overflow-auto max-h-[600px]">
            <table className="w-full">
              <thead className="sticky top-0 bg-background border-b">
                <tr>
                  {enhancedColumns.map(column => (
                    <th key={column.key} className="px-4 py-2 text-left font-medium">
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-muted/50 cursor-pointer"
                    onClick={() => handlers.handleRowClick(item, index)}
                  >
                    {columns.map(column => (
                      <td key={column.key} className="px-4 py-2">
                        {column.render
                          ? column.render(item, index)
                          : String((item as any)[column.key] || '')
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {enablePagination && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={pagination.previousPage}
            disabled={!pagination.hasPrevious}
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={pagination.currentPage === page ? 'default' : 'outline'}
                  onClick={() => pagination.goToPage(page)}
                  size="sm"
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            onClick={pagination.nextPage}
            disabled={!pagination.hasNext}
          >
            Next
          </Button>
        </div>
      )}

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        {processedData.length === data.length ? (
          `${data.length} total items`
        ) : (
          `${processedData.length} of ${data.length} items (filtered)`
        )}
      </div>
    </div>
  );
}
