import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { useMemo } from "react";
import { init } from "./init";
import { APOLLO_STATE_PROP_NAME } from "./constants";

const getState = (props: any) => (props || {})[APOLLO_STATE_PROP_NAME];

export const useApollo = <T = NormalizedCacheObject>(
  client: ApolloClient<T>,
  props: unknown
) => useMemo(() => init(client, getState(props)), [getState(props)]);
