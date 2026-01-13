import { UserRole } from '@prisma/client';

export interface CreateUserData {
  email: string;
  passwordHash: string;
  role: UserRole;
}
