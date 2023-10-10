import { auth, currentUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";
import { create } from "zustand";

interface useCreateTransactionStore {
  user: User;
}

export const useUser = async () => {
  const userData = await currentUser();
  const translatedUserData = JSON.parse(JSON.stringify(userData));
  return create<useCreateTransactionStore>((set) => ({
    user: translatedUserData,
  }));
};
