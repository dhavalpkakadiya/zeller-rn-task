/**
 * User Service Tests
 */

import { userService } from '../../src/services/userService';
import { databaseService } from '../../src/services/database';
import { fetchUsersFromAPI } from '../../src/services/api';
import { User } from '../../src/types/User';

jest.mock('../../src/services/database');
jest.mock('../../src/services/api');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initialize', () => {
    it('should initialize database service', async () => {
      (databaseService.initialize as jest.Mock).mockResolvedValue(undefined);

      await userService.initialize();

      expect(databaseService.initialize).toHaveBeenCalled();
    });
  });

  describe('loadUsersFromDatabase', () => {
    it('should load users from database', async () => {
      const mockUsers: User[] = [
        { id: '1', name: 'John Doe', role: 'Admin' },
        { id: '2', name: 'Jane Smith', role: 'Manager' },
      ];

      (databaseService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

      const users = await userService.loadUsersFromDatabase();

      expect(users).toEqual(mockUsers);
      expect(databaseService.getAllUsers).toHaveBeenCalled();
    });

    it('should return empty array on error', async () => {
      (databaseService.getAllUsers as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      const users = await userService.loadUsersFromDatabase();

      expect(users).toEqual([]);
    });
  });

  describe('syncUsersFromAPI', () => {
    it('should fetch users from API and save to database', async () => {
      const apiUsers: User[] = [
        { id: '1', name: 'John', role: 'Admin' },
        { id: '2', name: 'Jane', role: 'Manager' },
      ];

      (fetchUsersFromAPI as jest.Mock).mockResolvedValue(apiUsers);
      (databaseService.insertOrUpdateUsers as jest.Mock).mockResolvedValue(
        undefined,
      );

      const users = await userService.syncUsersFromAPI();

      expect(users).toEqual(apiUsers);
      expect(fetchUsersFromAPI).toHaveBeenCalled();
      expect(databaseService.insertOrUpdateUsers).toHaveBeenCalledWith(
        apiUsers,
      );
    });

    it('should return database users if API fails', async () => {
      const dbUsers: User[] = [{ id: '1', name: 'John', role: 'Admin' }];

      (fetchUsersFromAPI as jest.Mock).mockRejectedValue(
        new Error('API error'),
      );
      (databaseService.getAllUsers as jest.Mock).mockResolvedValue(dbUsers);

      const users = await userService.syncUsersFromAPI();

      expect(users).toEqual(dbUsers);
      expect(databaseService.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('addUser', () => {
    it('should add user to database', async () => {
      const user: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
      };

      (databaseService.insertUser as jest.Mock).mockResolvedValue(undefined);

      await userService.addUser(user);

      expect(databaseService.insertUser).toHaveBeenCalledWith(user);
    });
  });

  describe('updateUser', () => {
    it('should update user in database', async () => {
      const user: User = {
        id: '1',
        name: 'John Updated',
        role: 'Manager',
      };

      (databaseService.updateUser as jest.Mock).mockResolvedValue(undefined);

      await userService.updateUser(user);

      expect(databaseService.updateUser).toHaveBeenCalledWith(user);
    });
  });

  describe('deleteUser', () => {
    it('should delete user from database', async () => {
      (databaseService.deleteUser as jest.Mock).mockResolvedValue(undefined);

      await userService.deleteUser('1');

      expect(databaseService.deleteUser).toHaveBeenCalledWith('1');
    });
  });

  describe('refreshUsers', () => {
    it('should sync users from API', async () => {
      const apiUsers: User[] = [{ id: '1', name: 'John', role: 'Admin' }];

      (fetchUsersFromAPI as jest.Mock).mockResolvedValue(apiUsers);
      (databaseService.insertOrUpdateUsers as jest.Mock).mockResolvedValue(
        undefined,
      );

      const users = await userService.refreshUsers();

      expect(users).toEqual(apiUsers);
      expect(fetchUsersFromAPI).toHaveBeenCalled();
      expect(databaseService.insertOrUpdateUsers).toHaveBeenCalledWith(
        apiUsers,
      );
    });
  });
});
