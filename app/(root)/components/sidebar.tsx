"use client";
import { Button } from "@/components/ui/button";
import { SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  const navList = [
    { name: "Dashboard", href: "/" },
    { name: "Transaction", href: "/transactions" },
    { name: "Cash Log", href: "/cash-out" },
    { name: "Profile", href: `/profile/${user?.id}` ?? "" },
  ];

  return (
    <div className="flex flex-col space-y-4 justify-between items-center w-full h-full px-2">
      <div className="flex flex-col w-full space-y-2 justify-center">
        {navList.map((nav, idx) => {
          return (
            <Link className="w-full" key={idx} href={nav.href}>
              <Button
                variant={pathname === nav.href ? "default" : "ghost"}
                className="text-right flex justify-end lg:text-left w-full lg:justify-start"
              >
                {nav.name}
              </Button>
            </Link>
          );
        })}
      </div>
      <SignOutButton>
        <Button className="bg-red-500 w-full text-white">Sign Out</Button>
      </SignOutButton>
    </div>
  );
}
