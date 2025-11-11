export type UserRole = 'Admin' | 'Manager';

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
}
