"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { UserData } from "@/hooks/use-create-transaction";
import { useUser } from "@clerk/nextjs";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { CalendarDays } from "lucide-react";
import React from "react";

interface AvatarDetailProps {
  badge: "sender" | "reciever";
  userData: UserData;
}
export default function AvatarDetails({ badge, userData }: AvatarDetailProps) {
  const { user } = useUser();
  return (
    <div className="flex flex-col space-y-1  items-center">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex items-center space-x-1">
        <h1 className="h-full">{userData.name}</h1>
        {userData.name === user?.firstName ? (
          <h1>{" (You)"}</h1>
        ) : (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" className="w-fit h-fit px-0 pt-2">
                <InfoCircledIcon />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="">
              <div className="flex justify-between space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>VC</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">{userData.name}</h4>
                  <p className="text-sm">
                    {userData.city},{userData.district},{userData.province},
                    {userData.postalCode}
                  </p>
                  <div className="flex items-center pt-2">
                    <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                    <span className="text-xs text-muted-foreground">
                      Joined December 2021
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        )}
      </div>

      <Badge>{badge}</Badge>
    </div>
  );
}
