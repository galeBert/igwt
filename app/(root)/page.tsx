import { getUserData } from "@/actions/get-user-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useCreateTransactionModal } from "@/hooks/use-create-transaction";
import { auth } from "@clerk/nextjs";
import axios from "axios";
import Image from "next/image";
import CreateTransactionModal from "./components/create-transaction-modal";
import MainCard from "./components/main-card";
export default async function Home() {
  const { userId } = auth();
  const fUserData = await getUserData(userId ?? "");

  return (
    <>
      <div className=" space-x-2 flex">
        <div className="w-full">
          <Card className="relative overflow-hidden bg-center bg-cover hover:dark:bg-gray-900">
            <div className="absolute  w-full h-full flex flex-col justify-center px-20 items-end ">
              <Label className="text-4xl  font-bold z-10">
                GET 20% CASHBACK
              </Label>
              <Label className="text-2xl z-10">valid until: april 2024</Label>
            </div>
            <div className="absolute left-0 top-1 scale-110  h-full w-[300px] ">
              <Image
                fill
                alt="left-2-main-bg-purple"
                // className="blur-[3px]"
                src="https://firebasestorage.googleapis.com/v0/b/igwt-3b1a7.appspot.com/o/left-2-main-bg-purple.png?alt=media&token=0d26a818-8348-4ae6-ae01-8a9aaa3b8694&_gl=1*1vyydll*_ga*NTY0Mjc2NzI5LjE2OTU1NjQzNDg.*_ga_CW55HF8NVT*MTY5OTY5MzU4OS42My4xLjE2OTk2OTc0NDAuMTkuMC4w"
              />
            </div>
            <div className="absolute -right-3  top-4 h-full w-[200px] ">
              <Image
                fill
                alt="main-bg-a-purple"
                // className="blur-[1px]"
                src="https://firebasestorage.googleapis.com/v0/b/igwt-3b1a7.appspot.com/o/main-bg-a-purple.png?alt=media&token=521dd959-f53e-4d3c-b92e-53218536d2fc&_gl=1*1i2zkyu*_ga*NTY0Mjc2NzI5LjE2OTU1NjQzNDg.*_ga_CW55HF8NVT*MTY5OTY5MzU4OS42My4xLjE2OTk2OTUzMjEuNDYuMC4w"
              />
            </div>
            <CardContent className="backdrop-blur-2xl relative w-fit m-5 px-0 rounded-lg">
              {/* <div className="bg-white absolute w-full h-full left-0 rounded-md opacity-5" /> */}
              <CardHeader>
                <CardTitle className="text-xl">Balance</CardTitle>
                <CardTitle>Rp.100.000.000</CardTitle>
              </CardHeader>
              <MainCard />
            </CardContent>
          </Card>
        </div>
      </div>
      <CreateTransactionModal fUserData={fUserData} />
    </>
  );
}
