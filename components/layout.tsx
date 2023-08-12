import Header from "./Header";
import Footer from "./Footer";
import { useRouter } from "next/router";

// fetch
import useSWR from "swr";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { verifyJwt } from "@/lib/helper/jwt";
import { NextApiRequest } from "next";

interface LayoutProps {
  children: React.ReactNode;
  error?: unknown | any;
  data?: any;
  headerBg?: string;
  headerTxt?: string;
  headerSky?: string;
  footerSky?: string;
}

interface Auth {
  authenticated: boolean;
  verifiedToken: {
    id: string;
    roles: string;
    iat: string;
    exp: string;
  };
}

interface Dta {
  authenticated: boolean;
  data: {
    id: string;
    username: string;
    roles: string;
    additional_Info: { Dob: string; Phone_Number: number; email: string };
  };
}

export default function Layout({
  children,
  // data,
  headerBg,
  headerTxt,
  headerSky,
  footerSky,
}: LayoutProps) {
  const router = useRouter();
  const [authenticate, setAuthenticate] = useState<boolean>(false);

  async function checkAuth(abort: AbortController) {
    console.log("useEffect triggered");

    try {
      const response = await fetch("/api/authentication", {
        headers: {
          "Content-Type": "application/json",
        },
        signal: abort.signal,
      });
      const json = await response.json();
      setAuthenticate(json?.authenticate);
      if (json?.authenticate) {
      } else {
      }
      console.log(json);

      if (response.status === 200) {
        console.log("user is logged in");
      } else if (response.status === 403) {
        console.log("user is not authenticated");
      }
      if (json?.authenticate === false) {
        return router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const abort = new AbortController();
    checkAuth(abort);
    return () => {
      abort.abort;
    };
  }, []);
  return (
    <div
      className="transition-all
    ">
      <Header
        authenticate={authenticate}
        headerBg={headerBg}
        headerTxt={headerTxt}
        headerSky={headerSky}
      />
      <main className="flex flex-wrap items-center justify-center font-sans">
        {children}
      </main>
      <Footer footerSky={footerSky} />
    </div>
  );
}
