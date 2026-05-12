import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '../types/auth';

// Helper to safely load state from localStorage
const loadPersistedState = (): Partial<AuthState> => {
  try {
    const serializedUser = localStorage.getItem('user');
    const serializedToken = localStorage.getItem('token');
    if (serializedUser === null || serializedToken === null) return {};
    return {
      user: JSON.parse(serializedUser),
      token: serializedToken,
      isAuthenticated: true
    };
  } catch (err) {
    return {};
  }
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  ...loadPersistedState()
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      
      // Persist to localStorage
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
  },
});

export const { setCredentials, logout, setLoading, setError, updateUser } = authSlice.actions;
export default authSlice.reducer;
