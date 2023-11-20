import { TTransactionData } from "@/hooks/use-create-transaction";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function createContact(url: any, { arg }: { arg: any }) {
  const transactionData = await fetch(`${baseUrl}${url}`, {
    method: "POST",
    body: JSON.stringify(arg),
  });
  const awaitedTransactionData: TTransactionData = await transactionData.json();

  return awaitedTransactionData;
}
