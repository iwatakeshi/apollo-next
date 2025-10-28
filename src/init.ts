import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import merge from "deepmerge";

let __apollo_client: ApolloClient<unknown> | undefined = undefined;

/**
 * Helper function to check deep equality between two values using JSON serialization.
 * Used for array merging to prevent duplicates.
 * 
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns True if values are deeply equal
 */
const isEqual = <T>(a: T, b: T): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
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
  const _client = __apollo_client ?? client;

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (state) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _client.extract();

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
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _client as ApolloClient<T>;
  // Create the Apollo Client once in the client
  if (!__apollo_client) __apollo_client = _client;

  return _client as ApolloClient<T>;
};
