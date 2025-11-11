import { databaseService } from './database';
import { fetchUsersFromAPI } from './api';
import { User } from '../types/User';

class UserService {
  /**
   * Initialize the database
   */
  async initialize(): Promise<void> {
    await databaseService.initialize();
  }

  /**
   * Load users from database
   */
  async loadUsersFromDatabase(): Promise<User[]> {
    try {
      return await databaseService.getAllUsers();
    } catch (error) {
      console.error('Error loading users from database:', error);
      return [];
    }
  }

  /**
   * Fetch users from API and sync to database
   */
  async syncUsersFromAPI(): Promise<User[]> {
    try {
      const users = await fetchUsersFromAPI();
      await databaseService.insertOrUpdateUsers(users);
      return users;
    } catch (error) {
      console.error('Error syncing users from API:', error);
      // If API fails, return users from database
      return await this.loadUsersFromDatabase();
    }
  }

  /**
   * Add a new user to the database
   */
  async addUser(user: User): Promise<void> {
    await databaseService.insertUser(user);
  }

  /**
   * Update an existing user in the database
   */
  async updateUser(user: User): Promise<void> {
    await databaseService.updateUser(user);
  }

  /**
   * Delete a user from the database
   */
  async deleteUser(id: string): Promise<void> {
    await databaseService.deleteUser(id);
  }

  /**
   * Refresh users: fetch from API and update database, then return all users from database
   */
  async refreshUsers(): Promise<User[]> {
    try {
      // Sync from API first
      await this.syncUsersFromAPI();
      // Then load all users from database (includes API users + any local changes)
      return await this.loadUsersFromDatabase();
    } catch (error) {
      console.error('Error refreshing users:', error);
      // If refresh fails, return users from database
      return await this.loadUsersFromDatabase();
    }
  }
}

export const userService = new UserService();
