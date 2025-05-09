import { create } from 'zustand';

interface TimerState {
  time: number;
  isRunning: boolean;
  startTime: number | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
  tick: () => void;
}

export const useTimerStore = create<TimerState>()((set) => ({
  time: 0,
  isRunning: false,
  startTime: null,
  start: () => set({ isRunning: true, startTime: Date.now() }),
  stop: () => set({ isRunning: false }),
  reset: () => set({ time: 0, isRunning: false, startTime: null }),
  tick: () => set((state) => ({ time: state.time + 1 })),
})); 