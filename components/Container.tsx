"use client";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ContainerProps {
  children: React.ReactNode;
}

export default function Container({ children }: ContainerProps) {
  const [mounted, setMounted] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  if (!isSignedIn && isLoaded) {
    return redirect("/sign-in");
  }
  return <main className="container dark:bg-gray-950">{children}</main>;
}
