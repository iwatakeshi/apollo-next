'use client';

import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';
import React, { ReactNode } from 'react';

/**
 * Apollo Client wrapper for Next.js App Router (13+).
 * 
 * This component must be used in a Client Component to wrap your app
 * with Apollo Provider when using the App Router.
 * 
 * @example
 * ```typescript
 * // app/providers.tsx
 * 'use client';
 * 
 * import { ApolloWrapper } from '@iwatakeshi/apollo-next/app-router';
 * import { makeClient } from './apolloClient';
 * 
 * export function Providers({ children }: { children: ReactNode }) {
 *   return (
 *     <ApolloWrapper makeClient={makeClient}>
 *       {children}
 *     </ApolloWrapper>
 *   );
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // app/layout.tsx
 * import { Providers } from './providers';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <Providers>{children}</Providers>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function ApolloWrapper<T = NormalizedCacheObject>({
  children,
  makeClient,
}: {
  children: ReactNode;
  makeClient: () => ApolloClient<T>;
}) {
  // Create client only once on mount
  const client = makeClient();

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
