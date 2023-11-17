"use client";

import { Button } from "@/components/ui/button";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useCity,
  useDistrict,
  getPostalCode,
  useProvince,
} from "@/hooks/useCloudAlert";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";
import { text } from "node:stream/consumers";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

import * as z from "zod";
import { string } from "zod";

const addresSchema = z.object({
  text: z.string(),
  id: z.string(),
});
const FormSchema = z.object({
  province: addresSchema,
  city: addresSchema,
  district: addresSchema,
  postalCode: addresSchema,
  street_name: z.string(),
  description: z.string().optional(),
});

type AdressDetail = {
  text: string;
  id: string;
};
export type AddressData = {
  city: AdressDetail;
  district: AdressDetail;
  province: AdressDetail;
  postalCode: AdressDetail;
  street_name?: string;
  description?: string;
  formatted_address?: string;
  address_id?: string;
};

interface ProfileCardProps {
  data?: AddressData;
  onSubmit?: (variables?: any) => void;
  onChange?: (variables?: AddressData) => void;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
  defaultValues?: AddressData;
  loading?: boolean;
}

export default function AddressForm({
  data,
  onSubmit,
  secondaryAction,
  secondaryActionLabel,
  defaultValues,
  onChange,
  loading,
}: ProfileCardProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      province: {
        text: data?.province?.text ?? "",
        id: data?.province?.id ?? undefined,
      },
      city: {
        text: data?.city?.text ?? "",
        id: data?.city?.id ?? undefined,
      },
      district: {
        text: data?.district?.text ?? "",
        id: data?.district?.id ?? undefined,
      },
      postalCode: {
        text: data?.postalCode?.text ?? "",
        id: data?.postalCode?.id ?? undefined,
      },
      street_name: data?.street_name ?? "",
      description: data?.description ?? "",
    },
  });

  const { data: provincies } = useSWR(
    "https://alamat.thecloudalert.com/api/provinsi/get",
    useProvince
  );

  const selectedProvince = form.watch("province");
  const selectedCity = form.watch("city");
  const selectedDistrict = form.watch("district");

  const { data: cities } = useSWR(selectedProvince.id, useCity);
  const { data: district } = useSWR(selectedCity.id, useDistrict);
  const { data: postalcode, mutate } = useSWR("postal-code", async () => {
    if (selectedDistrict.id && selectedCity.id) {
      const getProvince = await fetch(
        `https://alamat.thecloudalert.com/api/kodepos/get/?d_kabkota_id=${selectedCity.id}&d_kecamatan_id=${selectedDistrict.id}`,
        { method: "GET" }
      );
      const province = await getProvince.json();
      const result = province.result;

      if (!result.length) {
        return [];
      }
      return result;
    }
  });

  useEffect(() => {
    if ((selectedDistrict.id, selectedCity.id)) {
      mutate();
    }
  }, [selectedDistrict.id, selectedCity.id, mutate]);

  const [open, setOpen] = useState({
    province: false,
    city: false,
    district: false,
    subdistrict: false,
    postalCode: false,
  });

  const adressFieldList: {
    name: "province" | "city" | "district" | "postalCode";
    data: any[];
  }[] = [
    { name: "province", data: provincies ?? [] },
    { name: "city", data: cities ?? [] },
    { name: "district", data: district ?? [] },
    { name: "postalCode", data: postalcode ?? [] },
  ];

  const handleClick = () => {
    onSubmit?.(form.getValues());
  };

  useEffect(() => {
    onChange?.(form.getValues());
  }, [form, onChange]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleClick)} className="space-y-3">
          {adressFieldList.map((fieldList, idx) => {
            return (
              <FormField
                key={idx}
                control={form.control}
                name={fieldList.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {fieldList.name[0].toUpperCase() +
                        fieldList.name.slice(1)}
                    </FormLabel>
                    <FormControl>
                      <Popover
                        open={open[fieldList.name]}
                        onOpenChange={(openState) => {
                          setOpen((e) => ({
                            ...e,
                            [fieldList.name]: openState,
                          }));
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open[fieldList.name]}
                            className="w-full justify-between"
                          >
                            {form.watch(fieldList.name).text ??
                              `Select ${fieldList.name}...`}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className=" p-0">
                          <Command>
                            <CommandInput placeholder="Search Province..." />
                            <CommandEmpty>
                              No {fieldList.name} found.
                            </CommandEmpty>
                            <ScrollArea>
                              <CommandGroup className="h-36 overflow-scroll">
                                {fieldList.data?.map((prov, idx) => {
                                  return (
                                    <CommandItem
                                      key={idx}
                                      onSelect={() => {
                                        form.setValue(fieldList.name, prov);
                                        setOpen((e) => ({
                                          ...e,
                                          [fieldList.name]: false,
                                        }));
                                      }}
                                    >
                                      {prov.text}
                                    </CommandItem>
                                  );
                                })}
                              </CommandGroup>
                            </ScrollArea>
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
            name="street_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street name</FormLabel>
                <FormControl>
                  <Input placeholder="Jl. gelatik" {...field} />
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
                <FormLabel>Additional info</FormLabel>
                <FormControl>
                  <Input placeholder="near statue..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end items-center w-full space-x-3">
            {secondaryAction ? (
              <Button variant="secondary" onClick={secondaryAction}>
                {secondaryActionLabel}
              </Button>
            ) : null}
            <Button disabled={loading} type="submit">
              {loading ? (
                <div className="flex justify-center items-center w-full space-x-2">
                  <Loader2 className="w-5 animate-spin" />
                  <span>loading...</span>
                </div>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
