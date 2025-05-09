import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PlayRecord } from '../types/game';

interface RecordsState {
  records: PlayRecord[];
  addRecord: (record: Omit<PlayRecord, 'id' | 'completedAt'>) => void;
  clearRecords: () => void;
  getPlayerBestScore: (playerName: string) => number;
}

export const useRecordsStore = create<RecordsState>()(
  persist(
    (set, get) => ({
      records: [],
      addRecord: record => {
        const newRecord: PlayRecord = {
          ...record,
          id: crypto.randomUUID(),
          completedAt: new Date().toISOString(),
        };
        set(state => ({
          records: [newRecord, ...state.records].slice(0, 10), // Keep only top 10 records
        }));
      },
      clearRecords: () => set({ records: [] }),
      getPlayerBestScore: playerName => {
        const playerRecords = get().records.filter(
          record => record.playerName === playerName && record.won
        );
        if (playerRecords.length === 0) return 0;
        return Math.max(...playerRecords.map(record => record.score));
      },
    }),
    {
      name: 'memory-match-records',
    }
  )
);
