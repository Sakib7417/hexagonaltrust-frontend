import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  role: 'user' | 'admin' | null;
  isAuthenticated: boolean;
  login: (user: User, token: string, role: 'user' | 'admin') => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      login: (user, token, role) => {
        // Store token in cookie
        document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
        // Store role in cookie for middleware
        document.cookie = `role=${role}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
        set({ user, token, role, isAuthenticated: true });
      },
      logout: () => {
        // Clear token from cookie
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        // Clear role from cookie
        document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        set({ user: null, token: null, role: null, isAuthenticated: false });
      },
      updateUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
