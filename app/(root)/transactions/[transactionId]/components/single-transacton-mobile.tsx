"use client";
import { getTransaction } from "@/actions/get-transaction";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { cn } from "@/lib/utils";
import { ArrowLeftRight, CreditCard, Info, Plane } from "lucide-react";
import moment from "moment";
import React from "react";
import useSWR from "swr";
import InfoPage from "./info-page";

interface SingleTransactionProps {
  transactionId: string;
}
export default function SingleTransactionMobile({
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
      <div className=" z-0 w-full fixed top-20 pb-3 inset-x-0">
        <div className=" mx-auto px-4">
          <Accordion
            className="w-full"
            defaultValue="item-1"
            type="single"
            collapsible
          >
            <AccordionItem className="w-full backdrop-blur-lg" value="item-1">
              <AccordionTrigger
                title="no-icon"
                className={cn(
                  " p-4 w-full z-[1] text-white backdrop-blur-xl dark:via-[#EC458D] dark:via-50% dark:to-[#FFF1BF] bg-gradient-to-r dark:from-0% from-40% via-sky-500 via-60% to-transparent   !no-underline normal-case  rounded-xl ",
                  {
                    "from-indigo-500 dark:from-[#474ED7]":
                      status.status === "ok",
                    "bg-yellow-400": status.status === "pending",
                    "bg-red-400": status.status === "fail",
                  }
                )}
              >
                <div className="flex relative flex-col space-y-3 justify-start w-full items-start">
                  <div className="flex items-start flex-col">
                    <h1 className="text-sm font-light">Transaction</h1>
                    <h2 className="text-xl font-semibold">
                      {data?.package_detail?.name ?? ""}
                    </h2>
                  </div>
                  <div className="absolute right-0 -top-3">
                    <Badge>{status.message}</Badge>
                  </div>
                  {/* <Link
                      target="_blank"
                      className="border w-full text-sm font-light truncate border-white p-1 px-4  border-solid rounded-lg"
                      href={data?.link ?? ""}
                    >
                      {data?.link}
                    </Link> */}
                </div>
              </AccordionTrigger>
              <AccordionContent
                className={cn(
                  " px-4 relative backdrop-blur-xl  pt-4 w-full h-full bg-opacity-50 border-t-0 border -translate-y-2  rounded-b-xl text-center "
                )}
              >
                <div className="pt-1 h-full backdrop-blur-xl space-y-4">
                  <div className="flex justify-between">
                    <div className=" flex items-center space-x-3 p-2">
                      <div className="text-left">
                        <h1 className="text-xs font-light"> Sender</h1>
                        <h1 className="text-lg font-medium">
                          {data?.sender?.name}
                        </h1>
                      </div>
                      <div className="w-6 h-6 bg-black flex items-center justify-center dark:fill-black  dark:bg-white rounded-full">
                        <ArrowLeftRight
                          className="dark:text-black text-white"
                          width={12}
                        />
                      </div>

                      <div className="text-left">
                        <h1 className="text-xs text font-light"> Reciever</h1>
                        <h1 className="text-lg font-medium">
                          {data?.reciever?.name}
                        </h1>
                      </div>
                    </div>
                    <div></div>
                  </div>
                  <div className="grid grid-cols-12 space-x-2">
                    <div className=" col-span-7 text-left p-2 rounded-lg flex-1 flex flex-col justify-between h-full border dark:bg-black">
                      <h3 className="text-xs font-normal">Total Price</h3>
                      <div>
                        {data?.selectedShipper?.price ? (
                          <h1 className="text-xs text-green-500">
                            +{data?.selectedShipper.price} (shipping)
                          </h1>
                        ) : null}
                        <h1 className="text-2xl font-bold">
                          Rp.
                          {Number(data?.price ?? 0) +
                            Number(data?.selectedShipper?.price ?? 0)}
                        </h1>
                      </div>
                    </div>
                    <div className="text-left col-span-5 space-y-2 p-2 rounded-lg h-full border dark:bg-black">
                      <div className="flex space-x-2 ">
                        <div className=" flex items-center justify-center  ">
                          <div
                            className={cn(
                              " bg-yellow-500 px-2 py-1 rounded-lg",
                              {
                                "bg-green-400": data?.selectedShipper,
                              }
                            )}
                          >
                            <Plane width={16} />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold">
                            Shipping
                          </span>
                          <span className="text-xs font-light">
                            {data?.selectedShipper?.company ?? "not set"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-row space-x-2 ">
                        <div className=" flex items-center justify-center  ">
                          <div
                            className={cn(
                              " bg-yellow-500 px-2 py-1 rounded-lg",
                              {
                                "bg-green-400": data?.payment,
                              }
                            )}
                          >
                            <CreditCard width={16} />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold">Payment</span>
                          <span className="text-xs font-light">
                            {data?.payment
                              ? data?.payment?.bill_payment.sender_bank.toUpperCase()
                              : "not set"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              className="w-full !pb-0 backdrop-blur-lg"
              value="item-2"
            >
              <AccordionTrigger
                title="no-icon"
                className={cn(
                  " p-4 w-full text-white !no-underline normal-case rounded-xl "
                )}
              >
                <div className="flex items-center space-x-2">
                  <Info width={20} />
                  <h1>Info</h1>
                </div>
              </AccordionTrigger>
              <AccordionContent
                className={cn(
                  " relative backdrop-blur-xl w-full h-full bg-opacity-50 border-t-0  -translate-y-2  rounded-b-xl text-center "
                )}
              >
                <InfoPage transactionId={transactionId} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </>
  );
}
