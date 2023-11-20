import { create } from "zustand";

interface useAddUserAddresModalStore {
  balance: number;
  userId: string | null;
  setBalance: (amount: number) => void;
}
export const useUserData = create<useAddUserAddresModalStore>((set) => ({
  balance: 0,
  userId: null,
  setBalance: (amount: number) => set({ balance: amount }),
}));
