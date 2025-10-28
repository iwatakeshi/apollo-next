import { ApolloClient, DocumentNode } from '@apollo/client';
import { logger } from './config';

/**
 * Options for prefetching queries.
 */
export interface PrefetchQuery {
  /** GraphQL query document */
  query: DocumentNode;
  /** Query variables */
  variables?: Record<string, any>;
  /** Optional query context */
  context?: Record<string, any>;
}

/**
 * Prefetch multiple GraphQL queries in parallel.
 * 
 * Useful for warming up the Apollo cache during SSR/SSG
 * before rendering the page.
 * 
 * @param client - Apollo Client instance
 * @param queries - Array of queries to prefetch
 * @returns Promise that resolves when all queries complete
 * 
 * @example
 * ```typescript
 * // In getStaticProps
 * import { prefetchQueries } from '@iwatakeshi/apollo-next';
 * 
 * export const getStaticProps = withApollo(
 *   createApolloClient(),
 *   async ({ client }) => {
 *     await prefetchQueries(client, [
 *       { query: GET_USER_QUERY, variables: { id: '1' } },
 *       { query: GET_POSTS_QUERY },
 *       { query: GET_COMMENTS_QUERY, variables: { postId: '1' } },
 *     ]);
 *     
 *     return {
 *       props: {},
 *       revalidate: 60,
 *     };
 *   }
 * );
 * ```
 */
export async function prefetchQueries(
  client: ApolloClient<any>,
  queries: PrefetchQuery[]
): Promise<void> {
  logger.debug(`Prefetching ${queries.length} queries...`);
  
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

  try {
    await Promise.all(
      queries.map(({ query, variables, context }) =>
        client.query({
          query,
          variables,
          context,
        }).catch((error) => {
          // Log error but don't fail the entire prefetch
          logger.warn('Query prefetch failed:', error);
          return null;
        })
      )
    );

    const duration = typeof performance !== 'undefined' 
      ? performance.now() - startTime 
      : Date.now() - startTime;
    
    logger.debug(`Prefetched ${queries.length} queries in ${duration.toFixed(2)}ms`);
  } catch (error) {
    logger.error('Prefetch queries failed:', error);
    throw error;
  }
}

/**
 * Enable Apollo DevTools integration.
 * 
 * Exposes the Apollo Client instance to browser DevTools for debugging.
 * Should only be called in development mode.
 * 
 * @param client - Apollo Client instance to expose
 * 
 * @example
 * ```typescript
 * import { enableApolloDevTools } from '@iwatakeshi/apollo-next';
 * 
 * const client = createApolloClient();
 * 
 * if (process.env.NODE_ENV === 'development') {
 *   enableApolloDevTools(client);
 * }
 * ```
 */
export function enableApolloDevTools(client: ApolloClient<any>): void {
  if (typeof window !== 'undefined') {
    (window as any).__APOLLO_CLIENT__ = client;
    logger.debug('Apollo DevTools enabled - window.__APOLLO_CLIENT__ is available');
  }
}
