import { NormalizedCacheObject } from '@apollo/client';
import { APOLLO_STATE_PROP_NAME } from './constants';

/**
 * Type-safe interface for Next.js page props that include Apollo state.
 * 
 * @template T - Additional props type
 * 
 * @example
 * ```typescript
 * interface MyPageProps {
 *   title: string;
 *   data: MyData;
 * }
 * 
 * export const getStaticProps = async (): Promise<GetStaticPropsResult<ApolloPageProps<MyPageProps>>> => {
 *   // ...
 * }
 * ```
 */
export interface ApolloPageProps<T = Record<string, any>> {
  [APOLLO_STATE_PROP_NAME]?: NormalizedCacheObject;
  [key: string]: any;
}

/**
 * Custom error class for apollo-next specific errors.
 * 
 * @example
 * ```typescript
 * throw new ApolloNextError('Failed to initialize client', originalError);
 * ```
 */
export class ApolloNextError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'ApolloNextError';
    
    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApolloNextError);
    }
  }
}

/**
 * Type guard to validate if an object is a valid Apollo Client.
 * 
 * @param client - Object to validate
 * @returns True if the object is a valid ApolloClient
 * 
 * @example
 * ```typescript
 * if (!validateApolloClient(client)) {
 *   throw new ApolloNextError('Invalid Apollo Client provided');
 * }
 * ```
 */
export const validateApolloClient = (client: unknown): client is import('@apollo/client').ApolloClient<any> => {
  return (
    client != null &&
    typeof client === 'object' &&
    'cache' in client &&
    'query' in client &&
    'mutate' in client &&
    typeof (client as any).query === 'function'
  );
};
