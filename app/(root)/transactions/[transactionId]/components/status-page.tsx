"use client";
import { getTransaction } from "@/actions/get-transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import React from "react";
import useSWR from "swr";

interface StatusPageInterface {
  transactionId: string;
}
export default function StatusPage({ transactionId }: StatusPageInterface) {
  const { data, error, isLoading } = useSWR(`single-transaction`, () =>
    getTransaction(transactionId)
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Status</CardTitle>
      </CardHeader>
      <CardContent className="space-x-6 grid grid-cols-2">
        <div className="flex flex-col space-y-4 justify-between">
          <div className="flex space-x-2">
            <Label>Shipping:</Label>
            <div className="flex flex-col ">
              <Label className="italic text-sm">
                {data?.selectedShipper?.courier_name ?? "not set"}
              </Label>
              <Label className="text-xs font-light">
                {data?.selectedShipper?.service_type ?? "not set"}
              </Label>
              <Label className="text-xs font-light">
                {data?.selectedShipper?.duration ?? "not set"}
              </Label>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Payment:</Label>
            <Label className="italic text-sm">test</Label>
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Total Price:</Label>
            <Label className="italic text-sm">
              {data?.price ? `Rp.${data.price}` : "not set"}
            </Label>
          </div>
        </div>
        <div className="flex flex-col space-y-4 justify-between">
          <div className="flex flex-col space-y-2">
            <Label>Package Name:</Label>
            <Label className="italic text-sm">not set</Label>
          </div>
          <div className="flex flex-col space-y-2">
            <Label>Sender:</Label>
            <Label className="italic text-sm">not set</Label>
          </div>
          <div className="flex flex-col space-y-2">
            <Label>Reciever:</Label>
            <Label className="italic text-sm">Rp.10.000</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
