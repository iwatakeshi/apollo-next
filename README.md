# apollo-next

Utilities to integrate Apollo Client with Next.js, supporting both Pages Router and App Router.

## Features

- ✅ **Pages Router Support** - Full support for `getStaticProps` and `getServerSideProps`
- ✅ **App Router Support** - Next.js 13+ App Router with Server Components
- ✅ **Automatic Cache Hydration** - Seamless SSR/SSG to client-side transitions
- ✅ **TypeScript First** - Fully typed with comprehensive JSDoc
- ✅ **Performance Optimized** - Efficient cache merging and deduplication
- ✅ **Debug Mode** - Built-in logging for development
- ✅ **Cache Persistence** - Optional localStorage/sessionStorage support
- ✅ **DevTools Integration** - Easy Apollo DevTools setup

## Installation

```bash
npm add @iwatakeshi/apollo-next graphql @apollo/client
```

## Quick Start

### Pages Router (Next.js 12 and earlier)

1. Create your Apollo Client

```ts
// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const createApolloClient = () =>
  new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri: 'https://api.example.com/graphql',
    }),
    cache: new InMemoryCache(),
  });
```

2. Set up Apollo Provider in `_app.tsx`

```tsx
// pages/_app.tsx
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '@iwatakeshi/apollo-next';
import { createApolloClient } from '../lib/apolloClient';

function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo(createApolloClient(), pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
```

3. Use in your pages with SSR/SSG

```tsx
// pages/index.tsx
import { useQuery, gql } from '@apollo/client';
import { GetStaticProps } from 'next';
import { withApollo } from '@iwatakeshi/apollo-next';
import { createApolloClient } from '../lib/apolloClient';

const GET_DATA = gql`
  query GetData {
    data {
      id
      name
    }
  }
`;

export default function HomePage() {
  const { data, loading } = useQuery(GET_DATA);
  
  if (loading) return <p>Loading...</p>;
  
  return <div>{/* render data */}</div>;
}

export const getStaticProps = withApollo<GetStaticProps>(
  createApolloClient(),
  async ({ client }) => {
    await client.query({ query: GET_DATA });
    
    return {
      props: {},
      revalidate: 60,
    };
  }
);
```

### App Router (Next.js 13+)

1. Create a Client Component wrapper

```tsx
// app/providers.tsx
'use client';

import { ApolloWrapper } from '@iwatakeshi/apollo-next/app-router';
import { createApolloClient } from '../lib/apolloClient';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloWrapper makeClient={createApolloClient}>
      {children}
    </ApolloWrapper>
  );
}
```

2. Use in your layout

```tsx
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

3. Use in Server or Client Components

```tsx
// app/page.tsx
'use client';

import { useQuery, gql } from '@apollo/client';

const GET_DATA = gql`
  query GetData {
    data {
      id
      name
    }
  }
`;

export default function Page() {
  const { data, loading } = useQuery(GET_DATA);
  
  if (loading) return <p>Loading...</p>;
  
  return <div>{/* render data */}</div>;
}
```

## Advanced Features

### Cache Persistence

Persist Apollo cache to localStorage for offline support:

```tsx
import { usePersistentApollo } from '@iwatakeshi/apollo-next';

function MyApp({ Component, pageProps }) {
  const apolloClient = usePersistentApollo(
    createApolloClient(),
    pageProps,
    { 
      storage: 'localStorage', // or 'sessionStorage'
      key: 'my-app-apollo-cache'
    }
  );

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
```

### Query Prefetching

Prefetch multiple queries in parallel during SSR/SSG:

```tsx
import { prefetchQueries, withApollo } from '@iwatakeshi/apollo-next';

export const getStaticProps = withApollo(
  createApolloClient(),
  async ({ client }) => {
    await prefetchQueries(client, [
      { query: GET_USER, variables: { id: '1' } },
      { query: GET_POSTS },
      { query: GET_COMMENTS, variables: { postId: '1' } },
    ]);
    
    return {
      props: {},
      revalidate: 60,
    };
  }
);
```

### Debug Mode

Enable detailed logging for development:

```tsx
import { configure } from '@iwatakeshi/apollo-next';

if (process.env.NODE_ENV === 'development') {
  configure({
    debug: true,
    logCacheHydration: true,
    logPerformance: true,
  });
}
```

### Apollo DevTools

Enable Apollo DevTools in the browser:

```tsx
import { enableApolloDevTools } from '@iwatakeshi/apollo-next';

const client = createApolloClient();

if (process.env.NODE_ENV === 'development') {
  enableApolloDevTools(client);
}
```

## API Reference

### `useApollo(client, pageProps)`

React hook for Pages Router that initializes Apollo Client with SSR/SSG state.

### `withApollo(client, dataFetchingFn)`

HOC that wraps `getStaticProps` or `getServerSideProps` to inject Apollo Client.

### `ApolloWrapper`

Client Component wrapper for App Router (Next.js 13+).

### `usePersistentApollo(client, pageProps, options)`

Hook with localStorage/sessionStorage persistence.

### `prefetchQueries(client, queries)`

Utility to prefetch multiple queries in parallel.

### `configure(options)`

Configure debug logging and performance monitoring.

### `enableApolloDevTools(client)`

Enable Apollo DevTools integration.

## TypeScript Support

Full TypeScript support with comprehensive types:

```tsx
import type { ApolloPageProps } from '@iwatakeshi/apollo-next';

interface MyPageProps {
  title: string;
}

export const getStaticProps = async (): Promise<GetStaticPropsResult<ApolloPageProps<MyPageProps>>> => {
  // ...
};
```

## Migration from 0.3.x

Version 0.4.0 adds new features while maintaining backward compatibility:

- ✅ All existing APIs work unchanged
- ✅ New App Router support is opt-in
- ✅ `merge` function is deprecated (use `withApollo` instead)
- ✅ `init` is now internal (no breaking changes if you weren't using it directly)

## License

MIT
