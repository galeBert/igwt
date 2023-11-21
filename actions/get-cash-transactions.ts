import { CashTransactionData } from "@/hooks/use-create-transaction";
import axios from "axios";

const url = process.env.NEXT_PUBLIC_API_URL;

export const getCashTransactions = async (userId: string) => {
  const userData = await axios.get(`${url}/api/cash-out/${userId}`);
  const awaitedUserData: CashTransactionData[] = userData.data;

  return awaitedUserData;
};
