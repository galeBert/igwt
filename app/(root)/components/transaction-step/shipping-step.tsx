"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import { RadioGroup } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface ShippingStepProps {
  onSubmit: () => void;
  secondaryAction?: () => void;
  onCancel: () => void;
  role?: "sender" | "reciever";
}

const FormSchema = z.object({
  type: z.string({
    required_error: "You need to select a notification type.",
  }),
});

const contacts = [
  { name: "udin", phoneNumber: "0812321", addres: "jl.artileri" },
  { name: "saduy", phoneNumber: "0812321", addres: "jl.woy" },
  { name: "ujang", phoneNumber: "0812321", addres: "jl.aduh" },
  { name: "endang", phoneNumber: "0812321", addres: "jl.walah" },
];
export default function ShippingStep({
  onCancel,
  onSubmit,
  secondaryAction,
}: ShippingStepProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  return (
    <>
      <DialogHeader>
        <DialogTitle>Shipping</DialogTitle>
        <DialogDescription>
          here are list of shipping that available
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-6"
        >
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>JNE</AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3 p-1">
                      <FormControl>
                        <RadioGroup
                          className="space-y-3"
                          onChange={field.onChange}
                        >
                          {contacts.map((contact, idx) => {
                            return (
                              <RadioGroup.Option key={idx} value={contact.name}>
                                {({ active, checked }) => (
                                  <Card
                                    className={cn(
                                      "flex space-x-2 py-1 px-2 focus:ring-2 focus:ring-black items-center",
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
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that matches the other
                components&apos; aesthetic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes. It&apos;s animated by default, but you can disable it if
                you prefer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="w-full flex space-x-2 justify-end">
            <Button type="submit" onClick={secondaryAction} variant="secondary">
              Back
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
