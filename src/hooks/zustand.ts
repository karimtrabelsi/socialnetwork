import { create } from "zustand";

interface storeState {
  isUpdate: boolean;
  setIsUpdate: (isUpdate: boolean) => void;
}

export const useMyStore = create<storeState>((set) => ({
  isUpdate: false,
  setIsUpdate: (by) => set((state) => ({ isUpdate: by })),
}));
