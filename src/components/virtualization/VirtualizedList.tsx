
import React, { useMemo, useCallback } from 'react';
import { FixedSizeList as List, VariableSizeList } from 'react-window';
import { ScrollArea } from '@/components/ui/scroll-area';

interface VirtualizedListProps<T> {
  data: T[];
  itemHeight: number | ((index: number) => number);
  height: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  onItemClick?: (item: T, index: number) => void;
  className?: string;
  overscan?: number;
}

export function VirtualizedList<T>({
  data,
  itemHeight,
  height,
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

  const ListComponent = isVariableHeight ? VariableSizeList : List;

  return (
    <div className={className}>
      <ScrollArea style={{ height }}>
        <ListComponent
          height={height}
          itemCount={data.length}
          itemSize={itemHeight as any}
          overscanCount={overscan}
        >
          {Row}
        </ListComponent>
      </ScrollArea>
    </div>
  );
}
