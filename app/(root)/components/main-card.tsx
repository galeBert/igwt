"use client";
import AddUserAddresModal from "@/components/add-user-address-modal.tsx";
import { CashOutMoneyModal } from "@/components/cash-out-modal";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription } from "@/components/ui/card";
import Modal from "@/components/ui/modal";
import { useAddUserAddresModal } from "@/hooks/use-add-user-address-modal";
import {
  useCreateTransactionModal,
  UserData,
} from "@/hooks/use-create-transaction";
import axios from "axios";
import React from "react";
import FormStep from "./transaction-step/form-step";

interface MainCardProps {
  user: UserData;
  userId: string;
}
export default function MainCard({ user, userId }: MainCardProps) {
  const { onOpen } = useCreateTransactionModal();
  const { onOpen: addAddressData } = useAddUserAddresModal();

  const handleCreateTransaction = () => {
    if (user.address_id) {
      return onOpen();
    }
    addAddressData();
  };

  const handleCashout = () => {};
  return (
    <>
      <CardContent className="space-y-3">
        <CardDescription>What are you gonna do today?</CardDescription>
        <div className="space-x-3">
          <Button onClick={handleCreateTransaction}>Create new order</Button>
          <CashOutMoneyModal userId={userId} />
          <Button onClick={handleCashout} variant="secondary">
            Cash out Money
          </Button>
        </div>
      </CardContent>
      <AddUserAddresModal onSubmit={() => {}} />
    </>
  );
}
