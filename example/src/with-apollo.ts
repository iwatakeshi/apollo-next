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
