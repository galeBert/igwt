import { TTransactionData } from "@/hooks/use-create-transaction";

const url = process.env.NEXT_PUBLIC_API_URL;

export const selectShipper = async (transactionId: string) => {
  const transactionData = await fetch(
    `${url}/api/transaction/${transactionId}`,
    {
      method: "PATCH",
    }
  );
  const awaitedTransactionData: TTransactionData = await transactionData.json();

  return awaitedTransactionData;
};
