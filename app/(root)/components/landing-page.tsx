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
    <div className="w-full h-screen overflow-hidden flex -top-4 left-0 m-0 absolute bg-[#030304]">
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "w-full  absolute h-full z-[11] backdrop-blur-sm bg-white    bg-opacity-10",
          {
            "bg-transparent pointer-events-none backdrop-blur-none ": !open,
          }
        )}
      />
      <div className="absolute z-[11] w-full p-4">
        <div className="flex  items-center space-x-2 w-9">
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
          z-[12] 
          translate-x-1/2 
          lg:right-1/4 
          right-1/2 pointer-events-none
          
          `,
          { "opacity-100 pointer-events-auto": open }
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
                colorBackground: "rgba(0,0,0, 0.7)",
                colorPrimary: "black",
                colorText: "white",
                colorTextSecondary: "white",
                colorAlphaShade: "white",
              },
            }}
          />
        </div>
      </div>
      <div className="absolute lg:relative z-10  h-full text-white flex-1 flex items-center backdrop-blur-sm md:backdrop-blur-none">
        <div className="text-5xl mx-auto md:p-20 p-5  space-y-10">
          <p className="font-medium">
            Transparent
            <br /> and secure transaction
          </p>
          <p className="font-normal text-xl md:max-w-sm text-slate-300">
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

      <div className="flex-1 flex h-full  absolute md:relative ">
        <div className="block sm:hidden w-0 md:w-1/4 lg:hidden" />
        <Spline
          className=" -scale-x-100 translate-x-1/3 lg:translate-x-0"
          scene="https://prod.spline.design/n07cjQnMTMyUsmIk/scene.splinecode"
        />
      </div>
    </div>
  );
}
