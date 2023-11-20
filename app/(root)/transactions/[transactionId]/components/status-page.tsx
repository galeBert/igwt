"use client";
import { getTransaction } from "@/actions/get-transaction";
import AvatarDetails from "@/app/(root)/components/avatar-details";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
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
      <CardContent className="">
        <div className="flex p-2 py-5 w-full justify-center items-center space-x-6">
          {data?.sender && data?.reciever ? (
            <>
              <AvatarDetails badge="sender" userData={data?.sender} />

              <ArrowRightIcon />
              <AvatarDetails badge="reciever" userData={data?.reciever} />
            </>
          ) : null}
        </div>
        <Card className="p-2 w-full flex flex-col space-y-2 justify-between">
          <div className="flex justify-between items-end">
            <CardDescription>Package:</CardDescription>
            {data?.package_detail?.name ? (
              <Label>{data?.package_detail?.name}</Label>
            ) : (
              <Link href={data?.link ?? ""}>{data?.link}</Link>
            )}
          </div>
          <div className="flex justify-between">
            <CardDescription>Shipper:</CardDescription>
            <Label>
              {data?.selectedShipper
                ? data?.selectedShipper.company.toUpperCase()
                : "not set"}
            </Label>
          </div>
          <div className="flex justify-between">
            <CardDescription>Payment:</CardDescription>

            <Label>
              {data?.payment
                ? data?.payment?.bill_payment.sender_bank.toUpperCase()
                : "not set"}
            </Label>
          </div>
          <div className="flex justify-between">
            <CardDescription>Payment Status:</CardDescription>

            <Label>
              {data?.payment ? data?.payment?.bill_payment.status : "not set"}
            </Label>
          </div>
          <Separator />
          <div className="flex justify-between">
            <CardDescription>Shipping Price:</CardDescription>
            <Label>
              {data?.selectedShipper?.price
                ? `Rp.${data?.selectedShipper?.price}`
                : "(not set) Rp.0"}
            </Label>
          </div>
          <div className="flex justify-between">
            <CardDescription> Price:</CardDescription>
            <Label>
              {data?.price ? `Rp.${data?.price}` : "(not set) Rp.0"}
            </Label>
          </div>
          <div className="flex justify-between">
            <CardDescription>Total Transaction:</CardDescription>
            <Label className="text-lg">
              Rp.
              {Number(data?.price ?? 0) +
                Number(data?.selectedShipper?.price ?? 0)}
            </Label>
          </div>
        </Card>
      </CardContent>
    </Card>
  );
}
