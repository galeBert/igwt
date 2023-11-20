"use client";

import { useUserData } from "@/hooks/useUserData";
import { useRef } from "react";

function StoreInitializer({
  balance,
  userId,
}: {
  balance: number;
  userId: string;
}) {
  const initialized = useRef(false);
  if (!initialized.current) {
    useUserData.setState({ balance, userId });
    initialized.current = true;
  }
  return null;
}

export default StoreInitializer;
