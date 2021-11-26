import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../src/use-apollo'
import '../styles/globals.css'
import { createApolloClient } from '../utils/apollo'

function MyApp({ Component, pageProps }) {
  const client = useApollo(createApolloClient(), pageProps)
  return <ApolloProvider client={client}>
    <Component {...pageProps} />
  </ApolloProvider>
}

export default MyApp
