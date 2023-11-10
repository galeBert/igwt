import { getTransaction } from "@/actions/get-transaction";
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import React from "react";
import TransactionPage from "./components/transaction-page";
import SingleTransaction from "./components/single-transacton";

export const revalidate = 0;

export default async function page({
  params,
}: {
  params: { transactionId: string };
}) {
  return (
    <div className="space-y-3">
      <SingleTransaction transactionId={params.transactionId} />

      <TransactionPage />
    </div>
  );
}
