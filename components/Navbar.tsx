"use client";
import Sidebar from "@/app/(root)/components/sidebar";
import { db } from "@/lib/firebase";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import {
  and,
  collection,
  onSnapshot,
  or,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ThemeButton } from "./theme-button";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "./ui/menubar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

interface NavbarProps {
  userData?: User | null;
}
export default function Navbar({ userData }: NavbarProps) {
  const [notification, setNotification] = useState<any[]>([]);
  useEffect(() => {
    if (userData?.emailAddresses[0].emailAddress) {
      const q = query(
        collection(db, `transactions`),
        and(
          where(
            "notReadBy",
            "array-contains",
            userData.emailAddresses[0].emailAddress
          ),
          or(
            where(
              "sender.email",
              "==",
              userData.emailAddresses[0].emailAddress
            ),
            where(
              "reciever.email",
              "==",
              userData.emailAddresses[0].emailAddress
            )
          )
        ),

        orderBy("createdAt", "asc")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = {
            ...doc.data(),
            id: doc.id,
          } as unknown;

          setNotification((prev) => {
            return [data];
          });
        });
      });

      return unsubscribe;
    }
  }, [userData?.emailAddresses]);

  console.log(notification);

  return (
    <div className="fixed md:relative z-50 px-4 md:px-0 w-full md:h-[72px] left-0 h-[56px]">
      <div className="flex z-20 w-full left-0 backdrop-blur-xl dark:bg-black bg-white bg-opacity-50 sticky top-0 justify-between items-center  py-2 md:py-2 ">
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
          <Link href="/" className=" text-xl md:text-4xl font-bold">
            IGWT
          </Link>
        </div>
        <Sheet>
          <SheetTrigger asChild className="block lg:hidden">
            <Button variant="outline" size="icon">
              <HamburgerMenuIcon width={40} />
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col space-x-3">
            <Card className="mt-10 ">
              <div className=" space-x-4 w-full items-center justify-between px-3 flex">
                <ThemeButton />
                <div className="py-2 px-4 items-center rounded-md hover:bg-slate-100 dark:hover:bg-gray-800 flex space-x-4">
                  <div className="flex flex-col items-start">
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
          <SignedIn>
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>
                  <Bell />
                </MenubarTrigger>
                <MenubarContent align="end">
                  <MenubarItem>
                    New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>New Window</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Share</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Print</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
