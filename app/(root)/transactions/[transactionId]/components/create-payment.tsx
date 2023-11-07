"use client";
import { createPaymentGateway } from "@/actions/create-payment-gateway";
import { getTransaction } from "@/actions/get-transaction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TTransactionData } from "@/hooks/use-create-transaction";
import { bankList } from "@/lib/bank-list";
import { oneHourfromNowFlipFormat } from "@/lib/helpers";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

interface CreatePaymentProps {
  transactionId: string;
  bank?: string;
}

export default function CreatePayment({ transactionId }: CreatePaymentProps) {
  const { data, error, isLoading, mutate } = useSWR(`single-transaction`, () =>
    getTransaction(transactionId)
  );
  const [bank, setBank] = useState("");
  const [link, setLink] = useState("");
  const { user } = useUser();
  const isSender = data?.userId === user?.id && data?.role === "sender";
  const totalPrice = data?.selectedShipper?.price ?? 0 + (data?.price ?? 0);

  const handleClick = async () => {
    if (transactionId) {
      await createPaymentGateway({
        amount: 10002,
        bank: "bca",
        name: "abert",
        title: "jual sapi",
        transactionId,
      });

      await axios.post(`/api/transaction/${transactionId}/transaction-log`, {
        role: data?.role,
        description: `selected payment to bca `,
        status: "waiting payment to complete",
      });
      mutate();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Set Payment</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Payment</DialogTitle>
          <DialogDescription>
            Choose one of this payment service
          </DialogDescription>
        </DialogHeader>
        <Card>
          <CardContent className="space-y-6">
            <div className="flex flex-col space-y-2 py-2">
              <Label className="text-lg">Bank</Label>
              <Select onValueChange={(e) => setBank(e)}>
                <SelectTrigger
                  disabled={isSender || !user}
                  className="w-[180px]"
                >
                  <SelectValue
                    placeholder={isSender ? "not set" : "select bank..."}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Bank</SelectLabel>
                    {bankList.map((bank, key) => {
                      return (
                        <SelectItem
                          className="flex space-x-1 items-center"
                          key={key}
                          value={bank.value}
                        >
                          <div className="flex items-center space-x-1">
                            <Avatar className="w-6 h-6">
                              <AvatarImage
                                sizes="sm"
                                src={bank.imageeUrl}
                                alt={bank.value}
                              />
                              <AvatarFallback>
                                {bank.name.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <p>{bank.name} </p>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <Label className="text-xl">Summary</Label>
              <div className="flex justify-between">
                <Label>Price</Label>
                <Label>Rp.{data?.price}</Label>
              </div>
              <div className="flex justify-between">
                <Label>Shipping</Label>
                <Label>Rp.{data?.selectedShipper?.price}</Label>
              </div>
              <Separator />
              <div className="flex justify-between">
                <Label className="text-2xl">Total Price</Label>
                <Label>Rp.{totalPrice}</Label>
              </div>
            </div>
            <Button onClick={handleClick}>Generate Virtual Account</Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
