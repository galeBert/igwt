"use client";
import React from "react";

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
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Badge } from "@/components/ui/badge";
import { useCreateTransactionModal } from "@/hooks/use-create-transaction";

interface PackageStepProps {
  onSubmit: () => void;
  secondaryAction?: () => void;
  onCancel?: () => void;
}

const FormSchema = z.object({
  name: z.string(),
  weight: z.number(),
  height: z.number(),
  description: z.string().optional(),
});

export default function PackageStep({ onSubmit, onCancel }: PackageStepProps) {
  const { transaction, setTransaction } = useCreateTransactionModal();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ...transaction.package_detail,
    },
  });

  const handleSubmit = () => {
    setTransaction({ package_detail: { ...form.getValues() } });
    onSubmit();
  };
  return (
    <>
      <DialogHeader>
        <Badge className="w-fit">{transaction.role}</Badge>
        <DialogTitle>Package Detail</DialogTitle>
        <DialogDescription>
          can you help me describe this package data?
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className=" space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Baju" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field: { onChange, ...rest } }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1"
                    onChange={(e) => onChange(Number(e.currentTarget.value))}
                    {...rest}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="height"
            render={({ field: { onChange, ...rest } }) => (
              <FormItem>
                <FormLabel>Height (cm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    onChange={(e) => onChange(Number(e.currentTarget.value))}
                    placeholder="100"
                    {...rest}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="describe your package important info"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full flex justify-end space-x-3">
            <Button variant="secondary" onClick={onCancel}>
              Back
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
