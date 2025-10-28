import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { init } from '../init';

describe('init', () => {
  let client: ApolloClient<NormalizedCacheObject>;

  beforeEach(() => {
    // Create a fresh client for each test
    client = new ApolloClient({
      cache: new InMemoryCache(),
      uri: 'https://example.com/graphql',
    });
  });

  it('should return the client if no state is provided', () => {
    const result = init(client);
    expect(result).toBe(client);
  });

  it('should restore cache with provided state', () => {
    const state = {
      ROOT_QUERY: {
        __typename: 'Query',
        user: { id: '1', name: 'Test User' },
      },
    };

    const result = init(client, state);
    const cache = result.cache.extract();
    
    expect(cache).toEqual(state);
  });

  it('should merge existing cache with new state', () => {
    // Pre-populate cache
    client.cache.restore({
      ROOT_QUERY: {
        __typename: 'Query',
        existingData: 'existing',
      },
    });

    const newState = {
      ROOT_QUERY: {
        __typename: 'Query',
        newData: 'new',
      },
    };

    const result = init(client, newState);
    const cache = result.cache.extract();
    
    // Both should be present after merge
    expect(cache.ROOT_QUERY).toHaveProperty('existingData');
    expect(cache.ROOT_QUERY).toHaveProperty('newData');
  });

  it('should handle array merging correctly', () => {
    const existingState = {
      ROOT_QUERY: {
        __typename: 'Query',
        items: [{ id: '1', name: 'Item 1' }],
      },
    };

    client.cache.restore(existingState);

    const newState = {
      ROOT_QUERY: {
        __typename: 'Query',
        items: [{ id: '2', name: 'Item 2' }],
      },
    };

    const result = init(client, newState);
    const cache = result.cache.extract();
    
    // Should contain both items
    expect(cache.ROOT_QUERY.items).toHaveLength(2);
  });

  it('should return the same client instance on client-side', () => {
    // First call
    const result1 = init(client);
    // Second call with the same client
    const result2 = init(client);
    
    expect(result1).toBe(result2);
  });
});
