import { getTransaction } from "@/actions/get-transaction";
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import React from "react";
import CreatePayment from "./components/create-payment";
import CreateProductDetail from "./components/create-product-detail";
import CreateShipper from "./components/create-shipper";
import StatusPage from "./components/status-page";
import InfoPage from "./components/info-page";
import TransactionPage from "./components/transaction-page";

export const revalidate = 0;

export default async function page({
  params,
}: {
  params: { transactionId: string };
}) {
  const data = await getTransaction(params.transactionId);

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <CardTitle>Detail Transaction</CardTitle>
        <Badge className="bg-yellow-400">Waiting for approval</Badge>
      </div>

      <div className="flex flex-col w-full space-y-4">
        <div className="flex space-x-4">
          <StatusPage transactionId={params.transactionId} />
          <InfoPage transactionId={params.transactionId} />
        </div>

        <div className="flex space-x-2 ">
          <CreateShipper transactionId={params.transactionId} data={data} />
          <CreatePayment transactionId={params.transactionId} />
          <CreateProductDetail data={data} />
        </div>
      </div>
      <TransactionPage />
    </div>
  );
}
