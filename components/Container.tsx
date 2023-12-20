"use client";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ContainerProps {
  children: React.ReactNode;
}

export default function Container({ children }: ContainerProps) {
  const [mounted, setMounted] = useState(false);
  // const { isSignedIn, isLoaded } = useUser();
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  // const pathname = window.location.pathname.split("/");
  // const isSingleTransactionPage =
  //   pathname?.[1] === "transactions" && pathname.length > 2;

  // if (!isSignedIn && isLoaded && !isSingleTransactionPage) {
  //   return redirect("/sign-in");
  // }
  return (
    <main className="container lg:!max-w-[1024px] xl:!max-w-[1280px] 2xl:!max-w-[1536px]  md:!max-w-[768px]  dark:bg-gray-950">
      {children}
    </main>
  );
}
