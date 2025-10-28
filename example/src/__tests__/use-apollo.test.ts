import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { useApollo } from '../use-apollo';
import { APOLLO_STATE_PROP_NAME } from '../constants';

describe('useApollo', () => {
  let client: ApolloClient<NormalizedCacheObject>;

  beforeEach(() => {
    client = new ApolloClient({
      cache: new InMemoryCache(),
      uri: 'https://example.com/graphql',
    });
  });

  it('should initialize Apollo client without state', () => {
    const { result } = renderHook(() => useApollo(client, {}));
    expect(result.current).toBeDefined();
  });

  it('should initialize Apollo client with hydrated state', () => {
    const state = {
      ROOT_QUERY: {
        __typename: 'Query',
        user: { id: '1', name: 'Test User' },
      },
    };

    const props = {
      [APOLLO_STATE_PROP_NAME]: state,
    };

    const { result } = renderHook(() => useApollo(client, props));
    const cache = result.current.cache.extract();
    
    expect(cache).toEqual(state);
  });

  it('should memoize the client instance', () => {
    const props = { [APOLLO_STATE_PROP_NAME]: null };
    
    const { result, rerender } = renderHook(() => useApollo(client, props));
    const firstInstance = result.current;
    
    rerender();
    const secondInstance = result.current;
    
    expect(firstInstance).toBe(secondInstance);
  });

  it('should update when state changes', () => {
    const initialProps = {
      [APOLLO_STATE_PROP_NAME]: { ROOT_QUERY: { data: 'initial' } },
    };
    
    const { result, rerender } = renderHook(
      ({ props }) => useApollo(client, props),
      { initialProps: { props: initialProps } }
    );
    
    const updatedProps = {
      [APOLLO_STATE_PROP_NAME]: { ROOT_QUERY: { data: 'updated' } },
    };
    
    rerender({ props: updatedProps });
    
    // Should have new cache state
    expect(result.current.cache.extract()).toHaveProperty('ROOT_QUERY');
  });
});
