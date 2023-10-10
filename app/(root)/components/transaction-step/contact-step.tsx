"use client";
import React from "react";
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
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ContantStepProps {
  onSubmit: () => void;
  secondaryAction?: () => void;
  role?: "sender" | "reciever";
}

const contacts = [
  { name: "udin", phoneNumber: "0812321", addres: "jl.artileri" },
  { name: "saduy", phoneNumber: "0812321", addres: "jl.woy" },
  { name: "ujang", phoneNumber: "0812321", addres: "jl.aduh" },
  { name: "endang", phoneNumber: "0812321", addres: "jl.walah" },
];
const FormSchema = z.object({
  type: z.string({
    required_error: "You need to select a notification type.",
  }),
});
export default function ContactStep({
  onSubmit,
  secondaryAction,
  role,
}: ContantStepProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const isContactSelected = !!form.watch("type");

  const onSubmitForm = (data: z.infer<typeof FormSchema>) => {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };
  const handleSubmit = () => {
    form.handleSubmit(onSubmitForm);
    secondaryAction?.();
  };

  return (
    <>
      <DialogHeader>
        <Badge className="w-fit">{role}</Badge>

        <DialogTitle>Create Transaction</DialogTitle>
        <DialogDescription>
          who do you want to ask to do a transaction?
        </DialogDescription>
      </DialogHeader>
      <Button onClick={onSubmit}>+ New Contact</Button>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Contact</FormLabel>
                <FormControl>
                  <RadioGroup className="space-y-3" onChange={field.onChange}>
                    {contacts.map((contact, idx) => {
                      return (
                        <RadioGroup.Option key={idx} value={contact.name}>
                          {({ active, checked }) => (
                            <Card
                              className={cn(
                                "flex space-x-2 py-1 px-2 items-center",
                                active
                                  ? "ring-2 ring-black outline-2 outline-black"
                                  : "",
                                checked ? "border-black outline-2" : ""
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
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-end">
            <Button disabled={!isContactSelected} type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
