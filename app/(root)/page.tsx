import { getUserData } from "@/actions/get-user-data";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateTransactionModal } from "@/hooks/use-create-transaction";
import { auth } from "@clerk/nextjs";
import axios from "axios";
import CreateTransactionModal from "./components/create-transaction-modal";
import MainCard from "./components/main-card";

export default async function Home() {
  const { userId } = auth();
  const fUserData = await getUserData(userId ?? "");

  return (
    <>
      <div className=" space-x-2 flex">
        <div className="w-full">
          <Card className="mt-4 hover:dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-xl">Balance</CardTitle>
              <CardTitle>Rp.100.000.000</CardTitle>
            </CardHeader>
            <MainCard />
          </Card>
        </div>
      </div>
      <CreateTransactionModal fUserData={fUserData} />
    </>
  );
}
