"use client";
import AddressForm from "@/components/form/address-form";
import Modal from "@/components/ui/modal";
import { useAddContactModal } from "@/hooks/use-add-contact";
import React from "react";

export default function AddContactModal() {
  const { isOpen, onClose } = useAddContactModal();
  return (
    <Modal onClose={onClose} open={isOpen}>
      <AddressForm />
    </Modal>
  );
}
