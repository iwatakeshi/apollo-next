import { type ApolloClient, NormalizedCacheObject } from "@apollo/client";
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

type ContextWithApolloClient<
  T extends GetServerSideProps<any, any> | GetStaticProps<any, any>,
  TCacheShape = NormalizedCacheObject
> = T extends GetServerSideProps<infer Params, infer Preview>
  ? GetServerSidePropsContext<Params, Preview> & {
      client: ApolloClient<TCacheShape>;
    }
  : T extends GetServerSideProps<infer Params, infer Preview>
  ? GetStaticPropsContext<Params, Preview> & {
      client: ApolloClient<TCacheShape>;
    }
  : T extends GetServerSideProps
  ? GetServerSideProps<ParsedUrlQuery> & { client: ApolloClient<TCacheShape> }
  : GetStaticProps<ParsedUrlQuery> & { client: ApolloClient<TCacheShape> };

type WithApolloClientFn<
  T extends GetServerSideProps<any, any> | GetStaticProps<any, any>,
  U = NormalizedCacheObject
> = (
  context: ContextWithApolloClient<T, U>
) => T extends GetServerSideProps<any, any>
  ? Promise<GetServerSidePropsResult<any>>
  : Promise<GetStaticPropsResult<any>>;

export function withApollo<
  T extends GetServerSideProps | GetStaticProps,
  U = NormalizedCacheObject
>(client: ApolloClient<U>, fn: WithApolloClientFn<T, U>): T {
  return (async (context: any) => {
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
