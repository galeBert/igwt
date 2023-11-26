"use client";
import { getTransaction } from "@/actions/get-transaction";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUserData } from "@/hooks/useUserData";
import { axios } from "@/lib/axios";
import clsx from "clsx";
import moment from "moment";
import React from "react";
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
  const { userId } = useUserData();
  const { data, isLoading } = useSWR("single-transaction", () =>
    getTransaction(transactionId)
  );

  const isPackageArrived = data?.transaction_status?.status === "DONE";
  const transactionLimit = moment(data?.transaction_status?.expired_at).diff(
    Date.now()
  );

  const handleFinishTransaction = async () => {
    await axios.patch(`/api/transactions`, {
      transactionId,
      transaction_status: { status: "FINISHED" },
    });
    await axios.patch(`/api/transactions`, {
      transactionId,
      transaction_status: { status: "FINISHED" },
    });
    await axios.post(`/api/${data?.userId}/balance`, {
      transactionId,
      role: data?.role,
      amount: (data?.price ?? 0) + (data?.selectedShipper?.price ?? 0),
      from: data?.reciever?.email,
      to: data?.sender?.email,
      transactionUserId: data?.userId,
      type: "income",
      status: "DONE",
    });
  };

  if (!data && !isLoading) {
    return <p>transaction not found</p>;
  }
  //000 second 0 mean transaction status success,010 second 1 mean transaction pending,020 second 2 mean transaction fail
  //000 third 0 mean transaction type created, 1 means shippent, 2 means payment

  const status =
    data?.transaction_status?.status === "FINISHED"
      ? { message: "completed", status: "ok" }
      : data?.status === "000"
      ? { message: "transaction created", status: "ok" }
      : data?.status === "001"
      ? { message: "shipper selected", status: "ok" }
      : data?.status === "012"
      ? { message: "waiting payment to complete", status: "pending" }
      : data?.status === "002"
      ? { message: "payment complete", status: "ok" }
      : data?.status === "022"
      ? { message: "payment failed", status: "fail" }
      : data?.status === "003"
      ? { message: "ready for pickup", status: "ok" }
      : data?.status === "013"
      ? { message: "requesting pickup", status: "pending" }
      : data?.status === "023"
      ? { message: "pickup canceled", status: "fail" }
      : data?.status === "114"
      ? { message: "courier picking up", status: "pending" }
      : data?.status === "214"
      ? { message: "picked up", status: "pending" }
      : data?.status === "314"
      ? { message: "sending package", status: "pending" }
      : data?.status === "004"
      ? { message: "package send", status: "ok" }
      : { message: "transaction not found", status: "fail" };
  const isSender = data?.userId === userId && data?.role === "sender";

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
      <div className="flex flex-col h-fit w-full space-y-4">
        <div className="grid md:grid-cols-2 h-fit space-y-4 md:space-x-4">
          <StatusPage transactionId={transactionId} />
          <InfoPage transactionId={transactionId} />
        </div>

        <div className="flex space-x-2 ">
          <CreateShipper transactionId={transactionId} />
          <CreatePayment transactionId={transactionId} />
          <CreateProductDetail data={data} />

          {isPackageArrived && !isSender ? (
            <Countdown
              autoStart
              date={new Date(Date.now() + transactionLimit)}
              renderer={(count) => {
                setTimeout(() => {
                  count.api.start();
                }, 100);
                if (count.completed) {
                  // handleFinishTransaction();
                  return (
                    <Button onClick={handleFinishTransaction} className="!py-0">
                      Transaction Completed
                    </Button>
                  );
                }
                return (
                  <div className=" relative flex space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={handleFinishTransaction}>
                            Finish Transaction
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          this transaction will automaticly finish within 24
                          hours
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
          ) : null}
        </div>
      </div>
    </>
  );
}
