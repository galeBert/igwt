"use client";
import AddUserAddresModal from "@/components/add-user-address-modal.tsx";
import { CashOutMoneyModal } from "@/components/cash-out-modal";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAddUserAddresModal } from "@/hooks/use-add-user-address-modal";
import {
  useCreateTransactionModal,
  UserData,
} from "@/hooks/use-create-transaction";
import { useUserData } from "@/hooks/useUserData";
import { formatter } from "@/lib/utils";
import axios from "axios";
import React from "react";
import FormStep from "./transaction-step/form-step";

interface MainCardProps {
  user: UserData;
  userId: string;
}
export default function MainCard({ user, userId }: MainCardProps) {
  const { onOpen } = useCreateTransactionModal();
  const { balance } = useUserData();
  const { onOpen: addAddressData } = useAddUserAddresModal();

  const handleCreateTransaction = () => {
    if (user.address_id) {
      return onOpen();
    }
    addAddressData();
  };

  return (
    <>
      <CardContent
        className={`backdrop-blur-sm  md:backdrop-blur-2xl relative w-full 
        md:w-fit
        md:m-5
        md:pb-0
        p-0
        rounded-lg`}
      >
        <div className="bg-white pointer-events-none absolute w-full h-full left-0 rounded-md opacity-5" />
        <CardHeader className="w-full">
          <CardTitle className="text-xl">Balance</CardTitle>

          <CardTitle>{formatter.format(balance)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 ">
          <CardDescription>What are you gonna do today?</CardDescription>
          <div className="space-x-3">
            <Button onClick={handleCreateTransaction}>Create new order</Button>
            <CashOutMoneyModal userId={userId} />
            <Button
              onClick={async () => {
                const transactionData = await axios.post(
                  `api/create-transaction-email`,
                  {
                    inviteLink: "https://google.com",
                    productName: "https://www.igwt.space/",
                    recieverEmail: "ggalilea007@gmail.com",
                    recieverName: "https://www.igwt.space/",
                    senderEmail: "ggalilea007@gmail.com",
                    senderName: "https://www.igwt.space/",
                    senderPhoto: "https://www.igwt.space/",
                  }
                );
                console.log(transactionData);
              }}
            >
              Send Email
            </Button>
          </div>
        </CardContent>
        <AddUserAddresModal onSubmit={() => {}} />
      </CardContent>
    </>
  );
}
