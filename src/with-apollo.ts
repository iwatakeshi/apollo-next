import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { ParsedUrlQuery } from "querystring";
import { APOLLO_STATE_PROP_NAME } from "./constants";

type ApolloClientContext<TCacheShape = NormalizedCacheObject> = {
  client: ApolloClient<TCacheShape>;
};

type Context<
  T extends GetServerSideProps<any, any, any> | GetStaticProps<any, any, any>
> = T extends GetServerSideProps<infer Props, infer Params, infer Preview>
  ? GetServerSidePropsContext<Params, Preview>
  : T extends GetStaticProps<infer Props, infer Params, infer Preview>
  ? GetStaticPropsContext<Params, Preview>
  : T extends GetServerSideProps<infer Props, infer Params>
  ? GetServerSidePropsContext<Params>
  : T extends GetStaticProps<infer Props, infer Params>
  ? GetStaticPropsContext<Params>
  : T extends GetServerSideProps<infer Props>
  ? GetServerSidePropsContext<ParsedUrlQuery>
  : T extends GetStaticProps<infer Props>
  ? GetStaticPropsContext<ParsedUrlQuery>
  : never;

type ContextWithApolloClient<
  T extends GetServerSideProps | GetStaticProps,
  TCacheShape = NormalizedCacheObject
> = T extends GetServerSideProps<infer Props, infer Params, infer Preview>
  ? GetServerSidePropsContext<Params, Preview> &
      ApolloClientContext<TCacheShape>
  : T extends GetServerSideProps<infer Props, infer Params, infer Preview>
  ? GetStaticPropsContext<Params, Preview> & ApolloClientContext<TCacheShape>
  : T extends GetServerSideProps<infer Props, infer Params>
  ? GetServerSidePropsContext<Params> & ApolloClientContext<TCacheShape>
  : T extends GetStaticProps<infer Props, infer Params>
  ? GetStaticPropsContext<Params> & ApolloClientContext<TCacheShape>
  : T extends GetServerSideProps<infer Props>
  ? GetServerSidePropsContext<ParsedUrlQuery> & ApolloClientContext<TCacheShape>
  : T extends GetStaticProps<infer Props>
  ? GetServerSideProps<ParsedUrlQuery> & ApolloClientContext<TCacheShape>
  : GetStaticProps<ParsedUrlQuery> & ApolloClientContext<TCacheShape>;

type WithApolloClientFn<
  T extends GetServerSideProps<any, any> | GetStaticProps<any, any>,
  U = NormalizedCacheObject
> = (
  context: ContextWithApolloClient<T, U>
) => T extends GetServerSideProps<any, any>
  ? Promise<GetServerSidePropsResult<any>>
  : Promise<GetStaticPropsResult<any>>;

/**
 * Higher-order function that wraps Next.js data fetching methods with Apollo Client.
 * 
 * This function:
 * - Injects an Apollo Client instance into the context
 * - Automatically extracts and includes the Apollo cache state in returned props
 * - Supports both static and server-side rendering
 * - Handles client factory functions for dynamic client creation
 * 
 * @template T - The type of Next.js data fetching function (GetStaticProps or GetServerSideProps)
 * @template U - The shape of the Apollo Client cache (defaults to NormalizedCacheObject)
 * 
 * @param input - Either an Apollo Client instance or a factory function that creates one
 * @param fn - The data fetching function that receives the enhanced context with the Apollo Client
 * @returns A wrapped data fetching function compatible with Next.js
 * 
 * @example
 * Using with a static Apollo Client:
 * ```typescript
 * import { withApollo } from '@iwatakeshi/apollo-next';
 * import { GetStaticProps } from 'next';
 * import { createApolloClient } from '../lib/apolloClient';
 * 
 * export const getStaticProps = withApollo<GetStaticProps>(
 *   createApolloClient(),
 *   async ({ client }) => {
 *     const { data } = await client.query({ query: MY_QUERY });
 *     
 *     return {
 *       props: { data },
 *       revalidate: 60,
 *     };
 *   }
 * );
 * ```
 * 
 * @example
 * Using with a client factory function (recommended for SSR):
 * ```typescript
 * import { withApollo } from '@iwatakeshi/apollo-next';
 * import { GetServerSideProps } from 'next';
 * import { createApolloClient } from '../lib/apolloClient';
 * 
 * export const getServerSideProps = withApollo<GetServerSideProps>(
 *   (context) => createApolloClient(context.req.cookies),
 *   async ({ client, params }) => {
 *     const { data } = await client.query({ 
 *       query: MY_QUERY,
 *       variables: { id: params?.id }
 *     });
 *     
 *     return {
 *       props: { data },
 *     };
 *   }
 * );
 * ```
 */
export function withApollo<
  T extends GetServerSideProps | GetStaticProps,
  U = NormalizedCacheObject
>(
  input: ApolloClient<U> | ((context: Context<T>) => ApolloClient<U>),
  fn: WithApolloClientFn<T, U>
): T {
  return (async (context: any) => {
    const client = input instanceof ApolloClient ? input : input(context);
    const enhancedContext = {
      ...context,
      client,
    };
    const result = await fn(enhancedContext);
    return {
      ...result,
      props: {
        ...((result as any).props || {}),
        [APOLLO_STATE_PROP_NAME]: client.cache.extract(),
      },
    } as any;
  }) as T;
}
