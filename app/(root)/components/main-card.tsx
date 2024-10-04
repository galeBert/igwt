import { getUserData } from "@/actions/get-user-data";
import { CashOutMoneyModal } from "@/components/cash-out-modal";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import Balance from "./balance";
import CreateTransactionsButton from "./crt-trnsctn-btn";

interface MainCardProps {
  userId: string;
}
export default async function MainCard({ userId }: MainCardProps) {
  const fUserData = await getUserData(userId ?? "");

  return (
    <>
      <CardContent
        className={`backdrop-blur-sm  md:backdrop-blur-2xl relative w-full 
        md:w-fit
        md:m-5
        md:pb-0
        p-0
        rounded-lg`}
      >
        <div className="bg-white pointer-events-none absolute w-full h-full left-0 rounded-md opacity-5" />
        <CardHeader className="w-full">
          <CardTitle className="text-xl">Balance</CardTitle>

          <Balance balance={fUserData.balance} />
        </CardHeader>
        <CardContent className="space-y-3 ">
          <CardDescription>What are you gonna do today?</CardDescription>
          <div className="space-x-3">
            <CreateTransactionsButton user={fUserData} />
            {/* <Button onClick={handleCreateTransaction}>Create new order</Button> */}

            <CashOutMoneyModal userId={userId} />
          </div>
        </CardContent>
        {/* <AddUserAddresModal onSubmit={() => {}} /> */}
      </CardContent>
    </>
  );
}
