"use client";
import { getTransaction } from "@/actions/get-transaction";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Plane, RefreshCw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useSWR from "swr";
import Countdown from "react-countdown";
import moment from "moment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Info</CardTitle>
      </CardHeader>
      <CardContent className="flex space-y-3 w-full flex-col">
        <Alert>
          <Plane className="h-4 w-4" />
          <AlertTitle className="flex items-center gap-x-2">
            Nomor resi
          </AlertTitle>
          <AlertDescription className="mt-4 flex items-center space-x-2 justify-between">
            <code className="relative w-full rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              Adijoirvmrm123213
            </code>
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
        <Alert>
          <Plane className="h-4 w-4" />
          <div className="flex  justify-between">
            <div className="flex space-x-2 w-full">
              <AlertTitle className="flex items-center gap-x-2">
                VA Number
              </AlertTitle>

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
                    return (
                      <div className="flex space-x-2">
                        <Badge className="bg-yellow-300">
                          {datas?.payment?.status.toLowerCase()}
                        </Badge>
                        <Badge color="red">
                          {count.hours}:{count.minutes}:{count.seconds}
                        </Badge>
                      </div>
                    );
                  }}
                >
                  <Badge className="bg-red-300">expired</Badge>
                </Countdown>
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
              {
                datas?.payment?.bill_payment.receiver_bank_account
                  .account_number
              }
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
      </CardContent>
    </Card>
  );
}
