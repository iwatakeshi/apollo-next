import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { GetServerSidePropsResult, GetStaticPropsResult } from "next";
import { APOLLO_STATE_PROP_NAME } from "./constants";

type GetServerSideOrStaticPropsResult<T> =
  | GetServerSidePropsResult<T>
  | GetStaticPropsResult<T>;

/**
 * Merges the Apollo cache with the props returned from getServerSideProps or getStaticProps.
 * 
 * @template T - The type of props being returned
 * @template U - The shape of the Apollo Client cache (defaults to NormalizedCacheObject)
 * @param client - Apollo Client instance containing the cache to extract
 * @param props - Props returned from getServerSideProps or getStaticProps
 * @returns Props with the Apollo cache merged in under the __APOLLO_STATE__ key
 * 
 * @deprecated Use `withApollo` instead - it provides better type safety and handles this automatically
 * 
 * @example
 * ```typescript
 * export const getStaticProps = async () => {
 *   const client = createApolloClient();
 *   
 *   await client.query({ query: MY_QUERY });
 *   
 *   return merge(client, {
 *     props: { someData: 'value' }
 *   });
 * }
 * ```
 */
export const merge = <T = unknown, U = NormalizedCacheObject>(
  client: ApolloClient<U>,
  props: GetServerSideOrStaticPropsResult<T>
): GetServerSideOrStaticPropsResult<T> => {
  return {
    ...props,
    props: {
      ...(props as any)?.props,
      [APOLLO_STATE_PROP_NAME]: client.cache.extract(),
    },
  };
};
