/**
 * API Service Tests
 */

import { fetchUsersFromAPI } from '../../src/services/api';
import { apolloClient } from '../../src/config/graphql';

jest.mock('../../src/config/graphql');

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchUsersFromAPI', () => {
    it('should fetch and transform users from API', async () => {
      const mockResponse = {
        data: {
          listZellerCustomers: {
            items: [
              {
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                role: 'Admin',
              },
              {
                id: '2',
                name: 'Jane Smith',
                email: 'jane@example.com',
                role: 'Manager',
              },
            ],
            nextToken: null,
          },
        },
      };

      (apolloClient.query as jest.Mock).mockResolvedValue(mockResponse);

      const users = await fetchUsersFromAPI();

      expect(users).toHaveLength(2);
      expect(users[0]).toEqual({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
      });
      expect(users[1]).toEqual({
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Manager',
      });
      expect(apolloClient.query).toHaveBeenCalledWith({
        query: expect.any(Object),
        fetchPolicy: 'network-only',
      });
    });

    it('should filter out invalid users (missing required fields)', async () => {
      const mockResponse = {
        data: {
          listZellerCustomers: {
            items: [
              {
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                role: 'Admin',
              },
              {
                id: '2',
                name: null, // Invalid
                email: 'jane@example.com',
                role: 'Manager',
              },
              {
                id: '3',
                name: 'Bob',
                email: 'bob@example.com',
                role: null, // Invalid
              },
              {
                id: null, // Invalid
                name: 'Alice',
                email: 'alice@example.com',
                role: 'Admin',
              },
            ],
            nextToken: null,
          },
        },
      };

      (apolloClient.query as jest.Mock).mockResolvedValue(mockResponse);

      const users = await fetchUsersFromAPI();

      expect(users).toHaveLength(1);
      expect(users[0].id).toBe('1');
    });

    it('should handle users without email', async () => {
      const mockResponse = {
        data: {
          listZellerCustomers: {
            items: [
              {
                id: '1',
                name: 'John Doe',
                email: null,
                role: 'Admin',
              },
            ],
            nextToken: null,
          },
        },
      };

      (apolloClient.query as jest.Mock).mockResolvedValue(mockResponse);

      const users = await fetchUsersFromAPI();

      expect(users).toHaveLength(1);
      expect(users[0].email).toBeUndefined();
    });

    it('should handle empty response', async () => {
      const mockResponse = {
        data: {
          listZellerCustomers: {
            items: [],
            nextToken: null,
          },
        },
      };

      (apolloClient.query as jest.Mock).mockResolvedValue(mockResponse);

      const users = await fetchUsersFromAPI();

      expect(users).toEqual([]);
    });

    it('should throw error when API call fails', async () => {
      const error = new Error('Network error');
      (apolloClient.query as jest.Mock).mockRejectedValue(error);

      await expect(fetchUsersFromAPI()).rejects.toThrow('Network error');
    });

    it('should transform role to correct type', async () => {
      const mockResponse = {
        data: {
          listZellerCustomers: {
            items: [
              {
                id: '1',
                name: 'John',
                email: 'john@example.com',
                role: 'Admin',
              },
              {
                id: '2',
                name: 'Jane',
                email: 'jane@example.com',
                role: 'Manager',
              },
            ],
            nextToken: null,
          },
        },
      };

      (apolloClient.query as jest.Mock).mockResolvedValue(mockResponse);

      const users = await fetchUsersFromAPI();

      expect(users[0].role).toBe('Admin');
      expect(users[1].role).toBe('Manager');
    });
  });
});
