"use client";
import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { columns } from "./columns";
import useSWR from "swr";
import { getTransactions } from "@/actions/get-transactions";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";
import { getCashTransactions } from "@/actions/get-cash-transactions";

interface TransactionTableProps {
  userId: string | null;
}
export default function CashTransactionTable({
  userId,
}: TransactionTableProps) {
  const { user } = useUser();
  const { data, isLoading } = useSWR(`income`, () =>
    getCashTransactions(user?.id ?? "")
  );
  return (
    <div className="space-y-2">
      <Label className="text-lg">Income & Outcome</Label>
      <DataTable loading={isLoading} columns={columns} data={data ?? []} />
    </div>
  );
}
