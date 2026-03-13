export interface User {
  id?: string;
  name?: string;
  username?: string; // Add username from login
  email?: string;
  avatar?: string;
  accountId?: string; // Add this
  team?: string;
  phone?: string; // Add this
  role?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}
