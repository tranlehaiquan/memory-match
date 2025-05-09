import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  username: string;
  highScore: number;
  login: (username: string) => void;
  logout: () => void;
  updateHighScore: (score: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      username: '',
      highScore: 0,
      login: (username: string) => set({ isAuthenticated: true, username }),
      logout: () => set({ isAuthenticated: false, username: '' }),
      updateHighScore: (score: number) =>
        set((state) => ({
          highScore: Math.max(state.highScore, score),
        })),
    }),
    {
      name: 'memory-match-auth',
    }
  )
); 