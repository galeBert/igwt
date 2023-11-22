"use client";
import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { columns } from "./columns";
import useSWR from "swr";
import { getTransactions } from "@/actions/get-transactions";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";

interface TransactionTableProps {
  userId: string | null;
}
export default function TransactionTable({ userId }: TransactionTableProps) {
  const { user, isLoaded } = useUser();
  const email = user?.emailAddresses?.[0].emailAddress;
  const { data, error, isLoading, isValidating } = useSWR(`/asu`, () =>
    getTransactions(email ?? "")
  );
  const newData = data?.map((transaction) => {
    return {
      ...transaction,
      role:
        transaction.userId === user?.id
          ? transaction.role
          : transaction.role === "sender"
          ? "reciever"
          : "sender",
    };
  });

  return (
    <div className="space-y-2">
      <Label className="text-lg">Transaction</Label>
      <DataTable loading={isLoading} columns={columns} data={newData ?? []} />
    </div>
  );
}
