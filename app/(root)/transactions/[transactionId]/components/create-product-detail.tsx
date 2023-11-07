"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TTransactionData } from "@/hooks/use-create-transaction";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useState } from "react";

interface CreatePaymentProps {
  userId?: string;
  bank?: string;
  data: TTransactionData;
}
const bankList = [
  {
    name: "BCA",
    value: "bca",
    imageeUrl:
      "https://baradesain.files.wordpress.com/2010/10/bca-bank-logo_logo-bagus-03.jpg",
  },
  {
    name: "BNI",
    value: "bni",
    imageeUrl:
      "https://pbs.twimg.com/profile_images/1623963744710832128/0AO3tjpL_400x400.png",
  },
  {
    name: "BRI",
    value: "bri",
    imageeUrl:
      "https://asset-2.tstatic.net/aceh/foto/bank/images/Logo-Bank-BRI-3.jpg",
  },
  {
    name: "MANDIRI",
    value: "mandiri",
    imageeUrl: "https://assets.dataindonesia.id/1638361092603_45_blob",
  },
];
export default function CreateProductDetail({
  userId,
  data,
}: CreatePaymentProps) {
  const [price, setPrice] = useState(0);
  const [name, setName] = useState("");
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [description, setDescription] = useState("");
  const { user } = useUser();
  const isSender = data.userId === user?.id && data.role === "sender";

  const handleUpdatePackagedetail = async () => {
    if (data) {
      await axios.patch(`/api/transactions`, {
        transactionId: data.id,
        price,
        package_detail: {
          name,
          height,
          weight,
          description,
        },
      });
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add product detail</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Payment</DialogTitle>
          <DialogDescription>
            Choose one of this payment service
          </DialogDescription>
        </DialogHeader>
        <Card>
          <CardContent className="space-y-6">
            <div className="flex flex-col space-y-3 py-2">
              <Label className="text-xl ">Price</Label>
              <div className="flex space-x-2 items-center">
                <Label className="text-lg  text-slate-600">Rp.</Label>
                <Input
                  defaultValue={data.price}
                  onChange={(e) => setPrice(Number(e.currentTarget.value))}
                  type="number"
                />
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-xl">Details</Label>
              <Separator />

              <div className="flex items-center justify-between">
                <Label>Name</Label>
                <div className="flex space-x-3 items-center">
                  <Input
                    defaultValue={data.package_detail?.name}
                    onChange={(e) => setName(e.currentTarget.value)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label>Weight</Label>
                <div className="flex space-x-3 items-center">
                  <Input
                    defaultValue={data.package_detail?.weight}
                    onChange={(e) => setWeight(Number(e.currentTarget.value))}
                    type="number"
                    className="w-20"
                  />
                  <Label className="text-lg w-8  text-slate-600">Kg</Label>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label>Height</Label>
                <div className="flex space-x-3 items-center ">
                  <Input
                    defaultValue={data.package_detail?.height}
                    onChange={(e) => setWeight(Number(e.currentTarget.value))}
                    type="number"
                    className="w-20"
                  />
                  <Label className="text-lg w-8 text-slate-600">Cm</Label>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Description</Label>
              <div className="flex space-x-3 items-center">
                <Input
                  defaultValue={data.package_detail?.description}
                  onChange={(e) => setDescription(e.currentTarget.value)}
                />
              </div>
            </div>
            <Separator />

            <Button onClick={handleUpdatePackagedetail} className="w-full">
              Confirm
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
