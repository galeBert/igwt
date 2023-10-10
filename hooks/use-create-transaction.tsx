import { create } from "zustand";

interface useCreateTransactionStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCreateTransactionModal = create<useCreateTransactionStore>(
  (set) => ({
    isOpen: false,
    onClose: () => set({ isOpen: false }),
    onOpen: () => set({ isOpen: true }),
  })
);
