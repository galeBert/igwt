import { TTransactionData } from "@/hooks/use-create-transaction";
import { db } from "@/lib/firebase";
import axios from "axios";
import { doc, onSnapshot } from "firebase/firestore";

const url = process.env.NEXT_PUBLIC_API_URL;

export const getTransaction = async (transactionId: string) => {
  const transactionData = await axios.get(
    `${url}/api/transaction/${transactionId}`
  );
  const awaitedTransactionData: TTransactionData = transactionData.data;

  return awaitedTransactionData;
};
