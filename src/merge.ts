import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { GetServerSidePropsResult, GetStaticPropsResult } from "next";
import { APOLLO_STATE_PROP_NAME } from "./constants";

type GetServerSideOrStaticPropsResult<T> =
  | GetServerSidePropsResult<T>
  | GetStaticPropsResult<T>;

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
