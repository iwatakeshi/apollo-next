import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { useMemo } from "react";
import { init } from "./init";
import { APOLLO_STATE_PROP_NAME } from "./constants";
import { ApolloPageProps } from "./types";

/**
 * Extracts Apollo state from Next.js page props.
 * 
 * @param props - Page props from Next.js
 * @returns The Apollo state or undefined
 */
const getState = (props: any) => (props || {})[APOLLO_STATE_PROP_NAME];

/**
 * React hook to initialize Apollo Client with server-side state hydration.
 * 
 * This hook should be used in your `_app.tsx` file to create an Apollo Client
 * that properly hydrates the cache with data from SSR/SSG.
 * 
 * @template T - The shape of the Apollo Client cache (defaults to NormalizedCacheObject)
 * @param client - The Apollo Client instance to initialize
 * @param props - Page props from Next.js containing the Apollo state
 * @returns Memoized Apollo Client instance with hydrated state
 * 
 * @example
 * ```typescript
 * // In _app.tsx
 * import { ApolloProvider } from '@apollo/client';
 * import { useApollo } from '@iwatakeshi/apollo-next';
 * import { createApolloClient } from '../lib/apolloClient';
 * 
 * function MyApp({ Component, pageProps }) {
 *   const apolloClient = useApollo(createApolloClient(), pageProps);
 *   
 *   return (
 *     <ApolloProvider client={apolloClient}>
 *       <Component {...pageProps} />
 *     </ApolloProvider>
 *   );
 * }
 * ```
 */
export const useApollo = <T = NormalizedCacheObject>(
  client: ApolloClient<T>,
  props: ApolloPageProps | unknown
) => {
  const state = getState(props);
  return useMemo(() => init(client, state), [client, state]);
};
