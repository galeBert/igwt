import { getUserData } from "@/actions/get-user-data";
import StoreInitializer from "@/components/store-initializer";
import { Separator } from "@/components/ui/separator";
import { useUserData } from "@/hooks/useUserData";
import { auth, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import Sidebar from "./components/sidebar";

export default async function layout({ children }: { children: ReactNode }) {
  const userData = await currentUser();

  const translatedUserData = JSON.parse(JSON.stringify(userData));
  const fUserData = await getUserData(userData?.id ?? "");

  useUserData.setState({
    balance: fUserData.balance,
    userId: fUserData.userId,
  });

  return (
    <Container>
      <StoreInitializer balance={fUserData.balance} userId={fUserData.userId} />

      <Navbar userData={translatedUserData} />

      <div className=" space-x-2 flex">
        <div className="w-1/4 hidden lg:block space-y-4">
          <Separator className=" rounded-md" />
          <Sidebar />
        </div>
        <div className="w-full space-y-4">
          <Separator className=" rounded-md" />
          {children}
        </div>
      </div>
    </Container>
  );
}
