import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { authStorage } from '@/lib/auth-storage';

export type UserRole = 'STUDENT' | 'TEACHER';

export interface AuthUser {
  id: number;
  name: string;
  role: UserRole | string;
  job: string;
  avatar_url?: string | null;
  class?: string | null;
  classroomId?: number | null;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  isHydrated: boolean;
  login: (token: string, user: AuthUser) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
  setHydrated: (hydrated: boolean) => void;
}

const setAuthCookies = (token: string, role: string) => {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + 7 * 864e5).toUTCString();
  document.cookie = `accessToken=${encodeURIComponent(token)}; expires=${expires}; path=/; SameSite=Lax`;
  document.cookie = `seed_role=${encodeURIComponent(role)}; expires=${expires}; path=/; SameSite=Lax`;
};

const clearAuthCookies = () => {
  if (typeof document === 'undefined') return;
  document.cookie =
    'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
  document.cookie =
    'seed_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      isHydrated: false,

      login: (token: string, user: AuthUser) => {
        if (typeof window !== 'undefined') {
          authStorage.setItem('accessToken', token);
          setAuthCookies(token, user.role);
        }

        set({
          isAuthenticated: true,
          user,
          token,
        });
      },

      setUser: (user: AuthUser) =>
        set((state) => {
          if (state.token) {
            setAuthCookies(state.token, user.role);
          }
          return {
            user,
            isAuthenticated: true,
          };
        }),

      logout: () => {
        if (typeof window !== 'undefined') {
          authStorage.removeItem('accessToken');
          authStorage.removeItem('token');
          try {
            sessionStorage.removeItem('accessToken');
          } catch {
            /* Storage unavailable. */
          }
          clearAuthCookies();
        }
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        });
      },

      setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),
    }),
    {
      name: 'seed-auth-storage',
      storage: createJSONStorage(() => authStorage),
      skipHydration: true,
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    },
  ),
);
