"use client";
import { getTransaction } from "@/actions/get-transaction";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Banknote, Copy, Plane, RefreshCw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useSWR from "swr";
import Countdown from "react-countdown";
import moment from "moment";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import clsx from "clsx";
import { Label } from "@/components/ui/label";

export default function InfoPage({ transactionId }: { transactionId: string }) {
  const {
    data: datas,
    error,
    isLoading,
    mutate,
  } = useSWR(`single-transaction`, () => getTransaction(transactionId));

  const onCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("text copied");
  };
  const momentObject = moment(datas?.payment?.expired_date);
  const unixTimestamp = momentObject.valueOf();
  const [start, setStart] = useState(false);
  useEffect(() => {
    if (datas?.payment) {
      setStart(true);
    }
  }, [datas?.payment]);

  useEffect(() => {
    if (start) {
      setTimeout(() => {
        setStart(false);
      }, 1000);
    }
  }, [start]);

  const shippingInfo = datas?.shipping_status ? (
    <Alert
      className={clsx(
        "transition-all relative   duration-500 !-translate-y-100",
        {
          "shadow-blue-400  ring-4 border-solid  ring-blue-400  translate-y-0  shadow-lg":
            start,
        }
      )}
    >
      <div className="flex justify-between">
        <div className="flex space-x-2 items-center">
          <div className="flex items-center space-x-2">
            <div>
              <Plane width={16} />
            </div>
            <AlertTitle className="m-0">Shipping Waybill</AlertTitle>
          </div>

          <Badge className="bg-green-400 py-0">
            {datas.shipping_status.status}
          </Badge>
        </div>
        <Button onClick={() => mutate()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <AlertDescription>
        {datas?.selectedShipper?.company.toUpperCase()}
      </AlertDescription>
      <AlertDescription className="mt-4 flex items-center space-x-2 justify-between">
        <code className="relative w-full rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {datas?.shipping_status.waybill_id}
        </code>
        <Button
          onClick={() =>
            onCopy(
              String(
                datas?.payment?.bill_payment.receiver_bank_account
                  .account_number
              ) ?? ""
            )
          }
          variant="outline"
          size="sm"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  ) : null;

  const paymentInfo = datas?.payment ? (
    <Alert
      className={clsx(
        "transition-all relative   duration-500 !-translate-y-100",
        {
          "shadow-blue-400  ring-4 border-solid  ring-blue-400  translate-y-0  shadow-lg":
            start,
        }
      )}
    >
      <div className="flex justify-between">
        <div className="flex space-x-2 items-center">
          <div className="flex items-center space-x-2">
            <div>
              <Banknote width={16} />
            </div>
            <AlertTitle className="m-0">VA Number</AlertTitle>
          </div>

          {datas?.payment?.bill_payment.status === "SUCCESSFUL" ? (
            <Badge className="bg-green-400 py-0">Paid</Badge>
          ) : (
            <Countdown
              autoStart
              date={new Date(unixTimestamp)}
              renderer={(count) => {
                setTimeout(() => {
                  count.api.start();
                }, 100);
                if (count.completed) {
                  return <Badge className="bg-red-300 !py-0">Expired</Badge>;
                }
                return (
                  <div className="flex space-x-2">
                    <Badge className="bg-yellow-300">
                      {datas?.payment?.status.toLowerCase()}
                    </Badge>

                    <Badge>
                      {count.hours}:{count.minutes}:{count.seconds}
                    </Badge>
                  </div>
                );
              }}
            ></Countdown>
          )}
        </div>
        <Button onClick={() => mutate()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <AlertDescription>
        {datas?.payment?.bill_payment.sender_bank.toUpperCase()}
      </AlertDescription>
      <AlertDescription className="mt-4 flex items-center space-x-2 justify-between">
        <code className="relative w-full rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {datas?.payment?.bill_payment.receiver_bank_account.account_number}
        </code>
        <Button
          onClick={() =>
            onCopy(
              String(
                datas?.payment?.bill_payment.receiver_bank_account
                  .account_number
              ) ?? ""
            )
          }
          variant="outline"
          size="sm"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  ) : null;
  const infoContent =
    datas?.payment || datas?.shipping_status ? (
      <>
        {shippingInfo}
        {paymentInfo}
      </>
    ) : (
      <div className="flex w-full my-auto h-full items-center justify-center">
        <Label>info about payment and shipping will appear here</Label>
      </div>
    );
  return (
    <Card className=" h-full w-full min-h-full p-5 px-0">
      <CardContent className="h-full space-y-2">
        <CardTitle>Info</CardTitle>
        <div className=" h-full space-y-2">{infoContent}</div>
      </CardContent>
    </Card>
  );
}
