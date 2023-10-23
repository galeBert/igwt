"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TTransactionData } from "@/hooks/use-create-transaction";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";

interface CreatePaymentProps {
  userId?: string;
  bank?: string;
  data: TTransactionData;
}
const bankList = [
  {
    name: "BCA",
    value: "bca",
    imageeUrl:
      "https://baradesain.files.wordpress.com/2010/10/bca-bank-logo_logo-bagus-03.jpg",
  },
  {
    name: "BNI",
    value: "bni",
    imageeUrl:
      "https://pbs.twimg.com/profile_images/1623963744710832128/0AO3tjpL_400x400.png",
  },
  {
    name: "BRI",
    value: "bri",
    imageeUrl:
      "https://asset-2.tstatic.net/aceh/foto/bank/images/Logo-Bank-BRI-3.jpg",
  },
  {
    name: "MANDIRI",
    value: "mandiri",
    imageeUrl: "https://assets.dataindonesia.id/1638361092603_45_blob",
  },
];
export default function CreatePayment({ userId, data }: CreatePaymentProps) {
  const [bank, setBank] = useState("");
  const { user } = useUser();
  const isSender = data.userId === user?.id && data.role === "sender";

  return (
    <Select onValueChange={(e) => setBank(e)}>
      <SelectTrigger disabled={isSender || !user} className="w-[180px]">
        <SelectValue placeholder={isSender ? "not set" : "select bank..."} />
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
                    <AvatarFallback>{bank.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <p>{bank.name} </p>
                </div>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
