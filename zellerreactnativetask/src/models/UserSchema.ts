import Realm from 'realm';
import { User, UserRole } from '../types/User';

export class UserSchema extends Realm.Object<UserSchema> {
  id!: string;
  name!: string;
  email?: string;
  role!: UserRole;
  createdAt!: Date;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'User',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      email: 'string?',
      role: 'string',
      createdAt: 'date',
      updatedAt: 'date',
    },
  };

  toUser(): User {
    return {
      id: this.id,
      name: this.name,
      email: this.email || undefined,
      role: this.role as UserRole,
    };
  }
}
