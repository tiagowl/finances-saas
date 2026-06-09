import { create } from 'zustand';

interface ApiState {
  wakingUp: boolean;
  wakeAttempt: number;
  setWakingUp: (wakingUp: boolean, wakeAttempt?: number) => void;
}

export const useApiStore = create<ApiState>((set) => ({
  wakingUp: false,
  wakeAttempt: 0,
  setWakingUp: (wakingUp, wakeAttempt = 0) => set({ wakingUp, wakeAttempt }),
}));
