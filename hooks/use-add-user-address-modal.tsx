import { create } from "zustand";

interface useAddUserAddresModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
export const useAddUserAddresModal = create<useAddUserAddresModalStore>(
  (set) => ({
    isOpen: false,
    onClose: () => set({ isOpen: false }),
    onOpen: () => set({ isOpen: true }),
  })
);
