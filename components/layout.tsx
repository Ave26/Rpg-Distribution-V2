"use client";

import Footer from "./Footer";
import { useRouter } from "next/router";

import React, { ReactNode, useEffect, useState } from "react";
import { useMyContext } from "@/contexts/AuthenticationContext";
import useSWR from "swr";
import { AuthProps } from "@/types/authTypes";
import HamburgerMenuHeader from "./Parts/HamburgerMenuHeader";

import { FaCircleUser } from "react-icons/fa6";
import { ProstockIcon } from "./Admin/dashboardLayout";
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
          className={`flex w-full justify-between shadow-2xl ${
            isAuthenticated ? "h-[8%] " : "h-[5%]"
          }`}
        >
          <div className="flex h-full w-[20%] items-center justify-center gap-3">
            <HamburgerMenuHeader />
            <div className="flex items-center justify-center gap-1">
              <ProstockIcon />
              <h1 className="text-base font-extrabold text-sky-600">
                RPG-ProStock
              </h1>
            </div>
          </div>
          <div className="flex h-full w-[20%] items-center justify-center gap-2">
            <FaCircleUser className="h-10 w-10 text-yellow-500" />
            <h1 className="font-extrabold uppercase">
              {globalState?.verifiedToken?.role ?? "User"}
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

      <main
        // className={`${
        //   isAuthenticated
        //     ? "bg-gradient-to-tr from-[#3960cd] via-[#5665d9] to-[#4877fa]"
        //     : "bg-gradient-to-b from-cyan-300 to-blue-500"
        // } h-screen`}

        className={`h-[92%] bg-[#edf0f7] ${
          isAuthenticated ? "h-[92%]" : "h-full"
        }`}
      >
        {children}
      </main>
      {/* <Footer /> */}
    </div>
  );
}

// bg-gradient-to-b from-[#efbf04] via-blue-500 to-cyan-300
