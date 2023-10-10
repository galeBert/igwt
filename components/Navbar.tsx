"use client";
import { UserButton } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";
import React from "react";
import { ThemeButton } from "./theme-button";

interface NavbarProps {
  userData?: User | null;
}
export default function Navbar({ userData }: NavbarProps) {
  return (
    <div className="flex justify-between items-center p-2">
      <h1 className="text-4xl font-bold">IGWT</h1>

      <div className="flex space-x-4 items-center">
        <ThemeButton />
        <div className="py-2 px-4 items-center rounded-md hover:bg-slate-100 dark:hover:bg-gray-800 flex space-x-4">
          <div className="flex flex-col items-end">
            <span>Welcome back!</span>
            <span>{userData?.firstName}</span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}
