"use client";
import React, { useState } from "react";
import Spline from "@splinetool/react-spline";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { SignIn } from "@clerk/nextjs";
import Modal from "@/components/ui/modal";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full h-screen overflow-hidden flex -top-4 left-0 m-0 absolute bg-black">
      <div className="absolute w-full p-4">
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
          <h1 className=" text-white text-xl md:text-4xl font-bold">IGWT</h1>
        </div>
      </div>

      <div
        className={cn(
          `
          absolute 
          top-1/2 
          duration-200 
          opacity-0  
          transition-all 
          -translate-y-1/2 
          z-10 
          translate-x-1/2 
          lg:right-1/4 
          md:right-1/2
          `,
          { "opacity-100": open }
        )}
      >
        <div
          className={cn("relative duration-200 opacity-0  transition-all", {
            "opacity-100": open,
          })}
        >
          <div className="absolute  top-0 left-0 px-[29px]  w-full h-full">
            <div
              className={cn(
                "backdrop-blur-none w-full h-full opacity-0 transition-all duration-300 rounded-2xl",
                {
                  "opacity-100 backdrop-blur-xl": open,
                }
              )}
            />
          </div>
          <SignIn
            appearance={{
              variables: {
                colorBackground: "rgba(0,0,0, 0.4)",
                colorPrimary: "black",
                colorText: "white",
                colorTextSecondary: "white",
              },
            }}
          />
        </div>
      </div>
      <div className=" text-white flex-1 flex items-center">
        <div className="bg-black text-5xl mx-auto p-20 space-y-10">
          <p className="font-medium">
            Transparent
            <br /> and secure transaction
          </p>
          <p className="font-normal text-xl text-slate-300">
            IGWT help you to safely make a transaction with everyone, you can
            live tract ongoing transaction
          </p>
          <div className="flex ">
            <Button
              className="space-x-6 bg-white text-black hover:bg-slate-300 hover:text-black"
              onClick={() => setOpen(!open)}
              size="lg"
            >
              <span>TRY NOW</span>
              <ArrowRight />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 ">
        <Spline
          className=" -scale-x-100"
          scene="https://prod.spline.design/n07cjQnMTMyUsmIk/scene.splinecode"
        />
      </div>
    </div>
  );
}
