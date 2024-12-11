import { create } from 'zustand';

interface User {
  wallet: string;
  email: string;
  dnsNames: string[];
}

interface AppState {
  user: User | null;
  isConnected: boolean;
  setUser: (user: User | null) => void;
  setIsConnected: (status: boolean) => void;
  addDnsName: (name: string) => void;
  removeDnsName: (name: string) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  isConnected: false,
  setUser: (user) => set({ user }),
  setIsConnected: (status) => set({ isConnected: status }),
  addDnsName: (name) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, dnsNames: [...state.user.dnsNames, name] }
        : null,
    })),
  removeDnsName: (name) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            dnsNames: state.user.dnsNames.filter((n) => n !== name),
          }
        : null,
    })),
})); 