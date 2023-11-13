"use client";
import { getTransaction } from "@/actions/get-transaction";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import clsx from "clsx";
import { ArrowDown } from "lucide-react";
import React, { useEffect } from "react";
import Countdown from "react-countdown";
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

  const limit = new Date(Date.now() + 5000).getTime() - Date.now();
  console.log(limit);

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log("hai", limit);
  //   }, limit);
  // }, [limit]);

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
      ? { message: "ready for pickup", status: "ok" }
      : data.status === "013"
      ? { message: "requesting pickup", status: "pending" }
      : data.status === "023"
      ? { message: "pickup canceled", status: "fail" }
      : data.status === "114"
      ? { message: "courier picking up", status: "pending" }
      : data.status === "214"
      ? { message: "picked up", status: "pending" }
      : data.status === "314"
      ? { message: "sending package", status: "pending" }
      : data.status === "004"
      ? { message: "package send", status: "ok" }
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

          <Countdown
            autoStart
            date={new Date(Date.now() + 5000)}
            renderer={(count) => {
              setTimeout(() => {
                count.api.start();
              }, 100);
              if (count.completed) {
                return <Badge className="bg-red-300 !py-0">Expired</Badge>;
              }
              return (
                <div className=" relative flex space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button>Finish Transaction</Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        this transaction will automaticly finish within 24 hours
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Badge>
                    {count.hours}:{count.minutes}:{count.seconds}
                  </Badge>
                </div>
              );
            }}
          ></Countdown>
        </div>
      </div>
    </>
  );
}
