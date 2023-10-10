"use client";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { auth, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar } from "@radix-ui/react-avatar";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import validator from "validator";
import * as z from "zod";

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

export default function ProfileCard() {
  const { user, isLoaded } = useUser();
  const [open, setOpen] = useState({
    province: false,
    city: false,
    district: false,
    subdistrict: false,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  if (!isLoaded) {
    return <div>loading...</div>;
  }
  if (!user) {
    return <div>user not found</div>;
  }

  const adressFieldList: ("province" | "city" | "district" | "subdistrict")[] =
    ["province", "city", "district", "subdistrict"];
  return (
    <div>
      <CardTitle>Profile</CardTitle>

      <Card className="mt-4 hover:dark:bg-gray-900">
        <CardHeader className="">
          <div className="flex space-x-2 py-1 px-2 focus:ring-2 focus:ring-black items-center">
            <Avatar className="w-20">
              <AvatarImage
                className="rounded-full"
                src="https://github.com/shadcn.png"
                alt="@shadcn"
              />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.fullName}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Separator />

          <CardTitle className="text-xl">Address</CardTitle>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
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
        </CardContent>
      </Card>
    </div>
  );
}
