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

  return (
    <div className="bg-gradient-to-b from-cyan-300 to-blue-500">
      <Header
        data={data}
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
