"use client";

import { useUserData } from "@/hooks/useUserData";
import { useRef } from "react";

function StoreInitializer({ balance }: { balance: number }) {
  const initialized = useRef(false);
  if (!initialized.current) {
    useUserData.setState({ balance });
    initialized.current = true;
  }
  return null;
}

export default StoreInitializer;
