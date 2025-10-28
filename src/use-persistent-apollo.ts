import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { useMemo } from 'react';
import { init } from './init';
import { APOLLO_STATE_PROP_NAME } from './constants';
import { logger } from './config';

/**
 * Extracts Apollo state from Next.js page props.
 * 
 * @param props - Page props from Next.js
 * @returns The Apollo state or undefined
 */
const getState = (props: any) => (props || {})[APOLLO_STATE_PROP_NAME];

/**
 * React hook to initialize Apollo Client with persistent cache.
 * 
 * Optionally persists the Apollo cache to localStorage or sessionStorage
 * for offline support and faster subsequent page loads.
 * 
 * @template T - The shape of the Apollo Client cache (defaults to NormalizedCacheObject)
 * @param client - The Apollo Client instance to initialize
 * @param props - Page props from Next.js containing the Apollo state
 * @param options - Persistence options
 * @returns Memoized Apollo Client instance with hydrated and persisted state
 * 
 * @example
 * ```typescript
 * // In _app.tsx with localStorage persistence
 * import { usePersistentApollo } from '@iwatakeshi/apollo-next';
 * import { createApolloClient } from '../lib/apolloClient';
 * 
 * function MyApp({ Component, pageProps }) {
 *   const apolloClient = usePersistentApollo(
 *     createApolloClient(),
 *     pageProps,
 *     { storage: 'localStorage', key: 'apollo-cache' }
 *   );
 *   
 *   return (
 *     <ApolloProvider client={apolloClient}>
 *       <Component {...pageProps} />
 *     </ApolloProvider>
 *   );
 * }
 * ```
 */
export const usePersistentApollo = <T = NormalizedCacheObject>(
  client: ApolloClient<T>,
  props: unknown,
  options: {
    storage?: 'localStorage' | 'sessionStorage';
    key?: string;
  } = {}
) => {
  const { storage = 'localStorage', key = '__APOLLO_CACHE__' } = options;

  return useMemo(() => {
    const state = getState(props);
    const initializedClient = init(client, state);

    // Only run in browser
    if (typeof window === 'undefined') {
      return initializedClient;
    }

    try {
      const storageAPI = storage === 'localStorage' ? window.localStorage : window.sessionStorage;

      // Try to load persisted cache
      const persistedCache = storageAPI.getItem(key);
      if (persistedCache && !state) {
        // Only use persisted cache if no SSR state is provided
        const parsed = JSON.parse(persistedCache);
        initializedClient.cache.restore(parsed);
        logger.debug(`Restored cache from ${storage}`);
      }

      // Persist cache on changes (debounced)
      let timeoutId: NodeJS.Timeout;
      const originalWrite = initializedClient.cache.write.bind(initializedClient.cache);
      (initializedClient.cache as any).write = function (...args: Parameters<typeof originalWrite>) {
        const result = originalWrite(...args);
        
        // Debounce saves to avoid too frequent writes
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          try {
            const currentCache = initializedClient.cache.extract();
            storageAPI.setItem(key, JSON.stringify(currentCache));
            logger.debug(`Persisted cache to ${storage}`);
          } catch (error) {
            logger.warn('Failed to persist cache:', error);
          }
        }, 1000);
        
        return result;
      };
    } catch (error) {
      logger.warn('Cache persistence not available:', error);
    }

    return initializedClient;
  }, [client, getState(props), storage, key]);
};
