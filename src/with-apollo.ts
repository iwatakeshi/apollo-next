import { type ApolloClient, NormalizedCacheObject } from "@apollo/client";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
  PreviewData,
} from "next";
import { ParsedUrlQuery } from "querystring";

type ContextWithApolloClient<
  T,
  TCacheShape = NormalizedCacheObject,
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData
> = T extends GetServerSideProps
  ? GetServerSidePropsContext<Params, Preview> & { client: ApolloClient<TCacheShape> }
  : GetStaticPropsContext<Params, Preview> & { client: ApolloClient<TCacheShape> };

type WithApolloClientFn<
  T extends GetServerSideProps | GetStaticProps,
  U = NormalizedCacheObject
> = (
  context: ContextWithApolloClient<T, U>
) => T extends GetServerSideProps ? Promise<GetServerSidePropsResult<any>> : Promise<GetStaticPropsResult<any>>;

export function withApolloClient<
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
      },
    } as any;
  }) as T;
}