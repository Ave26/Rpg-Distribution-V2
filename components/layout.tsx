"use client";

import Footer from "./Footer";
import { useRouter } from "next/router";
import Image from "next/image";
import ProStockV2 from "@/public/assets/Finally.png";

import React, { ReactNode, useEffect, useState } from "react";
import { useMyContext } from "@/contexts/AuthenticationContext";
import useSWR from "swr";
import { AuthProps } from "@/types/authTypes";
import HamburgerMenuHeader from "./Parts/HamburgerMenuHeader";

import { FaCircleUser } from "react-icons/fa6";
import LogoutButton from "./Parts/LogoutButton";
import { LogoutResponse } from "@/pages/api/user/logout";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { updateGlobalState, globalState, states } = useMyContext();
  const isAuthenticated = globalState?.authenticated as Boolean;

  const fetcher = async (url: string) => {
    const response = await fetch(url, {
      method: "GET",
    });
    const data: AuthProps = await response.json();
    if (data?.authenticated === false || !data?.authenticated) router.push("/");
    updateGlobalState(data);
    console.log(data);
    return data;
  };
  useSWR("/api/authentication", fetcher);

  console.log(globalState?.verifiedToken?.role);
  const [logoutResponse, setLogoutResponse] = useState<LogoutResponse>({
    isLogout: false,
    message: "",
  });

  // useEffect checker
  useEffect(() => {
    console.log(logoutResponse);
    console.log(isAuthenticated);
  }, [logoutResponse, isAuthenticated]);
  useEffect(() => {
    console.log(states?.isActive);
  }, [states?.isActive]);

  return (
    <div className="h-screen">
      {isAuthenticated && (
        <header
          className={`flex w-full justify-between text-fluid-xs shadow-2xl ${
            isAuthenticated ? "h-[10%] " : "h-0"
          }`}
        >
          <div className="flex w-fit items-center justify-center p-2">
            <ProstockIcon />
          </div>
          <div className="flex h-full w-full items-center justify-center gap-2 overflow-hidden sm:w-[40%]">
            <FaCircleUser className="h-10 w-10" />
            <h1 className="font-semibold uppercase">
              Hello {globalState?.verifiedToken?.role ?? "User"}!
            </h1>

            <LogoutButton
              states={{
                logoutResponse,
                setLogoutResponse,
              }}
            />
          </div>
        </header>
      )}
      {/* bg-[#edf0f7] */}
      <main
        className={`h-[90%] w-full bg-slate-500/50  ${
          isAuthenticated ? "h-[90%]" : "h-full"
        }`}
      >
        {children}
      </main>
    </div>
  );
}

function ProstockIcon() {
  return (
    <>
      <div className="relative h-[5em] w-[5em]">
        <Image src={ProStockV2} alt={"rpg"} priority />
      </div>
    </>
  );
}

// bg-gradient-to-b from-[#efbf04] via-blue-500 to-cyan-300
