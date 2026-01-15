export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setAuthData: (user: User, token: string) => void;
}
