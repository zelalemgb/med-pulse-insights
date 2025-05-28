
import React, { useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface VirtualizedTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  height?: number;
  rowHeight?: number;
  onRowClick?: (item: T, index: number) => void;
  className?: string;
}

interface TableColumn<T> {
  key: string;
  header: string;
  width?: number;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
}

export function VirtualizedTable<T>({
  data,
  columns,
  height = 400,
  rowHeight = 50,
  onRowClick,
  className
}: VirtualizedTableProps<T>) {
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = data[index];
    
    return (
      <div style={style} className="flex border-b">
        <TableRow 
          className={`w-full cursor-pointer hover:bg-muted/50 ${onRowClick ? 'cursor-pointer' : ''}`}
          onClick={() => onRowClick?.(item, index)}
        >
          {columns.map((column) => (
            <TableCell 
              key={column.key} 
              style={{ width: column.width || 'auto', minWidth: column.width || 100 }}
              className="px-4 py-2 truncate"
            >
              {column.render 
                ? column.render(item, index)
                : String((item as any)[column.key] || '')
              }
            </TableCell>
          ))}
        </TableRow>
      </div>
    );
  }, [data, columns, onRowClick]);

  const totalWidth = useMemo(() => {
    return columns.reduce((sum, col) => sum + (col.width || 150), 0);
  }, [columns]);

  return (
    <div className={`border rounded-lg ${className}`}>
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow>
            {columns.map((column) => (
              <TableHead 
                key={column.key}
                style={{ width: column.width || 'auto', minWidth: column.width || 100 }}
                className="px-4 py-2 font-medium"
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      </Table>
      
      <ScrollArea style={{ height }}>
        <List
          height={height}
          itemCount={data.length}
          itemSize={rowHeight}
          width={totalWidth}
        >
          {Row}
        </List>
      </ScrollArea>
      
      {data.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No data available
        </div>
      )}
    </div>
  );
}
