"use client";
import Header from "@/components/Misc/Header";
import Sidebar from "@/components/Misc/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { NextStepProvider, NextStep } from "nextstepjs";
import { steps } from "@/lib/step";
import { useGlobalState } from "@/context/GlobalContext";

export default function MindPlayLayout({ children }) {
  const { sidebarState } = useGlobalState();
  return (
    <NextStepProvider>
      <NextStep steps={steps}>
        <div
          className={`h-screen flex relative ${
            sidebarState && "max-lg:bg-black/20"
          } `}
        >
          <Sidebar />

          <main
            className={`relative h-screen w-full p-5 flex flex-col justify-start overflow-y-scroll ${
              sidebarState && "max-lg:-z-10"
            }`}
          >
            <Header />
            {children}
          </main>

          <Toaster />
        </div>
      </NextStep>
    </NextStepProvider>
  );
}
