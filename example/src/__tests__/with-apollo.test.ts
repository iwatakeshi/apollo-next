import { describe, it, expect, vi } from 'vitest';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { withApollo } from '../with-apollo';
import { APOLLO_STATE_PROP_NAME } from '../constants';

describe('withApollo', () => {
  const createMockClient = () =>
    new ApolloClient({
      cache: new InMemoryCache(),
      uri: 'https://example.com/graphql',
    });

  it('should wrap getStaticProps and inject Apollo client', async () => {
    const client = createMockClient();
    const mockData = { message: 'Hello World' };

    const wrappedFn = withApollo(
      client,
      async ({ client: apolloClient }) => {
        expect(apolloClient).toBe(client);
        return {
          props: { data: mockData },
        };
      }
    );

    const context = {
      params: {},
    };

    const result = await wrappedFn(context as any);

    expect(result).toHaveProperty('props');
    expect((result as any).props).toHaveProperty(APOLLO_STATE_PROP_NAME);
    expect((result as any).props.data).toEqual(mockData);
  });

  it('should support client factory function', async () => {
    const client = createMockClient();
    const mockData = { message: 'Hello World' };

    const wrappedFn = withApollo(
      () => client,
      async ({ client: apolloClient }) => {
        expect(apolloClient).toBe(client);
        return {
          props: { data: mockData },
        };
      }
    );

    const context = {
      params: {},
    };

    const result = await wrappedFn(context as any);

    expect(result).toHaveProperty('props');
    expect((result as any).props).toHaveProperty(APOLLO_STATE_PROP_NAME);
  });

  it('should extract and include cache state in props', async () => {
    const client = createMockClient();
    
    // Pre-populate cache
    client.cache.restore({
      ROOT_QUERY: {
        __typename: 'Query',
        user: { id: '1', name: 'Test User' },
      },
    });

    const wrappedFn = withApollo(client, async () => {
      return {
        props: { serverData: 'test' },
      };
    });

    const result = await wrappedFn({} as any);

    expect((result as any).props[APOLLO_STATE_PROP_NAME]).toHaveProperty('ROOT_QUERY');
    expect((result as any).props[APOLLO_STATE_PROP_NAME].ROOT_QUERY).toHaveProperty('user');
  });

  it('should handle getServerSideProps context', async () => {
    const client = createMockClient();

    const wrappedFn = withApollo(
      (context) => {
        expect(context).toHaveProperty('req');
        expect(context).toHaveProperty('res');
        return client;
      },
      async () => {
        return {
          props: { data: 'server-side' },
        };
      }
    );

    const context = {
      req: {},
      res: {},
      params: {},
      query: {},
    };

    const result = await wrappedFn(context as any);

    expect(result).toHaveProperty('props');
    expect((result as any).props.data).toBe('server-side');
  });

  it('should preserve existing props', async () => {
    const client = createMockClient();
    const existingProps = {
      foo: 'bar',
      nested: { value: 123 },
    };

    const wrappedFn = withApollo(client, async () => {
      return {
        props: existingProps,
      };
    });

    const result = await wrappedFn({} as any);

    expect((result as any).props).toHaveProperty('foo', 'bar');
    expect((result as any).props).toHaveProperty('nested');
    expect((result as any).props.nested.value).toBe(123);
    expect((result as any).props).toHaveProperty(APOLLO_STATE_PROP_NAME);
  });
});
