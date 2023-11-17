import { create } from "zustand";

interface useAddUserAddresModalStore {
  balance: number;
  setBalance: (amount: number) => void;
}
export const useUserData = create<useAddUserAddresModalStore>((set) => ({
  balance: 0,
  setBalance: (amount: number) => set({ balance: amount }),
}));
