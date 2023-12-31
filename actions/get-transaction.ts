import { TTransactionData } from "@/hooks/use-create-transaction";

const url = process.env.NEXT_PUBLIC_API_URL;

export const getTransaction = async (transactionId: string) => {
  const transactionData = await fetch(
    `${url}/api/transaction/${transactionId}`,
    {
      method: "GET",
      cache: "no-cache",
    }
  );
  const awaitedTransactionData: TTransactionData = await transactionData.json();

  return awaitedTransactionData;
};
