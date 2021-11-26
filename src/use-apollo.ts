import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { useMemo } from "react";
import { init } from "./init";
import { APOLLO_STATE_PROP_NAME } from "./constants";

export const useApollo = <T = NormalizedCacheObject>(client: ApolloClient<T>, props: any = {}) =>
  useMemo(() =>
    init(client, props[APOLLO_STATE_PROP_NAME]), [props[APOLLO_STATE_PROP_NAME]])