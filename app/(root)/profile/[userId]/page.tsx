import { getUserData } from "@/actions/get-user-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { currentUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";
import React from "react";
import ProfileInfo from "./components/profile-info";

export default async function page() {
  const userData = await currentUser();
  const fUserData = await getUserData(userData?.id ?? "");

  const translatedUserData: User = JSON.parse(JSON.stringify(userData));

  return (
    <div>
      <CardTitle>Profile</CardTitle>
      <Card className="mt-4 hover:dark:bg-gray-900">
        <CardHeader className="">
          <div className="flex space-x-2 py-1 px-2 focus:ring-2 focus:ring-black items-center">
            <Avatar className="w-12 h-12">
              <AvatarImage
                className="rounded-full"
                src="https://github.com/shadcn.png"
                alt="@shadcn"
              />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{translatedUserData.firstName}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {translatedUserData.emailAddresses[0].emailAddress}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Separator />
          <CardTitle className="text-xl">Address</CardTitle>
          <ProfileInfo data={fUserData} />
        </CardContent>
      </Card>
    </div>
  );
}
