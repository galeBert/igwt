"use client";
import { getTransaction } from "@/actions/get-transaction";
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import clsx from "clsx";
import React from "react";
import useSWR from "swr";
import CreatePayment from "./create-payment";
import CreateProductDetail from "./create-product-detail";
import CreateShipper from "./create-shipper";
import InfoPage from "./info-page";
import StatusPage from "./status-page";

interface SingleTransactionProps {
  transactionId: string;
}
export default function SingleTransaction({
  transactionId,
}: SingleTransactionProps) {
  const { data, isLoading } = useSWR("single-transaction", () =>
    getTransaction(transactionId)
  );
  if (isLoading) {
    return <p>loading...</p>;
  }
  if (!data) {
    return <p>transaction not found</p>;
  }

  const status =
    data.status === "000"
      ? { message: "transaction created", status: "ok" }
      : data.status === "001"
      ? { message: "shipper selected", status: "ok" }
      : data.status === "011"
      ? { message: "waiting payment to complete", status: "pending" }
      : { message: "transaction not found", status: "fail" };
  return (
    <>
      <div className="flex space-x-2">
        <CardTitle>Detail Transaction</CardTitle>
        <Badge
          className={clsx({
            "bg-green-400": status.status === "ok",
            "bg-yellow-400": status.status === "pending",
            "bg-red-400": status.status === "fail",
          })}
        >
          {status.message}
        </Badge>
      </div>
      <div className="flex flex-col w-full space-y-4">
        <div className="grid grid-cols-2 space-x-4">
          <StatusPage transactionId={transactionId} />
          <InfoPage transactionId={transactionId} />
        </div>

        <div className="flex space-x-2 ">
          <CreateShipper transactionId={transactionId} data={data} />
          <CreatePayment transactionId={transactionId} />
          <CreateProductDetail data={data} />
        </div>
      </div>
    </>
  );
}
