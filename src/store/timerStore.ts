import { create } from 'zustand';

interface TimerState {
  isRunning: boolean;
  elapsedTime: number;
  intervalId: number | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export const useTimerStore = create<TimerState>(set => ({
  isRunning: false,
  elapsedTime: 0,
  intervalId: null,
  start: () => {
    set(state => {
      if (state.isRunning) return state;

      const intervalId = window.setInterval(() => {
        set(state => ({
          elapsedTime: state.elapsedTime + 1,
        }));
      }, 1000);

      return {
        isRunning: true,
        intervalId,
      };
    });
  },
  stop: () => {
    set(state => {
      if (state.intervalId) {
        clearInterval(state.intervalId);
      }
      return {
        isRunning: false,
        intervalId: null,
      };
    });
  },
  reset: () => {
    set(state => {
      if (state.intervalId) {
        clearInterval(state.intervalId);
      }
      return {
        isRunning: false,
        elapsedTime: 0,
        intervalId: null,
      };
    });
  },
}));
