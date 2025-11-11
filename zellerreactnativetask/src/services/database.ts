import Realm from 'realm';
import { UserSchema } from '../models/UserSchema';
import { User } from '../types/User';

class DatabaseService {
  private realm: Realm | null = null;

  async initialize(): Promise<void> {
    try {
      this.realm = await Realm.open({
        schema: [UserSchema],
        schemaVersion: 1,
      });
      console.log('Realm database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    if (!this.realm) {
      throw new Error('Database not initialized');
    }

    try {
      const users = this.realm.objects<UserSchema>('User');
      return Array.from(users).map((user: UserSchema) => user.toUser());
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    if (!this.realm) {
      throw new Error('Database not initialized');
    }

    try {
      const user = this.realm.objectForPrimaryKey<UserSchema>('User', id);
      return user ? user.toUser() : null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async insertUser(user: User): Promise<void> {
    if (!this.realm) {
      throw new Error('Database not initialized');
    }

    try {
      this.realm.write(() => {
        this.realm!.create('User', {
          id: user.id,
          name: user.name,
          email: user.email || null,
          role: user.role,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
      console.log('User inserted:', user.id);
    } catch (error) {
      console.error('Error inserting user:', error);
      throw error;
    }
  }

  async updateUser(user: User): Promise<void> {
    if (!this.realm) {
      throw new Error('Database not initialized');
    }

    try {
      this.realm.write(() => {
        const existingUser = this.realm!.objectForPrimaryKey<UserSchema>(
          'User',
          user.id,
        );
        if (existingUser) {
          existingUser.name = user.name;
          existingUser.email = user.email || undefined;
          existingUser.role = user.role;
          existingUser.updatedAt = new Date();
        } else {
          // If user doesn't exist, create it
          this.realm!.create('User', {
            id: user.id,
            name: user.name,
            email: user.email || null,
            role: user.role,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      });
      console.log('User updated:', user.id);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    if (!this.realm) {
      throw new Error('Database not initialized');
    }

    try {
      this.realm.write(() => {
        const user = this.realm!.objectForPrimaryKey<UserSchema>('User', id);
        if (user) {
          this.realm!.delete(user);
        }
      });
      console.log('User deleted:', id);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async insertOrUpdateUsers(users: User[]): Promise<void> {
    if (!this.realm) {
      throw new Error('Database not initialized');
    }

    try {
      this.realm.write(() => {
        for (const user of users) {
          const existingUser = this.realm!.objectForPrimaryKey<UserSchema>(
            'User',
            user.id,
          );

          if (existingUser) {
            // Update existing user
            existingUser.name = user.name;
            existingUser.email = user.email || undefined;
            existingUser.role = user.role;
            existingUser.updatedAt = new Date();
          } else {
            // Insert new user
            this.realm!.create('User', {
              id: user.id,
              name: user.name,
              email: user.email || null,
              role: user.role,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        }
      });
      console.log('Users synced:', users.length);
    } catch (error) {
      console.error('Error syncing users:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.realm) {
      this.realm.close();
      this.realm = null;
      console.log('Database closed');
    }
  }

  // Get Realm instance for reactive queries (optional)
  getRealm(): Realm | null {
    return this.realm;
  }
}

export const databaseService = new DatabaseService();
