"use client";
import Sidebar from "@/app/(root)/components/sidebar";
import { UserButton } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import React from "react";
import { ThemeButton } from "./theme-button";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

interface NavbarProps {
  userData?: User | null;
}
export default function Navbar({ userData }: NavbarProps) {
  return (
    <div className="flex justify-between items-center p-2">
      <div className="flex items-center space-x-2 w-9">
        <Image
          width={36}
          height={36}
          alt="IGWT"
          src={
            "https://firebasestorage.googleapis.com/v0/b/igwt-3b1a7.appspot.com/o/fix-igwt-bordered-logo.png?alt=media&token=243eb52a-16ad-469e-8b1e-991cd873e436"
          }
          className="md:w-9 w-5"
        />
        <h1 className=" text-xl md:text-4xl font-bold">IGWT</h1>
      </div>
      <Sheet>
        <SheetTrigger asChild className="block lg:hidden">
          <Button variant="outline" className="px-2">
            <HamburgerMenuIcon width={40} />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col space-x-3">
          <Card className="mt-10 ">
            <div className=" space-x-4 w-full items-center justify-between px-3 flex">
              <ThemeButton />
              <div className="py-2 px-4 items-center rounded-md hover:bg-slate-100 dark:hover:bg-gray-800 flex space-x-4">
                <div className="flex flex-col items-end">
                  <span>Welcome Back</span>
                  <span>{userData?.firstName}</span>
                </div>
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </Card>
          <Sidebar />
        </SheetContent>
      </Sheet>
      <div className=" space-x-4 items-center hidden lg:flex">
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
