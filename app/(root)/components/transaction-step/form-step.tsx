"use client";
import React, { useEffect, useState } from "react";

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

import AddressForm, { AddressData } from "@/components/form/address-form";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import useSWRMutation from "swr/mutation";
import { createContact } from "@/actions/create-contact";
import { getSingleContact } from "@/actions/get-single-contact";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SearchCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

export default function FormStep({
  onSubmit,
  onCancel,
  title,
  subtitle,
}: FormStepProps) {
  const { user } = useUser();
  const [tabs, setTabs] = useState<"user" | "address">("user");
  const [address, setAddress] = useState<AddressData>();
  const [isSingleContactFound, setIsSingleContactFound] = useState(false);
  const formUser = useForm<z.infer<typeof FormSchemaUser>>({
    resolver: zodResolver(FormSchemaUser),
  });

  const {
    trigger,
    isMutating,
    data: newlyCreatedContact,
  } = useSWRMutation(`/api/${user?.id}/contact`, createContact);

  const {
    trigger: searchSingleContact,
    data: singleContactData,
    isMutating: isSearchingUser,
  } = useSWRMutation(`/api/${user?.id}/contact`, getSingleContact);

  const name = formUser.watch("username");
  const email = formUser.watch("email");

  const handleSubmit = () => {
    onSubmit(formUser.getValues());
    searchSingleContact({ email }).then((data) => {
      if (!data) {
        setTabs("address");
      }
    });
  };

  const handleSubmitAddress = async (variables: AddressData) => {
    if (variables) {
      const locationResult = await axios.post(`/api/biteship/maps`, {
        query: variables.postalCode.text,
      });

      if (locationResult.data.length) {
        trigger({ ...locationResult.data[0], ...variables, name, email });
      }
    }
    onCancel?.();
  };
  const handleSubmitExistAddress = async () => {
    if (singleContactData) {
      trigger({ ...singleContactData, name });
    }
    onCancel?.();
  };
  useEffect(() => {
    if (singleContactData) {
      setIsSingleContactFound(true);
    } else {
      setIsSingleContactFound(false);
    }
  }, [email, newlyCreatedContact, singleContactData]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>{title ?? "New Contact"}</DialogTitle>
        <DialogDescription>
          {subtitle ?? "can you help me fill this contact data?"}
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="igwt@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end w-full space-x-3">
                <Button variant="secondary" onClick={onCancel}>
                  Back
                </Button>
                <Popover
                  open={isSingleContactFound}
                  onOpenChange={setIsSingleContactFound}
                >
                  <PopoverTrigger asChild>
                    <Button disabled={isSearchingUser} type="submit">
                      {isSearchingUser ? "Searching..." : "Next"}
                    </Button>
                  </PopoverTrigger>
                  {singleContactData ? (
                    <PopoverContent className="space-y-2 translate-y-1/4">
                      <div className="flex space-x-2 items-center">
                        <SearchCheck width={24} />
                        <div className="flex flex-col">
                          <Label className="text-base">We found it!</Label>
                          <Label className="text-gray-500">
                            Your friend is on IGWT
                          </Label>
                        </div>
                      </div>
                      <Card>
                        <CardContent className="pt-4 flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage
                              src="https://github.com/shadcn.png"
                              alt="@shadcn"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <Label>{singleContactData.name}</Label>
                          <Label>{singleContactData.email}</Label>
                        </CardContent>
                      </Card>
                      <div className="w-full space-x-2 flex justify-end">
                        <Button
                          onClick={() => setIsSingleContactFound(false)}
                          variant="secondary"
                        >
                          wrong person
                        </Button>
                        <Button onClick={handleSubmitExistAddress}>
                          Continue
                        </Button>
                      </div>
                    </PopoverContent>
                  ) : null}
                </Popover>
              </div>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="address">
          <AddressForm
            loading={isMutating}
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
