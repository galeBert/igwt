import { AddressData } from "@/components/form/address-form";
import { TTransactionData } from "@/hooks/use-create-transaction";
import axios from "axios";

const url = process.env.NEXT_PUBLIC_API_URL;

export const getTransactions = async (userId: string) => {
  const userData = await axios.get(`${url}/api/transactions/${userId}`);
  const awaitedUserData: TTransactionData[] = userData.data;

  return awaitedUserData;
};
