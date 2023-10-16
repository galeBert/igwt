import { create } from "zustand";

interface useAddContactStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
export const useAddContactModal = create<useAddContactStore>((set) => ({
  isOpen: false,
  onClose: (action?: () => void) => {
    action?.();
    return set({ isOpen: false });
  },
  onOpen: () => set({ isOpen: true }),
}));
