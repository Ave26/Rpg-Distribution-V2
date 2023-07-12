import Header from "./Header";
import Footer from "./Footer";

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
  data,
  headerBg,
  headerTxt,
  headerSky,
  footerSky,
}: LayoutProps) {
  const [dta, setDta] = useState<Dta | null>(null);

  useEffect(() => {
    console.log("it is fetching");
    (async () => {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      console.log(json);
    })();
  }, []);

  return (
    <>
      <Header
        data={data}
        headerBg={headerBg}
        headerTxt={headerTxt}
        headerSky={headerSky}
      />

      <main className="">{children}</main>
      <Footer footerSky={footerSky} />
    </>
  );
}
