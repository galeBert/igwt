"use client";
import AddressForm from "@/components/form/address-form";
import Modal from "@/components/ui/modal";
import { useAddContactModal } from "@/hooks/use-add-contact";
import React, { useEffect, useState } from "react";

export default function AddContactModal() {
  const { isOpen, onClose } = useAddContactModal();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <Modal onClose={onClose} open={isOpen}>
      <AddressForm />
    </Modal>
  );
}
