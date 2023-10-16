import { AddressData } from "@/components/form/address-form";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCreateTransactionModal } from "@/hooks/use-create-transaction";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { PersonIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface RoleStepProps {
  fUserData: AddressData;
}

const FormSchema = z.object({
  role: z.enum(["sender", "reciever"], {
    required_error: "You need to select a notification type.",
  }),
  link: z.string().optional(),
});

export function RoleStep({ fUserData }: RoleStepProps) {
  const { user } = useUser();
  const { setTransaction, transaction } = useCreateTransactionModal();
  const { role } = transaction;
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { role, link: "" },
  });

  const roles = form.watch("role");
  const link = form.watch("link");
  const handleSubmit = () => {
    setTransaction({
      [roles]: { ...fUserData, name: user?.firstName },
      role: roles,
      link,
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Role</DialogTitle>
        <DialogDescription>
          choose your role to this transaction
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid space-y-6"
        >
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    defaultValue={role}
                    className="grid grid-cols-2 space-x-4"
                    onValueChange={field.onChange}
                  >
                    <div>
                      <RadioGroupItem
                        value="sender"
                        id="sender"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="sender"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="mb-3 h-6 w-6"
                        >
                          <rect width="20" height="14" x="2" y="5" rx="2" />
                          <path d="M2 10h20" />
                        </svg>
                        Sender
                      </Label>
                    </div>
                    <div className="h-full">
                      <RadioGroupItem
                        value="reciever"
                        id="reciever"
                        className="peer h-full sr-only"
                      />
                      <Label
                        htmlFor="reciever"
                        className="flex h-full flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <PersonIcon className="mt-px h-6 w-6" strokeWidth={2} />
                        Reciever
                      </Label>
                    </div>
                    <div></div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Link</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  please provide link to your desired product so both of you can
                  understand this transaction
                </FormDescription>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </Form>
    </>
  );
}
