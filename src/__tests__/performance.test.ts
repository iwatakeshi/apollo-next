import { describe, it, expect, beforeEach } from 'vitest';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { init } from '../init';

describe('Performance Tests', () => {
  let client: ApolloClient<any>;

  beforeEach(() => {
    client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({ uri: 'https://example.com/graphql' }),
    });
  });

  it('should handle large cache states efficiently', () => {
    // Generate a large state with 1000 entities
    const largeState: any = {
      ROOT_QUERY: {
        __typename: 'Query',
      },
    };

    // Add 1000 user entities
    for (let i = 0; i < 1000; i++) {
      largeState[`User:${i}`] = {
        __typename: 'User',
        id: `${i}`,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        posts: Array.from({ length: 10 }, (_, j) => ({
          __typename: 'Post',
          id: `post-${i}-${j}`,
          title: `Post ${j}`,
        })),
      };
    }

    const start = performance.now();
    const result = init(client, largeState);
    const duration = performance.now() - start;

    expect(result).toBeDefined();
    expect(duration).toBeLessThan(200); // Should complete in under 200ms
  });

  it('should efficiently merge arrays with many duplicates', () => {
    // Create initial state with 500 items
    const initialState = {
      ROOT_QUERY: {
        __typename: 'Query',
        items: Array.from({ length: 500 }, (_, i) => ({
          __typename: 'Item',
          id: `${i}`,
          name: `Item ${i}`,
        })),
      },
    };

    client.cache.restore(initialState);

    // New state with 500 items, 250 duplicates
    const newState = {
      ROOT_QUERY: {
        __typename: 'Query',
        items: [
          // First 250 are duplicates
          ...Array.from({ length: 250 }, (_, i) => ({
            __typename: 'Item',
            id: `${i}`,
            name: `Item ${i}`,
          })),
          // Next 250 are new
          ...Array.from({ length: 250 }, (_, i) => ({
            __typename: 'Item',
            id: `${i + 500}`,
            name: `Item ${i + 500}`,
          })),
        ],
      },
    };

    const start = performance.now();
    init(client, newState);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(100); // Should be fast with optimized isEqual
  });

  it('should perform well with deeply nested objects', () => {
    const createNestedObject = (depth: number): any => {
      if (depth === 0) {
        return {
          __typename: 'Leaf',
          id: 'leaf',
          value: 'data',
        };
      }
      return {
        __typename: 'Node',
        id: `node-${depth}`,
        children: Array.from({ length: 5 }, () => createNestedObject(depth - 1)),
      };
    };

    const nestedState = {
      ROOT_QUERY: {
        __typename: 'Query',
        root: createNestedObject(4), // 5 levels deep, 5 children each
      },
    };

    const start = performance.now();
    init(client, nestedState);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(150);
  });

  it('should handle multiple rapid initializations', () => {
    const state = {
      ROOT_QUERY: {
        __typename: 'Query',
        data: Array.from({ length: 100 }, (_, i) => ({
          __typename: 'Data',
          id: `${i}`,
          value: `Value ${i}`,
        })),
      },
    };

    const start = performance.now();
    
    // Simulate rapid re-renders in React
    for (let i = 0; i < 50; i++) {
      init(client, state);
    }
    
    const duration = performance.now() - start;
    const avgDuration = duration / 50;

    expect(avgDuration).toBeLessThan(10); // Each init should take less than 10ms on average
  });

  it('should efficiently compare GraphQL entities with __typename and id', () => {
    const entities = Array.from({ length: 1000 }, (_, i) => ({
      __typename: 'User',
      id: `${i}`,
      name: `User ${i}`,
      metadata: { created: new Date(), tags: ['a', 'b', 'c'] },
    }));

    const state = {
      ROOT_QUERY: {
        __typename: 'Query',
        users: entities,
      },
    };

    client.cache.restore(state);

    // Same entities, should be deduplicated quickly
    const newState = {
      ROOT_QUERY: {
        __typename: 'Query',
        users: [...entities.slice(0, 500), ...entities.slice(500)],
      },
    };

    const start = performance.now();
    init(client, newState);
    const duration = performance.now() - start;

    // With optimized isEqual using __typename+id, this should be very fast
    expect(duration).toBeLessThan(50);
  });
});
