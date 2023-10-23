"use client";
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
import { converter, db } from "@/lib/firebase";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { PencilIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

interface CreateShipperProps {
  userId?: string;
  bank?: string;
  data: TTransactionData;
}
export default function CreateShipper({ userId, data }: CreateShipperProps) {
  const [test, setTest] = useState<TTransactionData>();
  const { user } = useUser();
  const isSender = data.userId === user?.id && data.role === "sender";

  useEffect(() => {
    const q = doc(db, "transactions", data.id ?? "").withConverter(
      converter<TTransactionData>()
    );
    const unsub = onSnapshot<TTransactionData, any>(q, (doc) => {
      const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
      console.log(source, " data: ", doc.data());
      if (doc.exists()) {
        const a = doc.data();
        setTest(a);
      }
    });

    return unsub;
  }, [data.id]);

  // console.log("asdasdasdas", aa);
  console.log(data);

  const handleUpdateTransaction = async () => {
    if (!data.shipping && data) {
      const shipdata = await axios.post(
        "https://api.biteship.com/v1/rates/couriers",
        {
          origin_area_id: data.sender?.address_id,
          destination_area_id: data.reciever?.address_id,
          couriers: "jne,jnt,sicepat,ninja",
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
        },
        {
          headers: {
            Authorization:
              "biteship_test.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCBrdXJpciIsInVzZXJJZCI6IjY1MDNmZDNiMWI2NDI1MWNiOWQ5NmU4NiIsImlhdCI6MTY5NTkzMzYzOX0.sAGBBCynEHDzw1flpZFy7vsvFwg5jtIW_EIE-zdGmFs",
          },
        }
      );

      await axios.patch(`/api/transactions`, {
        transactionId: data.id,
        shipping: { ...shipdata.data },
      });
      await axios.get(`/api/transaction/${data.id}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger onClick={handleUpdateTransaction}>
        Click here to choose shipping
      </DialogTrigger>
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
                {test?.shipping?.pricing.map((shipper, key) => {
                  return (
                    <AccordionItem key={key} value={shipper.courier_name}>
                      <AccordionTrigger>
                        {shipper.courier_name}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col">
                            <h1>{shipper.service_type}</h1>
                            <h1>{shipper.duration}</h1>
                          </div>
                          <h3>{shipper.price}</h3>
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
