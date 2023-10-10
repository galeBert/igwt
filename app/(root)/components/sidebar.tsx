"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navList = [
  { name: "Dashboard", href: "/" },
  { name: "Transaction", href: "/transaction" },
  { name: "Profile", href: "/profile" },
];
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col space-y-4 justify-center">
      {navList.map((nav, idx) => {
        return (
          <Button
            variant={pathname === nav.href ? "default" : "ghost"}
            className="text-left justify-start"
            key={idx}
          >
            <Link href={nav.href}>{nav.name}</Link>
          </Button>
        );
      })}
    </div>
  );
}
