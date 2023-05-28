import Header from "./Header";
import Footer from "./Footer";

// fetch
import useSWR from "swr";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
  error?: unknown | any;
  data?: any;
  headerBg?: string;
  headerTxt?: string;
  headerSky?: string;
  footerSky?: string;
}

export default function Layout({
  children,
  data,
  headerBg,
  headerTxt,
  headerSky,
  footerSky,
}: LayoutProps) {
  return (
    <>
      <Header
        data={data}
        headerBg={headerBg}
        headerTxt={headerTxt}
        headerSky={headerSky}
      />

      <main className="h-full w-full font-extrabold">{children}</main>
      <Footer footerSky={footerSky} />
    </>
  );
}
