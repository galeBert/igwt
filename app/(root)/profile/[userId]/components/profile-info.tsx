"use client";
import AddressForm, { AddressData } from "@/components/form/address-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import { UserData } from "@/hooks/use-create-transaction";
import { formatter } from "@/lib/utils";
interface ProfileInfo {
  data: UserData;
}

async function updateUser(url: string, { arg }: { arg: string }) {
  await fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  });
}
export default function ProfileInfo({ data }: ProfileInfo) {
  const { user } = useUser();
  const { trigger, isMutating } = useSWRMutation(
    `/api/${user?.id}/address`,
    updateUser
  );

  const onSubmit = async (variables: AddressData) => {
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
    <div>
      <Card>
        <CardHeader>Info</CardHeader>
        <CardContent>
          <CardDescription className="text-">
            Balance: {formatter.format(Number(data.balance))}
          </CardDescription>
          <CardDescription className="text-">
            Balance: {data.balance}
          </CardDescription>
        </CardContent>
      </Card>
      <AddressForm
        data={data}
        onSubmit={onSubmit}
        defaultValues={{ ...data, postalCode: data.postalCode }}
        loading={isMutating}
      />
    </div>
  );
}
