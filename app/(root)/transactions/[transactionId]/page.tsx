import { getTransaction } from "@/actions/get-transaction";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Label } from "@/components/ui/label";
import React from "react";
import { columns } from "./components/columns";
import CreatePayment from "./components/create-payment";
import CreateShipper from "./components/create-shipper";
import tasks from "./data/tasks.json";

export default async function page({
  params,
}: {
  params: { transactionId: string };
}) {
  const data = await getTransaction(params.transactionId);

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <CardTitle>Detail Transaction</CardTitle>
        <Badge className="bg-yellow-400">Waiting for approval</Badge>
      </div>

      <div className="flex w-full space-x-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Status</CardTitle>
          </CardHeader>
          <CardContent className="space-x-6 grid grid-cols-2">
            <div className="flex flex-col space-y-4 justify-between">
              <div className="flex flex-col space-y-2">
                <Label>Shipping:</Label>
                <Label className="italic text-sm">
                  <CreateShipper data={data} />
                </Label>
              </div>
              <div className="flex flex-col space-y-2">
                <Label>Payment:</Label>
                <Label className="italic text-sm">
                  <CreatePayment data={data} />
                </Label>
              </div>

              <div className="flex flex-col space-y-2">
                <Label>Total Price:</Label>
                <Label className="italic text-sm">Rp.10.000</Label>
              </div>
            </div>
            <div className="flex flex-col space-y-4 justify-between">
              <div className="flex flex-col space-y-2">
                <Label>Package Name:</Label>
                <Label className="italic text-sm">not set</Label>
              </div>
              <div className="flex flex-col space-y-2">
                <Label>Sender:</Label>
                <Label className="italic text-sm">not set</Label>
              </div>
              <div className="flex flex-col space-y-2">
                <Label>Reciever:</Label>
                <Label className="italic text-sm">Rp.10.000</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Label>Transaction Log</Label>
        <DataTable data={tasks} columns={columns} />
      </div>
    </div>
  );
}
