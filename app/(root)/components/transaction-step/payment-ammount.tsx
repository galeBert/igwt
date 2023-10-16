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
  ammount: z.number({
    required_error: "You need to select a notification type.",
  }),
});
export default function PaymentAmmount({
  onSubmit,
  secondaryAction,
  onCancel,
}: BankStepProps) {
  const { setTransaction, transaction } = useCreateTransactionModal();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { ammount: transaction.price ?? 0 },
  });

  const ammount = form.watch("ammount");

  const handleSubmit = () => {
    setTransaction({ price: ammount });
    onSubmit();
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle>Bank</DialogTitle>
        <DialogDescription>which bank you want to choose</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="ammount"
            render={({ field: { onChange, ...rest } }) => (
              <FormItem>
                <FormLabel>Ammount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Rp. 9.999.999"
                    onChange={(e) => onChange(Number(e.currentTarget.value))}
                    {...rest}
                  />
                </FormControl>
                <FormDescription>
                  This ammount is exlude shipping
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
