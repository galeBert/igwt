import React, { useState } from "react";
import Modal from "@/components/ui/modal";
import { useCreateTransactionModal } from "@/hooks/use-create-transaction";

import { RoleStep } from "./transaction-step/role-step";
import SenderCreateTransactionModal from "./sender-create-transaction-modal";
import RecieverCreateTransactionModal from "./reciever-transaction-modal";

export default function CreateTransactionModal() {
  const { isOpen, onClose } = useCreateTransactionModal();
  const [role, setRole] = useState<"sender" | "reciever" | undefined>();

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setRole(undefined);
    }, 300);
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      {!role ? (
        <RoleStep role={role} setRole={setRole} />
      ) : role === "sender" ? (
        <SenderCreateTransactionModal role={role} />
      ) : (
        <RecieverCreateTransactionModal role={role} />
      )}
    </Modal>
  );
}
