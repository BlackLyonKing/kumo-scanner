// API monitoring and error tracking utilities

interface ApiMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  errors: ApiError[];
}

interface ApiError {
  timestamp: number;
  endpoint: string;
  error: string;
  responseTime?: number;
  statusCode?: number;
}

class ApiMonitor {
  private metrics: Map<string, ApiMetrics> = new Map();
  private requestTimes: Map<string, number> = new Map();

  startRequest(requestId: string, endpoint: string): void {
    this.requestTimes.set(requestId, Date.now());
    
    if (!this.metrics.has(endpoint)) {
      this.metrics.set(endpoint, {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        errors: []
      });
    }
    
    const metric = this.metrics.get(endpoint)!;
    metric.totalRequests++;
  }

  endRequest(requestId: string, endpoint: string, success: boolean, error?: string, statusCode?: number): void {
    const startTime = this.requestTimes.get(requestId);
    if (!startTime) return;
    
    const responseTime = Date.now() - startTime;
    this.requestTimes.delete(requestId);
    
    const metric = this.metrics.get(endpoint);
    if (!metric) return;
    
    if (success) {
      metric.successfulRequests++;
    } else {
      metric.failedRequests++;
      metric.errors.push({
        timestamp: Date.now(),
        endpoint,
        error: error || 'Unknown error',
        responseTime,
        statusCode
      });
      
      // Keep only last 50 errors per endpoint
      if (metric.errors.length > 50) {
        metric.errors = metric.errors.slice(-50);
      }
    }
    
    // Update average response time
    const totalTime = metric.averageResponseTime * (metric.totalRequests - 1) + responseTime;
    metric.averageResponseTime = totalTime / metric.totalRequests;
  }

  getMetrics(): Map<string, ApiMetrics> {
    return new Map(this.metrics);
  }

  getHealthStatus(): { healthy: boolean; issues: string[] } {
    const issues: string[] = [];
    
    for (const [endpoint, metrics] of this.metrics) {
      const errorRate = metrics.failedRequests / metrics.totalRequests;
      
      if (errorRate > 0.1) { // More than 10% error rate
        issues.push(`High error rate for ${endpoint}: ${(errorRate * 100).toFixed(1)}%`);
      }
      
      if (metrics.averageResponseTime > 5000) { // Slower than 5 seconds
        issues.push(`Slow response times for ${endpoint}: ${metrics.averageResponseTime.toFixed(0)}ms`);
      }
      
      // Check for recent errors
      const recentErrors = metrics.errors.filter(error => 
        Date.now() - error.timestamp < 300000 // Last 5 minutes
      );
      
      if (recentErrors.length > 5) {
        issues.push(`Multiple recent errors for ${endpoint}: ${recentErrors.length} in last 5 minutes`);
      }
    }
    
    return {
      healthy: issues.length === 0,
      issues
    };
  }
}

// Global monitor instance
export const apiMonitor = new ApiMonitor();

// Enhanced fetch wrapper with monitoring
export async function monitoredFetch(
  url: string, 
  options?: RequestInit, 
  timeout: number = 15000
): Promise<Response> {
  const requestId = `${Date.now()}-${Math.random()}`;
  const endpoint = new URL(url).origin + new URL(url).pathname;
  
  apiMonitor.startRequest(requestId, endpoint);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      ...options,
      signal: options?.signal || controller.signal,
      headers: {
        'Accept': 'application/json',
        ...(options?.headers || {})
      }
    });
    
    clearTimeout(timeoutId);
    
    apiMonitor.endRequest(requestId, endpoint, response.ok, 
      response.ok ? undefined : `HTTP ${response.status}`, response.status);
    
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    apiMonitor.endRequest(requestId, endpoint, false, errorMessage);
    throw error;
  }
}

// Retry logic with exponential backoff
export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<Response> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await monitoredFetch(url, options);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}
