"use client";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription } from "@/components/ui/card";
import { useCreateTransactionModal } from "@/hooks/use-create-transaction";
import axios from "axios";
import React from "react";

export default function MainCard() {
  const { onOpen } = useCreateTransactionModal();
  const handleOnClick = async () => {
    await axios.get("/api/maps/areas");
  };
  return (
    <CardContent className="space-y-3">
      <CardDescription>What are you gonna do today?</CardDescription>
      <div className="space-x-3">
        <Button onClick={onOpen}>Create new order</Button>
        <Button onClick={handleOnClick} variant="secondary">
          Transaction History
        </Button>
      </div>
    </CardContent>
  );
}
