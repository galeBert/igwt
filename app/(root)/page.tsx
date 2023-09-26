import { useTransactions } from "@/hooks/use-transactions";
import { useState } from "react";

import CreateOrder from "./components/create-order";

export default async function Home() {
  const test = await useTransactions();

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      hi
      <CreateOrder transaction={test} />
    </div>
  );
}
