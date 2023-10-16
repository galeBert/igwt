import { getTransactions } from "@/actions/get-transactions";
import { DataTable } from "@/components/ui/data-table";
import { auth } from "@clerk/nextjs";
import axios from "axios";
import React from "react";
import { columns } from "./components/columns";

export default async function page() {
  const { userId } = auth();
  const transactions = await getTransactions(userId ?? "");
  return (
    <div>
      trnasaction
      <DataTable columns={columns} data={transactions} />
    </div>
  );
}
