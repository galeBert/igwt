"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import axios from "axios";
import { collection, query, onSnapshot } from "firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";

interface CreateOrderProps {
  transaction?: any[];
}
export default function CreateOrder({ transaction }: CreateOrderProps) {
  const [first, setfirst] = useState(false);

  useEffect(() => {
    setfirst(true);
  }, []);

  const [test, setTest] = useState<any | null>(null);
  const handleClick = async () => {
    await axios.post("/api");
  };

  useEffect(() => {
    const q = query(collection(db, "transactions"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setTest(doc.data());
      });
    });

    return unsub;
  }, []);
  if (!first) return null;
  return (
    <div>
      create-order
      {test ? (
        <div>
          <p>order status: {test.transaction_status}</p>
          <p>VA status: {test.va_numbers[0].va_number}</p>
        </div>
      ) : null}
      <Button onClick={handleClick}>place order</Button>
    </div>
  );
}
