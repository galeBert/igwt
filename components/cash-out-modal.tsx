import { getUserData } from "@/actions/get-user-data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, formatter } from "@/lib/utils";
import { Coins, DollarSign, Wallet2 } from "lucide-react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { MoneyInput } from "./ui/money-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { bankList } from "@/lib/bank-list";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { createCashout } from "@/actions/create-money-transfer";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useUserData } from "@/hooks/useUserData";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  amount: z.number({
    required_error: "please enter your money first",
  }),
  accountNumber: z.number({
    required_error: "please enter your account number",
  }),
  bank: z.string(),
});

export function CashOutMoneyModal({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const { balance, setBalance } = useUserData();
  const { data, mutate } = useSWR(userId, getUserData);
  const { trigger, isMutating } = useSWRMutation(userId, createCashout);
  console.log(useUserData.getState());

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleCashOut = () => {
    const { accountNumber, amount, bank } = form.getValues();
    trigger(
      {
        userId,
        account_number: String(accountNumber),
        amount,
        bank_code: bank,
      },
      {
        onSuccess: () => {
          setBalance(balance - amount);

          toast.success("success");
          setOpen(false);
          getUserData(userId);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Cash out Money</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cash out</DialogTitle>
          <DialogDescription>
            Enter ammount of money you want to cash out
          </DialogDescription>
        </DialogHeader>
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <Wallet2 />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">Balance</p>
            <p className="text-sm text-muted-foreground">
              {formatter.format(Number(data?.balance))}
            </p>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCashOut)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field: { onChange, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <div className="flex space-x-2 items-center ">
                      <FormLabel className="text-gray-500">Rp.</FormLabel>

                      <FormControl>
                        <MoneyInput
                          onChange={(e) => {
                            const translatedCurrency =
                              e.currentTarget.value.split(".").join("") ?? 0;
                            console.log(translatedCurrency);

                            if (
                              Number(translatedCurrency) > Number(data?.balance)
                            ) {
                              form.setError("amount", {
                                message: "balance insuficient",
                              });
                            } else if (
                              Number(translatedCurrency) < Number(10000)
                            ) {
                              form.setError("amount", {
                                message: "minimum Rp.10.000",
                              });
                            } else {
                              form.clearErrors("amount");
                            }
                            onChange(Number(translatedCurrency));
                          }}
                        />
                      </FormControl>
                    </div>
                    {form.getFieldState("amount").error ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>minimum Rp.10.000</FormDescription>
                    )}
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Account number
                </Label>
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field: { onChange, ...rest } }) => (
                    <FormItem className="col-span-3">
                      <FormControl>
                        <Input
                          className="w-full"
                          onChange={(e) =>
                            onChange(Number(e.currentTarget.value))
                          }
                          type="number"
                          {...rest}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-4  w-full items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Bank
                </Label>
                <FormField
                  control={form.control}
                  name="bank"
                  render={({ field: { onChange } }) => (
                    <FormItem className="col-span-3">
                      <FormControl>
                        <Select onValueChange={(e) => onChange(e)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={"select bank..."} />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            <SelectGroup className="w-full">
                              <SelectLabel>Bank</SelectLabel>
                              {bankList.map((bank, key) => {
                                return (
                                  <SelectItem
                                    className="flex space-x-1 items-center"
                                    key={key}
                                    value={bank.value}
                                  >
                                    <div className="flex items-center space-x-1">
                                      <Avatar className="w-6 h-6">
                                        <AvatarImage
                                          sizes="sm"
                                          src={bank.imageeUrl}
                                          alt={bank.value}
                                        />
                                        <AvatarFallback>
                                          {bank.name.slice(0, 2)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <p>{bank.name} </p>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                disabled={isMutating}
                className="flex items-center space-x-1"
                type="submit"
              >
                {isMutating ? (
                  <>
                    <Coins className="animate-bounce" width={18} />{" "}
                    <span>Cashing out...</span>
                  </>
                ) : (
                  <>
                    <Coins width={18} /> <span>Cash Out</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
