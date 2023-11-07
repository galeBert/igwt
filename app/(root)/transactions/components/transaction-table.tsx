"use client";
import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { columns } from "./columns";
import useSWR from "swr";
import { getTransactions } from "@/actions/get-transactions";

interface TransactionTableProps {
  userId: string | null;
}
export default function TransactionTable({ userId }: TransactionTableProps) {
  const { data, error, isLoading } = useSWR(`/asu`, () =>
    getTransactions(userId ?? "")
  );
  console.log("data", data);

  return <DataTable columns={columns} data={data ?? []} />;
}
