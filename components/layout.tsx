"use client";

import Header from "./Header";
import Footer from "./Footer";
import { useRouter } from "next/router";

import React, { ReactNode } from "react";
import { useMyContext } from "@/contexts/AuthenticationContext";
import useSWR from "swr";
import { AuthProps } from "@/types/authTypes";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { updateGlobalState, globalState } = useMyContext();

  const fetcher = async (url: string) => {
    const response = await fetch(url, {
      method: "GET",
    });
    const data: AuthProps = await response.json();
    if (data?.authenticated === false || !data?.authenticated) router.push("/");
    updateGlobalState(data);
    return data;
  };

  useSWR("/api/authentication", fetcher);

  return (
    <div
      className="transition-all
    ">
      {/* headerBg={headerBg} headerTxt={headerTxt} headerSky={headerSky} */}
      <Header />
      <main className="flex h-full w-full flex-wrap items-center justify-center font-sans">
        {children}
      </main>
      {/* footerSky={footerSky} */}
      <Footer />
    </div>
  );
}
