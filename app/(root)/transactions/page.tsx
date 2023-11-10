import { getTransactions } from "@/actions/get-transactions";
import { DataTable } from "@/components/ui/data-table";
import { auth } from "@clerk/nextjs";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import React from "react";
import { columns } from "./components/columns";
import TransactionTable from "./components/transaction-table";

export default async function page() {
  const { userId } = auth();

  return (
    <div>
      <TransactionTable userId={userId} />
    </div>
  );
}
