"use client";
import React, { useState } from "react";

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import AddressForm, { AddressData } from "@/components/form/address-form";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import Modal from "./ui/modal";
import { useAddUserAddresModal } from "@/hooks/use-add-user-address-modal";
import useSWRMutation from "swr/mutation";
import { toast } from "react-hot-toast";
interface FormStepProps {
  onSubmit: (variable?: any) => void;
  secondaryAction?: () => void;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
  role?: "sender" | "reciever";
}

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const FormSchemaUser = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email(),
  // .regex(phoneRegex, "Invalid Number!")
  // .refine(validator.isMobilePhone)
});

async function updateUser(url: string, { arg }: { arg: string }) {
  await fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  });
}

export default function AddUserAddresModal({
  onSubmit,
  onCancel,
  title,
  subtitle,
}: FormStepProps) {
  const { isOpen, onClose } = useAddUserAddresModal();
  const { user } = useUser();
  const [address, setAddress] = useState<AddressData>();
  const [loading, setLoading] = useState(false);
  const formUser = useForm<z.infer<typeof FormSchemaUser>>({
    resolver: zodResolver(FormSchemaUser),
  });

  const { trigger, isMutating } = useSWRMutation(
    `/api/${user?.id}/address`,
    updateUser
  );

  const onSubmit2 = async (variables: AddressData) => {
    const { postalCode, ...rest } = variables;
    const locationResult = await axios.post(`/api/biteship/maps`, {
      query: postalCode.text,
    });
    if (locationResult.data.length) {
      trigger(
        {
          ...locationResult.data[0],
          ...rest,
          email: user?.emailAddresses[0]?.emailAddress,
          postalCode,
        },
        {
          onSuccess: () => toast.success("success update your address"),
          onError: (err) => console.log(err),
        }
      );
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>Address</DialogTitle>
        <DialogDescription>
          please complete your address data to start a transaction
        </DialogDescription>
      </DialogHeader>

      <AddressForm
        loading={loading}
        onChange={setAddress}
        onSubmit={onSubmit2}
        secondaryActionLabel="Back"
        secondaryAction={() => {}}
        defaultValues={address}
      />
    </Modal>
  );
}
