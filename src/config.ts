/**
 * Configuration options for apollo-next library.
 * 
 * @internal
 */
export const config = {
  /**
   * Enable debug logging in development mode.
   * Automatically enabled when NODE_ENV === 'development'
   */
  debug: typeof process !== 'undefined' && process.env?.NODE_ENV === 'development',
  
  /**
   * Log cache hydration details.
   * Useful for debugging SSR/SSG cache issues.
   */
  logCacheHydration: false,
  
  /**
   * Log performance metrics.
   * Tracks time taken for cache operations.
   */
  logPerformance: false,
};

/**
 * Update apollo-next configuration at runtime.
 * 
 * @param updates - Partial configuration to update
 * 
 * @example
 * ```typescript
 * import { configure } from '@iwatakeshi/apollo-next';
 * 
 * // Enable detailed logging
 * configure({
 *   debug: true,
 *   logCacheHydration: true,
 *   logPerformance: true,
 * });
 * ```
 */
export const configure = (updates: Partial<typeof config>): void => {
  Object.assign(config, updates);
};

/**
 * Internal logger that respects debug configuration.
 * 
 * @internal
 */
export const logger = {
  debug: (...args: any[]) => {
    if (config.debug) {
      console.log('[apollo-next]', ...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (config.debug) {
      console.warn('[apollo-next]', ...args);
    }
  },
  
  error: (...args: any[]) => {
    console.error('[apollo-next]', ...args);
  },
  
  performance: (label: string, fn: () => void) => {
    if (config.logPerformance) {
      const start = performance.now();
      fn();
      const duration = performance.now() - start;
      console.log(`[apollo-next] ${label}: ${duration.toFixed(2)}ms`);
    } else {
      fn();
    }
  },
};
