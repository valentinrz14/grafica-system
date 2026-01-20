import { UserRole } from '@prisma/client';

export interface CreateUserData {
  email: string;
  passwordHash?: string; // Optional for OAuth users
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  googleId?: string;
  oauthProvider?: string;
  profileComplete?: boolean;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileComplete?: boolean;
}
