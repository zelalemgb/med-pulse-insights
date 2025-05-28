
import { ProductData, ImportSummary, User, Facility } from '@/types/pharmaceutical';

export interface APIConfig {
  baseURL: string;
  apiKey?: string;
  timeout: number;
}

export interface SyncResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: string[];
}

export interface ExternalSystem {
  id: string;
  name: string;
  type: 'ERP' | 'WMS' | 'LMIS' | 'HMIS';
  endpoint: string;
  apiKey?: string;
  isActive: boolean;
  lastSync?: Date;
}

export class APIClient {
  private config: APIConfig;

  constructor(config: APIConfig) {
    this.config = config;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
      ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Product data sync
  async syncProducts(facilityId: string): Promise<SyncResponse> {
    return this.request<SyncResponse>(`/api/sync/products/${facilityId}`, {
      method: 'POST',
    });
  }

  async exportProducts(products: ProductData[]): Promise<SyncResponse> {
    return this.request<SyncResponse>('/api/export/products', {
      method: 'POST',
      body: JSON.stringify({ products }),
    });
  }

  // Real-time updates
  async getUpdates(lastSync: Date): Promise<SyncResponse> {
    const timestamp = lastSync.toISOString();
    return this.request<SyncResponse>(`/api/updates?since=${timestamp}`);
  }

  // System health check
  async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'down'; timestamp: Date }> {
    return this.request<{ status: 'healthy' | 'degraded' | 'down'; timestamp: Date }>('/api/health');
  }

  // Batch operations
  async batchSync(operations: Array<{ type: string; data: any }>): Promise<SyncResponse> {
    return this.request<SyncResponse>('/api/batch', {
      method: 'POST',
      body: JSON.stringify({ operations }),
    });
  }
}

export const createAPIClient = (system: ExternalSystem): APIClient => {
  return new APIClient({
    baseURL: system.endpoint,
    apiKey: system.apiKey,
    timeout: 30000, // 30 seconds
  });
};
