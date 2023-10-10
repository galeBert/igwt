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
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface BankStepProps {
  role?: "sender" | "reciever";
  onSubmit: () => void;
  onCancel: () => void;
  secondaryAction?: () => void;
}

const contacts = [
  { name: "udin", phoneNumber: "0812321", addres: "jl.artileri" },
  { name: "saduy", phoneNumber: "0812321", addres: "jl.woy" },
  { name: "ujang", phoneNumber: "0812321", addres: "jl.aduh" },
  { name: "endang", phoneNumber: "0812321", addres: "jl.walah" },
];
const FormSchema = z.object({
  ammount: z.number({
    required_error: "You need to select a notification type.",
  }),
});
export default function PaymentAmmount({
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
  const handleSubmit = (e: any) => {
    e.preventDefault();

    form.handleSubmit(onSubmitForm);
    onSubmit();
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle>Bank</DialogTitle>
        <DialogDescription>which bank you want to choose</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="ammount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ammount</FormLabel>
                <FormControl>
                  <Input placeholder="Rp. 9.999.999" {...field} />
                </FormControl>
                <FormDescription>
                  This ammount is exlude shipping
                </FormDescription>
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
