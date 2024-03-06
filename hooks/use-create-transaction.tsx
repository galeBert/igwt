import { AddressData } from "@/components/form/address-form";
import {
  PricingList,
  ShippingAddressData,
  ShippingPriceListData,
} from "@/lib/types";
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
  email: string;
  balance: number;
  userId: string;
}
export type CashTransactionData = {
  amount: number;
  from: string;
  id: string;
  status: string;
  to: string;
  transactionId: string;
  type: string;
};
export type TTransactionData = {
  notReadBy?: string[];
  id?: string;
  role?: "sender" | "reciever";
  link?: string;
  sender?: UserData;
  reciever?: UserData;
  price?: number;
  total_price?: number;
  payment?: {
    expired_date: string;
    amount: number;
    link_id: number;
    bill_payment: {
      amount: number;
      sender_bank: string;

      receiver_bank_account: {
        account_number: number;
      };
      status: string;
    };
    status: string;
  };
  shipping?: {
    success: boolean;
    object: string;
    message: string;
    code: number;
    origin: ShippingAddressData;
    destination: ShippingAddressData;
    pricing: PricingList[];
    shipping_type?: string;
  };
  shipping_status?: { waybill_id: string; status: string };
  selectedShipper?: ShippingPriceListData;
  bank?: string;
  status?: string;
  package_detail?: {
    name: string;
    height: number;
    weight: number;
    description?: string;
  };
  userId?: string;
  transaction_status?: {
    status: string;
    expired_at: string;
  };
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
