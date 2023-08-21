"use client";

import Header from "./Header";
import Footer from "./Footer";
import { useRouter } from "next/router";

// fetch
import React, {
  useEffect,
  useState,
  useContext,
  createContext,
  ReactNode,
} from "react";
import { useMyContext } from "./contexts/AuthenticationContext";
import useSWR from "swr";

// interface LayoutProps {
//   children: React.ReactNode;
//   error?: unknown | any;
//   data?: any;
//   headerBg?: string;
//   headerTxt?: string;
//   headerSky?: string;
//   footerSky?: string;
// }

// {
//   children,
//   // data,
//   headerBg,
//   headerTxt,
//   headerSky,
//   footerSky,
// }: LayoutProps

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { updateGlobalState } = useMyContext();

  const fetcher = async (url: string) => {
    const response = await fetch(url, {
      method: "GET",
    });
    const data = await response.json();
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
      <main className="flex flex-wrap items-center justify-center font-sans">
        {children}
      </main>
      {/* footerSky={footerSky} */}
      <Footer />
    </div>
  );
}
