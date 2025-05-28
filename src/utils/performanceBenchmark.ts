
interface BenchmarkResult {
  name: string;
  duration: number;
  memory: number;
  operations: number;
  opsPerSecond: number;
  timestamp: Date;
}

interface BenchmarkSuite {
  name: string;
  results: BenchmarkResult[];
  averageDuration: number;
  averageOpsPerSecond: number;
}

export class PerformanceBenchmark {
  private results: Map<string, BenchmarkResult[]> = new Map();
  private memoryBaseline: number = 0;

  async benchmark<T>(
    name: string,
    operation: () => Promise<T> | T,
    iterations: number = 1000
  ): Promise<BenchmarkResult> {
    // Collect garbage before benchmark
    if (global.gc) {
      global.gc();
    }

    this.memoryBaseline = this.getMemoryUsage();
    const startTime = performance.now();
    const startMemory = this.getMemoryUsage();

    // Run operation multiple times
    for (let i = 0; i < iterations; i++) {
      await operation();
    }

    const endTime = performance.now();
    const endMemory = this.getMemoryUsage();
    
    const duration = endTime - startTime;
    const memoryDelta = endMemory - startMemory;
    const opsPerSecond = (iterations / duration) * 1000;

    const result: BenchmarkResult = {
      name,
      duration,
      memory: memoryDelta,
      operations: iterations,
      opsPerSecond,
      timestamp: new Date()
    };

    this.addResult(name, result);
    return result;
  }

  async benchmarkAsync<T>(
    name: string,
    operation: () => Promise<T>,
    concurrency: number = 10,
    totalOperations: number = 1000
  ): Promise<BenchmarkResult> {
    if (global.gc) {
      global.gc();
    }

    const startTime = performance.now();
    const startMemory = this.getMemoryUsage();

    const operationsPerBatch = Math.ceil(totalOperations / concurrency);
    const batches: Promise<void>[] = [];

    for (let i = 0; i < concurrency; i++) {
      const batch = async () => {
        for (let j = 0; j < operationsPerBatch && (i * operationsPerBatch + j) < totalOperations; j++) {
          await operation();
        }
      };
      batches.push(batch());
    }

    await Promise.all(batches);

    const endTime = performance.now();
    const endMemory = this.getMemoryUsage();
    
    const duration = endTime - startTime;
    const memoryDelta = endMemory - startMemory;
    const opsPerSecond = (totalOperations / duration) * 1000;

    const result: BenchmarkResult = {
      name: `${name} (async-${concurrency})`,
      duration,
      memory: memoryDelta,
      operations: totalOperations,
      opsPerSecond,
      timestamp: new Date()
    };

    this.addResult(name, result);
    return result;
  }

  private addResult(name: string, result: BenchmarkResult): void {
    const existing = this.results.get(name) || [];
    existing.push(result);
    this.results.set(name, existing);
  }

  private getMemoryUsage(): number {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      return (performance as any).memory.usedJSHeapSize || 0;
    }
    return 0;
  }

  getSuite(name: string): BenchmarkSuite | null {
    const results = this.results.get(name);
    if (!results || results.length === 0) return null;

    const averageDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    const averageOpsPerSecond = results.reduce((sum, r) => sum + r.opsPerSecond, 0) / results.length;

    return {
      name,
      results: [...results],
      averageDuration,
      averageOpsPerSecond
    };
  }

  getAllSuites(): BenchmarkSuite[] {
    return Array.from(this.results.keys()).map(name => this.getSuite(name)!).filter(Boolean);
  }

  compare(nameA: string, nameB: string): {
    faster: string;
    improvement: number;
    significant: boolean;
  } | null {
    const suiteA = this.getSuite(nameA);
    const suiteB = this.getSuite(nameB);

    if (!suiteA || !suiteB) return null;

    const faster = suiteA.averageOpsPerSecond > suiteB.averageOpsPerSecond ? nameA : nameB;
    const slower = faster === nameA ? suiteB : suiteA;
    const fasterSuite = faster === nameA ? suiteA : suiteB;

    const improvement = ((fasterSuite.averageOpsPerSecond - slower.averageOpsPerSecond) / slower.averageOpsPerSecond) * 100;
    const significant = improvement > 5; // 5% improvement threshold

    return {
      faster,
      improvement,
      significant
    };
  }

  export(): string {
    const data = {
      timestamp: new Date().toISOString(),
      suites: this.getAllSuites()
    };
    return JSON.stringify(data, null, 2);
  }

  clear(): void {
    this.results.clear();
  }
}

// Global benchmark instance
export const globalBenchmark = new PerformanceBenchmark();

// Benchmark decorator for methods
export function Benchmark(name?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const benchmarkName = name || `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      return globalBenchmark.benchmark(benchmarkName, () => originalMethod.apply(this, args));
    };

    return descriptor;
  };
}

// Utility functions for common benchmarks
export const CommonBenchmarks = {
  async sortingAlgorithms(data: number[]): Promise<void> {
    const testData = [...data];
    
    await globalBenchmark.benchmark('Array.sort', () => {
      [...testData].sort((a, b) => a - b);
    });

    await globalBenchmark.benchmark('QuickSort', () => {
      quickSort([...testData]);
    });
  },

  async searchAlgorithms(data: number[], target: number): Promise<void> {
    await globalBenchmark.benchmark('Linear Search', () => {
      data.indexOf(target);
    });

    await globalBenchmark.benchmark('Binary Search', () => {
      binarySearch(data, target);
    });
  }
};

// Helper algorithms for benchmarking
function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}
