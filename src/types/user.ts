export interface User {
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  avatar?: string;
  accountId?: string; 
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
