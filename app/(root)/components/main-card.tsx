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
import Modal from "@/components/ui/modal";
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
          <button
            onClick={() => {
              axios
                .post(
                  "/api/firebase/verify",
                  {},
                  {
                    headers: {
                      Authorization:
                        "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXYiOiJkdmJfMlhaOExseDJNZzRZd1Zta1NSWUxha3lvZWduIiwiaWQiOiJjbGllbnRfMllpaGNFNnhlc2hBcUZnSHozcGxMWXRQWWVPIiwicm90YXRpbmdfdG9rZW4iOiJ0bjlleW8zOXQ0NDhhbXl6czh1cmtlaDNjMjl0MXNtcmpvcTcwNDg2In0.KgeJKRiDudUMhGJBUKCnE3lOhyjqmcGHYYBdRiIleqVwQU9f6GBxPwomYNEu5scx_4t_Krx0ANZE2BmUNA-ydPSiw2AKhxyBLrSNoG1nMm5nKXZ0ZyNFRFxhGF5B80qrVWa2btzMa5StXUY3J2wx3bJ-vYc0vOu9t1kIVELdPWG0QXqP4fxUN93XtiIpAvqmLfWcmMSOj8HtvnGG0mzdJvhXvv-a4F-EghiUl7iFtoy7KwrlyZWz9s9-cdFGc9vqR9pCaiT90ft6KllWm8AKL07AKlIpwIXeiaOut7bVafvx4Xq9gNO_sEIBCa6qslqODbny1JAlCx00ry4j21EVFw",
                    },
                  }
                )
                .then((data) => console.log("asdasdsa", data));
            }}
          >
            test 1231231
          </button>
          <CardTitle>{formatter.format(balance)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 ">
          <CardDescription>What are you gonna do today?</CardDescription>
          <div className="space-x-3">
            <Button onClick={handleCreateTransaction}>Create new order</Button>
            <CashOutMoneyModal userId={userId} />
          </div>
        </CardContent>
        <AddUserAddresModal onSubmit={() => {}} />
      </CardContent>
    </>
  );
}
