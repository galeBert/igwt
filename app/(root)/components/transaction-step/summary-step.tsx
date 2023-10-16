"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useCreateTransactionModal } from "@/hooks/use-create-transaction";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

import { ArrowRightIcon } from "lucide-react";
import React from "react";
import AvatarDetails from "../avatar-details";

interface SummaryStepProps {
  onCancel: () => void;
  onSubmit: () => void;
}
export default function SummaryStep({ onCancel, onSubmit }: SummaryStepProps) {
  const { transaction } = useCreateTransactionModal();
  const { user } = useUser();
  const handleClick = async () => {
    if (user) {
      await axios.post(`/api/${user.id}/transaction`, transaction);
    }
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle>Summary</DialogTitle>
        <DialogDescription>
          please re-check and make sure your request is valid, after that you
          good to go!
        </DialogDescription>
      </DialogHeader>

      <div className="flex p-2 w-full justify-center items-center space-x-6">
        {transaction.sender && transaction.reciever ? (
          <>
            <AvatarDetails badge="sender" userData={transaction.sender} />

            <ArrowRightIcon />
            <AvatarDetails badge="reciever" userData={transaction.reciever} />
          </>
        ) : null}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="text-sm font-extralight space-y-3">
          <div>
            <h2>Product name:</h2>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button className="p-0" variant="link">
                  {transaction.package_detail?.name}
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-fit">
                <div className="flex flex-col space-x-1">
                  <div className=" flex space-x-2 items-center">
                    <h4 className="text-sm font-semibold">weight: </h4>
                    <p className="text-sm">
                      {transaction.package_detail?.weight} kg
                    </p>
                  </div>
                  <div className=" flex space-x-2 items-center">
                    <h4 className="text-sm font-semibold">height: </h4>
                    <p className="text-sm">
                      {transaction.package_detail?.height} cm
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <div>
            <h2>Price:</h2>
            <h2>Rp.{transaction.price}</h2>
          </div>
          <div>
            <h2>Shipment:</h2>
            <h2 className="italic">
              {transaction.shipping?.shipping_type ?? "fill by buyer"}
            </h2>
          </div>
          <div>
            <h2>Shipment Price:</h2>
            <h2 className="italic">
              {transaction.shipping?.shipping_type ?? "fill by buyer"}
            </h2>
          </div>
        </CardContent>
      </Card>
      <div className="flex w-full space-x-3 justify-end">
        <Button variant="secondary" onClick={onCancel}>
          Back
        </Button>
        <Button onClick={handleClick}>Submit</Button>
      </div>
    </>
  );
}
