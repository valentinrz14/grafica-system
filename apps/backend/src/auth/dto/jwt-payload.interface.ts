export interface JwtPayload {
  sub: string; // User ID
  email: string;
  role: string;
  firstName?: string; // User first name for personalization
  profileComplete: boolean; // Whether user has completed profile
  iat?: number; // Issued at
  exp?: number; // Expiration
}
