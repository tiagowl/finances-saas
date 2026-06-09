import { create } from 'zustand';
import { authApi } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { user, token } = await authApi.login(email, password);
      localStorage.setItem('finances_token', token);
      localStorage.setItem('finances_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const { user, token } = await authApi.register(name, email, password);
      localStorage.setItem('finances_token', token);
      localStorage.setItem('finances_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('finances_token');
    localStorage.removeItem('finances_user');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  initialize: () => {
    const token = localStorage.getItem('finances_token');
    const userStr = localStorage.getItem('finances_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem('finances_token');
        localStorage.removeItem('finances_user');
      }
    }
  },
}));
