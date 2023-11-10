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
  //000 second 0 mean transaction status success,010 second 1 mean transaction pending,020 second 2 mean transaction fail
  //000 third 0 mean transaction type created, 1 means shippent, 2 means payment
  const status =
    data.status === "000"
      ? { message: "transaction created", status: "ok" }
      : data.status === "001"
      ? { message: "shipper selected", status: "ok" }
      : data.status === "012"
      ? { message: "waiting payment to complete", status: "pending" }
      : data.status === "002"
      ? { message: "payment complete", status: "ok" }
      : data.status === "022"
      ? { message: "payment failed", status: "fail" }
      : data.status === "003"
      ? { message: "package is picked up", status: "ok" }
      : data.status === "013"
      ? { message: "waiting courier to pickup", status: "pending" }
      : data.status === "023"
      ? { message: "pickup canceled", status: "fail" }
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
