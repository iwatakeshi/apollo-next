import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';
import { prefetchQueries, enableApolloDevTools } from '../utils';
import { validateApolloClient, ApolloNextError } from '../types';

describe('Utility Functions', () => {
  let client: ApolloClient<any>;

  beforeEach(() => {
    client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({ uri: 'https://example.com/graphql' }),
    });
  });

  describe('validateApolloClient', () => {
    it('should return true for valid Apollo Client', () => {
      expect(validateApolloClient(client)).toBe(true);
    });

    it('should return false for null', () => {
      expect(validateApolloClient(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(validateApolloClient(undefined)).toBe(false);
    });

    it('should return false for plain object', () => {
      expect(validateApolloClient({})).toBe(false);
    });

    it('should return false for object missing cache', () => {
      expect(validateApolloClient({ query: () => {} })).toBe(false);
    });
  });

  describe('ApolloNextError', () => {
    it('should create error with message', () => {
      const error = new ApolloNextError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('ApolloNextError');
    });

    it('should preserve cause', () => {
      const cause = new Error('Original error');
      const error = new ApolloNextError('Wrapped error', cause);
      expect(error.cause).toBe(cause);
    });

    it('should be instance of Error', () => {
      const error = new ApolloNextError('Test');
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('prefetchQueries', () => {
    it('should prefetch multiple queries', async () => {
      const mockQuery = vi.spyOn(client, 'query').mockResolvedValue({
        data: { test: 'data' },
        loading: false,
        networkStatus: 7,
      } as any);

      const QUERY1 = gql`query { test1 }`;
      const QUERY2 = gql`query { test2 }`;

      await prefetchQueries(client, [
        { query: QUERY1 },
        { query: QUERY2, variables: { id: '1' } },
      ]);

      expect(mockQuery).toHaveBeenCalledTimes(2);
      expect(mockQuery).toHaveBeenCalledWith({
        query: QUERY1,
        variables: undefined,
        context: undefined,
      });
      expect(mockQuery).toHaveBeenCalledWith({
        query: QUERY2,
        variables: { id: '1' },
        context: undefined,
      });
    });

    it('should continue on query failure', async () => {
      const mockQuery = vi.spyOn(client, 'query')
        .mockRejectedValueOnce(new Error('Query 1 failed'))
        .mockResolvedValueOnce({
          data: { test: 'data' },
          loading: false,
          networkStatus: 7,
        } as any);

      const QUERY1 = gql`query { test1 }`;
      const QUERY2 = gql`query { test2 }`;

      // Should not throw
      await prefetchQueries(client, [
        { query: QUERY1 },
        { query: QUERY2 },
      ]);

      expect(mockQuery).toHaveBeenCalledTimes(2);
    });
  });

  describe('enableApolloDevTools', () => {
    it('should expose client to window', () => {
      enableApolloDevTools(client);
      expect((window as any).__APOLLO_CLIENT__).toBe(client);
    });
  });
});
