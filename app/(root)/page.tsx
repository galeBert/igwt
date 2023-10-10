"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCreateTransactionModal } from "@/hooks/use-create-transaction";
import axios from "axios";
import CreateTransactionModal from "./components/create-transaction-modal";

export default function Home() {
  const { onOpen } = useCreateTransactionModal();
  const handleOnClick = async () => {
    const test = await axios.post("/api");
    console.log(test);
  };
  return (
    <>
      <div className=" space-x-2 flex">
        <div className="w-full">
          <Card className="mt-4 hover:dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-xl">Balance</CardTitle>
              <CardTitle>Rp.100.000.000</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription>What are you gonna do today?</CardDescription>
              <div className="space-x-3">
                <Button onClick={onOpen}>Create new order</Button>
                <Button variant="secondary">Transaction History</Button>
              </div>
            </CardContent>
          </Card>
          {/* <div className="flex space-x-4 flex-1">
        <Card className="w-full hover:dark:bg-slate-200 bg-black dark:bg-slate-50">
          <CardHeader>
            <CardTitle className="dark:text-black text-white text-xl">
              Balance
            </CardTitle>
            <CardTitle className="dark:text-black text-white">
              Rp.100.000.000
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="w-full hover:dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-xl">On hold</CardTitle>
            <CardTitle>Rp.100.000.000</CardTitle>
          </CardHeader>
        </Card>
        <Card className="w-full hover:dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-xl">On hold</CardTitle>
            <CardTitle>Rp.100.000.000</CardTitle>
          </CardHeader>
        </Card>
        <Card className="w-full hover:dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-xl">On hold</CardTitle>
            <CardTitle>Rp.100.000.000</CardTitle>
          </CardHeader>
        </Card>
      </div> */}
        </div>
      </div>
      <CreateTransactionModal />
    </>
  );
}
