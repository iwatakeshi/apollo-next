# apollo-next

Utilities to integrate Apollo and Next.js.

## Usage

1. Install `apollo-next`:

```bash
npm add @iwatakeshi/apollo-next graphql @apollo/client
```

2. Create a custom Apollo client

```ts
export const createApolloClient = () =>
  new ApolloClient({
    ssrMode: typeof window === "undefined",
    // ...
  })
```

3. Set the `ApolloProvider` in `_app` file and initialize Apollo.

```tsx
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "@iwatakeshi/apollo-next";
// Import your custom client
import { createApolloClient } from "../utils/client.apollo";

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={useApollo(createApolloClient(), pageProps)}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
```

4. Use it in your static or server-side rendered pages.

```tsx
import { useQuery } from "@apollo/client";
import { GetStaticProps } from 'next'
import { merge } from '@iwatakeshi/apollo-next'
// Import your custom client
import { createApolloClient } from '../utils/client.apollo'

export default function MyPage() {
  const {data} = useQuery(/* ... */)
  return <div>{/* ... */}</div>
}

export const getStaticProps: GetStaticProps = async () => {
  const client = createApolloClient()
  const {data} = await client.query(/*...*/)
  return merge(client, {
    props: {
      data
    }
  })
}

```
