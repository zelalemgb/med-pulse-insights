
export interface ServiceConfig {
  name: string;
  baseUrl: string;
  timeout: number;
  retries: number;
  circuitBreaker: {
    threshold: number;
    timeout: number;
    resetTimeout: number;
  };
  rateLimit: {
    requests: number;
    window: number; // in milliseconds
  };
}

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  lastCheck: Date;
  errorRate: number;
}

export class APIGateway {
  private services: Map<string, ServiceConfig> = new Map();
  private healthStatus: Map<string, ServiceHealth> = new Map();
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();
  private rateLimiters: Map<string, RateLimiter> = new Map();

  registerService(config: ServiceConfig): void {
    this.services.set(config.name, config);
    this.circuitBreakers.set(config.name, new CircuitBreaker(config.circuitBreaker));
    this.rateLimiters.set(config.name, new RateLimiter(config.rateLimit));
    
    console.log(`Registered service: ${config.name}`);
  }

  async request<T>(
    serviceName: string,
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }

    // Check rate limit
    const rateLimiter = this.rateLimiters.get(serviceName)!;
    if (!rateLimiter.allowRequest()) {
      throw new Error(`Rate limit exceeded for service ${serviceName}`);
    }

    // Check circuit breaker
    const circuitBreaker = this.circuitBreakers.get(serviceName)!;
    if (!circuitBreaker.allowRequest()) {
      throw new Error(`Circuit breaker open for service ${serviceName}`);
    }

    const startTime = Date.now();
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), service.timeout);

      const response = await fetch(`${service.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Record success
      circuitBreaker.recordSuccess();
      this.updateHealthStatus(serviceName, 'healthy', Date.now() - startTime);
      
      return data;
    } catch (error) {
      // Record failure
      circuitBreaker.recordFailure();
      this.updateHealthStatus(serviceName, 'down', Date.now() - startTime);
      
      // Retry logic
      if (service.retries > 0) {
        return this.retryRequest(serviceName, endpoint, options, service.retries - 1);
      }
      
      throw error;
    }
  }

  private async retryRequest<T>(
    serviceName: string,
    endpoint: string,
    options: RequestInit,
    retriesLeft: number
  ): Promise<T> {
    if (retriesLeft <= 0) {
      throw new Error(`Max retries exceeded for ${serviceName}${endpoint}`);
    }

    // Exponential backoff
    const delay = Math.pow(2, 3 - retriesLeft) * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    return this.request(serviceName, endpoint, options);
  }

  private updateHealthStatus(
    serviceName: string,
    status: ServiceHealth['status'],
    responseTime: number
  ): void {
    const currentHealth = this.healthStatus.get(serviceName);
    const errorRate = status === 'down' 
      ? (currentHealth?.errorRate || 0) + 0.1 
      : Math.max((currentHealth?.errorRate || 0) - 0.05, 0);

    this.healthStatus.set(serviceName, {
      name: serviceName,
      status,
      responseTime,
      lastCheck: new Date(),
      errorRate: Math.min(errorRate, 1),
    });
  }

  getServiceHealth(serviceName?: string): ServiceHealth | ServiceHealth[] {
    if (serviceName) {
      return this.healthStatus.get(serviceName) || {
        name: serviceName,
        status: 'down',
        responseTime: 0,
        lastCheck: new Date(),
        errorRate: 1,
      };
    }
    
    return Array.from(this.healthStatus.values());
  }

  async loadBalance<T>(
    serviceNames: string[],
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const healthyServices = serviceNames.filter(name => {
      const health = this.healthStatus.get(name);
      return health?.status === 'healthy';
    });

    if (healthyServices.length === 0) {
      throw new Error('No healthy services available');
    }

    // Round-robin selection
    const selectedService = healthyServices[Math.floor(Math.random() * healthyServices.length)];
    return this.request(selectedService, endpoint, options);
  }
}

class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime?: Date;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(private config: ServiceConfig['circuitBreaker']) {}

  allowRequest(): boolean {
    if (this.state === 'closed') return true;
    
    if (this.state === 'open') {
      if (this.shouldAttemptReset()) {
        this.state = 'half-open';
        return true;
      }
      return false;
    }
    
    // half-open state
    return true;
  }

  recordSuccess(): void {
    this.failureCount = 0;
    this.state = 'closed';
  }

  recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = new Date();
    
    if (this.failureCount >= this.config.threshold) {
      this.state = 'open';
    }
  }

  private shouldAttemptReset(): boolean {
    if (!this.lastFailureTime) return false;
    
    const timeSinceLastFailure = Date.now() - this.lastFailureTime.getTime();
    return timeSinceLastFailure >= this.config.resetTimeout;
  }
}

class RateLimiter {
  private requests: number[] = [];

  constructor(private config: ServiceConfig['rateLimit']) {}

  allowRequest(): boolean {
    const now = Date.now();
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(
      timestamp => now - timestamp < this.config.window
    );
    
    if (this.requests.length >= this.config.requests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }
}

// Default service configurations
const defaultServices: ServiceConfig[] = [
  {
    name: 'product-service',
    baseUrl: '/api/products',
    timeout: 5000,
    retries: 3,
    circuitBreaker: { threshold: 5, timeout: 10000, resetTimeout: 30000 },
    rateLimit: { requests: 100, window: 60000 },
  },
  {
    name: 'analytics-service',
    baseUrl: '/api/analytics',
    timeout: 10000,
    retries: 2,
    circuitBreaker: { threshold: 3, timeout: 15000, resetTimeout: 45000 },
    rateLimit: { requests: 50, window: 60000 },
  },
  {
    name: 'inventory-service',
    baseUrl: '/api/inventory',
    timeout: 5000,
    retries: 3,
    circuitBreaker: { threshold: 5, timeout: 10000, resetTimeout: 30000 },
    rateLimit: { requests: 200, window: 60000 },
  },
];

// Global API gateway instance
export const apiGateway = new APIGateway();

// Register default services
defaultServices.forEach(service => {
  apiGateway.registerService(service);
});
