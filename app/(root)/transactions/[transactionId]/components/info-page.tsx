"use client";
import { getTransaction } from "@/actions/get-transaction";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Banknote, Copy, Plane, RefreshCw, Terminal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useSWR from "swr";
import Countdown from "react-countdown";
import moment from "moment";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
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
        "backdrop-blur-xl w-fit bg-white bg-opacity-20  dark:bg-opacity-5   border-none transition-all relative   duration-500 !-translate-y-100",
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
        "backdrop-blur-xl bg-white bg-opacity-20  dark:bg-opacity-5   border-none transition-all relative   duration-500 !-translate-y-100",
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
        <code className="relative w-full rounded dark:bg-black bg-white backdrop-blur-2xl bg-opacity-80 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
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
      <div className="flex bg-cover w-full my-auto h-full items-center justify-center">
        <Alert className="backdrop-blur-xl bg-white bg-opacity-20  dark:bg-opacity-5  border-none">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            info about payment and shipping will appear here
          </AlertDescription>
        </Alert>
      </div>
    );
  return (
    <Card
      className={`
       relative bg-cover w-full p-5 px-0
      dark:bg-[url('https://firebasestorage.googleapis.com/v0/b/igwt-3b1a7.appspot.com/o/dark-mode-mono-rezise.png?alt=media&token=299e2672-99a0-498d-b1c3-d1a235b4c5ab&_gl=1*c8fozh*_ga*NTY0Mjc2NzI5LjE2OTU1NjQzNDg.*_ga_CW55HF8NVT*MTY5OTYwNDkyMS42MS4xLjE2OTk2MDU4NzguNTIuMC4w')] 
      bg-[url('https://firebasestorage.googleapis.com/v0/b/igwt-3b1a7.appspot.com/o/light-mode-mono-resize.png?alt=media&token=43cbdf53-10d9-47c4-b987-f67f997aec11&_gl=1*fqouxe*_ga*NTY0Mjc2NzI5LjE2OTU1NjQzNDg.*_ga_CW55HF8NVT*MTY5OTYwNDkyMS42MS4xLjE2OTk2MDYxODkuNDguMC4w')] 
      `}
    >
      <div
        className={clsx(" w-full h-full absolute top-0", {
          "": !datas?.payment,
        })}
      />
      <CardContent className="h-full space-y-2  ">
        <div className=" h-full z-10 relative space-y-2">{infoContent}</div>
      </CardContent>
    </Card>
  );
}
