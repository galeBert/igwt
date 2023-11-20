"use client";
import React, { useState } from "react";
import Modal from "@/components/ui/modal";
import { useCreateTransactionModal } from "@/hooks/use-create-transaction";

import { RoleStep } from "./transaction-step/role-step";
import SenderCreateTransactionModal from "./sender-create-transaction-modal";
import RecieverCreateTransactionModal from "./reciever-transaction-modal";
import FormStep from "./transaction-step/form-step";
import type { AddressData } from "@/components/form/address-form";
interface CreteTransactionModalProps {
  fUserData: AddressData;
}
export default function CreateTransactionModal({
  fUserData,
}: CreteTransactionModalProps) {
  const { isOpen, onClose, transaction, setTransaction } =
    useCreateTransactionModal();
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setTransaction({ role: undefined });
    }, 300);
  };

  const handleAddContact = (variable: any) => {
    // console.log(variable);
    // if (user) {
    //   setIsAddContactOpen(false);
    //   axios.post(`/api/${user.id}/contact`, variable);
    // }
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      {isAddContactOpen ? (
        <FormStep
          onCancel={() => setIsAddContactOpen(false)}
          onSubmit={handleAddContact}
        />
      ) : !transaction.role ? (
        <RoleStep fUserData={fUserData} />
      ) : transaction.role === "sender" ? (
        <SenderCreateTransactionModal
          openForm={() => setIsAddContactOpen(true)}
        />
      ) : (
        <RecieverCreateTransactionModal
          openForm={() => setIsAddContactOpen(true)}
        />
      )}
    </Modal>
  );
}
