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
import { MoneyInput } from "@/components/ui/money-input";
import { useCreateTransactionModal } from "@/hooks/use-create-transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface BankStepProps {
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
  amount: z.number({
    required_error: "You need to select a notification type.",
  }),
});
export default function PaymentAmmount({ onSubmit, onCancel }: BankStepProps) {
  const { setTransaction, transaction } = useCreateTransactionModal();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { amount: transaction.price ?? 0 },
  });

  const ammount = form.watch("amount");

  const handleSubmit = () => {
    setTransaction({ price: ammount });
    onSubmit();
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle>Price</DialogTitle>
        <DialogDescription>how much does it cost</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="amount"
            render={({ field: { onChange, ...rest } }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <div className="flex space-x-2 items-center">
                  <FormDescription className="text-gray-400">
                    Rp
                  </FormDescription>

                  <FormControl>
                    <MoneyInput
                      placeholder=" 9.999.999"
                      onChange={(e) => {
                        const translatedCurrency =
                          e.currentTarget.value.split(".").join("") ?? 0;

                        onChange(Number(translatedCurrency));
                      }}
                    />
                  </FormControl>
                </div>

                <FormDescription>
                  This ammount is exclude shipping
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex space-x-3 justify-end">
            <Button onClick={onCancel} variant="secondary">
              Back
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
