"use client";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Label } from "@/components/ui/label";
import tasks from "../data/tasks.json";
import { columns } from "./columns";
import { useParams } from "next/navigation";
import useSWR from "swr";
import {
  getTransactionLog,
  GetTransactionLogProps,
} from "@/actions/get-transaction-log";
import moment from "moment";
import {
  query,
  collection,
  onSnapshot,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { removeDuplicateObjectFromArray } from "@/lib/helpers";

interface ITransactionLog extends GetTransactionLogProps {
  id: string;
}
export default function TransactionPage() {
  const { transactionId }: { transactionId: string } = useParams();
  const [log, setLog] = useState<ITransactionLog[]>([]);
  const test = "picking_up";
  console.log(test.split("_"), test.split("_").join(" "));

  useEffect(() => {
    const q = query(
      collection(db, `transactions/${transactionId}/transaction-log`),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = {
          ...doc.data(),
          id: doc.id,
        } as unknown as ITransactionLog;
        console.log(doc.exists(), doc.metadata);

        setLog((prev) => {
          return removeDuplicateObjectFromArray([data, ...prev], "id");
        });
      });
    });
    return unsubscribe;
  }, [transactionId]);

  const handleTransaction = async () => {
    await fetch(`/api/transaction/${transactionId}/transaction-log`, {
      method: "POST",
    });
  };
  //   const test = console.log(
  //     new Date(data?.[0].createdAt.seconds + data?.[0].createdAt.nanoseconds)
  //   );

  return (
    <div>
      <Button onClick={handleTransaction}>AddData</Button>
      <Label>Transaction Log</Label>
      <DataTable data={log} columns={columns} />
    </div>
  );
}
