
import React, { useMemo, useCallback } from 'react';
import { FixedSizeList as List, VariableSizeList } from 'react-window';
import { ScrollArea } from '@/components/ui/scroll-area';

interface VirtualizedListProps<T> {
  data: T[];
  itemHeight: number | ((index: number) => number);
  height: number;
  width?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  onItemClick?: (item: T, index: number) => void;
  className?: string;
  overscan?: number;
}

export function VirtualizedList<T>({
  data,
  itemHeight,
  height,
  width = 300,
  renderItem,
  onItemClick,
  className,
  overscan = 5
}: VirtualizedListProps<T>) {
  const isVariableHeight = typeof itemHeight === 'function';

  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = data[index];
    
    return (
      <div 
        style={style} 
        className={`${onItemClick ? 'cursor-pointer hover:bg-muted/50' : ''}`}
        onClick={() => onItemClick?.(item, index)}
      >
        {renderItem(item, index)}
      </div>
    );
  }, [data, renderItem, onItemClick]);

  return (
    <div className={className}>
      <ScrollArea style={{ height }}>
        {isVariableHeight ? (
          <VariableSizeList
            height={height}
            width={width}
            itemCount={data.length}
            itemSize={itemHeight as (index: number) => number}
            overscanCount={overscan}
          >
            {Row}
          </VariableSizeList>
        ) : (
          <List
            height={height}
            width={width}
            itemCount={data.length}
            itemSize={itemHeight as number}
            overscanCount={overscan}
          >
            {Row}
          </List>
        )}
      </ScrollArea>
    </div>
  );
}
