const url = process.env.NEXT_PUBLIC_API_URL;

export interface GetTransactionLogProps {
  createdAt: string;
  description: string;
  role: "sender" | "reciever";
  status: string;
  userId: string;
}
export const getTransactionLog = async (transactionId: string) => {
  const transactionData = await fetch(
    `${url}/api/transaction/${transactionId}/transaction-log`,
    {
      method: "GET",
    }
  );
  const awaitedtransactionLog: GetTransactionLogProps[] =
    await transactionData.json();

  if (awaitedtransactionLog) {
    return awaitedtransactionLog;
  }
  return [];
};
