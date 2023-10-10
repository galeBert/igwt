"use client";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

export default function SummaryStep() {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Summary</DialogTitle>
        <DialogDescription>
          please re-check and make sure your request is valid, after that you
          good to go!
        </DialogDescription>
      </DialogHeader>
    </>
  );
}
