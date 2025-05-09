import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  highScore: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string) => void;
  logout: () => void;
  updateHighScore: (score: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (username: string) => {
        const user: User = {
          id: crypto.randomUUID(),
          username,
          highScore: 0,
        };
        set({ user, isAuthenticated: true });
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      updateHighScore: (score: number) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, highScore: Math.max(state.user.highScore, score) }
            : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
); 