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
import { useAdress } from "@/hooks/use-Adress";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import * as z from "zod";

const FormSchema = z.object({
  province: z.string(),
  city: z.string(),
  district: z.string(),
  street_name: z.string(),
  postalCode: z.string().optional(),
  description: z.string().optional(),
});

type BiteshipAddress = {
  id: string;
  name: string;
  country_name: string;
  country_code: string;
  administrative_division_level_1_name: string;
  administrative_division_level_1_type: string;
  administrative_division_level_2_name: string;
  administrative_division_level_2_type: string;
  administrative_division_level_3_name: string;
  administrative_division_level_3_type: string;
  postal_code: number;
};

export type AddressData = {
  city?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  street_name?: string;
  description?: string;
  formatted_address?: string;
};
interface ProfileCardProps {
  data?: AddressData;
  onSubmit?: (variables?: any) => void;
  onChange?: (variables?: AddressData) => void;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
  defaultValues?: AddressData;
}

export default function AddressForm({
  data,
  onSubmit,
  secondaryAction,
  secondaryActionLabel,
  defaultValues,
  onChange,
}: ProfileCardProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const provincies = useAdress({
    type: "province",
  });

  const selectedProvince = form.watch("province");
  const selectedCity = form.watch("city");
  const selectedDistrict = form.watch("district");
  const selectedPostalCode = form.watch("postalCode");
  const street_name = form.watch("street_name");
  const description = form.watch("description");

  useEffect(() => {
    if (
      selectedProvince ||
      selectedCity ||
      selectedDistrict ||
      selectedPostalCode ||
      street_name
    ) {
      onChange?.({
        province: selectedProvince,
        city: selectedCity,
        district: selectedDistrict,
        postalCode: selectedPostalCode,
        street_name,
        description,
      });
    }
  }, [
    description,
    onChange,
    selectedCity,
    selectedDistrict,
    selectedPostalCode,
    selectedProvince,
    street_name,
  ]);

  //city
  const findCity = provincies.find(
    (province) => province.text === selectedProvince
  );
  const cityId = findCity ? Number(findCity.id) : undefined;

  const cities = useAdress({
    type: "city",
    id: cityId,
  });

  //district
  const findDistrict = cities.find(
    (province) => province.text === selectedCity
  );
  const districtId = findDistrict ? Number(findDistrict.id) : undefined;

  const district = useAdress({
    type: "district",
    id: districtId,
  });

  //subdistrcict
  const findSubdistrict = district.find(
    (province) => province.text === selectedDistrict
  );
  const subistrictId = findSubdistrict ? Number(findSubdistrict.id) : undefined;

  //postalcode
  const postalcode = useAdress({
    type: "postalcode",
    id: subistrictId,
    cityId: districtId,
  });

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
    { name: "province", data: provincies },
    { name: "city", data: cities },
    { name: "district", data: district },
    { name: "postalCode", data: postalcode },
  ];

  const handleClick = () => {
    onSubmit?.(form.getValues());
  };

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
                            {form.watch(fieldList.name) ??
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
                                        form.setValue(
                                          fieldList.name,
                                          prov.text
                                        );
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
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
