"use client";
import AddressForm, { AddressData } from "@/components/form/address-form";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useState } from "react";

interface ProfileInfo {
  data: any;
}
export default function ProfileInfo({ data }: ProfileInfo) {
  const { user } = useUser();
  const [address, setAddress] = useState<AddressData>();

  const onSubmit = async () => {
    if (address) {
      const { postalCode, ...rest } = address;
      const locationResult = await axios.post(`/api/biteship/maps`, {
        query: postalCode,
      });
      if (locationResult.data.length) {
        axios.post(`/api/${user?.id}/address`, {
          ...locationResult.data[0],
          ...rest,
          email: user?.emailAddresses[0]?.emailAddress,
        });
      }
    }
  };

  return (
    <div>
      <AddressForm
        data={data}
        onSubmit={onSubmit}
        defaultValues={{ ...data, postalCode: data.postalcode }}
        onChange={setAddress}
      />
    </div>
  );
}
