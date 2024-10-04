"use client";
import { CardTitle } from "@/components/ui/card";
import { useUserData } from "@/hooks/useUserData";

import { formatter } from "@/lib/utils";
import { useEffect } from "react";

export default function Balance({ balance }: { balance: number }) {
  const { balance: currBalance, setBalance } = useUserData();
  useEffect(() => {
    setBalance(balance);
  }, [balance]);

  return <CardTitle>{formatter.format(currBalance)}</CardTitle>;
}
