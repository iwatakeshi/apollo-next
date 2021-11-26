import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../src/use-apollo'
import '../styles/globals.css'
import { createApolloClient } from '../utils/apollo'

function MyApp({ Component, pageProps }) {
  return <ApolloProvider client={useApollo(createApolloClient(), pageProps)}>
    <Component {...pageProps} />
  </ApolloProvider>
}

export default MyApp
