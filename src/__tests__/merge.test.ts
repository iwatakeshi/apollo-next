import { describe, it, expect } from 'vitest';
import { merge } from '../merge';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { APOLLO_STATE_PROP_NAME } from '../constants';

describe('merge', () => {
  it('should merge Apollo cache into props', () => {
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({ uri: 'https://example.com/graphql' }),
    });

    const cacheData = {
      ROOT_QUERY: {
        __typename: 'Query',
        user: { id: '1', name: 'Test' },
      },
    };

    client.cache.restore(cacheData);

    const props = {
      props: {
        serverData: 'test',
      },
    };

    const result = merge(client, props);

    expect(result).toHaveProperty('props');
    expect((result as any).props).toHaveProperty('serverData', 'test');
    expect((result as any).props).toHaveProperty(APOLLO_STATE_PROP_NAME);
    expect((result as any).props[APOLLO_STATE_PROP_NAME]).toEqual(cacheData);
  });

  it('should handle props without existing props object', () => {
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({ uri: 'https://example.com/graphql' }),
    });

    const result = merge(client, { notFound: true } as any);

    expect(result).toHaveProperty('props');
    expect((result as any).props).toHaveProperty(APOLLO_STATE_PROP_NAME);
  });

  it('should preserve redirect and notFound results', () => {
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({ uri: 'https://example.com/graphql' }),
    });

    const redirectResult = {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };

    const result = merge(client, redirectResult);

    expect(result).toHaveProperty('redirect');
    expect((result as any).redirect.destination).toBe('/login');
  });
});
