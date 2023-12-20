"use client";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Label } from "@/components/ui/label";
import tasks from "../data/tasks.json";
import { columns } from "./columns";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { GetTransactionLogProps } from "@/actions/get-transaction-log";
import { query, collection, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { removeDuplicateObjectFromArray } from "@/lib/helpers";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import CreateShipper from "./create-shipper";
import CreatePayment from "./create-payment";
import CreateProductDetail from "./create-product-detail";
import { getTransaction } from "@/actions/get-transaction";

interface ITransactionLog extends GetTransactionLogProps {
  id: string;
}

interface TransactionPageProps {}
export default function TransactionPage() {
  const { transactionId }: { transactionId: string } = useParams();
  const [log, setLog] = useState<ITransactionLog[]>([]);
  const { data } = useSWR("single-transaction", () =>
    getTransaction(transactionId)
  );

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

        setLog((prev) => {
          return removeDuplicateObjectFromArray([data, ...prev], "id");
        });
      });
    });
    return unsubscribe;
  }, [transactionId]);

  return (
    <>
      <div className="h-screen px-4 space-y-2 md:hidden absolute z-50 w-full bg-black dark:bg-neutral-800 left-0 rounded-t-xl top-3/4">
        <div
          onClick={() =>
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
          }
          className="w-1/4 mx-auto bg-white rounded-full h-1 my-3"
        />
        <CardTitle className="text-white">Actions</CardTitle>
        <Card>
          <CardContent className="flex items-center bg-black space-x-2  dark:bg-neutral-800 border-2 border-white rounded-lg relative justify-center pt-4">
            <CardDescription className="absolute text-white">
              No Actions for now
            </CardDescription>
            <div className=" flex flex-1 z-[1] dark:bg-neutral-800 space-x-2 bg-black h-full ">
              <CreateShipper transactionId={transactionId} />
              <CreatePayment transactionId={transactionId} />
              <CreateProductDetail data={data} />
            </div>
          </CardContent>
        </Card>
        <CardTitle className="pt-3 text-white">Transaction Log</CardTitle>
        <DataTable textColor="text-white" data={log} columns={columns} />
      </div>
      <div className="hidden md:block">
        <Label className="text-lg">Transaction Log</Label>
        <DataTable data={log} columns={columns} />
      </div>
    </>
  );
}
