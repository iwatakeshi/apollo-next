import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import merge from "deepmerge";
import { complement, equals } from "rambda";
let __apollo_client: ApolloClient<unknown> | undefined = undefined;

export const init = <T = NormalizedCacheObject>(
  client: ApolloClient<T>,
  state: unknown = null
): ApolloClient<T> => {
  const _client = __apollo_client ?? client;

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (state) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _client.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(state as unknown, existingCache as unknown, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every(complement(equals(d)))
        ),
      ],
    });

    // Restore the cache with the merged data
    _client.cache.restore(data);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _client as ApolloClient<T>;
  // Create the Apollo Client once in the client
  if (!client) return (__apollo_client = client);

  return _client as ApolloClient<T>;
};
