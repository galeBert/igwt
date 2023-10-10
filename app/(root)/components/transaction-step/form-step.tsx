"use client";
import React, { FormEvent, useState } from "react";

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

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import validator from "validator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface FormStepProps {
  onSubmit: () => void;
  secondaryAction?: () => void;
  onCancel?: () => void;

  role?: "sender" | "reciever";
}

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email().optional(),
  phoneNumber: z
    .string()
    .regex(phoneRegex, "Invalid Number!")
    .refine(validator.isMobilePhone),
  province: z.string(),
  city: z.string(),
  district: z.string(),
  subdistrict: z.string(),
  streetName: z.string(),
  description: z.string().optional(),
});

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];
export default function FormStep({ onSubmit, onCancel, role }: FormStepProps) {
  const [open, setOpen] = useState({
    province: false,
    city: false,
    district: false,
    subdistrict: false,
  });
  const [tabs, setTabs] = useState<"user" | "address">("user");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const username = form.watch("username");
  const username1 = form.watch("province");
  const username2 = form.watch("city");
  const username3 = form.watch("district");
  const username4 = form.watch("subdistrict");

  const adressFieldList: ("province" | "city" | "district" | "subdistrict")[] =
    ["province", "city", "district", "subdistrict"];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTabs("address");
  };
  return (
    <>
      <DialogHeader>
        <Badge className="w-fit">{role}</Badge>
        <DialogTitle>New Contact</DialogTitle>
        <DialogDescription>
          can you help me fill this contact data?
        </DialogDescription>
      </DialogHeader>
      <Tabs defaultValue="user" value={tabs}>
        <TabsList>
          <TabsTrigger onClick={() => setTabs("user")} value="user">
            User
          </TabsTrigger>
          <TabsTrigger onClick={() => setTabs("address")} value="address">
            Address
          </TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <Form {...form}>
            <form onSubmit={handleSubmit} className=" space-y-3">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is name will be used for shipping receipt and contact
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input placeholder="+62 85123123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="address">
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
              className=" space-y-3"
            >
              {adressFieldList.map((fieldList, idx) => {
                return (
                  <FormField
                    key={idx}
                    control={form.control}
                    name={fieldList}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {fieldList[0].toUpperCase() + fieldList.slice(1)}
                        </FormLabel>
                        <FormControl>
                          <Popover
                            open={open[fieldList]}
                            onOpenChange={(openState) => {
                              setOpen((e) => ({
                                ...e,
                                [fieldList]: openState,
                              }));
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open[fieldList]}
                                className="w-full justify-between"
                              >
                                {field.value
                                  ? frameworks.find(
                                      (language) =>
                                        language.value === field.value
                                    )?.label
                                  : `Select ${fieldList}...`}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className=" p-0">
                              <Command>
                                <CommandInput placeholder="Search Province..." />
                                <CommandEmpty>
                                  No {fieldList} found.
                                </CommandEmpty>
                                <CommandGroup>
                                  {frameworks.map((framework) => (
                                    <CommandItem
                                      key={framework.value}
                                      onSelect={() => {
                                        form.setValue(
                                          fieldList,
                                          framework.value
                                        );
                                        setOpen((e) => ({
                                          ...e,
                                          [fieldList]: false,
                                        }));
                                      }}
                                      onBlur={() => console.log("aaa")}
                                    >
                                      {framework.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              })}

              <FormField
                control={form.control}
                name="streetName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jl.artileri no.10" {...field} />
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
                      <Input placeholder="Jl.artileri no.10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </>
  );
}
