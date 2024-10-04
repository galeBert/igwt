"use client";
import { Button } from "@/components/ui/button";
import { useAddUserAddresModal } from "@/hooks/use-add-user-address-modal";
import {
  useCreateTransactionModal,
  UserData,
} from "@/hooks/use-create-transaction";

export default function CreateTransactionsButton({ user }: { user: UserData }) {
  const { onOpen } = useCreateTransactionModal();
  const { onOpen: addAddressData } = useAddUserAddresModal();

  const handleCreateTransaction = () => {
    if (user.address_id) {
      return onOpen();
    }
    addAddressData();
  };
  return <Button onClick={handleCreateTransaction}>Create new order</Button>;
}
