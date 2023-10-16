"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import validator from "validator";

import AddressForm, { AddressData } from "@/components/form/address-form";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

interface FormStepProps {
  onSubmit: (variable?: any) => void;
  secondaryAction?: () => void;
  onCancel?: () => void;

  role?: "sender" | "reciever";
}

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

// const FormSchema = z.object({
//   username: z.string().min(2, {
//     message: "Username must be at least 2 characters.",
//   }),
//   email: z.string().email().optional(),
//   phoneNumber: z
//     .string()
//     .regex(phoneRegex, "Invalid Number2!")
//     .refine(validator.isMobilePhone),
//   province: z.string(),
//   city: z.string(),
//   district: z.string(),
//   subdistrict: z.string(),
//   streetName: z.string(),
//   description: z.string().optional(),
// });

const FormSchemaUser = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  // email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  // .regex(phoneRegex, "Invalid Number!")
  // .refine(validator.isMobilePhone)
});

export default function FormStep({ onSubmit, onCancel }: FormStepProps) {
  const { user } = useUser();
  const [tabs, setTabs] = useState<"user" | "address">("user");
  const [address, setAddress] = useState<AddressData>();

  const formUser = useForm<z.infer<typeof FormSchemaUser>>({
    resolver: zodResolver(FormSchemaUser),
  });
  const name = formUser.watch("username");
  const phoneNumber = formUser.watch("phoneNumber");

  const handleSubmit = () => {
    onSubmit(formUser.getValues());

    setTabs("address");
  };

  const handleSubmitAddress = async (variables: AddressData) => {
    onSubmit({ ...formUser.getValues(), ...variables });
    if (variables) {
      const locationResult = await axios.post(`/api/biteship/maps`, {
        query: variables.postalCode,
      });
      if (locationResult.data.length) {
        axios.post(`/api/${user?.id}/contact`, {
          ...locationResult.data[0],
          ...variables,
          name,
          phoneNumber,
        });
      }
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>New Contact</DialogTitle>
        <DialogDescription>
          can you help me fill this contact data?
        </DialogDescription>
      </DialogHeader>
      <Tabs defaultValue="user" value={tabs}>
        <TabsList>
          <TabsTrigger onClick={() => setTabs("user")} value="user">
            User
          </TabsTrigger>
          <TabsTrigger onClick={() => setTabs("address")} value="address">
            Address
          </TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <Form {...formUser}>
            <form
              onSubmit={formUser.handleSubmit(handleSubmit)}
              className=" space-y-3"
            >
              <FormField
                control={formUser.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is name will be used for shipping receipt and contact
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formUser.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input placeholder="+62 85123123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end w-full space-x-3">
                <Button variant="secondary" onClick={onCancel}>
                  Back
                </Button>
                <Button type="submit">Next</Button>
              </div>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="address">
          <AddressForm
            onChange={setAddress}
            onSubmit={handleSubmitAddress}
            secondaryActionLabel="Back"
            secondaryAction={() => {}}
            defaultValues={address}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
