"use client";
import React, { useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { RadioGroup } from "@headlessui/react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCreateTransactionModal } from "@/hooks/use-create-transaction";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserData } from "@/hooks/useUserData";
import useSWR from "swr";
import { getContact } from "@/actions/get-contact";

interface ContantStepProps {
  onSubmit: () => void;
  secondaryAction?: () => void;
  onCancel: () => void;
}

const FormSchema = z.object({
  contact: z.string({
    required_error: "You need to select a notification type.",
  }),
});
export default function ContactStep({
  onSubmit,
  secondaryAction,
  onCancel,
}: ContantStepProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { userId } = useUserData();

  const { data, isLoading } = useSWR("/api/contact", () =>
    getContact(userId ?? "")
  );

  const contacts = data ?? [];

  const { transaction, setTransaction } = useCreateTransactionModal();
  const contact = form.watch("contact");
  const isContactSelected = !!form.watch("contact");

  const oppositeRole = transaction.role === "sender" ? "reciever" : "sender";
  const handleSubmit = () => {
    const selectedContact = contacts?.find((data) => data.name === contact);
    setTransaction({ [oppositeRole]: { ...selectedContact } });
    secondaryAction?.();
  };

  return (
    <>
      <DialogHeader>
        <Badge className="w-fit">{transaction?.role}</Badge>

        <DialogTitle>Create Transaction</DialogTitle>
        <DialogDescription>
          who do you want to ask to do a transaction?
        </DialogDescription>
      </DialogHeader>
      <Button onClick={onSubmit}>+ New Contact</Button>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 ">
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <div className="float-none space-x-2">
                  <FormLabel>Contact</FormLabel>
                  <Badge>{contacts.length}</Badge>
                </div>
                <FormControl>
                  <RadioGroup className="space-y-3" onChange={field.onChange}>
                    {isLoading ? (
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ) : (
                      <div className="max-h-[250px] space-y-3  overflow-scroll">
                        {contacts.map((contact, idx) => {
                          return (
                            <RadioGroup.Option key={idx} value={contact.name}>
                              {({ active, checked }) => (
                                <Card
                                  className={cn(
                                    "flex space-x-2 py-1 px-2 items-center",
                                    active
                                      ? "ring-2 dark:ring-white ring-black outline-2 outline-black dark:outline-white"
                                      : "",
                                    checked
                                      ? "border-black dark:border-white outline-2"
                                      : ""
                                  )}
                                >
                                  <Avatar>
                                    <AvatarImage
                                      src="https://github.com/shadcn.png"
                                      alt="@shadcn"
                                    />
                                    <AvatarFallback>
                                      {contact.name.slice(0, 1).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <span>{contact.name}</span>
                                  </div>
                                </Card>
                              )}
                            </RadioGroup.Option>
                          );
                        })}
                      </div>
                    )}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex space-x-3 justify-end">
            <Button onClick={onCancel} variant="secondary">
              Back
            </Button>
            <Button disabled={!isContactSelected} type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
