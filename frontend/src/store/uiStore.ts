import { create } from 'zustand';

interface UiStore {
  isSidebarOpen: boolean;
  isGlobalLoading: boolean;
  globalError: string | null;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setGlobalLoading: (loading: boolean) => void;
  setGlobalError: (error: string | null) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  isSidebarOpen: true,
  isGlobalLoading: false,
  globalError: null,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setGlobalLoading: (isGlobalLoading) => set({ isGlobalLoading }),
  setGlobalError: (globalError) => set({ globalError }),
}));
