import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import merge from "deepmerge";
import { config, logger } from "./config";
import { validateApolloClient, ApolloNextError } from "./types";

let __apollo_client: ApolloClient<unknown> | undefined = undefined;

/**
 * Helper function to check deep equality between two values.
 * Optimized for GraphQL cache entities with __typename and id fields.
 * Used for array merging to prevent duplicates.
 * 
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns True if values are deeply equal
 */
const isEqual = <T>(a: T, b: T): boolean => {
  // Fast path for primitives and same reference
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  
  // Optimized path for GraphQL entities (most common case in Apollo cache)
  // GraphQL normalized cache entities typically have __typename and id/key
  const aTyped = a as any;
  const bTyped = b as any;
  
  if (aTyped.__typename && bTyped.__typename) {
    // If both have __typename, compare type and ID
    if (aTyped.__typename !== bTyped.__typename) return false;
    
    // Check common ID fields
    if (aTyped.id !== undefined && bTyped.id !== undefined) {
      return aTyped.id === bTyped.id;
    }
    if (aTyped._id !== undefined && bTyped._id !== undefined) {
      return aTyped._id === bTyped._id;
    }
    if (aTyped.key !== undefined && bTyped.key !== undefined) {
      return aTyped.key === bTyped.key;
    }
  }
  
  // Fallback to JSON comparison for non-entity objects
  // Wrapped in try-catch to handle circular references gracefully
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    // If JSON.stringify fails (circular reference), do reference equality
    return false;
  }
};

/**
 * Initializes or returns an existing Apollo Client instance with optional state hydration.
 * 
 * This function handles:
 * - Creating a singleton Apollo Client on the client-side
 * - Merging server-side state (from SSR/SSG) with existing client cache
 * - Preventing duplicate entries when merging arrays
 * 
 * @template T - The shape of the Apollo Client cache (defaults to NormalizedCacheObject)
 * @param client - The Apollo Client instance to initialize
 * @param state - Optional state from server-side rendering (getStaticProps/getServerSideProps)
 * @returns The initialized Apollo Client with hydrated state
 * 
 * @example
 * ```typescript
 * const client = new ApolloClient({
 *   cache: new InMemoryCache(),
 *   uri: 'https://api.example.com/graphql'
 * });
 * 
 * // Initialize with SSR state
 * const initializedClient = init(client, pageProps.__APOLLO_STATE__);
 * ```
 */
export const init = <T = NormalizedCacheObject>(
  client: ApolloClient<T>,
  state: unknown = null
): ApolloClient<T> => {
  // Validate client
  if (!validateApolloClient(client)) {
    throw new ApolloNextError('Invalid Apollo Client provided to init()');
  }

  const _client = __apollo_client ?? client;

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (state) {
    logger.performance('Cache hydration', () => {
      // Get existing cache, loaded during client side data fetching
      const existingCache = _client.extract();

      if (config.logCacheHydration) {
        logger.debug('Hydrating cache:', {
          hasState: !!state,
          stateSize: JSON.stringify(state).length,
          existingCacheSize: JSON.stringify(existingCache).length,
        });
      }

      // Merge the existing cache into data passed from getStaticProps/getServerSideProps
      const data = merge(
        state as Partial<unknown>,
        existingCache as Partial<unknown>,
        {
          // combine arrays using object equality (like in sets)
          arrayMerge: (destinationArray, sourceArray) => [
            ...sourceArray,
            ...destinationArray.filter((d) =>
              sourceArray.every((s) => !isEqual(s, d))
            ),
          ],
        }
      );

      // Restore the cache with the merged data
      _client.cache.restore(data);

      if (config.logCacheHydration) {
        logger.debug('Cache hydration complete');
      }
    });
  }
  
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") {
    logger.debug('SSR mode: returning new client instance');
    return _client as ApolloClient<T>;
  }
  
  // Create the Apollo Client once in the client
  if (!__apollo_client) {
    __apollo_client = _client;
    logger.debug('Client-side: cached Apollo Client instance');
  }

  return _client as ApolloClient<T>;
};
