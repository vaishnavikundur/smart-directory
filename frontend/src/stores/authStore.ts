import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { authApi } from '@/api/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updatePreferences: (prefs: User['preferences']) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken) =>
        set({
          user,
          accessToken,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        }),

      checkAuth: async () => {
        const { accessToken } = get();
        if (!accessToken) {
          set({ isAuthenticated: false, user: null, accessToken: null });
          return;
        }
        try {
          const response = await authApi.refreshToken();
          set({
            user: response.user,
            accessToken: response.accessToken,
            isAuthenticated: true,
          });
        } catch {
          set({ isAuthenticated: false, user: null, accessToken: null });
        }
      },

      updatePreferences: (prefs) =>
        set((state) => ({
          user: state.user ? { ...state.user, preferences: prefs } : null,
        })),
    }),
    {
      name: 'contactflow-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
