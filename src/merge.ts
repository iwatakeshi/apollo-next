import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { GetServerSidePropsResult, GetStaticPropsResult } from "next";
import { APOLLO_STATE_PROP_NAME } from "./constants";

type GetServerSideOrStaticPropsResult<T> =
  | GetServerSidePropsResult<T>
  | GetStaticPropsResult<T>;

/**
 * Merges the Apollo cache with the props returned from getServerSideProps or getStaticProps.
 * @param client Apollo client
 * @param props Props returned from getServerSideProps or getStaticProps
 * @returns Props with the Apollo cache merged in
 * @deprecated Use `withApollo` instead
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
