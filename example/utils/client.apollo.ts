import { ApolloClient, InMemoryCache } from "@apollo/client";
import { init } from '../src'
export const createApolloClient = () =>
  new ApolloClient({
    ssrMode: typeof window === "undefined",
    uri: "https://swapi-graphql.netlify.app/.netlify/functions/index",
    cache: new InMemoryCache(),
  })