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
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { RadioGroup } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface BankStepProps {
  onSubmit: () => void;
  secondaryAction?: () => void;
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
export default function PaymentStep({
  onSubmit,
  secondaryAction,
}: BankStepProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

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
        <DialogTitle>Bank</DialogTitle>
        <DialogDescription>
          please choose bank you want to pay to
        </DialogDescription>
      </DialogHeader>

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
          <div className="w-full flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
