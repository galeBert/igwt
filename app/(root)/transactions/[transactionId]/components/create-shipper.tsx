"use client";
import { createOrder } from "@/actions/create-order";
import { getTransaction } from "@/actions/get-transaction";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Label } from "@/components/ui/label";
import { TTransactionData } from "@/hooks/use-create-transaction";
import { axios } from "@/lib/axios";
import { ShippingPriceListData } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import { CheckCircledIcon } from "@radix-ui/react-icons";

import { BoxIcon, Loader2, PencilIcon } from "lucide-react";
import React, { useState } from "react";
import useSWR from "swr";
interface CreateShipperProps {
  transactionId: string;
  bank?: string;
  data: TTransactionData;
}

export default function CreateShipper({
  transactionId,
  data,
}: CreateShipperProps) {
  const {
    data: datas,
    error,
    isLoading,
    mutate,
  } = useSWR(`single-transaction`, () => getTransaction(transactionId));
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const isSender = data.userId === user?.id && data.role === "sender";

  const handleUpdateTransaction = async () => {
    setLoading(true);
    if (!data.shipping && data) {
      const shipdata = await axios.post("/api/biteship/courier-rate", {
        origin_area_id: data.sender?.address_id,
        destination_area_id: data.reciever?.address_id,
        items: [
          {
            name: data.package_detail?.name,
            description: data.package_detail?.description,
            value: 0,
            length: 10,
            width: 10,
            height: data.package_detail?.height,
            weight: data.package_detail?.weight,
            quantity: 1,
          },
        ],
      });

      await axios.patch(`/api/transactions`, {
        transactionId,
        shipping: { ...shipdata.data },
      });
    }
    mutate();
    setLoading(false);
  };

  const handleChooseShipping = async (selected: ShippingPriceListData) => {
    setLoading(true);
    if (data) {
      await axios
        .patch(`/api/transaction/${data.id}`, {
          transactionId,
          selectedShipper: { ...selected },
          status: "001",
        })
        .then(async () => {
          await axios.post(`/api/transaction/${data.id}/transaction-log`, {
            role: data.role,
            description: `already selected shipping to ${selected.company} `,
            status: "complete",
          });
        })
        .catch(async () => {
          await axios.post(`/api/transaction/${data.id}/transaction-log`, {
            role: data.role,
            description: `already selected shipping to ${selected.company} `,
            status: "failed",
          });
        });
    }
    mutate();
    setOpen(false);
    setLoading(false);
  };

  const handleRequestPickup = async () => {
    setLoading(true);
    if (
      datas?.sender &&
      datas?.reciever &&
      datas.selectedShipper &&
      datas?.package_detail
    ) {
      const { sender, reciever, package_detail, selectedShipper } = datas;
      await createOrder({
        packageItems: [package_detail],
        reciever,
        selectedShipper,
        sender,
        transactionId,
      });
      mutate();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {data.selectedShipper &&
      data.payment?.bill_payment.status === "SUCCESSFUL" &&
      !data.shipping_status &&
      isSender ? (
        <Button
          disabled={loading}
          className="space-x-1 flex items-center relative"
          onClick={handleRequestPickup}
        >
          {loading ? (
            <div className="flex justify-center items-center w-full space-x-2">
              <Loader2 className="w-5 animate-spin" />
              <span>requesting...</span>
            </div>
          ) : (
            <>
              <div className="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </div>
              <div className="flex justify-center items-center w-full space-x-2">
                <BoxIcon className="w-5 " />
                <span>Request Pickup</span>
              </div>
            </>
          )}
        </Button>
      ) : null}
      {!isSender ? (
        <DialogTrigger onClick={handleUpdateTransaction} asChild>
          <Button className="space-x-1">
            {datas?.selectedShipper ? (
              <>
                <CheckCircledIcon className="bg-green-600 rounded-full text-white w-5 h-5 " />
                <p>Shippier Selected</p>
              </>
            ) : (
              <p>Click here to choose shipping</p>
            )}
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Shipping</DialogTitle>
          <DialogDescription>
            Choose one of this shipping service
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="flex flex-col space-y-2">
            <Label>Address</Label>
            <div className="flex items-center">
              <Label className="text-sm">Jl. artileri no.10</Label>
              <Button className="space-x-2 flex" variant="link" size="sm">
                <PencilIcon width={16} className="pr-1" /> edit
              </Button>
            </div>
          </div>

          <Card>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {datas?.shipping?.pricing.map((shipper, key) => {
                  return (
                    <AccordionItem key={key} value={shipper.courier_name}>
                      <AccordionTrigger>
                        {shipper.courier_name}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="w-full">
                          <div className="flex w-full justify-between items-center">
                            <div className="flex flex-col">
                              <h1>{shipper.service_type}</h1>
                              <h1>{shipper.duration}</h1>
                            </div>
                            <h3>{shipper.price}</h3>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              className="w-full"
                              disabled={loading || isLoading}
                              onClick={() => handleChooseShipping(shipper)}
                            >
                              {loading ? (
                                <div className="flex justify-center items-center w-full space-x-2">
                                  <Loader2 className="w-5 animate-spin" />
                                  <span>loading...</span>
                                </div>
                              ) : (
                                "Select"
                              )}
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
