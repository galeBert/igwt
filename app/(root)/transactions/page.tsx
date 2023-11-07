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
  // const transactions = await getTransactions(userId ?? "");
  // console.log("aaa", transactions);

  return (
    <div>
      Transaction
      <TransactionTable userId={userId} />
      {/* <DataTable columns={columns} data={transactions} /> */}
    </div>
  );
}
