/**
 * Database Service Tests
 */

import { databaseService } from '../../src/services/database';
import { User } from '../../src/types/User';
import Realm from 'realm';

// Mock Realm
jest.mock('realm');

describe('DatabaseService', () => {
  let mockRealm: any;
  let mockUsers: any[];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsers = [];

    mockRealm = {
      objects: jest.fn(() => mockUsers),
      objectForPrimaryKey: jest.fn(),
      create: jest.fn(),
      write: jest.fn(callback => callback()),
      delete: jest.fn(),
      close: jest.fn(),
    };

    (Realm.open as jest.Mock).mockResolvedValue(mockRealm);
    databaseService['realm'] = null;
  });

  afterEach(() => {
    databaseService['realm'] = null;
  });

  describe('initialize', () => {
    it('should initialize Realm database successfully', async () => {
      await databaseService.initialize();
      expect(Realm.open).toHaveBeenCalled();
      expect(databaseService['realm']).toBe(mockRealm);
    });

    it('should throw error if initialization fails', async () => {
      const error = new Error('Initialization failed');
      (Realm.open as jest.Mock).mockRejectedValue(error);

      await expect(databaseService.initialize()).rejects.toThrow(
        'Initialization failed',
      );
    });
  });

  describe('getAllUsers', () => {
    it('should throw error if database not initialized', async () => {
      await expect(databaseService.getAllUsers()).rejects.toThrow(
        'Database not initialized',
      );
    });

    it('should return all users from database', async () => {
      await databaseService.initialize();

      const mockUser1 = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
        toUser: jest.fn(() => ({
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'Admin',
        })),
      };

      const mockUser2 = {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Manager',
        toUser: jest.fn(() => ({
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'Manager',
        })),
      };

      mockUsers.push(mockUser1, mockUser2);
      mockRealm.objects.mockReturnValue(mockUsers);

      const users = await databaseService.getAllUsers();

      expect(users).toHaveLength(2);
      expect(users[0].name).toBe('John Doe');
      expect(users[1].name).toBe('Jane Smith');
      expect(mockRealm.objects).toHaveBeenCalledWith('User');
    });

    it('should return empty array when no users exist', async () => {
      await databaseService.initialize();
      mockRealm.objects.mockReturnValue([]);

      const users = await databaseService.getAllUsers();
      expect(users).toEqual([]);
    });

    it('should handle errors when fetching users', async () => {
      await databaseService.initialize();
      mockRealm.objects.mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(databaseService.getAllUsers()).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('getUserById', () => {
    it('should throw error if database not initialized', async () => {
      await expect(databaseService.getUserById('1')).rejects.toThrow(
        'Database not initialized',
      );
    });

    it('should return user by id', async () => {
      await databaseService.initialize();

      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
        toUser: jest.fn(() => ({
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'Admin',
        })),
      };

      mockRealm.objectForPrimaryKey.mockReturnValue(mockUser);

      const user = await databaseService.getUserById('1');

      expect(user).not.toBeNull();
      expect(user?.id).toBe('1');
      expect(user?.name).toBe('John Doe');
      expect(mockRealm.objectForPrimaryKey).toHaveBeenCalledWith('User', '1');
    });

    it('should return null when user not found', async () => {
      await databaseService.initialize();
      mockRealm.objectForPrimaryKey.mockReturnValue(null);

      const user = await databaseService.getUserById('999');
      expect(user).toBeNull();
    });
  });

  describe('insertUser', () => {
    it('should throw error if database not initialized', async () => {
      const user: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
      };

      await expect(databaseService.insertUser(user)).rejects.toThrow(
        'Database not initialized',
      );
    });

    it('should insert user into database', async () => {
      await databaseService.initialize();

      const user: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
      };

      await databaseService.insertUser(user);

      expect(mockRealm.write).toHaveBeenCalled();
      expect(mockRealm.create).toHaveBeenCalledWith('User', {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should insert user without email', async () => {
      await databaseService.initialize();

      const user: User = {
        id: '1',
        name: 'John Doe',
        role: 'Admin',
      };

      await databaseService.insertUser(user);

      expect(mockRealm.create).toHaveBeenCalledWith('User', {
        id: '1',
        name: 'John Doe',
        email: null,
        role: 'Admin',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('updateUser', () => {
    it('should throw error if database not initialized', async () => {
      const user: User = {
        id: '1',
        name: 'John Doe',
        role: 'Admin',
      };

      await expect(databaseService.updateUser(user)).rejects.toThrow(
        'Database not initialized',
      );
    });

    it('should update existing user', async () => {
      await databaseService.initialize();

      const existingUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
        updatedAt: new Date(),
      };

      mockRealm.objectForPrimaryKey.mockReturnValue(existingUser);

      const updatedUser: User = {
        id: '1',
        name: 'John Updated',
        email: 'john.updated@example.com',
        role: 'Manager',
      };

      await databaseService.updateUser(updatedUser);

      expect(mockRealm.write).toHaveBeenCalled();
      expect(existingUser.name).toBe('John Updated');
      expect(existingUser.email).toBe('john.updated@example.com');
      expect(existingUser.role).toBe('Manager');
    });

    it('should create user if not exists during update', async () => {
      await databaseService.initialize();
      mockRealm.objectForPrimaryKey.mockReturnValue(null);

      const user: User = {
        id: '1',
        name: 'John Doe',
        role: 'Admin',
      };

      await databaseService.updateUser(user);

      expect(mockRealm.create).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should throw error if database not initialized', async () => {
      await expect(databaseService.deleteUser('1')).rejects.toThrow(
        'Database not initialized',
      );
    });

    it('should delete user from database', async () => {
      await databaseService.initialize();

      const mockUser = {
        id: '1',
        name: 'John Doe',
      };

      mockRealm.objectForPrimaryKey.mockReturnValue(mockUser);

      await databaseService.deleteUser('1');

      expect(mockRealm.write).toHaveBeenCalled();
      expect(mockRealm.objectForPrimaryKey).toHaveBeenCalledWith('User', '1');
      expect(mockRealm.delete).toHaveBeenCalledWith(mockUser);
    });

    it('should not throw error if user not found', async () => {
      await databaseService.initialize();
      mockRealm.objectForPrimaryKey.mockReturnValue(null);

      await expect(databaseService.deleteUser('999')).resolves.not.toThrow();
      expect(mockRealm.delete).not.toHaveBeenCalled();
    });
  });

  describe('insertOrUpdateUsers', () => {
    it('should throw error if database not initialized', async () => {
      const users: User[] = [{ id: '1', name: 'John', role: 'Admin' }];

      await expect(databaseService.insertOrUpdateUsers(users)).rejects.toThrow(
        'Database not initialized',
      );
    });

    it('should insert new users', async () => {
      await databaseService.initialize();
      mockRealm.objectForPrimaryKey.mockReturnValue(null);

      const users: User[] = [
        { id: '1', name: 'John', role: 'Admin' },
        { id: '2', name: 'Jane', role: 'Manager' },
      ];

      await databaseService.insertOrUpdateUsers(users);

      expect(mockRealm.write).toHaveBeenCalled();
      expect(mockRealm.create).toHaveBeenCalledTimes(2);
    });

    it('should update existing users', async () => {
      await databaseService.initialize();

      const existingUser1 = {
        id: '1',
        name: 'John Old',
        email: null,
        role: 'Admin',
        updatedAt: new Date(),
      };

      mockRealm.objectForPrimaryKey.mockReturnValue(existingUser1);

      const users: User[] = [{ id: '1', name: 'John New', role: 'Manager' }];

      await databaseService.insertOrUpdateUsers(users);

      expect(existingUser1.name).toBe('John New');
      expect(existingUser1.role).toBe('Manager');
    });

    it('should handle mix of insert and update', async () => {
      await databaseService.initialize();

      const existingUser = {
        id: '1',
        name: 'John',
        email: null,
        role: 'Admin',
        updatedAt: new Date(),
      };

      mockRealm.objectForPrimaryKey
        .mockReturnValueOnce(existingUser) // First call returns existing
        .mockReturnValueOnce(null); // Second call returns null (new user)

      const users: User[] = [
        { id: '1', name: 'John Updated', role: 'Admin' },
        { id: '2', name: 'Jane New', role: 'Manager' },
      ];

      await databaseService.insertOrUpdateUsers(users);

      expect(existingUser.name).toBe('John Updated');
      expect(mockRealm.create).toHaveBeenCalledTimes(1); // Only for new user
    });
  });

  describe('close', () => {
    it('should close database connection', async () => {
      await databaseService.initialize();
      await databaseService.close();

      expect(mockRealm.close).toHaveBeenCalled();
      expect(databaseService['realm']).toBeNull();
    });

    it('should not throw if database not initialized', async () => {
      await expect(databaseService.close()).resolves.not.toThrow();
    });
  });
});
