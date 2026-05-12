export type UserRole = 'customer' | 'vendor' | 'admin' | 'superAdmin';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  name?: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  isActive?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
