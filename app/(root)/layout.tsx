import { Separator } from "@/components/ui/separator";
import { auth, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import Sidebar from "./components/sidebar";

export default async function layout({ children }: { children: ReactNode }) {
  const { userId } = auth();
  const userData = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }
  const translatedUserData = JSON.parse(JSON.stringify(userData));

  return (
    <Container>
      <Navbar userData={translatedUserData} />

      <div className=" space-x-2 flex">
        <div className="w-1/4 space-y-4">
          <Separator className="h-1 rounded-md" />
          <Sidebar />
        </div>
        <div className="w-full space-y-4">
          <Separator className="h-1 rounded-md" />
          {children}
        </div>
      </div>
    </Container>
  );
}
