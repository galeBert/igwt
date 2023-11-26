import { getTransaction } from "@/actions/get-transaction";
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import React from "react";
import TransactionPage from "./components/transaction-page";
import SingleTransaction from "./components/single-transacton";
import SingleTransactionMobile from "./components/single-transacton-mobile";

export const revalidate = 0;

export default async function page({
  params,
}: {
  params: { transactionId: string };
}) {
  return (
    <div className="space-y-3">
      <div className="block: md:hidden">
        <SingleTransactionMobile transactionId={params.transactionId} />
      </div>
      <div className="hidden md:block">
        <SingleTransaction transactionId={params.transactionId} />
      </div>

      <TransactionPage />
    </div>
  );
}
