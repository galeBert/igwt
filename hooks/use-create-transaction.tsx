import { AddressData } from "@/components/form/address-form";
import { ShippingAddressData, ShippingPriceListData } from "@/lib/types";
import { create } from "zustand";

interface useCreateTransactionStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  transaction: TTransactionData;
  setTransaction: (data: TTransactionData) => void;
}

export interface UserData extends AddressData {
  name: string;
}

export type TTransactionData = {
  id?: string;
  role?: "sender" | "reciever";
  link?: string;
  sender?: UserData;
  reciever?: UserData;
  price?: number;
  total_price?: number;
  shipping?: {
    success: boolean;
    object: string;
    message: string;
    code: number;
    origin: ShippingAddressData;
    destination: ShippingAddressData;
    pricing: ShippingPriceListData[];
  };
  bank?: string;
  status?: string;
  package_detail?: {
    name: string;
    height: number;
    weight: number;
    description?: string;
  };
  userId?: string;
};

export const useCreateTransactionModal = create<useCreateTransactionStore>(
  (set) => ({
    isOpen: false,
    transaction: {
      price: 0,
      package_detail: { height: 0, weight: 0, name: "", description: "" },
    },
    setTransaction: (data: TTransactionData) =>
      set((state) => ({
        transaction: { ...state.transaction, ...data },
      })),
    onClose: () => set({ isOpen: false }),
    onOpen: () => set({ isOpen: true }),
  })
);
